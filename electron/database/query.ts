import { database } from "./connection";
import { Book, type BookQueryObject } from "./objects/Book";
import { Collection, type CollectionQueryObject } from "./objects/Collection";
import { Shelf, type ShelfQueryObject } from "./objects/Shelf";
import TitleAlreadyExistsError from "./exceptions/TitleAlreadyExistsError";
import FileAlreadyExistsError from "./exceptions/FileAlreadyExistsError";
import BookDoesNotExistError from "./exceptions/BookDoesNotExistError";
import { MetaQueryObject } from "./objects/Metadata";
import { Tag, TagObject, TagQueryObject } from "./objects/Tag";
import { threadId } from "node:worker_threads";

class DatabaseQuery {
    getBooks() {
        // Get general info about all books stored
        const result = database.prepare(
            `
            SELECT b.id, b.title, b.author, b.recent_page, b.recent_read_at, b.thumbnail, b.pages, b.file_path, b.file_size, b.collection_id, b.created_at, t.id AS tag_id, t.tag_name
            FROM books AS b
            LEFT JOIN book_tag AS bt ON b.id == bt.book_id
            LEFT JOIN tags AS t ON bt.tag_id == t.id
            `
        ).all();
        
        if (result) {
            const books = new Map();
            
            result.forEach((row: BookQueryObject) => {
                if (!books.has(row.id)) {
                    books.set(row.id, new Book(
                        row.id, 
                        row.title, 
                        row.collection_id, 
                        row.file_path, 
                        row.file_size, 
                        row.pages, 
                        row.created_at, 
                        row.author, 
                        row.thumbnail, 
                        row.recent_page, 
                        row.recent_read_at
                    ));
                }

                if (row.tag_id && row.tag_name) {
                    books.get(row.id).tags.push(
                        new Tag(row.tag_id, row.tag_name)
                    );
                }
            });

            return Array.from(books.values());
        } else return [];
    }

    getBookById(id: number) {
        // Get details on a specific book
        const result = database.prepare(
            `
            SELECT b.id, b.title, b.author, b.recent_page, b.recent_read_at, b.thumbnail, b.pages, b.file_path, b.file_size, b.collection_id, b.created_at, t.id AS tag_id, t.tag_name
            FROM books AS b
            LEFT JOIN book_tag AS bt ON b.id == bt.book_id
            LEFT JOIN tags AS t ON bt.tag_id == t.id
            WHERE b.id = ?
            `
        ).all(id);

        if (result.length >= 1) {
            let book: Book | null = null;
            // Needs testing with books of multiple tags
            result.forEach((row: BookQueryObject) => {
                if (!book) {
                    book = new Book(
                        row.id, 
                        row.title, 
                        row.collection_id, 
                        row.file_path, 
                        row.file_size, 
                        row.pages, 
                        row.created_at,
                        row.author,
                        row.thumbnail,
                        row.recent_page,
                        row.recent_read_at
                    );
                }
                if (row.tag_id && row.tag_name && book) {
                    book.tags.push(
                        new Tag(row.tag_id, row.tag_name)
                    );
                }
            });
            return book;
        } else return null;
    }

    getCollectionsByShelfId(id: number) {
        // Get all collections on a specific shelf
        return database.prepare(
            `
            SELECT id, collection_name FROM collections
            WHERE shelf_id = ?
            `
        ).all(id).map((o: CollectionQueryObject) => new Collection(o.id, o.collection_name, id));
    }

    getShelfs() {
        // Get general info about all shelfs stored
        return database.prepare(
            `
            SELECT id, shelf_name FROM shelfs
            `
        ).all().map((o: ShelfQueryObject) => new Shelf(o.id, o.shelf_name));
    }

    getShelfByName(name: string) {
        // Get general info about all shelfs stored
        const result: ShelfQueryObject = database.prepare(
            `
            SELECT id, shelf_name FROM shelfs
            WHERE shelf_name = ?
            `
        ).get(name);

        if (result) return new Shelf(
            result.id,
            result.shelf_name
        ); 
        else return null;
    }

    getCollections() {
        // Get general info about all collections stored
        return database.prepare(
            `
            SELECT id, collection_name, shelf_id FROM collections
            `
        ).all().map((o: CollectionQueryObject) => new Collection(o.id, o.collection_name, o.shelf_id));
    }

    getCollectionById(collection_id: number) {
        // Get details about a specifc collection
        const result:CollectionQueryObject = database.prepare(
            `
            SELECT id, collection_name, shelf_id FROM collections
            WHERE id = ?
            `
        ).get(collection_id);

        if (result) return new Collection(
            result.id,
            result.collection_name,
            result.shelf_id
        );
        else return null;
    }

