import { FileJson, Hash, Palette, QrCode, Code, ImageIcon, Mail, File } from 'lucide-react';
import ToolCard from './ToolCard';

export default function ToolsGrid() {
  const tools = [
    {
      icon: Mail,
      title: 'Bulk Email Sender',
      description: 'Mailing made easy.',
      link: '/BulkEmailSender'
    },
    {
      icon: File,
      title: 'PDF Text Extractor',
      description: 'Extract text from any pdf with just one click.',
      link: '/PDFTextExtractor'
    },
    {
      icon: Palette,
      title: 'Pdf to Word/Word to pdf',
      description: 'Convert your pdf files to word and vica versa.',
      link: '/FileConversion'
    },
    {
      icon: QrCode,
      title: 'QR Code Generator',
      description: 'Create custom QR codes quickly.',
      link: '/QRcode'
    },
    {
      icon: Code,
      title: 'Web Scraper for job postings',
      description: 'Made Job finding easier.',
      link: '#'
    },
    {
      icon: ImageIcon,
      title: 'Image Compressor',
      description: 'Reduce image file sizes.',
      link: '/ImageCompressor'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Explore Our Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <div 
              key={index}
              className="animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <ToolCard {...tool} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}