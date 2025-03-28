
import React from "react";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
      <MobileNav />
    </div>
  );
};

export default MainLayout;
