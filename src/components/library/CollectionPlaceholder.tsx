/*
    Page component that redirects user to collection view page
    Current placeholder until better feature
*/

import { useNavigate } from "react-router-dom";
import { Crown, Cat } from "lucide-react";

interface CollectionPlaceholderProps {
  id: number;
  name: string;
}

export default function CollectionPlaceholder({ id, name }: CollectionPlaceholderProps) {
    const navigate = useNavigate();
    
    const goToCollection = (id: number) => {
        navigate(`/collection/${id}`);
    }

    return (
        <button
            onClick={() => goToCollection(id)}
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
                            <Cat
                                size={40}
                                className="text-stop-1 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                            />
                        </div>
                    </div>

                    {/* Effects */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-stop-1 to-transparent" />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-amber-500/20 blur-md rounded-full scale-x-50 group-hover:scale-x-100 transition-transform duration-500" />
            </div>

            {/* Collection Info */}
            <div className="bg-black/20 w-full rounded-md flex items-center justify-center p-1">
                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 group-hover:text-amber-300 transition-colors">
                {name.length > 30
                    ? name.slice(0, 28) + "..."
                    : name}
                </h3>
            </div>
            <div className="h-[2px] w-0 bg-gradient-to-r from-transparent via-amber-400 to-transparent group-hover:w-full transition-all duration-500 mx-auto mt-1" />
        </button>
    );
}
