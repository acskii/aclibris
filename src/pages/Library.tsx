import { useState, useEffect } from 'react';
import { type ShelfObject } from '../../electron/database/objects/Shelf';
import { type CollectionObject } from '../../electron/database/objects/Collection';
import { type BookObject } from "../../electron/database/objects/Book";
import { Spinner } from '../components/common/spinner/Spinner';
import { Info, Library, BookAlert, Trash2, PenBox, Plus, ArrowRight, Upload, Pin } from 'lucide-react';
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
            await window.db.shelf.delete(deleteShelf);
            loadData();
            setDeleteShelf(null);
        }
    }

    const handleEditShelf = async (new_name: string) => {
        if (editShelf) {
            const shelf = data.find((s) => s.shelf.id === editShelf)?.shelf;
            if (shelf) {
                await window.db.shelf.update(editShelf, new_name, shelf.pinned);
                loadData();
                setEditShelf(null);
            }
        }
    }

    const handlePinShelf = async (id: number) => {
        const shelf = data.find((s) => s.shelf.id === id)?.shelf;

        if (shelf) {
            await window.db.shelf.update(id, shelf.name, !shelf.pinned);
            loadData();
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
                                            className="w-full sm:w-auto bg-stop-3 text-white hover:bg-stop-3/80 cursor-pointer px-4 py-2 rounded text- font-semibold transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
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
                                        message={`Are you sure you want to delete the shelf "${d.shelf.name}"?`}
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
                                         {d.collections.length === 0 && <p>No collections found</p>}
                                         {d.collections.map((collection) => <CollectionPlaceholder id={collection.id} name={collection.name} />)}
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
                                        icon={<Trash2 size={20} />}
                                        tip={"Delete Shelf"}
                                        colorClass='bg-red-600'
                                        onClick={() => setDeleteShelf(d.shelf.id)}
                                    />
                                    <ButtonTip
                                        icon={<PenBox size={20} />}
                                        tip={"Edit Name"}
                                        colorClass='bg-stop-1'
                                        onClick={() => setEditShelf(d.shelf.id)}
                                    /> 
                                </div>
                            </div>
                        </div>
                    ))}

                    {data.length === 0 && (
                        <div className="text-center py-20 flex flex-col gap-4 bg-app-card/30 rounded-3xl border border-white/10 backdrop-blur-sm">
                            <div className="relative mx-auto">
                                <div className="absolute -inset-4 bg-stop-1/20 blur-2xl rounded-full" />
                                <BookAlert className="w-24 h-24 text-white relative" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-1">Your library is empty</h3>
                                <p className="text-white/60 font-medium">Start by creating your first shelf and adding collections</p>
                            </div>
                            <button 
                                className="cursor-pointer bg-gradient-to-br from-stop-1 to-stop-2 hover:brightness-110 text-white px-6 py-3 rounded-xl transition-all flex items-center gap-3 mx-auto font-bold shadow-lg shadow-stop-1/20 border border-white/20 active:scale-95"
                            >
                                <Plus size={20} strokeWidth={3} />
                                <span>Create a Shelf</span>
                            </button>
                        </div>
                    )}
                </div>  
            </div>  
        </SocialLayout>
    );
}