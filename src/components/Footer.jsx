export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Tools', 'About', 'Contact', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-cyan-400 transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="hover:text-cyan-400 transition-colors duration-200 cursor-pointer">
              contact@dkstoolbox.com
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">DK's Toolbox</h4>
            <p className="text-gray-400">Empowering your digital journey.</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>© 2024 DK's Toolbox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}