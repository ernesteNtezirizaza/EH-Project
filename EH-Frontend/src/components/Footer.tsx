
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-lg bg-tech-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl">EH</span>
              </div>
              <span className="ml-2 font-semibold text-lg text-white">Empower Her</span>
            </div>
            <p className="text-gray-400 mb-6">
              Empowering young women in Rwanda through technology education and creating pathways to success in the digital economy.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-tech-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-tech-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-tech-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-tech-600 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors inline-block">
                  About
                </a>
              </li>
              <li>
                <a href="#courses" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Courses
                </a>
              </li>
              <li>
                <a href="#community" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Community
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Subscribe to Our Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Stay updated with our latest courses, events, and success stories.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-tech-500"
              />
              <button 
                type="submit" 
                className="bg-tech-600 hover:bg-tech-700 px-4 py-2 rounded-r-lg text-white transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} EmpowerHer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
