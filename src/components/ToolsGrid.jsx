import { FileJson, Hash, Palette, QrCode, Code, ImageIcon } from 'lucide-react';
import ToolCard from './ToolCard';

export default function ToolsGrid() {
  const tools = [
    {
      icon: FileJson,
      title: 'Bulk Email Sender',
      description: 'Mailing made easy.',
      link: '/BulkEmailSender'
    },
    {
      icon: Hash,
      title: 'Base64 Encoder',
      description: 'Encode and decode Base64 strings easily.',
      link: '#'
    },
    {
      icon: Palette,
      title: 'Color Converter',
      description: 'Convert color codes between formats.',
      link: '#'
    },
    {
      icon: QrCode,
      title: 'QR Code Generator',
      description: 'Create custom QR codes quickly.',
      link: '#'
    },
    {
      icon: Code,
      title: 'Markdown Previewer',
      description: 'Write and preview markdown in real-time.',
      link: '#'
    },
    {
      icon: ImageIcon,
      title: 'Image Compressor',
      description: 'Reduce image file sizes.',
      link: '#'
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