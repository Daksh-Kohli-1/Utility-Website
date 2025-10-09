"use client"
import { useState } from 'react';
import { Image, Upload, Download, Loader2 } from 'lucide-react';

export default function ImageCompressor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCompressedImage(null);
      setError(null);
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/compress-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Compression failed');
      }

      const blob = await response.blob();
      const compressedUrl = URL.createObjectURL(blob);
      setCompressedImage({ url: compressedUrl, blob });
    } catch (err) {
      setError('Failed to compress image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (compressedImage) {
      const a = document.createElement('a');
      a.href = compressedImage.url;
      a.download = `compressed_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-2xl mb-4">
            <Image className="w-8 h-8 text-cyan-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Image Compressor</h1>
          <p className="text-gray-600">Reduce image file sizes.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-6">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-cyan-500 mb-4" />
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG, GIF (MAX. 10MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {previewUrl && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Original Image</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-lg mx-auto" style={{ maxHeight: '300px' }} />
                <p className="text-sm text-gray-600 mt-2">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            </div>
          )}

          {selectedFile && (
            <button
              onClick={handleCompress}
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Compressing...
                </>
              ) : (
                'Compress Image'
              )}
            </button>
          )}

          {compressedImage && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Compressed Image</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <img src={compressedImage.url} alt="Compressed" className="max-w-full h-auto rounded-lg mx-auto" style={{ maxHeight: '300px' }} />
                <p className="text-sm text-gray-600 mt-2">
                  Compressed ({(compressedImage.blob.size / 1024).toFixed(2)} KB)
                </p>
                <button
                  onClick={handleDownload}
                  className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Compressed Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}