    getBooksByCollectionId(id: number) {
        // Get general info about books within a specific collection
        const result = database.prepare(
            `
            SELECT b.id, b.title, b.author, b.recent_page, b.recent_read_at, b.thumbnail, b.pages, b.file_path, b.file_size, b.collection_id, b.created_at, t.id AS tag_id, t.tag_name
            FROM books AS b
            LEFT JOIN book_tag AS bt ON b.id == bt.book_id
            LEFT JOIN tags AS t ON bt.tag_id == t.id
            WHERE collection_id = ?
            `
        ).all(id);
        
        if (result) {
            const books = new Map();
            
            result.forEach((row: BookQueryObject) => {
                if (!books.has(row.id)) {
                    books.set(row.id, new Book(
                        row.id, 
                        row.title, 
                        row.collection_id, 
                        row.file_path, 
                        row.file_size, 
                        row.pages, 
                        row.created_at, 
                        row.author, 
                        row.thumbnail, 
                        row.recent_page, 
                        row.recent_read_at
                    ));
                }

                if (row.tag_id && row.tag_name) {
                    books.get(row.id).tags.push(
                        new Tag(row.tag_id, row.tag_name)
                    );
                }
            });

            return Array.from(books.values());
        } else return [];
    }

    addTagToBook(book_id: number, name: string) {
        const insertIntoBookTag = database.prepare(
            `
            INSERT OR IGNORE INTO book_tag (book_id, tag_id) VALUES (?, ?)
            `
        );
        
        database.prepare(
            `
            INSERT OR IGNORE INTO tags (tag_name) VALUES (?)
            `
        ).run(name);

        const result = database.prepare(
            `
            SELECT id
            FROM tags
            WHERE tag_name = ?
            `
        ).get(name);

        if (result) {
            insertIntoBookTag.run(book_id, result.id);
        } else {
            const result = database.prepare(
                `
                SELECT id FROM tags
                WHERE tag_name = ?
                `
            ).run(name);
            insertIntoBookTag.run(book_id, result.id);
        }
    }

    getTagsForBook(book_id: number) {
        return database.prepare(
            `
            SELECT t.id, t.tag_name
            FROM tags AS t
            INNER JOIN book_tag AS bt ON t.id = bt.tag_id
            WHERE bt.book_id = ?
            `
        ).all(book_id).map((t: TagQueryObject) => new Tag(t.id, t.tag_name));
    }

    getTags() {
        return database.prepare(
            `
            SELECT id, tag_name
            FROM tags
            `
        ).all().map((t: TagQueryObject) => new Tag(t.id, t.tag_name));
    }

    removeTagFromBook(book_id: number, tag_id: number) {
        database.prepare(
            `
            DELETE FROM book_tag
            WHERE book_id = ?
            AND tag_id = ?
            `
        ).run(book_id, tag_id);
    }

    addBook(title: string, pages: number, file_path: string, 
            file_size: number, created_at: number, collection_id: number, 
            author: string, thumbnail: Buffer, tags: string[]) {
        // add a new book
        // added values must be validated before calling this function
        try {
            const info = database.prepare(
                `
                INSERT INTO books (title, pages, thumbnail, file_path, file_size, created_at, collection_id, author) VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?);
                `
            ).run(title, pages, thumbnail, file_path, file_size, created_at, collection_id, author);

            const bookId = info.lastInsertRowid;

            if (tags.length > 0) {
                for (const tag of tags) {
                    this.addTagToBook(bookId, tag);
                }
            }

            // return object
            const result: BookQueryObject = database.prepare(
                `
                SELECT id, title, pages, thumbnail, file_path, file_size, created_at, collection_id, author FROM books
                WHERE id = ?
                `
            ).get(bookId);

            const tagResult: TagQueryObject[] = database.prepare(
                `
                SELECT t.id, t.tag_name
                FROM tags AS t
                INNER JOIN book_tag AS bt ON t.id = bt.tag_id
                WHERE bt.book_id = ?
                `
            ).all(bookId);
            
            return new Book(
                result.id,
                result.title,
                result.collection_id,
                result.file_path,
                result.file_size,
                result.pages,
                result.created_at,
                result.author,
                result.thumbnail,
                1,      // lastReadPage
                null,   // lastVisitedInUnix
                tagResult.map((t) => new Tag(t.id, t.tag_name))
            );

        } catch (error: any) {
            if (error.code == 'SQLITE_CONSTRAINT_UNIQUE') {
                if (error.message.includes("books.title")) throw new TitleAlreadyExistsError("Book title is already used");
                else if (error.message.includes("books.file_path")) throw new FileAlreadyExistsError("File uploaded already exists");
            } else {
                // re-throw if not recognised
                throw error;
            }
        }
    }

    addCollection(collection_name: string, shelf_id: number) {
        // add a new collection
        try {
            database.prepare(
                `
                INSERT INTO collections (collection_name, shelf_id) VALUES
                (?, ?);
                `
            ).run(collection_name, shelf_id);
            
            // return object
            const result: CollectionQueryObject = database.prepare(
                `
                SELECT id, collection_name, shelf_id FROM collections
                WHERE collection_name = ?
                AND shelf_id = ?
                `
            ).get(collection_name, shelf_id);
            
            return new Collection(
                result.id,
                result.collection_name,
                result.shelf_id
            );
        } catch (error: any) {
            console.log("[db:query] => Error occurred when attempting to add a collection: ", error.message);
            
            // re-throw error
            throw error;
        }
    }

