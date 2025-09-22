import { createContext, useContext, useState, ReactNode } from "react";
import { SideMenu } from "../components/common/menu/SideMenu";

type SideMenuContextType = {
  collapsed: boolean;
  toggleCollapsed: () => void;
};

const SideMenuContext = createContext<SideMenuContextType | null>(null);

export const SideMenuProvider = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  return (
    <SideMenuContext.Provider value={{ collapsed, toggleCollapsed }}>
        <div className="flex flex-row w-screen h-full">
          <div className="grow-1">
            <SideMenu />
          </div>
          <div className={`grow-2 h-screen w-full transition-all duration-300 overflow-y-auto`}>
              {children}
          </div>
        </div>
    </SideMenuContext.Provider>
  );
};

export const useSideMenu = () => {
  const context = useContext(SideMenuContext);
  if (!context) throw new Error("useSideMenu must be used within SideMenuProvider");
  return context;
};
