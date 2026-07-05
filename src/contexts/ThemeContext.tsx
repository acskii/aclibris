import React, { createContext, useContext, useEffect, useState } from 'react';
import { type ThemeType } from '../themes';

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeType>('default');

    // Load from DB on init
    useEffect(() => {
        const initTheme = async () => {
            const savedTheme = await window.db.settings.theme(); 
            setThemeState(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        };
        initTheme();
    }, []);

    const setTheme = (newTheme: ThemeType) => {
        setThemeState(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        window.db.settings.updateValue('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <div className="bg-app-bg text-white min-h-screen transition-colors duration-500">
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};