import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { PageNavigate } from "../components/pdf/PageNavigate";
import { BookObject } from "../../electron/database/objects/Book";
import { PDFDocumentProxy } from "pdfjs-dist";
import { documentCache } from "../service/DocumentCache";
import { Spinner } from "../components/common/spinner/Spinner";
import { useToast } from "../contexts/ToastContext";

// TODO: On any page view, the error of Book Not Found is shown before page is loaded
//       Then only removed if page is loaded
//       Behavior must be loading first then error if not found.

export function View() {
    const params = useParams();
    const { showToast, clearToast } = useToast();

    const [loading, setLoading] = useState<boolean>(false);
    const [file, setFile] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [totalPages, setTotalPages] = useState<number>(0);
    const [scale, setScale] = useState<number>(1);
    const [baseW, setBaseW] = useState<number>(0);

    const id = params.id ? parseInt(params.id) : null;
    const page = params.page ? parseInt(params.page) : 1;

    const [pdf, setPDF] = useState<PDFDocumentProxy | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const renderLock = useRef<boolean>(false);
    
    useEffect(() => {
        const loadDocument = async () => {
            try {
                setLoading(true);

                const doc = await documentCache.getDocument(file);
                setPDF(doc);

                if (doc) clearToast();
                // TODO: Error shows even if document exists, delayed error message removal issue
                else showToast("The book you're attempting to read does not exist, please go back to choose another.", 'error');
            } catch (error: any) {
                console.error(`[client:view] => Error occurred while loading document: ${error.message}`);
                showToast(error.message, 'error');
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
            if (!id) return;
            await window.db.book.addRecent(id, page, Date.now());
            // ^^^
        };

        saveAsRecent();
    }, [page]);

    useEffect(() => {
        const loadFilePath = async () => {
            if (!id) {
                showToast("The book you're attempting to read does not exist", 'error');
                setFile('');
                return;
            }

            // Electron specific
            // Calls the database to query on the book corresponding to the id requested
            const book: BookObject = await window.db.book.get(id);
            setTotalPages(book.pages);
            setTitle(book.title);

            // Due to database, a file path for the book will always be there
            // since editing book details won't allow invalid paths
            // To check for book existence, we need to attempt to render it first
            const file = book.filePath;
            setFile(file);
        };

        // Reset from previous book load, and load new one's details
        clearToast();
        setScale(1);
        setBaseW(0);
        loadFilePath();
    }, []);

    const renderPage = async () => {
        try {
            setLoading(true);
            clearToast();
            if (pdf != null && !renderLock.current) {
                renderLock.current = true;
                const documentPage = await pdf.getPage(page);
                const viewport = documentPage.getViewport({ scale: 1.5 });
                const canvas = canvasRef.current;
                    
                if (canvas) {
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    canvas.style.width = `${Math.round(viewport.width) * scale}px`;
                    canvas.style.height = `auto`;

                    setBaseW(Math.round(viewport.width));
            
                    const renderContext = {
                        canvas: canvas,
                        viewport: viewport,
                        intent: 'print'
                    }
                    
                    await documentPage.render(renderContext).promise;
                }
            }
        } catch (error: any) {
            console.error(`[client:view] => Error occurred while rendering page: ${error.message}`);
            showToast(error.message, 'error');
        } finally {
            renderLock.current = false;
            setLoading(false);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.style.width = `${Math.round(baseW * scale)}px`;
        canvas.style.height = `auto`;
    }, [scale]);

    useEffect(() => {
        renderPage();
        containerRef.current?.scrollIntoView({behavior:'instant'})
    }, [pdf, page]);

    const minZoom = 0.5;
    const maxZoom = 3;

    return (
        <>
            {id && (
                <div className="flex flex-col">
                    {pdf == null ? 
                        <PageNavigate 
                            current={0} 
                            total={0} 
                            bookId={id}
                            bookTitle={"Book Not Found"}
                            scale={1}
                            minScale={0}
                            maxScale={0}
                            OnZoomIn={() => {}}
                            OnZoomOut={() => {}}
                        />
                    : <PageNavigate 
                        current={page} 
                        total={totalPages} 
                        bookId={id}
                        bookTitle={title}
                        scale={scale}
                        minScale={minZoom}
                        maxScale={maxZoom}
                        OnZoomIn={() => setScale(prev => Math.min(prev + 0.1, maxZoom))}
                        OnZoomOut={() => setScale(prev => Math.max(prev - 0.1, minZoom))}
                    />}

                    {loading && (
                        <div className="flex flex-row items-center justify-center gap-2 z-30 my-10">
                            <Spinner />
                            <p className="text-purple-400 font-bold text-center text-md">
                                Loading..
                            </p>
                        </div>
                    )}
                    
                    <div className="relative text-center overflow-auto no-scrollbar">
                        <div 
                            ref={containerRef}
                            className="absolute top-0 left-0 w-1 h-1 opacity-0"
                            aria-hidden="true"
                        />
                        <canvas 
                            ref={canvasRef}
                            className={`${loading ? "invisible" : "visible"} inline-block`}
                        />
                    </div>
                </div>
            )}
        </>
    );
}