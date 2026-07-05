/*
    Wrapper layout component that includes a Socials component at the bottom of the page
*/

import Socials from "../components/Socials";
import { type ReactNode } from "react";

interface SocialLayoutProps {
    children : ReactNode;
}

export default function SocialLayout({ children }: SocialLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col gap-5 p-5 pb-0 justify-between">
            {children}
            <Socials />
        </div>
    );
}