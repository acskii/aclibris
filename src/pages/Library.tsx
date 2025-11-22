
import { useState, useEffect } from 'react';
import { type ShelfObject } from '../../electron/database/objects/Shelf';
import { type CollectionObject } from '../../electron/database/objects/Collection';
import { Spinner } from '../components/common/spinner/Spinner';
import { TriangleAlert, Library, Book, BookAlert, Trash2, PenBox} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '../components/common/dialog/DeleteDialog';
import { EditNameDialog } from '../components/common/dialog/EditNameDialog';

type LibraryShelf = {
    shelf: ShelfObject;
    collections: CollectionObject[];
}

export function LibraryPage() {
    const navigate = useNavigate();
    const [data, setData] = useState<LibraryShelf[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [deleteShelf, setDeleteShelf] = useState<number | null>(null);
    const [editShelf, setEditShelf] = useState<number | null>(null);

    const goToCollection = (id: number) => {
        navigate(`/collection/${id}`);
    }

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            // @ts-ignore
            const response: ShelfObject[] = await window.db.shelf.getAll();
            const result: LibraryShelf[] = await Promise.all(
            response.map(async (shelf: ShelfObject) => {
                // @ts-ignore
                const collections: CollectionObject[] = await window.db.collection.getByShelf(shelf.id)
                return {
                    shelf: shelf,
                    collections: collections
                } as LibraryShelf;
            }));
            setData(result);

        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleDeleteShelf = async () => {
        if (deleteShelf) {
            // @ts-ignore
            await window.db.shelf.delete(deleteShelf);
            loadData();
            setDeleteShelf(null);
        }
    }

    const handleEditShelf = async (new_name: string) => {
        if (editShelf) {
            // @ts-ignore
            await window.db.shelf.update(editShelf, new_name);
            loadData();
            setEditShelf(null);
        }
    }

    return (
        <div className="min-h-screen flex flex-col p-5">
            {loading && (
                <div className="flex bg-indigo-400 p-3 rounded-lg flex-row items-center justify-center gap-2 z-30 my-10">
                    <Spinner />
                    <p className="text-violet-900 font-bold text-center text-md">
                        Loading..
                    </p>
                </div>
            )}
            {error != '' && (
                <div className="bg-gradient-to-l from-orange-400 to-yellow-300 mb-10 z-50 w-3/5 rounded-xl" role="alert" aria-labelledby="toast-error">
                    <div className="flex p-4 items-center">
                        <div className="shrink-0 text-red-500">
                            <TriangleAlert size={30} />
                        </div>
                        <div className="ms-3">
                            <p className="text-md text-red-400 font-bold ">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8 flex flex-col items-start">
                <h1 className="mb-2 flex gap-3 justify-start">
                    <Library className="w-10 h-10" />
                    <span className="text-4xl font-bold text-white">My Library</span>
                </h1>
                <p  >
                    {data.length} shelf{data.length !== 1 ? 's' : ''} • {data.reduce((total, shelf) => total + shelf.collections.length, 0)} collections
                </p>
            </div>

            <div className="space-y-6">
                {data.map((d: LibraryShelf, index) => (
                    <div key={index + 1} className="flex bg-gray-800/50 backdrop-blur-sm rounded-md border border-indigo-500/20">
                        <div>
                            <div className="bg-gradient-to-br from-violet-500 to-purple-600 flex flex-auto items-center items-center justify-center border border-3 border-r-5 border-violet-700 h-full w-10">
                                <h2 className="text-2xl font-semibold text-white">
                                    {index + 1}
                                </h2>
                            </div>
                        </div>

                        <div className="w-full px-6 py-4">
                            {/* Shelf Header */}
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <div className="flex flex-row items-center gap-4">
                                    <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                                        {d.shelf.name}
                                    </h2>
                                    <p className="bg-gradient-to-br from-violet-500 to-purple-600 text-md font-bold px-2 py-1 rounded-md">
                                        {d.collections.length} collection{d.collections.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <div className="relative group">
                                        <button 
                                            className="bg-red-600 hover:bg-red-700 p-2 rounded-md font-bold text-sm cursor-pointer transition-colors duration-200"
                                            onClick={() => setDeleteShelf(d.shelf.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        
                                        {/* Hover Tooltip */}
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-red-600 text-white font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                            Delete Shelf
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <button 
                                            className="bg-sky-600 hover:bg-blue-700 p-2 rounded-md font-bold text-sm cursor-pointer transition-colors duration-200"
                                            onClick={() => setEditShelf(d.shelf.id)}
                                        >
                                            <PenBox size={18} />
                                        </button>
                                        
                                        {/* Hover Tooltip */}
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-blue-600 text-white font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                            Edit Name
                                        </div>
                                    </div>
                                </div>

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
                            <div className="overflow-x-auto pb-4">
                                <div className="flex gap-6 min-w-max">
                                    {d.collections.map((collection) => (
                                        <button 
                                            key={`${collection.id}`}
                                            onClick={() => goToCollection(collection.id)}
                                            className="group flex flex-col items-center justify-center cursor-pointer transform hover:scale-90 transition-transform duration-200"
                                        >
                                            {/* Book Stack */}
                                            <div className="relative w-32 h-40 mb-3">
                                                {/* Multiple book spines stacked */}
                                                <div className="absolute inset-0 flex gap-0.5">
                                                    {/* Main book spine */}
                                                    <div className="w-40 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-l-sm shadow-lg" />
                                                    
                                                    {/* Additional book spines peeking out */}
                                                    <div className="w-4 bg-gradient-to-r from-violet-700 to-indigo-700 rounded-l-sm opacity-80" />
                                                    <div className="w-3 bg-gradient-to-r from-violet-800 to-indigo-800 rounded-l-sm opacity-60" />
                                                    <div className="w-2 bg-gradient-to-r from-violet-900 to-indigo-900 rounded-l-sm opacity-40" />
                                                </div>
                                                
                                                {/* Collection icon overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Book size={40} className="text-white/60 group-hover:text-white/80 transition-colors" />
                                                </div>    
                                            </div>

                                            {/* Collection Info */}
                                            <div className="bg-black/20 w-full mx-auto rounded-md flex items-center justify-center p-1">
                                                <div className="text-center">
                                                    <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 group-hover:text-indigo-200 transition-colors">
                                                        {collection.name}
                                                    </h3>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {data.length === 0 && (
                    <div className="text-center py-16 flex flex-col gap-2">
                        <BookAlert className="w-24 h-24 mx-auto" />
                        <h3 className="text-2xl font-semibold text-white mb-2">Your library is empty</h3>
                        {/* <p className="text-indigo-200 mb-6">Start by creating your first shelf and adding collections</p> */}
                        {/* <button 
                            className="cursor-pointer bg-gradient-to-t border border-3 from-sky-600 to-cyan-300 hover:bg-gradient-to-b hover:from-indigo-600 hover:to-violet-600 hover:border-indigo-800 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-2 mx-auto"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-bold">Create a Shelf</span>
                        </button> */}
                    </div>
                )}
            </div>  
        </div>  
    );
}