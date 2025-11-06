// An object representation for a tag query result

export class Tag {
    public id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export type TagObject = {
    id: number;
    name: string;
}

export type TagQueryObject = {
    id: number;
    tag_name: string;
}