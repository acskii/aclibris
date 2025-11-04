import { database } from "./connection";
import { Book, type BookQueryObject } from "./objects/Book";
import { Collection, type CollectionQueryObject } from "./objects/Collection";
import { Shelf, type ShelfQueryObject } from "./objects/Shelf";
import TitleAlreadyExistsError from "./exceptions/TitleAlreadyExistsError";
import FileAlreadyExistsError from "./exceptions/FileAlreadyExistsError";
import BookDoesNotExistError from "./exceptions/BookDoesNotExistError";
import { MetaQueryObject } from "./objects/Metadata";

class DatabaseQuery {
    getBooks() {
        // Get general info about all books stored
        return database.prepare(
            `
            SELECT id, title, author, recent_page, recent_read_at, thumbnail, pages, file_path, file_size, collection_id, created_at FROM books
            `
        ).all().map((o: BookQueryObject) => new Book(o.id, o.title, o.collection_id, o.file_path, o.file_size, o.pages, o.created_at, o.author, o.thumbnail, o.recent_page, o.recent_read_at));
    }

    getBookById(id: number) {
        // Get details on a specific book
        const result: BookQueryObject = database.prepare(
            `
            SELECT id, title, thumbnail, author, pages, file_path, file_size, collection_id, created_at, recent_page, recent_read_at FROM books
            WHERE id = ?
            `
        ).get(id);

        if (result) return new Book(
            result.id, 
            result.title, 
            result.collection_id, 
            result.file_path, 
            result.file_size, 
            result.pages, 
            result.created_at,
            result.author,
            result.thumbnail,
            result.recent_page,
            result.recent_read_at
        );
        else return null;
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
        return database.prepare(
            `
            SELECT id, title, thumbnail, author, pages, file_path, file_size, collection_id, created_at, recent_page, recent_read_at FROM books
            WHERE collection_id = ?
            `
        ).all(id).map((o: BookQueryObject) => new Book(o.id, o.title, o.collection_id, o.file_path, o.file_size, o.pages, o.created_at, o.author, o.thumbnail, o.recent_page, o.recent_read_at));
    }

    addBook(title: string, pages: number, file_path: string, 
            file_size: number, created_at: number, collection_id: number, 
            author: string, thumbnail: Buffer) {
        // add a new book
        // added values must be validated before calling this function
        try {
            database.prepare(
                `
                INSERT INTO books (title, pages, thumbnail, file_path, file_size, created_at, collection_id, author) VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?);
                `
            ).run(title, pages, thumbnail, file_path, file_size, created_at, collection_id, author);

            // return object
            const result: BookQueryObject = database.prepare(
                `
                SELECT id, title, pages, thumbnail, file_path, file_size, created_at, collection_id, author FROM books
                WHERE title = ?
                AND file_path = ?
                `
            ).get(title, file_path);
            
            return new Book(
                result.id,
                result.title,
                result.collection_id,
                result.file_path,
                result.file_size,
                result.pages,
                result.created_at,
                result.author,
                result.thumbnail
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

    getRecentBook() {
        // get the most recently opened book

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

    updateBook(book_id: number, title: string, author: string, collection_id: number, thumbnail: Buffer) {
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
        } catch(error: any) {
            console.log("[db:query] => Error occurred when attempting to update book data: ", error.message);
        
            // re-throw error
            throw error;
        }
    }

}

export const query = new DatabaseQuery();