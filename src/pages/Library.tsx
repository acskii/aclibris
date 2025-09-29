
import { useState, useEffect } from 'react';
import { type ShelfObject } from '../../electron/database/objects/Shelf';
import { type CollectionObject } from '../../electron/database/objects/Collection';
import { Spinner } from '../components/common/spinner/Spinner';
import { TriangleAlert, Library, Plus, SquareLibrary, Book, BookAlert} from 'lucide-react';

type LibraryShelf = {
    shelf: ShelfObject;
    collections: CollectionObject[];
}

export function LibraryPage() {
    const [data, setData] = useState<LibraryShelf[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
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
                    })
                );
                setData(result);

            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col p-5 bg-gradient-to-br from-cyan-500 via-sky-600 to-violet-500">
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
                {data.map((d: LibraryShelf) => (
                    <div key={d.shelf.id} className="bg-gray-800/30 backdrop-blur-sm rounded-md p-6 border border-indigo-500/20">
                        {/* Shelf Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                                    <SquareLibrary className="w-6 h-6 text-indigo-300" />
                                    {d.shelf.name}
                                </h2>
                                <p className="text-indigo-200 text-sm mt-1">
                                    {d.collections.length} collection{d.collections.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Collections Row */}
                        <div className="overflow-x-auto pb-4">
                            <div className="flex gap-6 min-w-max">
                                {d.collections.map((collection) => (
                                <div 
                                    key={collection.id}
                                    className="group cursor-pointer transform hover:scale-105 transition-transform duration-200"
                                >
                                    {/* Book Stack */}
                                    <div className="relative w-32 h-40 mb-3">
                                    {/* Multiple book spines stacked */}
                                    <div className="absolute inset-0 flex gap-0.5">
                                        {/* Main book spine */}
                                        <div className="w-20 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-l-sm shadow-lg" />
                                        
                                        {/* Additional book spines peeking out */}
                                        <div className="w-4 bg-gradient-to-r from-violet-700 to-indigo-700 rounded-l-sm opacity-80" />
                                        <div className="w-3 bg-gradient-to-r from-violet-800 to-indigo-800 rounded-l-sm opacity-60" />
                                        <div className="w-2 bg-gradient-to-r from-violet-900 to-indigo-900 rounded-l-sm opacity-40" />
                                    </div>
                                    
                                    {/* Book cover effect */}
                                    <div className="absolute right-0 top-2 w-12 h-36 bg-gradient-to-l from-violet-500/20 to-indigo-500/10 rounded-r-sm border-l border-indigo-400/30" />
                                    
                                    {/* Collection icon overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Book className="w-8 h-8 text-white/60 group-hover:text-white/80 transition-colors" />
                                    </div>    
                                </div>

                                {/* Collection Info */}
                                <div className="text-center">
                                    <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 group-hover:text-indigo-200 transition-colors">
                                        {collection.name}
                                    </h3>
                                    </div>
                                </div>
                            ))}
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