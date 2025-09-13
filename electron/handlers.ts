import { ipcMain } from 'electron';
import { getFile } from '../util/pdf/process';

export function registerIPCHandlers() {
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
                result: new Uint8Array(result)
            };
        } catch (error: any) {
            console.error('[file:get] => Error getting the file: ', error);
            return { success: false, error: error.message };
        }
    })
}