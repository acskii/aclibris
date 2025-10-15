
export type PDFMetadata = {
    title?: string;
    creationdate?: string;
    pages: number;
    author?: string;
    thumbnail?: Uint8Array | null;
    filesize: number;
}