// An object representation for a shelf query result

export class Shelf {
    public id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export type ShelfObject = {
    id: number;
    name: string;
};

export type ShelfQueryObject = {
    id: number;
    shelf_name: string;
};