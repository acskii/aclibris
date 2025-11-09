import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { PageNavigate } from "../components/pdf/PageNavigate";
import { BookObject } from "../../electron/database/objects/Book";
import { PDFDocumentProxy } from "pdfjs-dist";
import { documentCache } from "../service/DocumentCache";
import { Spinner } from "../components/common/spinner/Spinner";

export function View() {
    const params = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>('');
    const [file, setFile] = useState<string>('');
    const [totalPages, setTotalPages] = useState<number>(0);

    const id = params.id ? parseInt(params.id) : null;
    const page = params.page ? parseInt(params.page) : 1;

    const [pdf, setPDF] = useState<PDFDocumentProxy | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderLock = useRef<boolean>(false);
    
    useEffect(() => {
        const loadDocument = async () => {
            try {
                setLoading(true);

                const doc = await documentCache.getDocument(file);
                setPDF(doc);
                setError(null)
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };            
        loadDocument(); 
    }, [file])

    useEffect(() => {
        const saveAsRecent = async () => {
            // This specific line will always run at every page turn
            // TODO: here or another place?
            // @ts-ignore
            await window.db.book.addRecent(id, page, Date.now());
            // ^^^
        };

        saveAsRecent();
    }, [page]);

    useEffect(() => {
        const loadFilePath = async () => {
            if (!id) {
                setError("The book you're attempting to book does not exist, please go back to choose another. ");
                setFile('');
                return;
            }

            // Electron specific
            // Calls the database to query on the book corresponding to the id requested
            // @ts-ignore
            const book: BookObject = await window.db.book.get(id);
            setTotalPages(book.pages);

            const file = book.filePath;

            if (file) {
                setFile(file);
                setError(null);
            } else {
                setError("The book you're attempting to book does not exist, please go back to choose another. ");
                setFile('');
            }
        };

        loadFilePath();
    }, []);

    const renderPage = async () => {
        try {
            setLoading(true);
            if (pdf != null) {
                renderLock.current = true;
                const documentPage = await pdf.getPage(page);
                const viewport = documentPage.getViewport({ scale: 1.5 });
                const canvas = canvasRef.current;
                    
                if (canvas) {
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                        canvas: canvas,
                        viewport: viewport,
                        intent: 'print'
                    }
                    
                    await documentPage.render(renderContext).promise;
                }
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            renderLock.current = false;
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!pdf || renderLock.current) return;
        renderPage();
    }, [pdf, page]);
    
    return (
        <div>
            {error && (
                <div className="fixed w-3/5 left-1/2 transform -translate-x-1/2 bg-gradient-to-l from-orange-400 to-yellow-300 top-20 z-50 w-3/5 rounded-xl" role="alert" aria-labelledby="toast-error">
                    <div className="flex p-4 items-center">
                        <div className="shrink-0 text-red-500">
                            <TriangleAlert size={30} />
                        </div>
                        <div className="ms-3">
                            <p className="text-md text-red-400 font-bold ">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {id && (
                <div className="flex flex-col">
                    <PageNavigate current={page} total={totalPages} bookId={id} />
                
                    {loading && (
                        <div className="flex flex-row items-center justify-center gap-2 z-30 my-10">
                            <Spinner />
                            <p className="text-purple-400 font-bold text-center text-md">
                                Loading..
                            </p>
                        </div>
                    )}
                
                    <div className="relative flex justify-center overflow-scroll">
                        <canvas 
                            ref={canvasRef} 
                            className={`${loading ? "invisible" : "visible"} relative max-w-full h-full shadow-lg`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}