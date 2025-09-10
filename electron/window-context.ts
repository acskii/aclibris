import path from 'path'
import { fileURLToPath } from 'node:url'


// Used for ES6 modules
// If path to current directory is needed
const __dirname = path.dirname(fileURLToPath(import.meta.url))


export const MainWindowContext = {
    
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
};