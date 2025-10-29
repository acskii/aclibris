import { Book, Calendar, Eye, Filter, Folder, LibrarySquare, Search, SearchX, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/common/spinner/Spinner";
import { useEffect, useMemo, useState } from "react";
import { BookObject } from "../../electron/database/objects/Book";
import { arrayToBase64 } from "../service/util/Thumbnail";
import { fromUnix } from "../service/util/Date";
import { ShelfObject } from "../../electron/database/objects/Shelf";
import { CollectionObject } from "../../electron/database/objects/Collection";
import { Dropdown } from "../components/common/dropdown/Dropdown";

function SearchPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [books, setBooks] = useState<BookObject[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [shelves, setShelves] = useState<ShelfObject[]>([]);
    const [collections, setCollections] = useState<CollectionObject[]>([]);
    const [selectedShelf, setSelectedShelf] = useState<number | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<number | null>(null);

    useEffect(() => {
        const loadBooks = async () => {
            setLoading(true);
            // Get books
            const books: BookObject[] = await window.db.book.getAll();
            // Sort them alphabetically
            books.sort((a, b) => a.title.localeCompare(b.title));

            const shelves: ShelfObject[] = await window.db.shelf.getAll();
            const collections: CollectionObject[] = await window.db.collection.getAll();

            setBooks(books);
            setShelves(shelves);
            setCollections(collections);
            setLoading(false);
        }

        loadBooks();
    }, [])

    useEffect(() => {
        // Auto-select shelf when collection is selected
        if (selectedCollection) {
            const collection = collections.find(c => c.id === selectedCollection);
            if (collection && collection.shelfId !== selectedShelf) {
                setSelectedShelf(collection.shelfId);
            }
        }
    }, [selectedCollection, collections, selectedShelf]);

    const getShelfFromCollection = (collection_id: number) => {
        return shelves.find((s) => {
            const collection = collections.find((c) => c.id == collection_id) 
            if (collection) return s.id == collection.shelfId;
            else return null;
        });
    }

    const filteredBooks = useMemo(() => {
        let filtered = books;

        // Apply search query filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(book => 
                book.title?.toLowerCase().includes(query) ||
                book.author?.toLowerCase().includes(query)
            );
        }

        // Apply shelf filter
        if (selectedShelf) {
            filtered = filtered.filter(book => getShelfFromCollection(book.collectionId)?.id === selectedShelf);
        }

        // Apply collection filter
        if (selectedCollection) {
            filtered = filtered.filter(book => book.collectionId === selectedCollection);
        }

        return filtered;
    }, [books, searchQuery, selectedShelf, selectedCollection]);

    const getCollectionName = (collectionId: number) => {
        return collections.find(c => c.id === collectionId)?.name;
    };

    const getCollectionsForShelf = (shelfId: number | null) => {
        if (!shelfId) return collections;
        return collections.filter(c => c.shelfId === shelfId);
    };

    const filterByShelf = (shelf_id: number | null) => {
        setSelectedShelf(shelf_id);
        setSelectedCollection(null);
    }

    const filterByCollection = (collection_id: number | null) => {
        setSelectedCollection(collection_id);
    }


    const handleBookClick = (id: number, page: number | null) => {
        navigate(`/view/${id}/${page ? page : 1}`);
    }

    return (
        <div className="min-h-screen px-5 pb-5">
            <div className="sticky top-0 z-10 bg-gradient-to-br from-cyan-500 to-sky-600 pb-4 pt-4 -mx-5 px-5 border-b border-indigo-500/20">
                <h1 className="mb-2 flex gap-3 justify-start">
                    <Search size={40} />
                    <span className="text-4xl font-bold text-white">Search</span>
                </h1>
                <div className="w-full p-2 mt-4">
                    <div className="flex flex-row mb-4 items-center gap-2 mx-auto bg-gray-800/30 py-4 px-4 rounded-md">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by title, author, shelf, or collection..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-2 px-2 bg-gray-700/50 border border-indigo-500/30 rounded-md text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                        />
                    </div>
                
                    <div className="z-50 w-full mb-4 bg-gray-800/30 backdrop-blur-sm rounded-md p-4 border border-indigo-500/20">
                        <div className="flex items-center gap-2 mb-3">
                            <Filter size={18} />
                            <span className="text-white font-semibold">Filters</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Dropdown 
                                title="Shelf"
                                placeholder="All Shelves"
                                options={shelves}
                                // TODO: change shelf with collection
                                value={selectedShelf ? shelves.find(s => s.id === selectedShelf) || null : null}
                                onOptionSelect={(option) => filterByShelf(option ? option.id : null)}
                            />

                            <Dropdown 
                                title="Collection"
                                placeholder="All Collections"
                                options={
                                    selectedShelf 
                                    ? getCollectionsForShelf(selectedShelf)
                                    : collections
                                }
                                // TODO: change collection with shelf
                                value={selectedCollection ? collections.find(c => c.id === selectedCollection) || null : null}
                                onOptionSelect={(option) => filterByCollection(option ? option.id : null)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-start justify-center mt-4 font-semibold text-lg">
                        <span>
                            {filteredBooks.length == books.length ? "Showing all books" : `Showing ${filteredBooks.length} of ${books.length} books`}
                        </span>
                        {searchQuery && (
                            <span>
                            Results for: "{searchQuery}"
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {loading && (
                <div className="flex bg-indigo-400 p-3 rounded-lg flex-row items-center justify-center gap-2 z-30 my-10">
                    <Spinner />
                    <p className="text-violet-900 font-bold text-center text-md">
                        Loading..
                    </p>
                </div>
            )}

            {filteredBooks.length === 0 && !loading ? (
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-md p-6 border border-indigo-500/20 text-center">
                    <SearchX size={50} className="mx-auto mb-2" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {searchQuery ? 'No books found' : 'No books in your library'}
                    </h3>
                    <p className="text-indigo-200">
                        {searchQuery 
                        ? 'Try different search terms or browse all books'
                        : 'Start by uploading your first book'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                    <div
                        key={book.id}
                        className="bg-gray-800/30 backdrop-blur-sm rounded-md border border-indigo-500/20 hover:border-indigo-400/50 cursor-pointer group"
                        onClick={() => handleBookClick(book.id, book.lastReadPage ?? null)}
                    >
                        {/* Thumbnail */}
                        <div className="relative h-48 bg-indigo-900/20 rounded-t-md overflow-hidden">
                            {book.thumbnail ? (
                                <img 
                                    src={`data:image/jpeg;base64,${arrayToBase64(book.thumbnail)}`}
                                    alt={book.title}
                                    className="w-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/40 to-violet-900/40">
                                    <Book size={20} />
                                </div>
                            )}
                            <div className="absolute top-3 right-3">
                        <       button className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                    <Eye size={15} />
                                </button>
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="p-4 flex flex-col gap-2">
                            <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-indigo-300 transition-colors">
                                {book.title}
                            </h3>

                            {book.author && (
                                <div className="flex items-center gap-2 text-sm">
                                    <User size={18} />
                                    <span>{book.author}</span>
                                </div>
                            )}

                            {/* Shelf and Collection */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                    <LibrarySquare size={14} />
                                    <span>{getShelfFromCollection(book.collectionId)?.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Folder size={14} />
                                    <span>{getCollectionName(book.collectionId)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm border-t border-indigo-500/20">
                                    <Calendar size={14} />
                                    <span>Added {fromUnix(book.createdAtInUnix)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            )}
        </div>    
    );
}

export default SearchPage