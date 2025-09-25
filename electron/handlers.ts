import { ipcMain } from 'electron';
import fs from 'fs/promises';
import { registerDbHandlers } from './handlers/db';


export function registerIPCHandlers() {
    registerDbHandlers();
    
    ipcMain.handle('file:get', async (_, filePath: string) => {
        if (!filePath.endsWith(".pdf")) {
            console.log('[file:get] => Path points to a file without a .pdf extension: ', filePath);
            return {
                success: false
            };
        }
        console.log('[file:get] => Getting file at path: ', filePath);
        
        try {
            const result = await fs.readFile(filePath);
            if (result == null) {
                console.log('[file:get] => Unable to get file at path: ', filePath);
                return {
                    success: false
                }
            }

            return {
                success: true,
                result: result
            };
        } catch (error: any) {
            console.error('[file:get] => Error getting the file: ', error);
            return { success: false, error: error.message };
        }
    })
}