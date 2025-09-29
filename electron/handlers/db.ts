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

    ipcMain.handle('db:book:delete', async (_, book_id) => {
        try {
            return query.deleteBook(book_id);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'book:delete': ", error.message);
        }
    });

    ipcMain.handle('db:book:add', async (_, file_path: string, data, collection_name: string, shelf_name: string) => {
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
                    0, c.id   // creationdate as unix seconds
                );
            } else {
                const ns = query.addShelf(shelf_name);
                const nc = query.addCollection(collection_name, ns.id);

                // Save book
                query.addBook(
                    data.title, data.pages, file_path, data.filesize,
                    0, nc.id   // creationdate as unix seconds
                );
            }
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'book:add': ", error.message);
            return "Unable to save book";
        }
    })

    ipcMain.handle('db:shelf:new', async (_, shelf_name) => {
        try {
            query.addShelf(shelf_name);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'shelf:new': ", error.message);
        }
    });

    ipcMain.handle('db:shelf:getAll', async (_) => {
        try {
            return query.getShelfs();
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'shelf:getAll': ", error.message);
        }
    });

    ipcMain.handle('db:collection:get-by-shelf', async (_, shelf_id) => {
        try {
            return  query.getCollectionsByShelfId(shelf_id);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'collection:get-by-shelf': ", error.message);
        }
    });

    ipcMain.handle('db:collection:getAll', async (_) => {
        try {
            return  query.getCollections();
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'collection:getAll': ", error.message);
        }
    });
}