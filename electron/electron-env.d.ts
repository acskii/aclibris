/// <reference types="vite-plugin-electron/electron-env" />

import { ViewType } from './database/objects/Book';

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

export interface FilesAPI {
  get: (filePath: string) => Promise<any>;
}

export interface FolderAPI {
  get: () => Promise<any>;
}

export interface DatabaseAPI {
  shelf: {
    new: (shelf_name: string) => Promise<any>;
    getAll: () => Promise<any>;
    delete: (shelf_id: number) => Promise<any>;
    update: (shelf_id: number, shelf_name: string, pinned: boolean) => Promise<any>;
  };
  collection: {
    add: (collection_name: string, shelf_id: number) => Promise<any>;
    get: (collection_id: number) => Promise<any>;
    delete: (collection_id: number) => Promise<any>;
    getByShelf: (shelf_id: number) => Promise<any>;
    getAll: () => Promise<any>;
    updateName: (collection_id: number, collection_name: string) => Promise<any>;
  };
  book: {
    get: (book_id: number) => Promise<any>;
    getAll: (page: number, filter: BookFilterObject) => Promise<any>;
    getByCollection: (collection_id: number) => Promise<any>;
    exist: () => Promise<any>;
    add: (file_path: string, data: any, collection_name: string, shelf_name: string, page_view: ViewType) => Promise<any>;
    update: (
      book_id: number, 
      title: string, 
      author: string, 
      collection_name: string, 
      shelf_name: string, 
      thumbnail: Uint8Array,
      page_view: ViewType, 
      tags: string[]
    ) => Promise<any>;
    delete: (book_id: number) => Promise<any>;
    addRecent: (book_id: number, last_page: number, last_visited_at_unix: number) => Promise<any>;
    getRecent: () => Promise<any>;
  };
  tag: {
    getAll: () => Promise<any>;
  };
  settings: {
    thumbnail: () => Promise<any>;
    loadRecent: () => Promise<any>;
    saveRecent: () => Promise<any>;
    theme: () => Promise<any>;
    search: {
      sort: () => Promise<any>;
      view: () => Promise<any>;
      pageSize: () => Promise<any>;
    };
    updateBoolean: (key: string, value: boolean) => Promise<any>;
    updateValue: (key: string, value: string | number) => Promise<any>;
  };
}

// Used in Renderer process, expose in `preload.ts`
declare global {
  interface Window {
    ipcRenderer: import('electron').IpcRenderer;
    files: FilesAPI;
    folder: FolderAPI;
    db: DatabaseAPI;
  }
}