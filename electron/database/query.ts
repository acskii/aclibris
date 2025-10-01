import { database } from "./connection";
import { Book, type BookQueryObject } from "./objects/Book";
import { Collection, type CollectionQueryObject } from "./objects/Collection";
import { Shelf, type ShelfQueryObject } from "./objects/Shelf";

class DatabaseQuery {
    getBooks() {
        // Get general info about all books stored
        return database.prepare(
            `
            SELECT id, title, author, pages, file_path, file_size, collection_id, created_at FROM books
            `
        ).all().map((o: BookQueryObject) => new Book(o.id, o.title, o.collection_id, o.file_path, o.file_size, o.pages, o.created_at, o.author));
    }

    getBookById(id: number) {
        // Get details on a specific book
        const result: BookQueryObject = database.prepare(
            `
            SELECT title, author, pages, file_path, file_size, collection_id, created_at FROM books
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
            result.author
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
            SELECT id, title, author, pages, file_path, file_size, collection_id, created_at FROM books
            WHERE collection_id = ?
            `
        ).all(id).map((o: BookQueryObject) => new Book(o.id, o.title, o.collection_id, o.file_path, o.file_size, o.pages, o.created_at, o.author));
    }

    addBook(title: string, pages: number, file_path: string, 
            file_size: number, created_at: number, collection_id: number, author: string) {
        // add a new book
        // added values must be validated before calling this function
        database.prepare(
            `
            INSERT INTO books (title, pages, file_path, file_size, created_at, collection_id, author) VALUES 
            (?, ?, ?, ?, ?, ?, ?);
            `
        ).run(title, pages, file_path, file_size, created_at, collection_id, author);
    }

    addCollection(collection_name: string, shelf_id: number) {
        // add a new collection
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
    }

    addShelf(shelf_name: string) {
        // add a new shelf
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

    // updateCollection
    // updateBook
    // updateShelf
    
}

export const query = new DatabaseQuery();