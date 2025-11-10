/*
    Simple In-Memory Cache to re-use same PDFDocumentProxy object that is a result of
    pdfjs-dist/legacy.

    An error may show up in line 34 based on window.files.get() -> this is a ipcRenderer exposed method from Electron
    - completely fine!
*/

import { getDocument, PDFDocumentProxy, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import worker from 'pdfjs-dist/legacy/build/pdf.worker?url';
import { parsePDFDate } from "./util/Date";

// Setting up worker for document processing
GlobalWorkerOptions.workerSrc = worker;

class DocumentCache {
    private cache: PDFDocumentProxy | null = null;
    private currentKey: string | null = null;

    async getDocument(filePath: string): Promise<PDFDocumentProxy | null> {
        // Make sure the file has correct extension
        if (!filePath.endsWith(".pdf")) {
            console.log("[service:document_cache] => File path provided isn't of correct extension: pdf: ", filePath);
            return null;
        }

        // If found in cache, return it
        if (this.cache != null && this.currentKey == filePath) {
            console.log("[service:document_cache] => Retrieved from cache: " + filePath);
            return this.cache;
        }

        console.log("[service:document_cache] => Saving in cache: " + filePath);

        // Get file from file system
        // @ts-ignore
        const response = await window.files.get(filePath);

        if (response.success == true) {
            // Convery to binary array
            if (this.currentKey != filePath) {
                this.clearCurrentDocument();
            }
            const array = new Uint8Array(response.result);
            const document = await getDocument({ data: array }).promise;
            // Save document to cache
            this.cache = document;
            this.currentKey = filePath;

            return document;
        } else {
            console.log("[service:document_cache] => Couldn't retrieve PDF from file system");
            return null;
        }
    }

    getCurrentDocument() {
        return (this.cache != null) ? this.cache : null;
    }

    async clearCurrentDocument() {
        if (this.currentKey) {
            const document = this.getCurrentDocument();
            if (document) {
                await document.cleanup();
                await document.destroy();
                console.log("[service:document_cache] => Cleared document for: ", this.currentKey);
                this.cache = null;
                this.currentKey = null;
            }    
        }
    }

    private async getThumbnail(doc: PDFDocumentProxy): Promise<Uint8Array | null> {
        // @ts-ignore
        const can_get_thumbnail = await window.db.settings.thumbnail();

        if (can_get_thumbnail) {
            const page = await doc.getPage(1);
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement('canvas');

            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({
                canvas: canvas,
                viewport: viewport
            }).promise;

            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const arrayBuffer = reader.result as ArrayBuffer;
                            resolve(new Uint8Array(arrayBuffer));
                        };
                        reader.readAsArrayBuffer(blob);
                    } else {
                        resolve(null);
                    }
                }, 'image/jpeg', 0.8); // JPEG with 80% quality
            });
        } else {
            return null;
        }
    }

    async getMetadata(filePath: string) {
        // Get the document from the cache
        // Avoid confusion with clashing names
        const document = await this.getDocument(filePath);
        if (!document) return null;

        const data = await document.getMetadata();
        const info: Map<string, any> = new Map();
        // Get a screenshot of the first page
        const thumbnail: Uint8Array | null = await this.getThumbnail(document);

        // From data.info you can get Title, Author, CreationDate
        // Then any other meta is from data.metadata

        // Get the data from data.info separated
        for (const [key, value] of Object.entries(data.info)) {
            if (["Title", "Author", "CreationDate"].includes(key)) {
                if (key == "CreationDate") {
                    info.set(key.toLowerCase(), parsePDFDate(value));
                } else {
                    info.set(key.toLowerCase(), value);
                }
            }
        }
    
        // @ts-ignore
        const response = await window.files.get(filePath);
        const array = new Uint8Array(response.result);
        const fileSize = array.byteLength;

        const result = {
            ...Object.fromEntries(info),
            pages: document.numPages,
            filesize: fileSize,
            thumbnail: thumbnail
        }

        return result;
    }
}

export const documentCache = new DocumentCache();
export type DocumentType = PDFDocumentProxy;
