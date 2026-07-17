import { ipcMain } from "electron";
import { query } from "../database/query";
import { Collection } from "../database/objects/Collection";
import { BookFilterObject } from "../database/objects/BookFilter";
import { ViewType } from "../database/objects/Book";

export function registerDbHandlers() {
    ipcMain.handle('db:book:getAll', async (_, page: number, filter: BookFilterObject) => {
        try {
            return query.getBooks(page, filter);
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

    ipcMain.handle('db:book:exist', async (_) => {
        try {
            return query.existsBook();
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'book:exist': ", error.message);
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

    ipcMain.handle('db:book:add', async (_, file_path: string, data, collection_name: string, shelf_name: string, page_view: ViewType) => {
        // KNOWN BUG:
        // When trying to add a book that already exists in a new shelf/collection
        // It creates the collection then attempts to add the book where it fails
        // Error: Empty shelf/collection

        // KNOWN ERROR:
        // Thumbnail can not be null or it raises an error and prevents books addition, 
        // even though there is a remove thumbnail setting
        
        try {
            const view = page_view === 'horizontal' ? 0 : 1;
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
                    data.createdAt, c.id, data.author, Buffer.from(data.thumbnail), view, data.tags
                );
            } else {
                const ns = query.addShelf(shelf_name);
                const nc = query.addCollection(collection_name, ns.id);

                // Save book
                query.addBook(
                    data.title, data.pages, file_path, data.filesize,
                    data.createdAt, nc.id, data.author, Buffer.from(data.thumbnail), view, data.tags
                );
            }

            return null;
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'book:add': ", error.message);
            return error.message;
        }
    })

    ipcMain.handle('db:book:update', async (_, book_id: number, title: string, author: string, collection_name: string, shelf_name: string, thumbnail: Uint8Array, page_view: ViewType, tags: string[]) => {
        try {
            const view = page_view === 'horizontal' ? 0 : 1;
            const s = query.getShelfByName(shelf_name);
            if (s) {
                const cs: Collection[] = query.getCollectionsByShelfId(s.id);

                let c = cs.find((c) => c.name === collection_name);
                if (!c) c = query.addCollection(collection_name, s.id);
                
                query.updateBook(book_id, title, author, c.id, Buffer.from(thumbnail), view, tags);
            } else {
                const ns = query.addShelf(shelf_name);
                const nc = query.addCollection(collection_name, ns.id);

                query.updateBook(book_id, title, author, nc.id, Buffer.from(thumbnail), view, tags);
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

    ipcMain.handle('db:shelf:update', async (_, shelf_id, shelf_name, pinned) => {
        try {
            query.updateShelf(shelf_id, shelf_name, pinned);
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

    ipcMain.handle('db:settings:thumbnail', async (_) => {
        try {
            return query.getBooleanMeta('thumbnail_on_upload');
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'settings:thumbnail': ", error.message);
        }
    });

    ipcMain.handle('db:settings:loadRecent', async (_) => {
        try {
            return query.getBooleanMeta('can_load_recent');
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'settings:loadRecent': ", error.message);
        }
    });

    ipcMain.handle('db:settings:saveRecent', async (_) => {
        try {
            return query.getBooleanMeta('can_save_recent');
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'settings:saveRecent': ", error.message);
        }
    });

    ipcMain.handle('db:settings:theme', async (_) => {
        try {
            return query.getValueMeta('theme');
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'settings:theme': ", error.message);
        }
    });

    ipcMain.handle('db:settings:search:page', async (_) => {
        try {
            return query.getNumberMeta('search_page_size');
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'settings:search:page': ", error.message);
        }
    });

    ipcMain.handle('db:settings:search:view', async (_) => {
        try {
            return query.getValueMeta('default_search_view');
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'settings:search:view': ", error.message);
        }
    });

    ipcMain.handle('db:settings:search:sort', async (_) => {
        try {
            return query.getBooleanMeta('default_search_sort');
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'settings:search:sort': ", error.message);
        }
    });

    ipcMain.handle('db:settings:updateBoolean', async (_, key: string, value: boolean) => {
        try {
            query.updateBooleanMeta(key, value);
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'settings:updateBoolean': ", error.message);
        }
    });

    ipcMain.handle('db:settings:updateValue', async (_, key: string, value: string | number) => {
        try {
            if (typeof value === "string") {
                query.updateStringMeta(key, value);
            } else {
                query.updateNumberMeta(key, value);
            }
        } catch (error: any) {
            console.log("[db:query] => Error occured when handling 'settings:updateValue': ", error.message);
        }
    });
}