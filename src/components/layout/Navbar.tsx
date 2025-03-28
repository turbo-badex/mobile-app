
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Settings, Search, Menu, X, Mail, Share2, Instagram, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [open, setOpen] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NaijaRizz',
          text: 'Check out NaijaRizz - The ultimate Rizz assistant!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback
      alert('Sharing not supported on this browser');
    }
  };

  const handleEmail = () => {
    window.location.href = "mailto:contact@naijarizz.com?subject=NaijaRizz%20App%20Inquiry";
  };

  return (
    <nav className={cn("w-full bg-white border-b border-gray-100 py-3 px-4 flex justify-between items-center", className)}>
      {/* Logo and brand */}
      <div className="flex items-center gap-2">
        <Link to="/">
          <img 
            src="/lovable-uploads/7dd7dae5-a3c6-4673-9485-8f5a7006305d.png" 
            alt="NaijaRizz Logo" 
            className="h-8" 
          />
        </Link>
      </div>

      {/* Mobile menu button */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <div className="flex flex-col h-full p-6 pt-0">
            <div className="flex justify-end mb-4">
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-6 flex-1">
              <button 
                onClick={handleEmail}
                className="w-full flex items-center gap-3 py-3 px-4 text-left text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Mail className="h-5 w-5" />
                Email Us
              </button>
              
              <button 
                onClick={handleShare}
                className="w-full flex items-center gap-3 py-3 px-4 text-left text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Share2 className="h-5 w-5" />
                Share App
              </button>
            </div>
            
            <div className="mt-auto flex flex-col items-center gap-4">
              <img 
                src="/lovable-uploads/7dd7dae5-a3c6-4673-9485-8f5a7006305d.png" 
                alt="NaijaRizz Logo" 
                className="h-10 mb-2" 
              />
              
              <div className="flex items-center justify-center gap-6">
                <a href="https://instagram.com/naijarizz" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#3155F6] transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="https://twitter.com/naijarizz" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#3155F6] transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="https://tiktok.com/@naijarizz" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#3155F6] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
                    <path d="M15 8a4 4 0 0 0 0 8"/>
                    <path d="M15 8a4 4 0 0 1 4 4V4"/>
                    <line x1="15" y1="8" x2="15" y2="16"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-6">
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
    </nav>
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
        "flex flex-col items-center text-sm transition-colors",
        active ? "text-[#3155F6]" : "text-gray-500 hover:text-[#3155F6]"
      )}
    >
      {icon}
      <span className="mt-1">{label}</span>
    </Link>
  );
};

export default Navbar;
