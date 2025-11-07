import { Book, Calendar, Eye, Folder, LibrarySquare, Search, SearchX, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/common/spinner/Spinner";
import { useEffect, useMemo, useState } from "react";
import { BookObject } from "../../electron/database/objects/Book";
import { arrayToBase64 } from "../service/util/Thumbnail";
import { fromUnix } from "../service/util/Date";
import { ShelfObject } from "../../electron/database/objects/Shelf";
import { CollectionObject } from "../../electron/database/objects/Collection";
import { Dropdown } from "../components/common/dropdown/Dropdown";
import { TagObject } from "../../electron/database/objects/Tag";
import { AutocompleteDropdown } from "../components/common/dropdown/AutocompleteDropdown";

function SearchPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [books, setBooks] = useState<BookObject[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [shelves, setShelves] = useState<ShelfObject[]>([]);
    const [collections, setCollections] = useState<CollectionObject[]>([]);
    const [selectedShelf, setSelectedShelf] = useState<number | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [allTags, setAllTags] = useState<TagObject[]>([]);
    const [tagOptions, setTagOptions] = useState<TagObject[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        const loadBooks = async () => {
            setLoading(true);
            // Get books
            // @ts-ignore
            const books: BookObject[] = await window.db.book.getAll();
            // Sort them alphabetically
            books.sort((a, b) => a.title.localeCompare(b.title));

            // @ts-ignore
            const tags: TagObject[] = await window.db.tag.getAll();

            // @ts-ignore
            const shelves: ShelfObject[] = await window.db.shelf.getAll();
            // @ts-ignore
            const collections: CollectionObject[] = await window.db.collection.getAll();

            setBooks(books);
            setShelves(shelves);
            setCollections(collections);
            setAllTags(tags);
            setTagOptions(tags);
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

        // Apply tags filter
        if (selectedTags.length > 0) {
            filtered = filtered.filter(book => {
                return selectedTags.every(selectedTag => 
                    book.tags.some(bookTag => bookTag.name === selectedTag)
                );
            })
        }

        return filtered;
    }, [books, searchQuery, selectedShelf, selectedCollection, selectedTags]);

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

    const filterByTag = (tag: string | null) => {
        if (tag) {
            setSelectedTags(prev => [...prev, tag]);
            setTagOptions(prev => prev.filter((t) => t.name !== tag));
            setTagInput('');
        }
    }

    const removeTag = (tag: string) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
        const nt = allTags.find((t) => t.name == tag) ?? null;

        if (nt && !tagOptions.find((t) => t.name == nt.name)) setTagOptions(prev => [...prev, nt]);
    }

    const handleBookClick = (id: number, page: number | null) => {
        navigate(`/view/${id}/${page ? page : 1}`);
    }

    return (
        <div className="min-h-screen px-5 pb-5">
            <div className="sticky top-0 z-10 bg-gradient-to-br from-cyan-500 to-sky-600 py-3 -mx-5 px-5 border-b border-indigo-500/20 max-h-[45vh]">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="flex gap-2 items-center">
                        <Search size={28} />
                        <span className="text-2xl font-bold text-white">Search</span>
                    </h1>
                </div>
                
                <div className="mb-2">
                    <div className="flex items-center gap-2 bg-gray-800/30 py-2 px-3 rounded-md">
                        <Search size={16} className="text-indigo-300" />
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-1 px-2 bg-gray-700/50 border border-indigo-500/30 rounded-md text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                        />
                    </div>
                </div>

                <div className="mb-2">
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-md p-2 border border-indigo-500/20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <Dropdown 
                                title="Shelf"
                                placeholder="All Shelves"
                                options={shelves}
                                value={selectedShelf ? shelves.find(s => s.id === selectedShelf) || null : null}
                                onOptionSelect={(option) => filterByShelf(option ? option.id : null)}
                                className="text-xs"
                            />

                            <Dropdown 
                                title="Collection"
                                placeholder="All Collections"
                                options={
                                    selectedShelf 
                                    ? getCollectionsForShelf(selectedShelf)
                                    : collections
                                }
                                value={selectedCollection ? (selectedShelf ? collections.find(c => c.id === selectedCollection) || null : null) : null}
                                onOptionSelect={(option) => filterByCollection(option ? option.id : null)}
                                className="text-xs"
                            />
                            <AutocompleteDropdown
                                title="Tag"
                                placeholder="Enter tag"
                                options={tagOptions}
                                value={tagInput}
                                onValueChange={setTagInput}
                                onOptionSelect={(option) => filterByTag(option ? option.name : null)}
                                className="text-xs flex-1"
                            />

                        </div>
                        <div className="flex flex-1 flex-row gap-2 max-height-5 mt-5 overflow-y-auto">
                            {selectedTags.map((tag) => {
                                return (
                                    <span
                                        key={tag}
                                        className={`bg-gray-500 text-white font-semibold px-2 rounded-md text-sm flex items-center gap-2`}
                                    >
                                        <span>{tag}</span>
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="transition-colors font-semibold rounded-full hover:bg-black/20 mt-0.5"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                    );
                                })}
                            </div>
                    </div>
                </div>

                {/* Minimal Stats */}
                <div className="text-xs text-white">
                    {filteredBooks.length < books.length ? <span>Showing <span className="font-semibold">{filteredBooks.length}</span> book{`${filteredBooks.length > 1 ? "s" : ""}`}</span> : <span>Showing all books</span>}
                    {searchQuery && ` • "${searchQuery}"`}
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
                        {(searchQuery || selectedTags || selectedShelf || selectedCollection) ? 'No books found' : 'No books in your library'}
                    </h3>
                    <p className="text-indigo-200">
                        {(searchQuery || selectedTags || selectedShelf || selectedCollection)
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
                            
                            <div className="flex flex-wrap gap-2 min-h-5 mb-2">
                                {book.tags.map(tag => (
                                    <span
                                    key={tag.id}
                                    className={`bg-gray-500 text-white font-semibold px-2 py-1 rounded-md text-sm flex items-center gap-2 transition-all`}
                                    >
                                    {tag.name}
                                    </span>
                                ))}
                            </div>

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
                                    <span>Created at {fromUnix(book.createdAtInUnix)}</span>
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