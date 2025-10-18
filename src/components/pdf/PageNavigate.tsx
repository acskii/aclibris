import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Library } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type PageNavigateProps = {
    current: number;
    total: number;
    bookId: number;
}

export function PageNavigate({ current, total, bookId }: PageNavigateProps) {
  const progress = (current / total) * 100;
  const navigate = useNavigate();
  const [page, setPage] = useState<string>('');

  useEffect(() => {
    setPage(String(current));
  }, [current])

  const confirmPageInput = () => {
    const p = parseInt(page);
    if (p >= 1 && p <= total) {
      navigate(`/view/${bookId}/${p}`);
    } else {
      setPage(String(current));
    }
  }

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

  const jumpToLibrary = () => {
    navigate("/library");
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") confirmPageInput();
  };

  return (
    <div className="sticky top-0 w-full flex justify-center z-30">
      <div className="w-full min-w-[50%] bg-gradient-to-r from-sky-600 via-cyan-500 to-violet-400 overflow-hidden text-white flex flex-col items-center backdrop-blur-md">
        {/* Navigation Controls */}
        <div className="flex flex-row gap-2 items-center justify-between w-full px-4 py-2">
          <button
              onClick={jumpToLibrary}
              className="bg-gradient-to-br from-blue-800 to-indigo-900 p-2 rounded-md hover:from-violet-400 hover:to-purple-500 text-white transition disabled:opacity-30"
          >
              <Library size={20} />
          </button>
          <div className="flex flex-row gap-2 items-center justify-center">
            <button
              onClick={jumpToStart}
              disabled={current <= 1}
              className="bg-gradient-to-br from-blue-800 to-indigo-900 p-2 rounded-md hover:from-violet-400 hover:to-purple-500 text-white transition disabled:opacity-30"
            >
              <ChevronsLeft size={20} />
            </button>
            <button
              onClick={jumpToPrevious}
              disabled={current <= 1}
              className="bg-gradient-to-br from-blue-800 to-indigo-900 p-2 rounded-md hover:from-violet-400 hover:to-purple-500 text-white transition disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-nowrap flex flex-row gap-2 text-sm font-bold text-white border border-3 border-purple px-3 py-1 bg-sky-400 rounded-lg">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="text-right m-0 p-0 bg-transparent"
                style={{width: `${page.length}ch`}}
                onKeyDown={onKeyDown}
                onBlur={confirmPageInput}
                onChange={(e) => setPage(e.target.value.replace(/[^\d]/g, ""))}
                value={page}
              /><p className="grow-1"> / {total}</p>
            </div>
            <button
              onClick={jumpToNext}
              disabled={current >= total}
              className="p-2 rounded-md bg-gradient-to-br from-blue-800 to-indigo-900 hover:to-purple-500 text-white transition disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={jumpToEnd}
              disabled={current >= total}
              className="p-2 rounded-md bg-gradient-to-br from-blue-800 to-indigo-900 hover:from-violet-400 hover:to-purple-500 text-white transition disabled:opacity-30"
            >
              <ChevronsRight size={20} />
            </button>
          </div>
          
        </div>

        {/* Progress Bar */}
        {total > 0 && (
          <div className="w-full h-2 rounded-full bg-blue-800 overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}