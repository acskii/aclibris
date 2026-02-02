import {
  PlusSquareIcon,
  BookMarkedIcon,
  LucideIcon,
  MenuIcon,
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  HelpCircleIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSideMenu } from "../../../contexts/SideMenuContext";

type PageItem = {
  icon: LucideIcon;
  label: string;
  url: string;
};

const pages: PageItem[] = [
  { icon: HomeIcon, label: "Home", url: "/" },
  { icon: PlusSquareIcon, label: "Upload Book", url: "/upload" },
  { icon: BookMarkedIcon, label: "Library", url: "/library" },
  { icon: SearchIcon, label: "Search Books", url: "/search" },
  { icon: SettingsIcon, label: "Settings", url: "/settings" },
];

export function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, toggleCollapsed } = useSideMenu();

  return (
    <div
      className={`h-screen z-40 bg-gradient-to-b from-stop-1 via-stop-2 via-30% to-stop-3/50 text-white shadow-xl backdrop-blur-md transition-all duration-300 ${
        collapsed ? "w-20" : "w-50"
      } flex flex-col justify-between`}
    >
      <div>
        {/* Toggle Button */}
        <div className={`flex p-3 ${collapsed ? "justify-center" : "justify-end"}`}>
          <button
            onClick={toggleCollapsed}
            className="text-white hover:text-white/50 transition"
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
                    ? "bg-stop-3 text-white"
                    : "hover:bg-stop-1 text-white"
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
      <div>
        <button
          onClick={() => navigate("/documentation")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg-b w-full ${
            location.pathname === "/documentation"
              ? "bg-stop-1 text-white"
              : "hover:bg-stop-2 bg-stop-3 text-white"
          } ${
            collapsed 
            ? "justify-center" 
            : ""
          }`}
        >
          <HelpCircleIcon size={20} />
          {!collapsed && <span className="font-medium">Documentation</span>}
        </button>
      </div>
    </div>
  );
}
