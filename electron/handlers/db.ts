import { ipcMain } from "electron";
import { query } from "../database/query";
import { Collection } from "../database/objects/Collection";

export function registerDbHandlers() {
    ipcMain.handle('db:book:getAll', async (_) => {
        try {
            return query.getBooks();
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'book:getAll': ", error.message);
        }
    });

    ipcMain.handle('db:book:get', async (_, book_id) => {
        try {
            return query.getBookById(book_id);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'book:get': ", error.message);
        }
    });

    ipcMain.handle('db:book:get-by-collection', async (_, collection_id: number) => {
        try {
            return query.getBooksByCollectionId(collection_id);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'book:get:get-by-collection': ", error.message);
        }
    });

    ipcMain.handle('db:book:delete', async (_, book_id) => {
        try {
            return query.deleteBook(book_id);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'book:delete': ", error.message);
        }
    });

    ipcMain.handle('db:book:add', async (_, file_path: string, data, collection_name: string, shelf_name: string) => {
        // KNOWN BUG:
        // When trying to add a book that already exists in a new shelf/collection
        // It creates the collection then attempts to add the book where it fails
        // Error: Empty shelf/collection
        
        try {
            // Check for shelf and collection 
            // Create collection and/or shelf if needed
            const s = query.getShelfByName(shelf_name);
            if (s) {
                const cs: Collection[] = query.getCollectionsByShelfId(s.id);

                let c = cs.find((c) => c.name === collection_name);
                if (!c) c = query.addCollection(collection_name, s.id);
                
                // Save book
                query.addBook(
                    data.title, data.pages, file_path, data.filesize,
                    data.createdAt, c.id, data.author, Buffer.from(data.thumbnail), data.tags
                );
            } else {
                const ns = query.addShelf(shelf_name);
                const nc = query.addCollection(collection_name, ns.id);

                // Save book
                query.addBook(
                    data.title, data.pages, file_path, data.filesize,
                    data.createdAt, nc.id, data.author, Buffer.from(data.thumbnail), data.tags
                );
            }

            return null;
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'book:add': ", error.message);
            return error.message;
        }
    })

    ipcMain.handle('db:book:update', async (_, book_id: number, title: string, author: string, collection_name: string, shelf_name: string, thumbnail: Uint8Array, tags: string[]) => {
        try {
            const s = query.getShelfByName(shelf_name);
            if (s) {
                const cs: Collection[] = query.getCollectionsByShelfId(s.id);

                let c = cs.find((c) => c.name === collection_name);
                if (!c) c = query.addCollection(collection_name, s.id);
                
                query.updateBook(book_id, title, author, c.id, Buffer.from(thumbnail), tags);
            } else {
                const ns = query.addShelf(shelf_name);
                const nc = query.addCollection(collection_name, ns.id);

                query.updateBook(book_id, title, author, nc.id, Buffer.from(thumbnail), tags);
            }
            return null;
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'book:update': ", error.message);
            return error.message;
        }
    });

    ipcMain.handle('db:shelf:new', async (_, shelf_name) => {
        try {
            query.addShelf(shelf_name);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'shelf:new': ", error.message);
        }
    });

    ipcMain.handle('db:shelf:update', async (_, shelf_id, shelf_name) => {
        try {
            query.updateShelf(shelf_id, shelf_name);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'shelf:update': ", error.message);
        }
    });

    ipcMain.handle('db:shelf:getAll', async (_) => {
        try {
            return query.getShelfs();
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'shelf:getAll': ", error.message);
        }
    });

    ipcMain.handle('db:shelf:delete', async (_, shelf_id) => {
        try {
            query.deleteShelf(shelf_id);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'shelf:delete': ", error.message);
        }
    });

    ipcMain.handle('db:collection:get-by-shelf', async (_, shelf_id) => {
        try {
            return  query.getCollectionsByShelfId(shelf_id);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'collection:get-by-shelf': ", error.message);
        }
    });

    ipcMain.handle('db:collection:update-name', async (_, collection_id, collection_name) => {
        try {
            query.updateCollectionName(collection_id, collection_name);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'collection:update-name': ", error.message);
        }
    });

    ipcMain.handle('db:collection:getAll', async (_) => {
        try {
            return  query.getCollections();
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'collection:getAll': ", error.message);
        }
    });

    ipcMain.handle('db:collection:get', async (_, collection_id: number) => {
        try {
            return query.getCollectionById(collection_id);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'collection:get': ", error.message);
        }
    });

    ipcMain.handle('db:collection:delete', async (_, collection_id: number) => {
        try {
            query.deleteCollection(collection_id);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'collection:delete': ", error.message);
        }
    });

    ipcMain.handle('db:book:add-recent', async (_, book_id: number, last_page: number, last_visited_at_unix: number) => {
        try {
            query.addRecentBook(book_id, last_page, last_visited_at_unix);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'book:add-recent': ", error.message);
        }
    });

    ipcMain.handle('db:book:get-recent', async (_) => {
        try {
            return query.getRecentBook();
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'book:get-recent': ", error.message);
        }
    });

    ipcMain.handle('db:tag:getAll', async (_) => {
        try {
            return query.getTags();
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'tag:getAll': ", error.message);
        }
    });
}