    addShelf(shelf_name: string) {
        // add a new shelf
        try {
            database.prepare(
                `
                INSERT INTO shelfs (shelf_name) VALUES
                (?);
                `
            ).run(shelf_name);

            // return object
            const result: ShelfQueryObject = database.prepare(
                `
                SELECT id, shelf_name FROM shelfs
                WHERE shelf_name = ?
                `
            ).get(shelf_name);

            return new Shelf(
                result.id,
                result.shelf_name
            );
        } catch (error: any) {
            console.log("[db:query] => Error occurred when attempting to add a shelf: ", error.message);
            
            // re-throw error
            throw error;
        }
    }

    deleteShelf(shelf_id: number) {
        // delete an existing shelf
        database.prepare(
            `
            DELETE FROM shelfs
            WHERE id = ?
            `
        ).run(shelf_id);
    }
    
    deleteCollection(collection_id: number) {
        // delete an existing collection
        database.prepare(
            `
            DELETE FROM collections
            WHERE id = ?
            `
        ).run(collection_id);
    }

    deleteBook(book_id: number) {
        // delete an existing book
        database.prepare(
            `
            DELETE FROM books
            WHERE id = ?
            `
        ).run(book_id);
    }

    addRecentBook(book_id: number, page: number, last_visited_unix: number) {
        // update values in the book
        if (this.getBooleanMeta('can_save_recent')) {
            const info = database.prepare(
                `
                UPDATE books
                SET recent_page = ?,
                    recent_read_at = ?
                WHERE id = ?
                `
            ).run(page, last_visited_unix, book_id);

            if (info.changes == 0) throw new BookDoesNotExistError("Book was not found");

            // add as the most recent book
            database.prepare(
                `
                UPDATE meta
                SET value = ?
                WHERE key = 'last_book'
                `
            ).run(`${book_id}`);
        }
    }

    getRecentBook() {
        // get the most recently opened book
        if (this.getBooleanMeta('can_load_recent')) {
            try {
                const response: MetaQueryObject = database.prepare(
                    `
                    SELECT key, value FROM meta
                    WHERE key = 'last_book'
                    `
                ).get();

                if (response.value == 'null') return null;
                else {
                    const book_id: number = parseInt(response.value);
                    return this.getBookById(book_id);
                }

            } catch (error: any) {
                console.log("[db:query] => Error occurred when attempting to get metadata: ", error.message);
                
                // re-throw error
                throw error;
            }
        }
    }

    updateShelf(shelf_id: number, new_name: string) {
        // update a given shelf's name by its ID

        try {
            database.prepare(
                `
                UPDATE shelfs
                SET shelf_name = ?
                WHERE id = ?        
                `
            ).run(new_name, shelf_id);
        } catch (error: any) {
            console.log("[db:query] => Error occurred when attempting to update shelf name: ", error.message);
        
            // re-throw error
            throw error;
        }
    }

    updateCollectionName(collection_id: number, new_name: string) {
        // update a given collection's name by its ID

        try {
            database.prepare(
                `
                UPDATE collections
                SET collection_name = ?
                WHERE id = ?        
                `
            ).run(new_name, collection_id);
        } catch (error: any) {
            console.log("[db:query] => Error occurred when attempting to update collection name: ", error.message);
        
            // re-throw error
            throw error;
        }
    }

    updateBook(book_id: number, title: string, author: string, collection_id: number, thumbnail: Buffer, tags: string[]) {
        // updates an existing book with new data
        // -> only select fields can be changed
        try {
            database.prepare(
                `
                UPDATE books
                SET
                    title = ?,
                    author = ?,
                    collection_id = ?,
                    thumbnail = ?
                WHERE id = ?
                `
            ).run(title, author, collection_id, thumbnail, book_id);

            // remove tags that aren't in the tags list
            const bookTags: TagObject[] = this.getTagsForBook(book_id);
            for (const tag of bookTags) {
                if (!tags.includes(tag.name)) {
                    this.removeTagFromBook(book_id, tag.id);
                }
            }

            // add tags that aren't in the book's tags from the tags list
            for (const tag of tags) {
                if (!bookTags.find((t) => t.name == tag)) {
                    this.addTagToBook(book_id, tag);
                }
            }

        } catch(error: any) {
            console.log("[db:query] => Error occurred when attempting to update book data: ", error.message);
        
            // re-throw error
            throw error;
        }
    }

    /* Settings */
    getBooleanMeta(key: string) {
        // Works with 'can_save_recent', 'can_load_recent', 'thumbnail_on_upload'
        const result = database.prepare(
            `
            SELECT value FROM meta
            WHERE key = ?
            `
        ).get(key);

        if (result) return result.value == 'true' ? true : false;
        else return null;
    }

    updateBooleanMeta(key: string, value: boolean) {
        // Toggle settings 
        database.prepare(
            `
            UPDATE meta
            SET value = ?
            WHERE key = ?
            `
        ).run((value) ? 'true' : 'false', key);
    }

}

export const query = new DatabaseQuery();