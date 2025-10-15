import { useParams } from "react-router-dom";
import { PDFViewer } from "../components/pdf/PDFViewer";
import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";

export function View() {
    const params = useParams();
    const [error, setError] = useState<boolean>(false);
    const [file, setFile] = useState<string>('');

    const id = params.id ? parseInt(params.id) : null;
    const page = params.page ? parseInt(params.page) : 1;

    useEffect(() => {
        const saveAsRecent = async () => {
            // This specific line will always run at every page turn
            // TODO: here or another place?
            await window.db.book.addRecent(id, page, Date.now());
            // ^^^
        };

        saveAsRecent();
    }, [page]);

    useEffect(() => {
        const loadFilePath = async () => {
            if (!id) {
                setError(true);
                setFile('');
                return;
            }

            // Electron specific
            // Calls the database to query on the book corresponding to the id requested

            const book = await window.db.book.get(id);
            const file = book.filePath;

            if (file) {
                setFile(file);
                setError(false);
            } else {
                setError(true);
                setFile('');
            }
        };

        loadFilePath();
    }, []);

    return (
        <div className="bg-white">
            {error && (
                <div className="fixed w-3/5 left-1/2 transform -translate-x-1/2 bg-gradient-to-l from-orange-400 to-yellow-300 top-20 z-50 w-3/5 rounded-xl" role="alert" aria-labelledby="toast-error">
                    <div className="flex p-4 items-center">
                        <div className="shrink-0 text-red-500">
                            <TriangleAlert size={30} />
                        </div>
                        <div className="ms-3">
                            <p className="text-md text-red-400 font-bold ">
                                The book you're attempting to book does not exist, please go back to choose another.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {id && <PDFViewer file={file} bookId={id} page={page} />}
        </div>
    );
}