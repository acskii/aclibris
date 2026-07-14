import { arrayToBase64 } from "../../service/util/Thumbnail";
import { type BookObject } from "../../../electron/database/objects/Book";
import { Book, Calendar, Eye, Folder, LibrarySquare, User } from "lucide-react";
import { fromUnix } from "../../service/util/Date";

export type ViewType = 'grid' | 'list';

interface BookItemProps {
    view: ViewType;
    book: BookObject;
    onClick: (id: number, lastReadPage: number) => void;
    getShelfName: (collectionId: number) => string;
    getCollectionName: (collectionId: number) => string;
}

export default function BookItem({ view, book, onClick, getShelfName, getCollectionName } : BookItemProps) {

    if (view === 'list') {
        /* List View Item */
        return (
            <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-app-card rounded-md border border-stop-3 hover:border-stop-1/60 hover:bg-stop-3/20 cursor-pointer transition-all group w-full"
                onClick={() => onClick(book.id, book.lastReadPage ?? 1)}
            >
                <div className="flex-1">
                    <h3 className="text-white font-semibold text-base truncate">
                        {book.title}
                    </h3>

                    {book.author && (
                        <div className="flex items-center gap-1.5 text-sm text-white/60 mt-1">
                            <User size={16} className="shrink-0" />
                            <span className="truncate">{book.author}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        {/* Shelf */}
                        <div className="flex items-center gap-1.5">
                            <LibrarySquare size={16} className="shrink-0" />
                            <span className="truncate max-w-[100px]">{getShelfName(book.collectionId)}</span>
                        </div>

                        {/* Collection */}
                        <div className="flex items-center gap-1.5">
                            <Folder size={16} className="shrink-0" />
                            <span className="truncate">{getCollectionName(book.collectionId)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Tags */}
                <div className="flex-1 min-w-[200px]">
                    {book.tags.length > 0 && (
                        <div className="flex flex-wrap justify-end gap-2 mb-2 overflow-y-auto max-h-18">
                            {book.tags.map(tag => (
                                <span
                                    key={tag.id}
                                    className="bg-white/10 text-white font-semibold p-1 rounded-md text-sm flex items-center gap-2 transition-all border border-white/5"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* Grid View Item */
    return (
        <div
            className="bg-app-card rounded-md border border-4 border-stop-3 hover:border-stop-3/40 cursor-pointer group"
            onClick={() => onClick(book.id, book.lastReadPage ?? 1)}
        >
            {/* Thumbnail */}
            <div className="relative h-48 bg-white/5 rounded-t-md overflow-hidden">
                {book.thumbnail ? (
                    <img 
                        src={`data:image/jpeg;base64,${arrayToBase64(book.thumbnail)}`}
                        alt={book.title}
                        className="w-full"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stop-1/20 to-stop-3/20">
                        <Book size={20} className="text-white/50" />
                    </div>
                )}
                
                <div className="absolute top-3 right-3">
                    <button className="bg-stop-3/60 cursor-pointer hover:bg-stop-3/40 text-white p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <Eye size={15} />
                    </button>
                </div>
            </div>
                            
            <div className="mt-auto">
                {/* Book Info */}
                <div className="p-4 flex flex-col gap-2">
                    <h3 className="overflow-hidden text-white font-semibold text-lg mb-2 group-hover:text-white/80 transition-colors">
                        {book.title.length > 100 
                        ? `${book.title.substring(0, 100)}...` 
                        : book.title}
                    </h3>
                                    
                    {book.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2 overflow-y-auto max-h-18">
                            {book.tags.map(tag => (
                                <span
                                    key={tag.id}
                                    className="bg-white/10 text-white font-semibold px-2 py-1 rounded-md text-sm flex items-center gap-2 transition-all border border-white/5"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {book.author && (
                        <div className="flex items-center gap-2 text-sm text-white/80">
                            <User size={18} />
                            <span>{book.author}</span>
                        </div>
                    )}

                    {/* Shelf and Collection */}
                    <div className="space-y-1 text-white/60">
                        <div className="flex items-center gap-2 text-sm">
                            <LibrarySquare size={14} />
                            <span>{getShelfName(book.collectionId)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Folder size={14} />
                            <span>{getCollectionName(book.collectionId)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm border-t border-white/10 pt-1">
                            <Calendar size={14} />
                            <span>Created at {fromUnix(book.createdAtInUnix)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}