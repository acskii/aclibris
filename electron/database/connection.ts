/*
    Returns a connection to the local database file
*/

import { createRequire } from 'module';
import { app } from 'electron';
import path from 'path';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

const isDev = !app.isPackaged;
const fileName = "reader_library.db";

const dbPath = (isDev) 
                ? fileName
                : path.join(app.getPath("userData"), fileName);

export const database = new Database(dbPath);