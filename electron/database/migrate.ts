/*
    Crude way to mimic migrations. - (Andrew)
    Essentially, each method within the class is considered a migration.
    Where the change is first checked, then added if not found, or left otherwise.

    Any missing tables are added into the schema, any new columns are added with default values,
    this should not affect the integrity of the already recorded data.

    Only call init() to apply all migrations.
*/

import { database } from "./connection";

class DatabaseMigration {
    private create_shelfs_table() {
        database.prepare(
            `
            CREATE TABLE IF NOT EXISTS shelfs (
                id INTEGER PRIMARY KEY,
                shelf_name VARCHAR(100) NOT NULL
            )
            `    
        ).run();
    }   
    
    private create_collections_table() {
        database.prepare(
            `
            CREATE TABLE IF NOT EXISTS collections (
                id INTEGER PRIMARY KEY,
                collection_name VARCHAR(100) NOT NULL,
                shelf_id INTEGER REFERENCES shelfs(id) ON DELETE CASCADE
            )
            `    
        ).run();
    }

    private create_tags_table() {
        database.prepare(
            `
            CREATE TABLE IF NOT EXISTS tags (
                id INTEGER PRIMARY KEY,
                tag_name VARCHAR(40) NOT NULL
            )
            `    
        ).run();
    }
    private create_book_tag_table() {
        database.prepare(
            `
            CREATE TABLE IF NOT EXISTS book_tag (
                book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
                tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
                PRIMARY KEY (book_id, tag_id)
            )
            `    
        ).run();
    }

    private create_books_table() {
        database.prepare(
            `
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY,
                file_path TEXT NOT NULL,
                file_size INTEGER NOT NULL,
                pages INTEGER NOT NULL,
                title TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE
            )
            `    
        ).run();
    }

    

    init() {
        this.create_shelfs_table();
        this.create_collections_table();
        this.create_books_table();
        this.create_tags_table();
        this.create_book_tag_table();
        console.log("[database:migrate] => Initialised local database schema");
    }
}

export const migrate = new DatabaseMigration();