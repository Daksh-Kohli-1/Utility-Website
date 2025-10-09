"use client"
import { useState } from 'react';
import { FileText, File, Upload, Download, Loader2, ArrowRight } from 'lucide-react';

export default function WordPdfConverter() {
  const [conversionType, setConversionType] = useState('pdf-to-word');
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTypeChange = (type) => {
    setConversionType(type);
    setSelectedFile(null);
    setConvertedFile(null);
    setError(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isPdfToWord = conversionType === 'pdf-to-word';
      const validType = isPdfToWord 
        ? file.type === 'application/pdf'
        : file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          file.type === 'application/msword';

      if (!validType) {
        setError(`Please select a valid ${isPdfToWord ? 'PDF' : 'Word'} file`);
        return;
      }

      setSelectedFile(file);
      setConvertedFile(null);
      setError(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('conversionType', conversionType);

    const endpoint = conversionType === 'pdf-to-word' 
      ? 'http://localhost:8000/pdf-to-word' 
      : 'http://localhost:8000/word-to-pdf';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await response.blob();
      const fileExtension = conversionType === 'pdf-to-word' ? 'docx' : 'pdf';
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, `.${fileExtension}`);
      
      setConvertedFile({ 
        url: URL.createObjectURL(blob), 
        blob,
        name: fileName,
        type: fileExtension
      });
    } catch (err) {
      setError('Failed to convert file. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (convertedFile) {
      const a = document.createElement('a');
      a.href = convertedFile.url;
      a.download = convertedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const getAcceptedFileTypes = () => {
    return conversionType === 'pdf-to-word' 
      ? '.pdf' 
      : '.doc,.docx';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-cyan-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Document Converter</h1>
          <p className="text-gray-600">Convert between PDF and Word formats.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Conversion Type Selector */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Select Conversion Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleTypeChange('pdf-to-word')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  conversionType === 'pdf-to-word'
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <File className="w-6 h-6 text-red-500" />
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <p className="font-semibold text-gray-800">PDF to Word</p>
                <p className="text-sm text-gray-500 mt-1">Convert PDF files to DOCX</p>
              </button>

              <button
                onClick={() => handleTypeChange('word-to-pdf')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  conversionType === 'word-to-pdf'
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <FileText className="w-6 h-6 text-blue-500" />
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <File className="w-6 h-6 text-red-500" />
                </div>
                <p className="font-semibold text-gray-800">Word to PDF</p>
                <p className="text-sm text-gray-500 mt-1">Convert DOCX files to PDF</p>
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Upload File</h3>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-10 h-10 text-cyan-500 mb-3" />
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  {conversionType === 'pdf-to-word' ? 'PDF files only' : 'Word files (.doc, .docx)'}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept={getAcceptedFileTypes()}
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Selected File</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  {conversionType === 'pdf-to-word' ? (
                    <File className="w-10 h-10 text-red-500 flex-shrink-0" />
                  ) : (
                    <FileText className="w-10 h-10 text-blue-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Convert Button */}
          {selectedFile && !convertedFile && (
            <button
              onClick={handleConvert}
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  Convert to {conversionType === 'pdf-to-word' ? 'Word' : 'PDF'}
                </>
              )}
            </button>
          )}

          {/* Converted File Preview and Download */}
          {convertedFile && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Converted File</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-cyan-50">
                <div className="flex items-center gap-3 mb-4">
                  {conversionType === 'pdf-to-word' ? (
                    <FileText className="w-10 h-10 text-blue-500 flex-shrink-0" />
                  ) : (
                    <File className="w-10 h-10 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{convertedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(convertedFile.blob.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                
                {conversionType === 'word-to-pdf' && (
                  <div className="mb-4">
                    <iframe
                      src={convertedFile.url}
                      className="w-full h-96 rounded-lg border border-gray-300"
                      title="PDF Preview"
                    />
                  </div>
                )}

                <button
                  onClick={handleDownload}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download {conversionType === 'pdf-to-word' ? 'Word' : 'PDF'} File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}