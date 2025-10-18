import { useEffect, useRef } from 'react';

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawAnimatedGrid = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const gridSize = 40;
      const cols = Math.ceil(width / gridSize);
      const rows = Math.ceil(height / gridSize);

      time += 0.02;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;
          
          // Create wave effect
          const wave = Math.sin(time + i * 0.3 + j * 0.3) * 0.5 + 0.5;
          const wave2 = Math.cos(time * 0.7 + i * 0.2 - j * 0.2) * 0.5 + 0.5;
          
          // Interpolate between cyan and blue
          const r = Math.floor(0 + wave * 100);
          const g = Math.floor(170 + wave * 85);
          const b = Math.floor(200 + wave2 * 55);
          const alpha = 0.1 + wave * 0.15;


        }
      }

      animationFrameId = requestAnimationFrame(drawAnimatedGrid);
    };

    drawAnimatedGrid();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6">
          Your Go-To Online Tech Utilities.
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          A collection of powerful and easy-to-use tools for developers, designers, and everyday users.
        </p>
      </div>
    </div>
  );
}