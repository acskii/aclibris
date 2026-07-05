/*
    Page component that redirects to my socials

    Set as environment variables.
    Use VITE_PUBLIC_SOCIAL_GITHUB for GitHub profile URL
    Use VITE_PUBLIC_SOCIAL_PORTFOLIO for personal portfolio website URL
*/

import { Globe, SquareArrowOutUpRight } from "lucide-react";

const GITHUB_LINK = import.meta.env.VITE_PUBLIC_SOCIAL_GITHUB;
const PORTFOLIO_LINK = import.meta.env.VITE_PUBLIC_SOCIAL_PORTFOLIO;

export default function Socials() {
    return (
        <div className="w-full bg-gray-800/30 p-3 flex rounded-md justify-between">       
            <div className="grid grid-cols-2 gap-4">
                {/* GitHub Profile */}
                {GITHUB_LINK && (
                    <a
                        href={GITHUB_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-all transform group"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-white/70 group-hover:text-white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                            <div className="text-white/80 group-hover:text-white text-left font-semibold text-sm flex items-center gap-2">
                                GitHub
                                <SquareArrowOutUpRight className="w-3 h-3 text-white/70 group-hover:text-white" />
                            </div>
                        </div>
                    </a>
                )}

                {/* Portfolio Website */}
                {PORTFOLIO_LINK && (
                    <a
                        href={PORTFOLIO_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-all transform group"
                    >
                        <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-white/70 group-hover:text-white" />
                            <div className="text-white/80 group-hover:text-white text-left font-semibold text-sm flex items-center gap-2">
                                Portfolio
                                <SquareArrowOutUpRight className="w-3 h-3 text-white/70 group-hover:text-white" />
                            </div>
                        </div>
                    </a>
                )}
            </div>
            <p className="text-center text-sm text-white/80">
                Built with ❤️ by Andrew Sameh
            </p>
        </div>
    );
}