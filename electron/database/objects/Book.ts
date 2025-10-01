// An object representation for a book query result

export class Book {
    public id: number;
    public title: string;
    public filePath: string;
    public fileSize: number;
    public pages: number;
    public createdAtInUnix: number;
    public collectionId: number;

    constructor(id: number, title: string, collectionId: number, 
                filePath: string, fileSize: number, pages: number,
                createdAtInUnix: number) {
        this.id = id;
        this.title = title;
        this.createdAtInUnix = createdAtInUnix;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.pages = pages;
        this.collectionId = collectionId;
    }
}

export type BookObject = {
    id: number;
    title: string;
    filePath: string;
    fileSize: number;
    pages: number;
    createdAtInUnix: number;
    collectionId: number;
};

export type BookQueryObject = {
    id: number;
    title: string;
    pages: number;
    file_path: string;
    file_size: number;
    collection_id: number;
    created_at: number;
};