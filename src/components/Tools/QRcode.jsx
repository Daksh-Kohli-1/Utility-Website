"use client"
import { useState } from 'react';

export default function QRGenerator() {
  const [url, setUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQR = async () => {
    if (!url.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const formdata = new FormData();
      formdata.append("URL", url);

      const res = await fetch("http://localhost:8000/generate-qr", {
        method: "POST",
        body: formdata,
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate QR code');
      }
      
      const data = await res.json();
      setQrCode(data.qr_code); // Use the base64 image from backend
    } catch (error) {
      console.error(error);
      setError("Can't generate QR code. Please try again.");
      setQrCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateQR();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QR Code Generator</h1>
            <p className="text-gray-600 text-sm">Create QR codes instantly</p>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter URL or Text
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
            />
            <button
              onClick={generateQR}
              disabled={!url.trim() || isLoading}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Generate
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* QR Code Display */}
        {(isLoading || qrCode) && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex flex-col items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-64 h-64">
                    {/* Loading animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 border-4 border-cyan-100 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium">Generating QR Code...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <img 
                      src={qrCode} 
                      alt="Generated QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-sm text-gray-600 max-w-md text-center break-all">
                    {url}
                  </p>
                  <a
                    href={qrCode}
                    download="qr-code.png"
                    className="mt-2 px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Download QR Code
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !qrCode && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No QR Code Yet
            </h3>
            <p className="text-gray-600">
              Enter a URL or text above and click Generate to create your QR code
            </p>
          </div>
        )}
      </div>
    </div>
  );
}