import { useState, useEffect } from "react";
import { BookObject } from "../../electron/database/objects/Book";
import { ArrowRight, Library, Upload, HelpCircle } from "lucide-react";
import { Spinner } from "../components/common/spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { fromUnix } from "../service/util/Date";


import SocialLayout from "../layouts/SocialLayout";

export function HomePage() {
    const navigate = useNavigate();
    const [recent, setRecent] = useState<BookObject | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadRecent = async () => {
            setLoading(true);
            const response = await window.db.book.getRecent();
            setRecent(response);
            setLoading(false);
        }

        loadRecent();
    }, []);

    const goToView = () => {
        if (recent) navigate(`/view/${recent.id}/${recent.lastReadPage}`);
    }

    const goToLibrary = () => {
        navigate('/library');
    }

    const goToUpload = () => {
        navigate('/upload');
    }

    const goToDocumentation = () => {
        navigate('/documentation');
    }

    return (
        <SocialLayout>
            <div className="w-full text-center space-y-6">
                {/* Documentation Help Section */}
                <div className="bg-gray-800/30 rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/90">
                            <HelpCircle size={18} />
                            <span className="text-md font-medium">Need help getting started?</span>
                        </div>
                        <button
                            onClick={goToDocumentation}
                            className="bg-stop-3 hover:bg-stop-3/60 text-white cursor-pointer px-4 py-2 rounded-md transition-all font-semibold text-md"
                        >
                            View Documentation
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="flex bg-stop-1/80 p-3 rounded-lg flex-row items-center justify-center gap-2 z-30 shadow-lg backdrop-blur-md">
                        <Spinner />
                        <p className="text-white font-bold text-center text-md">
                            Loading..
                        </p>
                    </div>
                )}

                <div className="bg-gray-800/30 rounded-md p-8">
                    {recent ? (
                        // Returning User
                        <div className="space-y-3">
                            <div className="flex items-center justify-center">
                                <span className="text-lg font-semibold text-white">Welcome Back!</span>
                            </div>
                            
                            <h2 className="text-xl font-semibold text-white/80 mb-4">
                                Want to continue?
                            </h2>

                            {/* Recent Book Card */}
                            <div className="bg-app-card rounded-md p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="font-semibold text-lg rounded-md px-2 py-1 bg-stop-1 text-white">
                                        Previously
                                    </div>
                                    <div className="text-left flex-1 overflow-hidden">
                                        <h3 className="text-white font-semibold text-lg text-wrap line-clamp-2">
                                            {recent.title}  {recent.author && (
                                                <span className="text-white/60 text-md font-normal ml-1">
                                                    by {recent.author}
                                                </span>
                                            )}
                                        </h3>

                                        {recent.lastVisitedInUnix && (
                                            <p className="text-white/80 text-sm">
                                                Last opened: {fromUnix(recent.lastVisitedInUnix)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 justify-center px-4 lg:px-15">
                                    <button
                                        type="button"
                                        onClick={goToView}
                                        className="bg-stop-2 text-white hover:bg-stop-3/80 cursor-pointer px-4 py-2 rounded-md transition-all transform flex items-center justify-center gap-2 font-semibold text-md"
                                    >
                                        <ArrowRight size={20} />
                                        Continue from page {recent.lastReadPage}
                                    </button>
                                    <span className="text-md font-bold text-white/60">OR</span>
                                    <button
                                        type="button"
                                        onClick={goToLibrary}
                                        className="bg-stop-1 hover:bg-stop-1/60 text-white cursor-pointer px-4 py-2 rounded-md transition-all transform flex items-center justify-center gap-2 font-semibold text-md"
                                    >
                                        <Library size={20} />
                                        View Library
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // First Time User
                        <div className="space-y-3">
                            <div className="flex items-center justify-center">
                                <span className="text-xl font-semibold text-white">Welcome!</span>
                            </div>

                            <p className="text-white/70 text-md leading-relaxed">
                                Start reading after uploading your first book by clicking on the button below
                            </p>

                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={goToUpload}
                                    className="bg-stop-3 text-white hover:bg-stop-3/80 cursor-pointer px-6 py-3 rounded-md transition-all transform flex items-center justify-center gap-2 font-semibold text-md mx-auto"
                                >
                                    <Upload size={20} />
                                    Upload Your First Book
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SocialLayout>
    );
}