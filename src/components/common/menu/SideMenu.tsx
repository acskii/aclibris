import {
  PlusSquareIcon,
  BookMarkedIcon,
  LucideIcon,
  MenuIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSideMenu } from "../../../contexts/SideMenuContext";

type PageItem = {
  icon: LucideIcon;
  label: string;
  url: string;
};

const pages: PageItem[] = [
  { icon: PlusSquareIcon, label: "Upload Book", url: "/upload" },
];

export function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, toggleCollapsed } = useSideMenu();

  return (
    <div
      className={`h-screen z-40 bg-gradient-to-b from-sky-600 via-cyan-500 via-30% to-violet-400 text-white shadow-xl backdrop-blur-md transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <div className={`flex p-3 ${collapsed ? "justify-center" : "justify-end"}`}>
        <button
          onClick={toggleCollapsed}
          className="text-cyan-300 hover:text-white transition"
        >
          <MenuIcon size={30} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-2 px-2">
        {pages.map(({ icon: Icon, label, url }) => {
          const isActive = location.pathname === url;
          return (
            <button
              key={label}
              onClick={() => navigate(url)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                  : "hover:bg-gradient-to-r hover:from-violet-400/30 hover:to-purple-500/30 text-cyan-200"
              }
              ${
                collapsed 
                ? "justify-center" 
                : ""
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span className="font-medium">{label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
