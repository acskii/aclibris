export default class FileAlreadyExistsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FileAlreadyExistsError";
    }
}