"use client"
import { useState } from 'react';
import { FileText, Upload, X } from 'lucide-react';

export default function PDFTextExtractor() {
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setExtractedText('');
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setExtractedText('');
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    setExtractedText('');
  };

  const handleExtract = async () => {
  try {
    const formdata = new FormData();
    formdata.append("pdf", pdfFile); // assuming pdfFile is a File object from input

    const res = await fetch("http://localhost:8000/extract-text", {
      method: "POST",
      body: formdata,
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();

    // Set extracted text to state
    setExtractedText(data.extracted_text || "No text found in the PDF.");
  } catch (error) {
    console.error("Error extracting text:", error);
    setExtractedText("Failed to extract text. Check console for details.");
  }
};

    
    


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-100 rounded-2xl mb-4">
            <FileText className="w-10 h-10 text-cyan-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">PDF Text Extractor</h1>
          <p className="text-gray-600">Extract text from PDF documents easily.</p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              isDragging
                ? 'border-cyan-500 bg-cyan-50'
                : 'border-gray-300 hover:border-cyan-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!pdfFile ? (
              <>
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Drop your PDF here
                </h3>
                <p className="text-gray-500 mb-4">or click to browse</p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="inline-block bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:bg-cyan-600 transition-colors"
                >
                  Choose PDF File
                </label>
              </>
            ) : (
              <div className="flex items-center justify-between bg-cyan-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-cyan-500 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{pdfFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-2 hover:bg-cyan-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* Extract Button */}
          {pdfFile && (
            <div className="mt-6 text-center">
              <button
                onClick={handleExtract}
                className="bg-cyan-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-cyan-600 transition-colors inline-flex items-center gap-2"
              >
                Extract Text
                <span className="text-xl">→</span>
              </button>
            </div>
          )}
        </div>

        {/* Extracted Text Display */}
        {extractedText && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Extracted Text</h2>
            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm">
                {extractedText}
              </pre>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(extractedText)}
                className="bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([extractedText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'extracted-text.txt';
                  a.click();
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Download as TXT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}