// An object representation for a shelf query result

export class Shelf {
    public id: number;
    public name: string;
    public pinned: boolean;

    constructor(id: number, name: string, pinned: number) {
        this.id = id;
        this.name = name;
        this.pinned = pinned == 0 ? false : true;
    }
}

export type ShelfObject = {
    id: number;
    name: string;
    pinned: boolean;
};

export type ShelfQueryObject = {
    id: number;
    shelf_name: string;
    pinned: number;
};