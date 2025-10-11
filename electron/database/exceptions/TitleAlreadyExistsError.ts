export default class TitleAlreadyExistsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TitleAlreadyExistsError";
    }
}