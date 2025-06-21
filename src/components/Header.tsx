
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Heart, Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/2b715270-d5ae-4f6c-be60-2dfaf1662139.png" 
              alt="Temanly Logo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/rent" className="text-gray-700 hover:text-pink-600 transition-colors">
              Find Companions
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-pink-600 transition-colors">
              FAQ
            </Link>
            <Link to="/safety" className="text-gray-700 hover:text-pink-600 transition-colors">
              Safety
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-pink-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild className="hidden sm:inline-flex">
              <Link to="/contact">Become a Talent</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <Link to="/rent">Browse Now</Link>
            </Button>
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
