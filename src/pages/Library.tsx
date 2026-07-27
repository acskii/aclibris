import { useState, useEffect } from 'react';
import { type ShelfObject } from '../../electron/database/objects/Shelf';
import { type CollectionObject } from '../../electron/database/objects/Collection';
import { type BookObject } from "../../electron/database/objects/Book";
import { Spinner } from '../components/Spinner';
import { Info, Library, BookAlert, Trash2, PenBox, ArrowRight, Upload, Pin, Plus } from 'lucide-react';
import DeleteDialog from '../components/common/dialog/DeleteDialog';
import { EditNameDialog } from '../components/common/dialog/EditNameDialog';
import { ButtonTip } from '../components/common/ButtonTip';
import SocialLayout from '../layouts/SocialLayout';
import CollectionPlaceholder from '../components/library/CollectionPlaceholder';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

type LibraryShelf = {
    shelf: ShelfObject;
    collections: CollectionObject[];
}

export function LibraryPage() {
    const { showToast, clearToast } = useToast();
    const navigate = useNavigate();
    
    const [data, setData] = useState<LibraryShelf[]>([]);
    const [recent, setRecent] = useState<BookObject | null>(null);
    const [hasBooks, setHasBooks] = useState<Boolean>(false);
    
    const [loading, setLoading] = useState(true);
    const [deleteShelf, setDeleteShelf] = useState<number | null>(null);
    const [editShelf, setEditShelf] = useState<number | null>(null);
    const [createShelf, setCreateShelf] = useState<boolean>(false);
    const [createCollectionShelfId, setCreateCollectionShelfId] = useState<number | null>(null);

    const loadData = async () => {
        try {            
            // Clear any notifications before loading
            clearToast();

            const response: ShelfObject[] = await window.db.shelf.getAll();
            const result: LibraryShelf[] = await Promise.all(
            response.map(async (shelf: ShelfObject) => {
                const collections: CollectionObject[] = await window.db.collection.getByShelf(shelf.id)
                return {
                    shelf: shelf,
                    collections: collections
                } as LibraryShelf;
            }));

            const sorted = result.sort((a, b) => {
                // Check pinned status
                if (a.shelf.pinned !== b.shelf.pinned) {
                    return a.shelf.pinned ? -1 : 1;
                }

                // If pinned status is the same, sort alphabetically by name
                return a.shelf.name.localeCompare(b.shelf.name);
            });

            setData(sorted);

        } catch (error: any) {
            console.error(`[client:library] => Error occurred while loading data: ${error.message}`);
            showToast(error.message, 'error');
        }
    }

    const loadRecent = async () => {
        const response = await window.db.book.getRecent();
        const exists = await window.db.book.exist();
        setHasBooks(exists ? true : false);
        setRecent(response);
    }

    useEffect(() => {
        setLoading(true);
        loadData();
        loadRecent();
        setLoading(false);
    }, []);

    const handleDeleteShelf = async () => {
        if (deleteShelf) {
            try {
                await window.db.shelf.delete(deleteShelf);
                await loadData();
            } catch (error: any) {
                showToast("Problem occurred while deleting shelf..", 'error');
                console.error(`[client:library] => Error occurred while deleting shelf: ${error.message}`);
            } finally {
                setDeleteShelf(null);
            }
        }
    }

    const handleEditShelf = async (new_name: string) => {
        if (editShelf) {
            try {
                const shelf = data.find((s) => s.shelf.id === editShelf)?.shelf;
                if (shelf) {
                    await window.db.shelf.update(editShelf, new_name, shelf.pinned);
                    await loadData();
                }
            } catch (error: any) {
                showToast("Problem occurred while renaming shelf..", 'error');
                console.error(`[client:library] => Error occurred while renaming shelf: ${error.message}`);
            } finally {
               setEditShelf(null);
            }
        }
    }

    const handlePinShelf = async (id: number) => {
        try {
            const shelf = data.find((s) => s.shelf.id === id)?.shelf;

            if (shelf) {
                await window.db.shelf.update(id, shelf.name, !shelf.pinned);
                await loadData();
            }
        } catch (error: any) {
            showToast("Problem occurred while pinning shelf..", 'error');
            console.error(`[client:library] => Error occurred while pinning shelf: ${error.message}`);
        }
    }

    const handleCreateShelf = async (shelfName: string) => {
        if (!shelfName.trim()) return;
        try {
            await window.db.shelf.new(shelfName.trim());
            await loadData();
            showToast(`Shelf "${shelfName}" created`, 'success');
        } catch (error: any) {
            showToast("Failed to create new shelf", 'error');
            console.error(`[client:library] => Error creating shelf: ${error.message}`);
        } finally {
            setCreateShelf(false);
        }
    }

    const handleCreateCollection = async (collectionName: string) => {
        if (!collectionName.trim() || createCollectionShelfId === null) return;
        try {
            await window.db.collection.add(collectionName.trim(), createCollectionShelfId);
            await loadData();
            showToast(`Collection "${collectionName}" created`, 'success');
        } catch (error: any) {
            showToast("Failed to create new collection", 'error');
            console.error(`[client:library] => Error creating collection: ${error.message}`);
        } finally {
            setCreateCollectionShelfId(null);
        }
    }

    const goToRecent = () => {
        if (recent) navigate(`/view/${recent.id}/${recent.lastReadPage}`);
    }

    const goToUpload = () => {
        navigate('/upload');
    }

    return (
        <SocialLayout>
            <div className="w-full">
                {loading && (
                    <div className="flex bg-app-card border border-white/20 p-3 rounded-lg flex-row items-center justify-center gap-2 z-30 my-10 backdrop-blur-md">
                        <Spinner />
                        <p className="text-white font-bold text-center text-md">
                            Loading..
                        </p>
                    </div>
                )}

                <div className="w-full px-6 py-4 min-w-0">
                    <EditNameDialog
                        isOpen={createShelf}
                        onClose={() => setCreateShelf(false)}
                        onSave={handleCreateShelf}
                        title="Create New Shelf"
                        currentName=""
                        placeholder="Enter shelf name..."
                    />

                    <EditNameDialog
                        isOpen={createCollectionShelfId !== null}
                        onClose={() => setCreateCollectionShelfId(null)}
                        onSave={handleCreateCollection}
                        title="Create New Collection"
                        currentName=""
                        placeholder="Enter collection name..."
                    />
                </div>

                <div className="mb-8 flex flex-col items-start drop-shadow-md">
                    <h1 className="mb-2 flex gap-3 justify-start items-center">
                        <Library size={40} />
                        <span className="text-4xl font-bold text-white">My Library</span>
                    </h1>
                    <p className="text-white/80 font-medium">
                        {data.length} shel{data.length !== 1 ? 'ves' : 'f'} • {data.reduce((total, shelf) => total + shelf.collections.length, 0)} collections
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="sticky top-0 z-40 w-full bg-stop-3 py-3 px-4 rounded-md mb-6">
                            {recent ? (
                                // Returning User
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="font-semibold text-lg rounded-md px-2 py-1 bg-stop-1 text-white">
                                            Previously
                                        </div>
                                        <div className="text-left min-w-0">
                                            <h2 className="text-white font-semibold text-md truncate max-w-[400px]">
                                                {recent.title}
                                                {recent.author && (
                                                    <span className="text-white/50 font-normal text-sm ml-1">by {recent.author}</span>
                                                )}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                                        <button
                                            type="button"
                                            onClick={goToRecent}
                                            className="bg-stop-2 text-white hover:bg-stop-2/80 cursor-pointer px-3 py-1.5 rounded-md text-md font-semibold transition-all flex items-center justify-center gap-2"
                                        >
                                            <ArrowRight size={20} />
                                            <span>Continue from p.{recent.lastReadPage}</span>
                                        </button>
                                    </div>
                                </div>
                            ) : hasBooks ? (
                                // Uploaded, not read
                                <div className="flex items-center gap-4">
                                    <Info size={20} />
                                    <h2 className="font-medium text-md">
                                        Pick a collection to start reading
                                    </h2>
                                </div>
                            ) : (
                                // First Time User
                                <div className="flex flex-col items-center gap-4">
                                    <p className="bg-stop-2 text-lg uppercase text-center font-bold px-2 py-1 rounded-md">Welcome to Aclibris!</p>

                                    <div className="flex justify-between items-center w-full">
                                        <h2 className="font-medium text-md">
                                            Ready to start? Upload your first book to add to your library.
                                        </h2>

                                        <button
                                            type="button"
                                            onClick={goToUpload}
                                            className="w-full sm:w-auto bg-stop-2 text-white hover:bg-stop-2/80 cursor-pointer px-4 py-2 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <Upload size={20} />
                                            <span>Upload Book</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>

                    {data.map((d: LibraryShelf, index) => (
                        <div key={index} id={`shelf-${index}`} className="flex flex-col bg-gray-800/50 rounded-md">
                        
                            <div className="w-full px-6 py-4 min-w-0">
                                {/* Shelf Header */}
                                <div className="flex items-center justify-between gap-4 mb-6">
                                    <DeleteDialog
                                        isOpen={deleteShelf === d.shelf.id}
                                        onClose={() => setDeleteShelf(null)}
                                        onConfirm={handleDeleteShelf}
                                        title="Delete Shelf"
                                        message={`This will delete the shelf <${d.shelf.name}>`}
                                        warning={d.collections.length > 0 ?
                                            `This will also delete ${d.collections.length} collection${d.collections.length !== 1 ? 's' : ''} and all books within them.`
                                            : undefined
                                        }
                                    />

                                    <EditNameDialog
                                        isOpen={editShelf === d.shelf.id}
                                        onClose={() => setEditShelf(null)}
                                        onSave={handleEditShelf}
                                        title="Edit Shelf Name"
                                        currentName={d.shelf.name}
                                        placeholder="Enter new shelf name..."
                                    />
                                </div>
                                
                                {/* Collections Row */}
                                <div className="overflow-x-auto pb-4 w-full">
                                    <div className="flex gap-6">
                                        {d.collections.map((collection) => <CollectionPlaceholder key={collection.id} id={collection.id} name={collection.name} />)}
                                        <button
                                            type="button"
                                            onClick={() => setCreateCollectionShelfId(d.shelf.id)}
                                            className="group shrink-0 w-36 h-48 border-2 border-dashed border-white/20 hover:border-white/60 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center justify-center gap-3 transition-all cursor-pointer"
                                            title="Add new collection"
                                        >
                                            <Plus size={20} />
                                            <span className="text-sm font-semibold text-white/70 group-hover:text-white text-center px-2">
                                                Add Collection
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-stop-3/80 flex gap-4 py-2 px-4 items-center justify-between border border-3 border-t-5 border-stop-3 w-full">
                                <ButtonTip
                                    icon={
                                        <Pin 
                                            size={20} 
                                            className={d.shelf.pinned ? "fill-white text-white rotate-45 transition-transform" : "text-white/60"} 
                                        />
                                    }
                                    tip={d.shelf.pinned ? "Unpin Shelf" : "Pin Shelf"}
                                    colorClass={d.shelf.pinned ? 'bg-amber-500' : 'bg-gray-700/50 hover:bg-gray-600'}
                                    onClick={() => handlePinShelf(d.shelf.id)}
                                />

                                <h2 className="flex-1 text-center text-2xl font-bold text-white">
                                    {d.shelf.name}
                                </h2>
                                
                                <div className="flex flex-row items-center gap-2">
                                    <ButtonTip
                                        icon={<PenBox size={20} />}
                                        tip={"Edit Name"}
                                        colorClass='bg-stop-1'
                                        onClick={() => setEditShelf(d.shelf.id)}
                                    /> 
                                    <ButtonTip
                                        icon={<Trash2 size={20} />}
                                        tip={"Delete Shelf"}
                                        colorClass='bg-red-600'
                                        onClick={() => setDeleteShelf(d.shelf.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => setCreateShelf(true)}
                        className="w-full py-5 border-2 border-dashed border-white/20 hover:border-white/50 bg-stop-3/40 hover:bg-stop-3 rounded-md flex items-center justify-center gap-3 transition-all cursor-pointer group text-white/80 hover:text-white"
                    >
                        <Plus size={20} />
                        <span className="text-lg font-semibold">Create New Shelf</span>
                    </button>

                    {data.length === 0 && (
                        <div className="py-20 flex flex-col justify-center items-center text-center gap-4 bg-stop-3 rounded-md">
                            <BookAlert className="w-24 h-24 text-white" />
                            <h3 className="text-3xl font-bold text-white mb-1">Your library is empty</h3>
                        </div>
                    )}
                </div>  
            </div>  
        </SocialLayout>
    );
}