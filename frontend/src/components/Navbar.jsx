import { Search, Moon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-bold">DK</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">DK's Toolbox</span>
            </div>
          </div>
          
        </div>
      </div>
    </nav>
  );
}
