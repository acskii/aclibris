/*
    Simple In-Memory Cache to re-use same PDFDocumentProxy object that is a result of
    pdfjs-dist/legacy.

    An error may show up in line 34 based on window.files.get() -> this is a ipcRenderer exposed method from Electron
    - completely fine!
*/

import { getDocument, PDFDocumentProxy, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import worker from 'pdfjs-dist/legacy/build/pdf.worker?url';

// Setting up worker for document processing
GlobalWorkerOptions.workerSrc = worker;

class DocumentCache {
    private cache: Map<string, PDFDocumentProxy> = new Map();
    private currentKey: string | null = null;

    async getDocument(filePath: string) {
        // Make sure the file has correct extension
        if (!filePath.endsWith(".pdf")) {
            console.log("[service:document_cache] => File path provided isn't of correct extension: pdf");
            return null;
        }

        // If found in cache, return it
        if (this.cache.has(filePath)) {
            console.log("[service:document_cache] => Retrieved from cache: " + filePath);
            return this.cache.get(filePath) || null;
        }

        console.log("[service:document_cache] => Saving in cache: " + filePath);

        // Get file from file system
        const response = await window.files.get(filePath);
        if (response.success == true) {
            // Convery to binary array
            const array = new Uint8Array(response.result);
            const document = await getDocument({ data: array }).promise;
            // Save document to cache
            this.cache.set(filePath, document);
            this.currentKey = filePath;
            return document;
        } else {
            console.log("[service:document_cache] => Couldn't retrieve PDF from file system");
            return null;
        }
    }

    getCurrentDocument() {
        return (this.currentKey != null) ? this.cache.get(this.currentKey) : null;
    }

    clearCache() {
        console.log("[service:document_cache] => Clearing document cache..");
        this.cache.forEach((document, _) => {
            document.destroy();
        })
        this.currentKey = null;
        this.cache.clear();
    }
}

export const documentCache = new DocumentCache();
export type DocumentType = PDFDocumentProxy;
