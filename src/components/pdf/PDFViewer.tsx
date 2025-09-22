import { documentCache } from '../../service/DocumentCache';

import { useState, useEffect, useRef } from 'react';
import { Spinner } from '../common/spinner/Spinner';
import { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { PageNavigate } from './PageNavigate';
import { TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PDFViewerProps = { 
    file: string;
    page: number;
};

export function PDFViewer({ file, page }: PDFViewerProps) {
    const navigate = useNavigate();
    const keyPressTimeout = useRef<NodeJS.Timeout | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pdf, setPDF] = useState<PDFDocumentProxy | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderLock = useRef<boolean>(false);

    useEffect(() => {
        const loadPDF = async () => {
            try {
                if (file == null) return null;
                setLoading(true);
                if (!file.endsWith(".pdf")) setError("Incorrect file extension");
                
                const doc = await documentCache.getDocument(file);
                setPDF(doc);
                setTotalPages(doc ? doc.numPages : 0);
                setError(null)
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        loadPDF(); 
    }, [file])
    
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
                        viewport: viewport
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

    const handleKeyDown = (event: KeyboardEvent) => {
        if (keyPressTimeout.current) {
            clearTimeout(keyPressTimeout.current);
            keyPressTimeout.current = null;
        }

        keyPressTimeout.current = setTimeout(() => {
            if (event.key == 'ArrowLeft') {
                if (page >= 1) navigate(`/view/${(page == 1) ? 1 : page - 1}`);
            } else if (event.key == 'ArrowRight') {
                if (page < totalPages) navigate(`/view/${page + 1}`);
            } 
        }, 40);
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        if (!pdf || renderLock.current) return;
        renderPage();

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (keyPressTimeout.current) clearTimeout(keyPressTimeout.current);
        }
    }, [pdf, page]);

    return (
        <div className="flex flex-col w-full">
            <PageNavigate current={page} total={totalPages} file={file} />
            <div className="mb-8 relative flex justify-center">
                <canvas 
                    ref={canvasRef} 
                    className={`${loading ? "hidden" : ""} relative z-10 max-w-full max-h-full h-full rounded-lg shadow-2xl border border-indigo-500/30`}
                />
            </div>
            {loading && (
                <div className="flex flex-row items-center justify-center gap-2 z-30 my-10">
                    <Spinner />
                    <p className="text-violet-500 font-bold text-center text-md">
                        Loading..
                    </p>
                </div>
            )}
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
        </div>
    );
}