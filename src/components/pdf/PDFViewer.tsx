import { getDocument, PDFDocumentProxy, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import workerSrc from 'pdfjs-dist/build/pdf.worker?url';

import { useState, useEffect, useRef } from 'react';
import { Spinner } from '../common/spinner/Spinner';

GlobalWorkerOptions.workerSrc = workerSrc;

type PDFViewerProps = { 
    file: string;
    page: number;
};

export function PDFViewer({ file, page }: PDFViewerProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderLock = useRef<boolean>(false);

    useEffect(() => {
        const loadDocument = async () => {
            try {
                setLoading(true);
                if (!file.endsWith(".pdf")) setError("Incorrect file extension");
                
                const response = await window.files.get(file);
                const array = response.result;
                const document = await getDocument({ data: array }).promise;
                setDocument(document);
                setError(null)
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        loadDocument(); 
    }, [file])
    
    const renderPage = async () => {
        try {
            setLoading(true);
            if (document != null) {
                renderLock.current = true;
                const documentPage = await document.getPage(page);
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

    useEffect(() => {
        if (!document || renderLock.current) return;
        renderPage();
    }, [document, page]);

    return (
        <div>
            {loading && <Spinner />}
            {error && <span className="text-red-500 text-lg font-bold">{error}</span>}
            <canvas ref={canvasRef} className="w-full">

            </canvas>
        </div>
    );
}