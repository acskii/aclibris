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
            setError(error.message);
        } finally {
            renderLock.current = false;
            setLoading(false);
        }
    };

    const computeBaseScale = (width: number) => {
        const minW = 800;        // minimum window width
        const midW = 1200;       // width at which baseScale === 1
        const minBase = 0.80;    // scale at minW
        const maxBase = 1.00;    // scale at or above midW

        if (width <= minW) return minBase;
        if (width >= midW) return maxBase;
        const t = (width - minW) / (midW - minW);
        return minBase + t * (maxBase - minBase);
    };

    const [baseScale, setBaseScale] = useState(() => computeBaseScale(window.innerWidth || 1200));

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            const newBase = computeBaseScale(w);
            // preserve user's relative zoom ratio: r = currentScale / prevBase
            const ratio = scale / baseW;
            // compute next absolute scale and clamp to allowed range
            const nextScale = Math.max(newBase, Math.min(newBase * 2, newBase * ratio)); // example clamp to [newBase, newBase*2]
            setBaseScale(newBase);
            setScale(nextScale);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [scale]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.style.width = `${Math.round(baseW * scale)}px`;
        canvas.style.height = `auto`;
    }, [scale]);

    useEffect(() => {
        if (!pdf || renderLock.current) return;
        renderPage();
        containerRef.current?.scrollIntoView({behavior:'instant'})
    }, [pdf, page]);

    const minZoom = () => baseScale;
    const maxZoom = () => Math.round(baseScale * 1.5);

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
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {id && (
                <div className="flex flex-col">
                    <PageNavigate 
                        current={page} 
                        total={totalPages} 
                        bookId={id} 
                        scale={scale}
                        minScale={minZoom()}
                        maxScale={maxZoom()}
                        OnZoomIn={() => setScale(prev => Math.min(prev + 0.1, maxZoom()))}
                        OnZoomOut={() => setScale(prev => Math.max(prev - 0.1, minZoom()))}
                    />
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
        </div>
    );
}