// An object representation for filter information to filter book query results

export class BookFilter {
    public query: string;
    public collectionId: number | null;
    public shelfId: number | null;
    public tags: string[];
    public asc: boolean;

    constructor(query: string = '', collectionId: number | null = null, 
                shelfId: number | null = null, tags: string[] = [], asc: boolean = true) {

        this.query = query;
        this.collectionId = collectionId;
        this.shelfId = shelfId;
        this.tags = tags;
        this.asc = asc;
    }
}

export type BookFilterObject = {
    query: string;
    collectionId: number | null;
    shelfId: number | null;
    tags: string[];
    asc: boolean;
}