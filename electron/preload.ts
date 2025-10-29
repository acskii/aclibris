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
    getAll: () => ipcRenderer.invoke('db:shelf:getAll')
  },
  collection: {
    get: (collection_id: number) => ipcRenderer.invoke('db:collection:get', collection_id),
    getByShelf: (shelf_id: number) => ipcRenderer.invoke('db:collection:get-by-shelf', shelf_id),
    getAll: () => ipcRenderer.invoke('db:collection:getAll')
  },
  book: {
    get: (book_id: number) => ipcRenderer.invoke('db:book:get', book_id),
    getAll: () => ipcRenderer.invoke('db:book:getAll'),
    getByCollection: (collection_id: number) => ipcRenderer.invoke('db:book:get-by-collection', collection_id),
    add: (file_path: string, data: any, collection_name: string, shelf_name: string) => ipcRenderer.invoke('db:book:add', file_path, data, collection_name, shelf_name),
    addRecent: (book_id: number, last_page: number, last_visited_at_unix: number) => ipcRenderer.invoke('db:book:add-recent', book_id, last_page, last_visited_at_unix),
    getRecent: () => ipcRenderer.invoke('db:book:get-recent')
  }
})