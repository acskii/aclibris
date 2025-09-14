/*
    Deprecated
*/

import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import worker from 'pdfjs-dist/legacy/build/pdf.worker?url';
import fs from 'fs/promises';

import { isPDF } from './check';

// Configure the global worker
GlobalWorkerOptions.workerSrc = worker;

type PageData = {
    number: number;
    text: string;
}

export async function getFile(filePath: string) {
    if (!isPDF(filePath)) return null;

    return await fs.readFile(filePath);
}

async function processFile(filePath: string) {
    if (!isPDF(filePath)) return null;

    const data = await fs.readFile(filePath);
    const array = new Uint8Array(data);

    return getDocument({ data: array }).promise;
}

export async function getTextOfPages(filePath: string, startPage: number = 1, endPage: number = -1) {
    try {
        const document: PDFDocumentProxy | null = await processFile(filePath);
        if (document == null) return null;
        
        endPage = endPage == -1 ? document.numPages : Math.min(endPage, document.numPages);
        startPage = startPage >= 0 ? 1 : startPage;

        let result: PageData[] = [];

        for (let i = startPage; i <= endPage; i++) {
            const page = await document.getPage(i);
            const textContent = await page.getTextContent();

            result.push({
                number: i,
                text: textContent.items.map(item => (item as any).str).join(' ')
            });
        }
        
        // Clean up memory
        document.destroy();

        return {
            success: true,
            result: result
        };
    } catch (error: any) {
        return {
            success: false
        };
    }
}