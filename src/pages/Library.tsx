import { useState, useEffect } from 'react';
import { type ShelfObject } from '../../electron/database/objects/Shelf';
import { type CollectionObject } from '../../electron/database/objects/Collection';
import { Spinner } from '../components/common/spinner/Spinner';
import { TriangleAlert, Library, BookAlert, Trash2, PenBox, Crown, Cat, Plus} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '../components/common/dialog/DeleteDialog';
import { EditNameDialog } from '../components/common/dialog/EditNameDialog';
import { ButtonTip } from '../components/common/ButtonTip';
import SocialLayout from '../layouts/SocialLayout';

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

            const response: ShelfObject[] = await window.db.shelf.getAll();
            const result: LibraryShelf[] = await Promise.all(
            response.map(async (shelf: ShelfObject) => {
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
            await window.db.shelf.delete(deleteShelf);
            loadData();
            setDeleteShelf(null);
        }
    }

    const handleEditShelf = async (new_name: string) => {
        if (editShelf) {
            await window.db.shelf.update(editShelf, new_name);
            loadData();
            setEditShelf(null);
        }
    }

    return (
        <SocialLayout>
            <div className="w-full bg-gradient-to-br from-stop-1 via-stop-2 to-stop-3">
                {loading && (
                    <div className="flex bg-app-card border border-white/20 p-3 rounded-lg flex-row items-center justify-center gap-2 z-30 my-10 backdrop-blur-md">
                        <Spinner />
                        <p className="text-white font-bold text-center text-md">
                            Loading..
                        </p>
                    </div>
                )}
                {error != '' && (
                    <div className="bg-gradient-to-l from-orange-400 to-yellow-300 mb-10 z-50 w-3/5 rounded-xl shadow-lg" role="alert" aria-labelledby="toast-error">
                        <div className="flex p-4 items-center">
                            <div className="shrink-0 text-red-600">
                                <TriangleAlert size={30} />
                            </div>
                            <div className="ms-3">
                                <p className="text-md text-red-700 font-bold ">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-8 flex flex-col items-start drop-shadow-md">
                    <h1 className="mb-2 flex gap-3 justify-start items-center">
                        <Library className="w-10 h-10 text-white" />
                        <span className="text-4xl font-bold text-white">My Library</span>
                    </h1>
                    <p className="text-white/80 font-medium">
                        {data.length} shelf{data.length !== 1 ? 's' : ''} • {data.reduce((total, shelf) => total + shelf.collections.length, 0)} collections
                    </p>
                </div>

                <div className="space-y-6">
                    {data.map((d: LibraryShelf, index) => (
                        <div key={index} id={`shelf-${index}`} className="flex bg-gray-800/50 rounded-md">
                            <div>
                                <div className="bg-stop-3/80 flex flex-auto items-center items-center justify-center border border-3 border-r-5 border-stop-3 h-full w-10">
                                    <h2 className="text-2xl font-bold text-white">
                                        {index + 1}
                                    </h2>
                                </div>
                            </div>

                            <div className="w-full px-6 py-4 min-w-0">
                                {/* Shelf Header */}
                                <div className="flex items-center justify-between gap-4 mb-6">
                                    <div className="flex flex-row items-center gap-4">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            {d.shelf.name}
                                        </h2>
                                        <p className="bg-stop-2 text-md font-bold px-2 py-1 rounded-md">
                                            {d.collections.length} collection{d.collections.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
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
                                        {d.collections.map((collection) => (
                                            <button
                                                key={`${collection.id}`}
                                                onClick={() => goToCollection(collection.id)}
                                                className="group flex flex-none flex-col items-center cursor-pointer"
                                            >
                                                {/* The Crystal Cat Container */}
                                                <div className="relative w-28 h-36 mb-6 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                                                    {/* Cat Head */}
                                                    <div className="relative h-full w-full bg-white/10 backdrop-blur-2xl rounded-b-[2rem] rounded-t-lg border border-white/20 shadow-2xl overflow-hidden group-hover:border-amber-400/50 transition-colors">

                                                        {/* The Ears */}
                                                        <div className="absolute top-0 left-0 w-8 h-8 bg-white/10 border-r border-b border-white/20 -translate-x-2 -translate-y-2 rotate-[15deg]" />
                                                        <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 border-l border-b border-white/20 translate-x-2 -translate-y-2 -rotate-[15deg]" />
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-amber-500/10" />

                                                        {/* Icons */}
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                            {/* Floating Crown */}
                                                            <div className="relative transform -translate-y-1 group-hover:-translate-y-3 transition-transform duration-500">
                                                                <Crown size={20} className="text-amber-400 fill-amber-400/20" />
                                                            </div>

                                                            {/* Cat Face */}
                                                            <div className="relative">
                                                            <Cat size={40} className="text-stop-1 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
                                                            </div>
                                                        </div>

                                                        {/* Effects */}
                                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-stop-1 to-transparent" /></div>
                                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-amber-500/20 blur-md rounded-full scale-x-50 group-hover:scale-x-100 transition-transform duration-500" />
                                                    </div>

                                                    {/* Collection Info */}
                                                    <div className="bg-black/20 w-full rounded-md flex items-center justify-center p-1">
                                                        <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 group-hover:text-amber-300 transition-colors">
                                                            {collection.name.length > 30 ? collection.name.slice(0,28) + "..." : collection.name}
                                                        </h3>
                                                    </div>
                                                <div className="h-[2px] w-0 bg-gradient-to-r from-transparent via-amber-400 to-transparent group-hover:w-full transition-all duration-500 mx-auto mt-1" />
                                            </button> 
                                        ))}
                                    </div>
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