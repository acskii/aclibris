import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { PageNavigate } from "../components/pdf/PageNavigate";
import { BookObject, ViewType } from "../../electron/database/objects/Book";
import { PDFDocumentProxy } from "pdfjs-dist";
import { documentCache } from "../service/DocumentCache";
import { Spinner } from "../components/Spinner";
import { useToast } from "../contexts/ToastContext";
import { PDFPageCanvas } from "../components/pdf/PDFPageCanvas";

// TODO: On any page view, the error of Book Not Found is shown before page is loaded
//       Then only removed if page is loaded
//       Behavior must be loading first then error if not found.

export function View() {
    const params = useParams();
    const navigate = useNavigate();
    const { showToast, clearToast } = useToast();

    const [loading, setLoading] = useState<boolean>(true);
    
    const [file, setFile] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [totalPages, setTotalPages] = useState<number>(0);
    const [scale, setScale] = useState<number>(1);
    const [view, setView] = useState<ViewType>('horizontal');

    const id = params.id ? parseInt(params.id) : null;
    const page = params.page ? parseInt(params.page) : 1;

    const [pdf, setPDF] = useState<PDFDocumentProxy | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    useEffect(() => {
        const loadBookMeta = async () => {
        if (!id) {
            showToast("The book you're attempting to read does not exist.", "error");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            clearToast();

            const book: BookObject = await window.db.book.get(id);
            if (!book) {
                showToast("The book you're attempting to read does not exist.", "error");
                return;
            }

            setTitle(book.title);
            setTotalPages(book.pages);
            setView(book.view);
            setFile(book.filePath);
        } catch (error: any) {
            console.error(`[client:view] => Error parsing metadata: ${error.message}`);
            showToast(error.message, "error");
        }
        };

        loadBookMeta();
    }, [id]);

    useEffect(() => {
        if (!file) return;

        const loadDocument = async () => {
        try {
            setLoading(true);
            const doc = await documentCache.getDocument(file);
            if (doc) {
                setPDF(doc);
                clearToast();
            } else {
                showToast("The book file could not be read. Please check its existence on your drive.", "error");
            }
        } catch (err: any) {
            console.error(`[client:view] => Error reading document: ${err.message}`);
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
        };

        loadDocument();
    }, [file]);

    useEffect(() => {
        if (!id) return;
        window.db.book.addRecent(id, page, Date.now());
    }, [page, view, id]);

    useEffect(() => {
        if (view !== 'vertical' || !pdf || !id) return;

        const observerOptions = {
            root: null, // Use browser viewport
            rootMargin: '-20% 0px -60% 0px', // Target trigger when page occupies major reading area
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const pageNum = parseInt(entry.target.getAttribute('data-page-index') || '1');
                    if (pageNum !== page) {
                        // Update UI page tracking without interrupting scroll behaviors
                        navigate(`/view/${id}/${pageNum}`, { replace: true });
                    }
                }
            });
        }, observerOptions);

        const currentRefs = pageRefs.current;
            Object.values(currentRefs).forEach((ref) => {
                if (ref) observer.observe(ref);
            });

            return () => {
                Object.values(currentRefs).forEach((ref) => {
                    if (ref) observer.unobserve(ref);
                });
            };
    }, [view, pdf, totalPages, page, id, navigate]);

    /* Scroll to top on horizontal view */
    useEffect(() => {
        if (view !== 'horizontal') return;
        containerRef.current?.scrollIntoView({ behavior: 'instant' })
    }, [pdf, page]);

    const minZoom = 0.5;
    const maxZoom = 2.0;

    return (
        <div className="flex flex-col min-h-screen">
        {id && (
            <>
            <PageNavigate 
                current={pdf ? page : 0} 
                total={totalPages} 
                bookId={id}
                bookTitle={pdf ? title : "Loading..."}
                scale={scale}
                minScale={minZoom}
                maxScale={maxZoom}
                OnZoomIn={() => setScale(prev => Math.min(prev + 0.1, maxZoom))}
                OnZoomOut={() => setScale(prev => Math.max(prev - 0.1, minZoom))}
                view={view}
            />

            {loading && (
                <div className="flex flex-row items-center justify-center gap-2 py-10 z-30">
                    <Spinner />
                </div>
            )}

            {pdf && (
                <div className="relative text-center overflow-auto no-scrollbar flex-1 flex justify-center">
                    <div 
                        ref={containerRef}
                        className="absolute top-0 left-0 w-1 h-1 opacity-0"
                        aria-hidden="true"
                    />

                    {view === 'horizontal' ? (
                        /* Paginated Viewport Layout */
                        <div className="max-w-full">
                            <PDFPageCanvas 
                                pdf={pdf} 
                                pageNumber={page} 
                                scale={scale} 
                                view={view}
                            />
                        </div>
                    ) : (
                        /* Continuous Infinite Scroll Layout */
                        // TODO: Scrolling glitch (fix it)
                        <div className="flex flex-col items-center max-w-full w-full">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <div
                                    key={pageNum}
                                    data-page-index={pageNum}
                                    ref={el => pageRefs.current[pageNum] = el}
                                    className="w-full flex justify-center"
                                >
                                    <PDFPageCanvas 
                                        pdf={pdf} 
                                        pageNumber={pageNum} 
                                        scale={scale} 
                                        view={view}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            </>
        )}
        </div>
    );
}