import { ReactNode } from "react";

type ButtonTipProps = {
    icon: ReactNode;
    tip: string;
    colorClass: string;
    onClick: () => void;
};

export function ButtonTip({ icon, tip, colorClass, onClick } : ButtonTipProps) {
    return (
        <div className="relative group">
            <button
                className={`${colorClass} hover:${colorClass}/80 ho p-2 rounded-md font-bold text-sm cursor-pointer transition-colors duration-200`}
                onClick={onClick}
            >
                {icon}
            </button>

            {/* Hover Tooltip */}
            <div className={`${colorClass} absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-white font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50`}>
                {tip}
            </div>
        </div>
    );
}