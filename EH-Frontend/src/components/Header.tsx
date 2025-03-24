
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 glass shadow-sm' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-tech-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">EH</span>
            </div>
            <span className="ml-2 font-semibold text-lg">Empower Her</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#hero" className="text-foreground hover:text-tech-600 transition-colors font-medium">
            Home
          </a>
          <a href="#about" className="text-foreground hover:text-tech-600 transition-colors font-medium">
            About
          </a>
          <a href="#courses" className="text-foreground hover:text-tech-600 transition-colors font-medium">
            Courses
          </a>
          <a href="#community" className="text-foreground hover:text-tech-600 transition-colors font-medium">
            Community
          </a>
          <a href="#contact" className="text-foreground hover:text-tech-600 transition-colors font-medium">
            Contact
          </a>
          <div className="border-l border-gray-200 h-6 mx-2"></div>
          <Link to="/login" className="btn-primary py-2 px-6">
             Login/Sign Up
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden z-10 text-foreground focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <div className={`
          fixed inset-0 bg-white z-0 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden
        `}>
          <div className="flex flex-col h-full justify-center items-center space-y-8 p-8">
            <Link 
              to="/" 
              className="text-foreground text-2xl font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <a 
              href="#about" 
              className="text-foreground text-2xl font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a 
              href="#courses" 
              className="text-foreground text-2xl font-medium"
              onClick={() => setIsOpen(false)}
            >
              Courses
            </a>
            <a 
              href="#community" 
              className="text-foreground text-2xl font-medium"
              onClick={() => setIsOpen(false)}
            >
              Community
            </a>
            <a 
              href="#contact" 
              className="text-foreground text-2xl font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
            <div className="pt-6 flex flex-col space-y-4 w-full max-w-xs">
              <button className="btn-secondary py-3 px-8 w-full">
                Login
              </button>
              <button className="btn-primary py-3 px-8 w-full">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
