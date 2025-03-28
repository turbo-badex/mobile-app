
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-6">
      <div className="flex justify-between items-center">
        <NavItem 
          icon={<Home className="h-5 w-5" />} 
          to="/" 
          label="Home" 
          active={currentPath === "/"} 
        />
        <NavItem 
          icon={<MessageSquare className="h-5 w-5" />} 
          to="/manual" 
          label="Chat" 
          active={currentPath === "/manual"} 
        />
        <NavItem 
          icon={<Search className="h-5 w-5" />} 
          to="/rizz-lines" 
          label="Rizz" 
          active={currentPath === "/rizz-lines"} 
        />
        <NavItem 
          icon={<Settings className="h-5 w-5" />} 
          to="/settings" 
          label="Settings" 
          active={currentPath === "/settings"} 
        />
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  to: string;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, to, label, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center text-xs transition-colors",
        active ? "text-[#3155F6]" : "text-gray-500 hover:text-[#3155F6]"
      )}
    >
      {icon}
      <span className="mt-1">{label}</span>
    </Link>
  );
};

export default MobileNav;
