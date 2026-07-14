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
                id INTEGER PRIMARY KEY UNIQUE,
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
                tag_name VARCHAR(40) NOT NULL UNIQUE
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
                file_path TEXT NOT NULL UNIQUE,
                file_size INTEGER NOT NULL,
                thumbnail BLOB DEFAULT NULL,
                pages INTEGER NOT NULL,
                recent_page INTEGER DEFAULT 1,
                title TEXT NOT NULL UNIQUE,
                author VARCHAR(100) NOT NULL,
                created_at INTEGER NOT NULL,
                recent_read_at INTEGER DEFAULT NULL,
                collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE
            )
            `    
        ).run();
    }

    private create_meta_table() {
        database.prepare(
            `
            CREATE TABLE IF NOT EXISTS meta (
                key TEXT PRIMARY KEY,
                value TEXT
            )
            `    
        ).run();
    }

    private seed_default_values() {
        const seeded = database.prepare(
            `
            SELECT value FROM meta
            WHERE key = 'seeded'
            `
        ).get();
        
        if (!seeded) {
            database.prepare(
                `
                INSERT INTO shelfs (shelf_name, pinned) VALUES 
                ('Default', 1);
                `
            ).run();

            const default_shelf_id = database.prepare(`SELECT id FROM shelfs WHERE shelf_name = 'Default'`).get();
            database.prepare(
                `
                INSERT INTO collections (collection_name, shelf_id) VALUES 
                ('Default', ?);
                `
            ).run(default_shelf_id.id);
            
            database.prepare(
                `
                INSERT INTO meta (key, value) VALUES 
                ('seeded', 'true');
                `
            ).run();
            console.log("[db:migrate] => Seeded Default Values");
        }
    }

    private add_recent_book_read() {
        // Will include either 'null' for no recent book (at first use)
        //              or '{book_id}' to relate to a saved book

        const lastBook = database.prepare(
            `
            SELECT value FROM meta
            WHERE key = 'last_book'
            `
        ).get();

        if (!lastBook) {
            database.prepare(
            `
            INSERT INTO meta (key, value) VALUES 
            ('last_book', 'null');
            `
            ).run();
        }
    }

    private add_toggle_settings() {
        // Will include 'true' if these settings are added for the first time
        //      may change to 'false' based on user change

        const settings = ['can_save_recent', 'can_load_recent', 'thumbnail_on_upload', 'default_search_sort'];
    
        settings.forEach(setting => {
            const existing = database.prepare(`
                SELECT value FROM meta WHERE key = ?
            `).get(setting);
            
            if (!existing) {
                database.prepare(`
                    INSERT INTO meta (key, value) VALUES (?, 'true')
                `).run(setting);
            }
        });
    }

    private add_value_settings() {
        // Will include 'default' string value if these settings are added for the first time
        //      may change to any other string based on user change

        const settings = [
            { setting: 'theme', default: 'default' },
            { setting: 'search_page_size', default: '12' },
            { setting: 'default_search_view', default: 'grid' },
        ];
    
        settings.forEach(setting => {
            const existing = database.prepare(`
                SELECT value FROM meta WHERE key = ?
            `).get(setting.setting);
            
            if (!existing) {
                database.prepare(`
                    INSERT INTO meta (key, value) VALUES (?, ?)
                `).run(setting.setting, setting.default);
            }
        });
    }

    private add_shelf_pins() {
        // Will include a new boolean column to track which shelf has been pinned by the user
        //      0 -> NOT Pinned
        //      1 -> Pinned

        const col = database.prepare(
            `
            SELECT 1 
            FROM pragma_table_info('shelfs') 
            WHERE name = 'pinned';
            `
        ).get();

        if (!col) {
            database.prepare(
                `
                ALTER TABLE shelfs
                ADD COLUMN pinned INTEGER DEFAULT 0 CHECK (pinned IN (0, 1))
                `
            ).run();
        }
    }

    // private add_book_views() {
    //     // Will include a new column to track a books viewing preference
    //     // Uses numbers to not limit the number of possible options
    //     // Number is interpreted by client 
    //     //      0 -> Default Horizontal View
    //     //      1 -> Vertical Scrolling View    

    //     const pin = database.prepare(
    //         `
    //         SELECT page_view FROM books
    //         LIMIT 1
    //         `
    //     ).get();

    //     if (!pin) {
    //         database.prepare(
    //             `
    //             ALTER TABLE books
    //             ADD COLUMN view_page INTEGER DEFAULT 0;
    //             `
    //         ).run();
    //     }
    // }

    // private add_indexes() {
    //     // Add indexes to tables to increase search performance
    //     //      With checking to not re-add an existing index

    //     try {
    //         const transaction = database.transaction(() => {
    //             database.prepare("CREATE INDEX IF NOT EXISTS idx_books_title ON books(title)").run();
    //             database.prepare("CREATE INDEX IF NOT EXISTS idx_books_author ON books(author)").run();
    //             database.prepare("CREATE INDEX IF NOT EXISTS idx_book_tag_book ON book_tag(book_id)").run();
    //             database.prepare("CREATE INDEX IF NOT EXISTS idx_books_collection ON books(collection_id)").run();
    //             database.prepare("CREATE INDEX IF NOT EXISTS idx_book_tag_tag ON book_tag(tag_id)").run();
    //             database.prepare("CREATE INDEX IF NOT EXISTS idx_shelf_collection ON collections(shelf_id)").run();
    //         });
            
    //         transaction();
    //     } catch (error) {
    //         console.error("Error creating indexes:", error);
    //     }
    // }

    init() {
        this.create_shelfs_table();
        this.create_collections_table();
        this.create_books_table();
        this.create_tags_table();
        this.create_book_tag_table();
        this.create_meta_table();
        this.add_recent_book_read();
        this.add_toggle_settings();
        this.add_value_settings();
        this.add_shelf_pins();
        this.seed_default_values();
        console.log("[db:migrate] => Initialised local database schema");
    }
}

export const migrate = new DatabaseMigration();