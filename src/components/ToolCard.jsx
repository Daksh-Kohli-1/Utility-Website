'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ToolCard({ icon: Icon, title, description, link }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsAnimating(true);
    
    setTimeout(() => {
      window.location.href = link;
    }, 800);
  };

  return (
    <>
      {/* Email sending animation overlay - covers whole page */}
      {isAnimating && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 animate-fade-in">
          <div className="relative">
            {/* Envelope animation */}
            <div className="animate-bounce">
              <Send className="w-24 h-24 text-cyan-500 animate-pulse" />
            </div>
            
            {/* Large ripple effects covering screen */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-96 h-96 border-4 border-cyan-400 rounded-full animate-ping opacity-40"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-64 h-64 border-4 border-cyan-500 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.15s' }}></div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-[32rem] h-[32rem] border-4 border-blue-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>
      )}

      <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer">
        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
          <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-500 transition-colors duration-300">
            <Icon className="w-6 h-6 text-cyan-500 group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-cyan-500 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        
        <Link 
          href={link}
          onClick={handleClick}
          className="text-cyan-500 hover:text-cyan-600 font-medium text-sm inline-flex items-center group-hover:translate-x-2 transition-transform duration-300"
        >
          Launch
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </>
  );
}