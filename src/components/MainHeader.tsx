
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Globe, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MainHeader = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/2b715270-d5ae-4f6c-be60-2dfaf1662139.png" 
                alt="Temanly Logo"
                className="h-10 w-auto"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/services" className="text-gray-700 hover:text-gray-900 font-medium">Services</Link>
              <Link to="/talents" className="text-gray-700 hover:text-gray-900 font-medium">Browse Talents</Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-gray-900 font-medium">How It Works</Link>
              <Link to="/safety" className="text-gray-700 hover:text-gray-900 font-medium">Safety</Link>
              <Link to="/faq" className="text-gray-700 hover:text-gray-900 font-medium">FAQ</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4" />
              <span className="text-gray-700">ID</span>
            </div>
            
            <Link to="/talent-register">
              <Button className="bg-pink-500 text-white hover:bg-pink-600 rounded-full px-6">
                ⭐ Jadi Talent
              </Button>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/user-dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Link to="/signup">
                  <Button variant="ghost">Masuk</Button>
                </Link>
                <Link to="/signup">
                  <Button>Daftar</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
