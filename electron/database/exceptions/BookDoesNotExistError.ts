export default class BookDoesNotExistError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BookDoesNotExistError";
    }
}