import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from '../Navbar';

//tailwind wird für layout verwendet
export const Layout: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl"> 
      <NavBar />
      <div className="py-2 px-6">
        {/* Outlet: Component von react das für die child Komponenten definiert ist */}
        <Outlet />
      </div>
    </div>
  );
};