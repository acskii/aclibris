// An object representation for a collection query result

export class Collection {
    public id: number;
    public name: string;
    public shelfId: number;

    constructor(id: number, name: string, shelfId: number) {
        this.id = id;
        this.name = name;
        this.shelfId = shelfId;
    }
}

export type CollectionObject = {
    id: number;
    name: string;
    shelfId: number;
};

export type CollectionQueryObject = {
    id: number;
    collection_name: string;
    shelf_id: number;
};