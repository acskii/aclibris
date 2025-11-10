import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

contextBridge.exposeInMainWorld('files', {
  get: (filePath: string) => ipcRenderer.invoke('file:get', filePath)
});

contextBridge.exposeInMainWorld('db', {
  shelf: {
    new: (shelf_name: string) => ipcRenderer.invoke('db:shelf:new', shelf_name),
    getAll: () => ipcRenderer.invoke('db:shelf:getAll'),
    delete: (shelf_id: number) => ipcRenderer.invoke('db:shelf:delete', shelf_id),
    update: (shelf_id: number, shelf_name: string) => ipcRenderer.invoke('db:shelf:update', shelf_id, shelf_name)
  },
  collection: {
    get: (collection_id: number) => ipcRenderer.invoke('db:collection:get', collection_id),
    delete: (collection_id: number) => ipcRenderer.invoke('db:collection:delete', collection_id),
    getByShelf: (shelf_id: number) => ipcRenderer.invoke('db:collection:get-by-shelf', shelf_id),
    getAll: () => ipcRenderer.invoke('db:collection:getAll'),
    updateName: (collection_id: number, collection_name: string) => ipcRenderer.invoke('db:collection:update-name', collection_id, collection_name)
  },
  book: {
    get: (book_id: number) => ipcRenderer.invoke('db:book:get', book_id),
    getAll: () => ipcRenderer.invoke('db:book:getAll'),
    getByCollection: (collection_id: number) => ipcRenderer.invoke('db:book:get-by-collection', collection_id),
    add: (file_path: string, data: any, collection_name: string, shelf_name: string) => ipcRenderer.invoke('db:book:add', file_path, data, collection_name, shelf_name),
    update: (book_id: number, title: string, author: string, collection_name: string, shelf_name: string, thumbnail: Uint8Array, tags: string[]) => ipcRenderer.invoke('db:book:update', book_id, title, author, collection_name, shelf_name, thumbnail, tags),
    delete: (book_id: number) => ipcRenderer.invoke('db:book:delete', book_id),
    addRecent: (book_id: number, last_page: number, last_visited_at_unix: number) => ipcRenderer.invoke('db:book:add-recent', book_id, last_page, last_visited_at_unix),
    getRecent: () => ipcRenderer.invoke('db:book:get-recent')
  },
  tag: {
    getAll: () => ipcRenderer.invoke('db:tag:getAll')
  },
  settings: {
    thumbnail: () => ipcRenderer.invoke('db:settings:thumbnail'),
    loadRecent: () => ipcRenderer.invoke('db:settings:loadRecent'),
    saveRecent: () => ipcRenderer.invoke('db:settings:saveRecent'),
    updateBoolean: (key: string, value: boolean) => ipcRenderer.invoke('db:settings:updateBoolean', key, value)
  }
})