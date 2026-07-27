import { ipcMain, dialog } from 'electron';
import fs from 'fs/promises';
import { registerDbHandlers } from './handlers/db';
import path from 'path';


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
    });

    ipcMain.handle('folder:get', async (_) => {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                properties: ['openDirectory']
            });

            if (canceled || filePaths.length === 0) {
                return { success: false, result: [] };
            }

            const folderPath = filePaths[0];
            const folderName = path.basename(folderPath);

            const children = await fs.readdir(folderPath, { withFileTypes: true });
            const batch = children.filter((c) => {
                if (c.isFile() && c.name.endsWith(".pdf")) return true;
                return false;
            }).map((c) => {
                return path.join(folderPath, c.name);
            });

            return {
                success: true,
                result: {
                    folder: folderName,
                    files: batch,
                },
            };

        } catch (error: any) {
            console.error('[folder:get] => Error getting the folder content: ', error);
            return { success: false, error: error.message };
        }
    });
}