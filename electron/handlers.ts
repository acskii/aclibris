import { ipcMain } from 'electron';
import { getFile } from '../util/pdf/process';
import { registerDbHandlers } from './handlers/db';

export function registerIPCHandlers() {
    registerDbHandlers();
    
    ipcMain.handle('file:get', async (_, filePath) => {
        console.log('[file:get] => Getting file at path: ', filePath);
        
        try {
            const result = await getFile(filePath);
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