// object representation of book pagination
import { BookObject } from "./Book";

export class Page {
    public page: number;
    public total: number;
    public books: BookObject[];

    constructor(page: number, total: number, books: BookObject[]) {
        this.page = page;
        this.books = books;
        this.total = total;
    }
}

export type PageObject = {
    page: number;
    total: number;
    books: BookObject[];
}