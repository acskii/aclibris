import { useEffect, useRef, useState } from "react";
import { PDFDocumentProxy } from "pdfjs-dist";
import { Spinner } from "../Spinner";
import { ViewType } from "../../../electron/database/objects/Book";

interface PDFPageCanvasProps {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  view: ViewType;
}

export function PDFPageCanvas({ pdf, pageNumber, scale, view }: PDFPageCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderTaskRef = useRef<any>(null);
    
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    const STANDARD_STRIP_WIDTH = 800;

    // Task 1: Estimate or handle aspect ratio structural sizing safely
    useEffect(() => {
        let isCurrent = true;
        
        const calculateLayoutDimensions = async () => {
        try {
            const page = await pdf.getPage(pageNumber);
            if (!isCurrent) return;

            const unscaledViewport = page.getViewport({ scale: 1.0 });
            let displayWidth = unscaledViewport.width * scale;
            let displayHeight = unscaledViewport.height * scale;

            if (view === 'vertical') {
                const targetVisualWidth = STANDARD_STRIP_WIDTH * scale;
                displayWidth = targetVisualWidth;
                displayHeight = unscaledViewport.height * (targetVisualWidth / unscaledViewport.width);
            }

            setDimensions({ width: displayWidth, height: displayHeight });
        } catch (err) {
            console.error(`[pdf-canvas] Dimension calculation failed on page ${pageNumber}:`, err);
        }
        };

        calculateLayoutDimensions();
        return () => { isCurrent = false; };
    }, [pdf, pageNumber, scale, view]);

    // Task 2: Viewport Virtualization Observer (The Core RAM Fix)
    useEffect(() => {
        const container = containerRef.current;
        if (!container || view === 'horizontal') {
            setIsVisible(true); // Paginated view always renders single active page
            return;
        }

        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                // Mark visible if page is in viewport or close to it (1.0 margin)
                setIsVisible(entry.isIntersecting);
            });
        },
        {
            root: null, // browser viewport
            rootMargin: "600px 0px 600px 0px", // Pre-load 1-2 pages ahead, drop behind
            threshold: 0.01,
        }
        );

        observer.observe(container);
        return () => {
            observer.disconnect();
        };
    }, [view]);

    // Task 3: Context-aware Render & Garbage Collection
    useEffect(() => {
        if (!isVisible || dimensions.width === 0) {
        // If page goes out of view, abort lingering tasks and let canvas drop from DOM
        if (renderTaskRef.current) {
            renderTaskRef.current.cancel();
            renderTaskRef.current = null;
        }
        return;
        }

        let isCurrent = true;

        const renderPage = async () => {
        try {
            setLoading(true);
            const page = await pdf.getPage(pageNumber);
            if (!isCurrent) return;

            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }

            const unscaledViewport = page.getViewport({ scale: 1.0 });
            let renderScale = scale;

            if (view === 'vertical') {
                const targetVisualWidth = STANDARD_STRIP_WIDTH * scale;
                // Capping pixel ratio calculation to 2.0 max prevents runaway memory usage on 4k screens
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                renderScale = (targetVisualWidth / unscaledViewport.width) * dpr;
            } else {
                renderScale = scale * 1.5 * Math.min(window.devicePixelRatio || 1, 2);
            }

            const viewport = page.getViewport({ scale: renderScale });
            const canvas = canvasRef.current;

            if (canvas && isCurrent) {
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const renderContext = {
                    canvas: canvas,
                    viewport: viewport,
                    intent: 'print'
                };

                const renderTask = page.render(renderContext);
                renderTaskRef.current = renderTask;

                await renderTask.promise;
            }
        } catch (error: any) {
            if (error.name !== 'RenderingCancelledException') {
                console.error(`[pdf-canvas] Render failed on page ${pageNumber}:`, error);
            }
        } finally {
            if (isCurrent) {
                setLoading(false);
            }
        }
        };

        renderPage();

        return () => {
            isCurrent = false;
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };
    }, [pdf, pageNumber, scale, view, isVisible, dimensions.width]);

    return (
        <div 
            ref={containerRef}
            className="relative flex items-center justify-center select-none overflow-hidden bg-slate-950/10 border border-slate-800/10"
            style={{ 
                width: dimensions.width ? `${dimensions.width}px` : '100%', 
                height: dimensions.height ? `${dimensions.height}px` : '500px',
            }}
        >
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-xs z-10">
                    <Spinner />
                </div>
            )}

            {isVisible ? (
                <canvas
                    ref={canvasRef}
                    className="block transition-opacity duration-150"
                    style={{
                        width: '100%',
                        height: '100%',
                        opacity: loading ? 0.5 : 1
                    }}
                />
            ) : (
                /* Structural memory placeholder skeleton when offscreen */
                <div className="text-slate-700/40 font-mono text-sm select-none">
                    Page {pageNumber}
                </div>
            )}
        </div>
    );
}