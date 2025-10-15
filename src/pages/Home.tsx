import { useState, useEffect } from "react";
import { BookObject } from "../../electron/database/objects/Book";
import { ArrowRight, FileText, Library, Upload, HelpCircle, Globe } from "lucide-react";
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
                <div className="hidden bg-indigo-800/20 rounded-md p-4 border border-indigo-500/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HelpCircle size={18} />
                            <span className="text-md">Need help getting started?</span>
                        </div>
                        <button
                            onClick={goToDocumentation}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 cursor-pointer rounded-md transition-colors text-sm"
                        >
                            View Documentation
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="flex bg-indigo-400 p-3 rounded-lg flex-row items-center justify-center gap-2 z-30">
                        <Spinner />
                        <p className="text-violet-900 font-bold text-center text-md">
                            Loading..
                        </p>
                    </div>
                )}

                <div className="bg-gray-800/30 backdrop-blur-sm rounded-md p-8 border border-indigo-500/20 shadow-2xl">
                    {recent ? (
                        // Returning User
                        <div className="space-y-3">
                            <div className="flex items-center justify-center">
                                <span className="text-lg font-semibold text-white">Welcome Back!</span>
                            </div>
                            
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Want to continue?
                            </h2>

                            {/* Recent Book Card */}
                            <div className="bg-indigo-900/20 rounded-md p-6 border border-indigo-500/30">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="font-semibold text-lg rounded-md px-2 py-1 bg-gradient-to-br from-violet-500 to-purple-600">
                                        Previously
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="text-white font-semibold text-lg text-wrap truncate">
                                            {recent.title}  {recent.author && (
                                                <span className="text-indigo-200 text-md">
                                                    by {recent.author}
                                                </span>
                                            )}
                                        </h3>

                                        {recent.lastVisitedInUnix && (
                                            <p className="text-indigo-200 text-sm">
                                                Last opened: {fromUnix(recent.lastVisitedInUnix)}
                                           </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 justify-center px-30">
                                    <button
                                        type="button"
                                        onClick={goToView}
                                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white cursor-pointer px-4 py-2 rounded-md transition-all transform flex items-center justify-center gap-2 font-semibold text-md"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                        Continue from page {recent.lastReadPage}
                                    </button>
                                    <span className="text-md font-semibold text-indigo-200">OR</span>
                                    <button
                                        type="button"
                                        onClick={goToLibrary}
                                        className="bg-gradient-to-br from-sky-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white cursor-pointer px-4 py-2 rounded-md transition-all transform flex items-center justify-center gap-2 font-semibold text-md"
                                    >
                                        <Library className="w-5 h-5" />
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

                            <p className="text-indigo-200 text-md leading-relaxed">
                                Start reading after uploading your first book by clicking on the button below
                            </p>

                            <div>
                                <button
                                    type="button"
                                    onClick={goToUpload}
                                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white cursor-pointer px-4 py-2 rounded-md transition-all transform flex items-center justify-center gap-2 font-semibold text-md mx-auto"
                                >
                                    <Upload size={18} />
                                    Upload Your First Book
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Reach Out Section */}
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-md p-6 border border-indigo-500/20">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center justify-center gap-2">
                        Connect with me
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* GitHub Profile */}
                        <a
                            href="https://github.com/acskii"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-indigo-900/20 hover:bg-indigo-800/30 rounded-md p-4 border border-indigo-500/30 transition-all transform group"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-indigo-300 group-hover:text-indigo-200" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                </svg>
                                <div className="text-white text-left font-semibold text-sm">GitHub</div>
                            </div>
                        </a>

                        {/* Project Repository */}
                        <a
                            href={import.meta.env.VITE_PUBLIC_REPOLINK!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden bg-indigo-900/20 hover:bg-indigo-800/30 rounded-md p-4 border border-indigo-500/30 transition-all transform group"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-indigo-300 group-hover:text-indigo-200" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                </svg>
                                <div className="text-left">
                                    <div className="text-white font-semibold text-sm">Repository</div>
                                </div>
                            </div>
                        </a>

                        {/* Portfolio */}
                        <a
                            href={import.meta.env.VITE_PUBLIC_PORTFOLIO_LINK!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-indigo-900/20 hover:bg-indigo-800/30 cursor-pointer rounded-md p-4 border border-indigo-500/30 transition-all transform group"
                        >
                            <div className="flex items-center gap-3">
                                <Globe className="w-6 h-6 text-indigo-300 group-hover:text-indigo-200" />
                                <div className="text-white text-left font-semibold text-sm">Portfolio</div>
                            </div>
                        </a>
                    </div>
                </div>
                <p className="mt-4 text-center text-sm">
                    Built with ❤️ by Andrew Sameh
                </p>
            </div>
        </div>
    );
}