import { useState, useEffect } from "react";
import { BookObject } from "../../electron/database/objects/Book";
import { ArrowRight, Library, Upload, HelpCircle, Globe } from "lucide-react";
import { Spinner } from "../components/common/spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { fromUnix } from "../service/util/Date";

export function HomePage() {
    const navigate = useNavigate();
    const [recent, setRecent] = useState<BookObject | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadRecent = async () => {
            setLoading(true);
            // @ts-ignore
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
        <div className="min-h-screen flex items-center justify-center p-5">
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
                                    <div className="text-left flex-1">
                                        <h3 className="text-white font-semibold text-lg text-wrap truncate">
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

                {/* Reach Out Section */}
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-md p-6">
                    <h3 className="text-white/90 font-semibold text-lg mb-4 flex items-center justify-center gap-2">
                        Connect with me
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* GitHub Profile */}
                        <a
                            href="https://github.com/acskii"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-app-card hover:bg-app-card/80 rounded-md p-4 transition-all transform group"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-white/70 group-hover:text-white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                </svg>
                                <div className="text-white/80 group-hover:text-white text-left font-semibold text-sm">GitHub</div>
                            </div>
                        </a>

                        {/* Portfolio */}
                        <a
                            href={import.meta.env.VITE_PUBLIC_PORTFOLIO_LINK!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-app-card hover:bg-app-card/80 rounded-md p-4 transition-all transform group"
                        >
                            <div className="flex items-center gap-3">
                                <Globe className="w-6 h-6 text-white/70 group-hover:text-white" />
                                <div className="text-white/80 group-hover:text-white text-left font-semibold text-sm">Portfolio</div>
                            </div>
                        </a>
                    </div>
                </div>
                <p className="mt-4 text-center text-sm text-white/80">
                    Built with ❤️ by Andrew Sameh
                </p>
            </div>
        </div>
    );
}