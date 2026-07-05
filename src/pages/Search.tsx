import { Book, Calendar, ChevronLeft, ChevronRight, Eye, Folder, LibrarySquare, Search, SearchX, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/common/spinner/Spinner";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookObject } from "../../electron/database/objects/Book";
import { arrayToBase64 } from "../service/util/Thumbnail";
import { fromUnix } from "../service/util/Date";
import { ShelfObject } from "../../electron/database/objects/Shelf";
import { CollectionObject } from "../../electron/database/objects/Collection";
import { Dropdown } from "../components/common/dropdown/Dropdown";
import { TagObject } from "../../electron/database/objects/Tag";
import { AutocompleteDropdown } from "../components/common/dropdown/AutocompleteDropdown";
import { BookFilter } from "../../electron/database/objects/BookFilter";
import { PageObject } from "../../electron/database/objects/Page";
import SocialLayout from "../layouts/SocialLayout";

function SearchPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [books, setBooks] = useState<BookObject[]>([]);
    const [page, setPage] = useState<number>(0);
    const [asc, setAsc] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [shelves, setShelves] = useState<ShelfObject[]>([]);
    const [collections, setCollections] = useState<CollectionObject[]>([]);
    const [selectedShelf, setSelectedShelf] = useState<number | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [allTags, setAllTags] = useState<TagObject[]>([]);
    const [tagOptions, setTagOptions] = useState<TagObject[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    

    useEffect(() => {
        const loadMenus = async () => {
            const tags: TagObject[] = await window.db.tag.getAll();
            const shelves: ShelfObject[] = await window.db.shelf.getAll();
            const collections: CollectionObject[] = await window.db.collection.getAll();

            setShelves(shelves);
            setCollections(collections);
            setAllTags(tags);
            setTagOptions(tags);
        }

        loadMenus();
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

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        
        const filterObject = new BookFilter(
            searchQuery,
            selectedCollection,
            selectedShelf,
            selectedTags,
            asc
        );

        const results: PageObject = await window.db.book.getAll(page, filterObject);
        
        if (results) {
            setBooks(results.books);
            setTotal(results.total);
        } else {
            setBooks([]);
            setTotal(1);
        }
        setLoading(false);
    }, [page, searchQuery, selectedShelf, selectedCollection, selectedTags, asc]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    useEffect(() => {
        containerRef.current?.scrollIntoView({behavior:'instant'})
    }, [page]);

    useEffect(() => {
        setPage(0);
    }, [searchQuery, selectedShelf, selectedCollection, selectedTags, asc]);

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
        <SocialLayout>
            <div className="mb-4 flex flex-col items-start">
                <h1 className="flex gap-3 justify-start">
                    <Search size={40} className="text-white" />
                    <span className="text-4xl font-bold text-white">Search</span>
                </h1>
            </div>

            <div 
                ref={containerRef}
                className="w-1 h-1 opacity-0"
                aria-hidden="true"
            />
            
            <div className="sticky z-10 top-5 rounded-md gap-2 flex items-center mb-2 border-4 border-white/20 bg-stop-3 p-3">
                <div className="w-full">
                    <input
                        type="text"
                        placeholder="Search by title or author"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-1 px-2 bg-app-card border border-1 border-white/40 rounded-md text-white font-semibold placeholder-white/50 focus:border-3 focus:outline-none text-base"
                    />
                </div>
            </div>

            {loading && (
                <div className="flex bg-app-card backdrop-blur-md p-3 rounded-lg flex-row items-center justify-center gap-2 z-30 my-10">
                    <Spinner />
                    <p className="text-white font-bold text-center text-md">
                        Loading..
                    </p>
                </div>
            )}

            <div className="my-5">
                {books.length === 0 && !loading ? (
                    <div className="bg-app-card backdrop-blur-sm rounded-md p-6 border border-white/20 text-center">
                        <SearchX size={50} className="mx-auto mb-2 text-white" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {(searchQuery || selectedTags || selectedShelf || selectedCollection) ? 'No books found' : 'No books in your library'}
                        </h3>
                        <p className="text-white/70">
                            {(searchQuery || selectedTags || selectedShelf || selectedCollection)
                            ? 'Try different search terms or browse all books'
                            : 'Start by uploading your first book'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-3">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="bg-app-card rounded-md border border-4 border-stop-3 hover:border-stop-3/40 cursor-pointer group"
                            onClick={() => handleBookClick(book.id, book.lastReadPage ?? null)}
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
                                        <div className="flex flex-wrap gap-2 mb-2">
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
                                            <span>{getShelfFromCollection(book.collectionId)?.name}</span>
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
                    ))}
                    </div>
                )}
            </div>

            <div className="gap-2 rounded-md flex flex-row justify-center items-center mb-2 border-4 border-white/20 bg-stop-3 p-3">
                    <button
                        onClick={() => setPage(prev => prev - 1)}
                        disabled={(page + 1) <= 1}
                        className="bg-white/10 p-2 rounded-md hover:bg-white/20 text-white transition disabled:opacity-30"
                        >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-nowrap flex flex-row gap-2 text-sm font-bold text-white border-2 border-white/20 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg">
                        <p className="grow-1">{page + 1} / {total}</p>
                    </div>
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={(page + 1) >= total}
                        className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition disabled:opacity-30"
                    >
                        <ChevronRight size={20} />
                    </button>
            </div>

            <div className="sticky -mb-5 bottom-0 z-10 border-4 rounded-md border-white/20 bg-stop-3 py-3 px-5">
                    <div className="bg-app-card backdrop-blur-sm rounded-md p-2 border border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <Dropdown 
                                title="Shelf"
                                placeholder="All Shelves"
                                options={shelves}
                                value={selectedShelf ? shelves.find(s => s.id === selectedShelf) || null : null}
                                onOptionSelect={(option) => filterByShelf(option ? option.id : null)}
                                className="text-xs"
                                isUp={true}
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
                                isUp={true}
                            />
                            <AutocompleteDropdown
                                title="Tag"
                                placeholder="Enter tag"
                                options={tagOptions}
                                value={tagInput}
                                onValueChange={setTagInput}
                                onOptionSelect={(option) => filterByTag(option ? option.name : null)}
                                className="text-xs flex-1"
                                isUp={true}
                            />

                        </div>
                        <div className="flex flex-1 flex-row gap-2 max-height-5 mt-5 overflow-y-auto">
                            {selectedTags.map((tag) => {
                                return (
                                    <span
                                        key={tag}
                                        className="bg-white/20 text-white font-semibold px-2 rounded-md text-sm flex items-center gap-2 border border-white/10"
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
        </SocialLayout>    
    );
}

export default SearchPage