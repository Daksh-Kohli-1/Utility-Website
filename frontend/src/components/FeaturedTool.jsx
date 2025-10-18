import { ImageIcon } from 'lucide-react';

export default function FeaturedTool() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Featured Tool</h2>
        
        <div className="bg-gradient-to-r from-gray-50 to-cyan-50 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300 shadow-lg">
              <ImageIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">AI Image Resizer</h3>
            <p className="text-gray-600 leading-relaxed">
              Intelligently resize and enhance your images with our new AI-powered tool. 
              Perfect for web developers and content creators who need pixel-perfect results 
              without losing quality.
            </p>
          </div>
          
          <button className="flex-shrink-0 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg whitespace-nowrap">
            Launch Tool
          </button>
        </div>
      </div>
    </section>
  );
}
