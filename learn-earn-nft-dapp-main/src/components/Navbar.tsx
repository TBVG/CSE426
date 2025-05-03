
import React from 'react';
import ConnectWallet from './ConnectWallet';
import { GraduationCap } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-white border-b shadow-sm py-3 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-study-blue" />
          <h1 className="text-xl font-heading font-bold text-study-blue">Study-to-Earn</h1>
        </div>
        
        <ConnectWallet />
      </div>
    </header>
  );
};

export default Navbar;
