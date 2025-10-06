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
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-bold">DK</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">DK's Toolbox</span>
            </div>
            
            <div className="hidden md:flex space-x-6">
              {['Home', 'Tools', 'About', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-gray-600 hover:text-cyan-500 transition-colors duration-200 relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search tools..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 w-48 focus:w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Moon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
