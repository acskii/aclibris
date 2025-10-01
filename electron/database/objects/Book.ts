// An object representation for a book query result

export class Book {
    public id: number;
    public title: string;
    public author: string;
    public filePath: string;
    public fileSize: number;
    public pages: number;
    public createdAtInUnix: number;
    public collectionId: number;

    constructor(id: number, title: string, collectionId: number, 
                filePath: string, fileSize: number, pages: number,
                createdAtInUnix: number, author: string = 'N/A') {
        this.id = id;
        this.title = title;
        this.author = author;
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
    author: string;
    filePath: string;
    fileSize: number;
    pages: number;
    createdAtInUnix: number;
    collectionId: number;
};

export type BookQueryObject = {
    id: number;
    title: string;
    author: string;
    pages: number;
    file_path: string;
    file_size: number;
    collection_id: number;
    created_at: number;
};