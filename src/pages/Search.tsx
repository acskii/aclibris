import { ArrowUpWideNarrow, ArrowDownWideNarrow, ChevronLeft, ChevronRight, LayoutGrid, List, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookObject } from "../../electron/database/objects/Book";
import { ShelfObject } from "../../electron/database/objects/Shelf";
import { CollectionObject } from "../../electron/database/objects/Collection";
import { TagObject } from "../../electron/database/objects/Tag";
import { BookFilter } from "../../electron/database/objects/BookFilter";
import { PageObject } from "../../electron/database/objects/Page";
import SocialLayout from "../layouts/SocialLayout";
import ChooseDialog, { DialogOption } from "../components/common/dialog/ChooseDialog";
import TagDialog from "../components/common/dialog/TagDialog";
import BookItem, { ViewType } from "../components/search/BookItem";

function SearchPage() {
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState<boolean>(true);
    
    const [shelfSelect, setShelfSelect] = useState<boolean>(false);
    const [shelfName, setShelfName] = useState<string>("All Shelves");
    const [selectedShelf, setSelectedShelf] = useState<number | null>(null);
    const [shelves, setShelves] = useState<ShelfObject[]>([]);

    const [collectionSelect, setCollectionSelect] = useState<boolean>(false);
    const [collectionName, setCollectionName] = useState<string>("All Collections");
    const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
    const [collections, setCollections] = useState<CollectionObject[]>([]);

    const [tagSelect, setTagSelect] = useState<boolean>(false);
    const [allTags, setAllTags] = useState<TagObject[]>([]);
    const [tagOptions, setTagOptions] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    /* Affected by meta settings */
    const [view, setView] = useState<ViewType>('grid');
    const [asc, setAsc] = useState<boolean>(false);
    /**/

    const [books, setBooks] = useState<BookObject[]>([]);

    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(1);
    
    const [searchQuery, setSearchQuery] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const loadMenus = async () => {
            const tags: TagObject[] = await window.db.tag.getAll();
            const shelves: ShelfObject[] = await window.db.shelf.getAll();
            const collections: CollectionObject[] = await window.db.collection.getAll();

            setShelves(shelves);
            setCollections(collections);
            setAllTags(tags);
            setTagOptions(tags.map((t) => t.name));
        };

        const loadSettings = async () => {
            const sort = await window.db.settings.search.sort();
            const view = await window.db.settings.search.view();

            setAsc(!sort);
            setView(view);
        };

        loadMenus();
        loadSettings();
    }, [])

    useEffect(() => {
        /* Auto-select shelf when collection is selected */
        if (selectedCollection) {
            const collection = collections.find(c => c.id === selectedCollection);
            if (collection && collection.shelfId !== selectedShelf) {
                setSelectedShelf(collection.shelfId);
            }
        }

        if (selectedShelf) {
            const shelf = shelves.find(s => s.id === selectedShelf);
            if (shelf) setShelfName(shelf.name);
        }
    }, [selectedCollection, collections, selectedShelf]);

    const clearResults = () => {
        /* Clear the book results list */
        setBooks([]);
        setTotal(1);
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
            clearResults();
        }
        setLoading(false);
    }, [page, searchQuery, selectedShelf, selectedCollection, selectedTags, asc]);

    useEffect(() => {
        clearResults();
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

    const getShelfName = (collectionId: number) => {
        return shelves.find((s) => {
            const collection = collections.find((c) => c.id == collectionId) 
            if (collection) return s.id == collection.shelfId;
            else return null;
        })?.name;
    }

    const getTagPreviewText = () => {
        if (selectedTags.length === 0) return "Tags";
        if (selectedTags.length <= 2) return selectedTags.join(", ");
        return `${selectedTags.slice(0, 2).join(", ")} + ${selectedTags.length - 2} more`;
    };

    const getCollectionsForShelf = (shelfId: number | null) => {
        if (!shelfId) return collections;
        return collections.filter(c => c.shelfId === shelfId);
    };

    const selectShelf = (shelf: DialogOption | null) => {
        /* Set the selected shelf value, clear selected collection */
        if (shelf) {
            setSelectedShelf(shelf.id);
            setShelfName(shelf.name);
        } else {
            setSelectedShelf(null);
            setShelfName("All Shelves");
        }

        setSelectedCollection(null);
        setCollectionName("All Collections");

        /* Close dialog */
        setShelfSelect(false);
    }

    const selectCollection = (collection: DialogOption | null) => {
        /* Set the selected collection value */
        if (collection) {
            setSelectedCollection(collection.id);
            setCollectionName(collection.name);
        } else {
            setSelectedCollection(null);
            setCollectionName("All Collections");
        }

        /* Close dialog */
        setCollectionSelect(false);
    }

    const filterByTag = (tag: string | null) => {
        if (tag) {
            setSelectedTags(prev => [...prev, tag]);
            setTagOptions(prev => prev.filter((t) => t !== tag));
        }
    }

    const removeTag = (tag: string) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
        const nt = allTags.find((t) => t.name == tag) ?? null;

        if (nt && !tagOptions.find((t) => t == nt.name)) setTagOptions(prev => [...prev, nt.name]);
    }

    const handleBookClick = (id: number, page: number | null) => {
        navigate(`/view/${id}/${page ? page : 1}`);
    }

    return (
        <SocialLayout>
            <div>
                {/* Reference point for top scroll */}
                <div 
                    ref={containerRef}
                    className="w-1 h-1 opacity-0"
                    aria-hidden="true"
                />
                
                <div className="w-full px-6 py-4 min-w-0">
                    {/* Dialog for shelf filtering */}
                    <ChooseDialog 
                        isOpen={shelfSelect}
                        selected={selectedShelf}
                        options={shelves}
                        item={"Shelf"}
                        onClose={() => setShelfSelect(false)}
                        onOptionSelect={(option) => selectShelf(option)}
                    />

                    {/* Dialog for collection filtering */}
                    <ChooseDialog 
                        isOpen={collectionSelect}
                        selected={selectedCollection}
                        options={selectedShelf ? getCollectionsForShelf(selectedShelf) : collections}
                        item={"Collection"}
                        onClose={() => setCollectionSelect(false)}
                        onOptionSelect={(option) => selectCollection(option)}
                    />

                    {/* Dialog for tag filtering */}
                    <TagDialog 
                        isOpen={tagSelect}
                        onClose={() => setTagSelect(false)}
                        availableTags={tagOptions}
                        selectedTags={selectedTags}
                        onSelectTag={(name) => filterByTag(name)}
                        onRemoveTag={(name) => removeTag(name)}
                        onClearAll={() => {
                            selectedTags.forEach(tag => removeTag(tag)); 
                            setTagSelect(false);
                        }}
                    />
                </div>

                <div className="sticky z-10 top-5 rounded-md gap-4 flex flex-col items-center border-4 border-white/20 bg-stop-3 p-3">
                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-1 px-2 bg-app-card border border-1 border-white/40 rounded-md text-white font-semibold placeholder-white/50 focus:border-3 focus:outline-none text-base"
                        />
                    </div>

                    <div className="flex justify-start lg:justify-center w-full">
                        <div className="w-md flex flex-col gap-4 items-start lg:flex-row lg:items-center">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShelfSelect(true)}
                                    className="text-nowrap py-1 px-2 flex-1 cursor-pointer bg-app-card border border-1 border-white/40 rounded-md text-white font-semibold placeholder-white/50 focus:border-3 focus:outline-none text-base"
                                    title="Shelf"
                                >
                                    {shelfName}
                                </button>
                                        
                                <button
                                    onClick={() => setCollectionSelect(true)}
                                    className="text-nowrap py-1 px-2 flex-1 cursor-pointer bg-app-card border border-1 border-white/40 rounded-md text-white font-semibold placeholder-white/50 focus:border-3 focus:outline-none text-base"
                                    title="Collection"
                                >
                                    {collectionName}
                                </button>

                                <button
                                    onClick={() => setTagSelect(true)}
                                    className="text-nowrap py-1 px-2 cursor-pointer bg-app-card border border-1 border-white/40 rounded-md text-white font-semibold placeholder-white/50 focus:border-3 focus:outline-none text-base"
                                    title="Filter by Tags"
                                >
                                    {getTagPreviewText()}
                                </button>   
                            </div>

                            <div className="flex items-center bg-stop-3/40 p-1 rounded-md border border-white/5">
                                <button
                                    onClick={() => setView('grid')}
                                    className={`p-1.5 rounded transition-all cursor-pointer ${
                                        view === 'grid' 
                                            ? 'bg-stop-1 text-white shadow-sm' 
                                            : 'text-white/50 hover:text-white'
                                    }`}
                                    title="Grid View"
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className={`p-1.5 rounded transition-all cursor-pointer ${
                                        view === 'list' 
                                            ? 'bg-stop-1 text-white shadow-sm' 
                                            : 'text-white/50 hover:text-white'
                                    }`}
                                    title="List View"
                                >
                                    <List size={18} />
                                </button>
                            </div>
                            
                            <button
                                onClick={() => setAsc((prev) => !prev)}
                                className="p-1.5 rounded transition-all cursor-pointer text-white/50 hover:text-white border border-white/5 shadow-sm"
                                title={`${asc ? "Ascending" : "Descending"}`}
                            >
                                {asc ? <ArrowUpWideNarrow size={18} /> : <ArrowDownWideNarrow size={18} />}
                            </button>
                        </div>    
                    </div>
                    
                </div>

                <div className="my-5">
                    {loading && (
                        <div className="flex items-center justify-center w-full">
                            <Spinner />
                        </div>
                    )}

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
                        <div className={
                            view === 'grid'
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-3"
                                : "flex flex-col gap-3 p-3 w-full"
                        }>
                            {books.map((book) => (
                                <BookItem
                                    key={book.id}
                                    book={book}
                                    view={view}
                                    onClick={handleBookClick}
                                    getShelfName={(collectionId) => getShelfName(collectionId) ?? "Unkown"}
                                    getCollectionName={(collectionId) => getCollectionName(collectionId) ?? "Unknown"}
                                />
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
            </div>
        </SocialLayout>    
    );
}

export default SearchPage