import { ipcMain } from "electron";
import { query } from "../database/query";

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
}