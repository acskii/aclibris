import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Library, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ViewType } from "../../../electron/database/objects/Book";

type PageNavigateProps = {
    current: number;
    total: number;
    bookId: number;
    bookTitle: string;
    scale: number;
    minScale: number;
    maxScale: number;
    view: ViewType;
    OnZoomIn: () => void;
    OnZoomOut: () => void;
}

export function PageNavigate({ current, total, bookId, bookTitle, scale, minScale = 1, maxScale = 2, view, OnZoomIn, OnZoomOut }: PageNavigateProps) {
    const progress = total > 0 ? (current / total) * 100 : 0;
    const navigate = useNavigate();
    const [page, setPage] = useState<string>('');

    useEffect(() => {
      setPage(String(current));
    }, [current]);

    const confirmPageInput = () => {
      const p = parseInt(page);
      if (p >= 1 && p <= total) {
        navigate(`/view/${bookId}/${p}`);
      } else {
        setPage(String(current));
      }
    };

    const jumpToStart = () => {
        navigate(`/view/${bookId}/1`);
    };
    const jumpToEnd = () => {
        navigate(`/view/${bookId}/${total}`);
    };
    
    const jumpToNext = () => {
        const jump = current + 1 > total ? total : current + 1;
        navigate(`/view/${bookId}/${jump}`);
    };

    const jumpToPrevious = () => {
        const jump = current - 1 <= 0 ? 1 : current - 1;
        navigate(`/view/${bookId}/${jump}`);
    };

    const jumpToLibrary = () => navigate("/");

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") confirmPageInput();
    };

    return (
      <div className="sticky top-0 w-full flex justify-center z-30">
        <div className="w-full bg-stop-2 overflow-hidden text-white flex flex-col items-center">
          {/* Navigation Controls */}
          <div className="flex flex-row gap-10 items-center justify-between w-full px-5 py-2">
            <button
                onClick={jumpToLibrary}
                className="bg-stop-3 p-2 cursor-pointer rounded-md hover:bg-slate-600 text-white transition"
            >
                <Library size={20} />
            </button>

            <div className="flex-1 hidden lg:inline-block">
              <h1 className="font-bold text-sm md:text-md lg:text-lg line-clamp-1" title={bookTitle}>
                  {bookTitle}
              </h1>
            </div>

            <div className="flex flex-row gap-2 items-center flex-1 justify-end">
              <button
                  onClick={OnZoomIn}
                  disabled={scale >= maxScale}
                  className="bg-stop-3 p-2 cursor-pointer rounded-md hover:bg-slate-600 text-white transition disabled:opacity-30"
              >
                  <Plus size={20} />
              </button>
              <div className="text-nowrap flex flex-row gap-2 text-sm font-bold text-white border border-slate-700 px-3 py-1 bg-slate-900 rounded-lg">
                {Math.round(scale * 100)}%
              </div>
              <button
                  onClick={OnZoomOut}
                  disabled={scale <= minScale}
                  className="bg-stop-3 p-2 cursor-pointer rounded-md hover:bg-slate-600 text-white transition disabled:opacity-30"
              >
                  <Minus size={20} />
              </button>
            </div>

            {view === 'horizontal' && (
                <div className="flex flex-row gap-2 items-center justify-center">
                  <button
                    onClick={jumpToStart}
                    disabled={current <= 1}
                    className="bg-stop-3 p-2 cursor-pointer rounded-md hover:bg-slate-600 text-white transition disabled:opacity-30"
                  >
                    <ChevronsLeft size={20} />
                  </button>
                  <button
                    onClick={jumpToPrevious}
                    disabled={current <= 1}
                    className="bg-stop-3 p-2 cursor-pointer rounded-md hover:bg-slate-600 text-white transition disabled:opacity-30"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="text-nowrap flex flex-row gap-2 text-sm font-bold text-white border border-slate-700 px-3 py-1 bg-slate-900 rounded-lg">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="text-right m-0 p-0 bg-transparent outline-none focus:ring-0 w-8"
                      style={{ width: `${Math.max(page.length, 1)}ch` }}
                      onKeyDown={onKeyDown}
                      onBlur={confirmPageInput}
                      onChange={(e) => setPage(e.target.value.replace(/[^\d]/g, ""))}
                      value={page}
                    /><span className="grow-1"> / {total}</span>
                  </div>
                  <button
                    onClick={jumpToNext}
                    disabled={current >= total}
                    className="bg-stop-3 p-2 cursor-pointer rounded-md hover:bg-slate-600 text-white transition disabled:opacity-30"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button
                    onClick={jumpToEnd}
                    disabled={current >= total}
                    className="bg-stop-3 p-2 cursor-pointer rounded-md hover:bg-slate-600 text-white transition disabled:opacity-30"
                  >
                    <ChevronsRight size={20} />
                  </button>
                </div>
            )}
          </div>

          {/* Progress Bar */}
          {total > 0 && (
            <div className="w-full h-1.5 bg-slate-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
}