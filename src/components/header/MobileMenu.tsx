
import React from 'react';
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden absolute w-full bg-background border-b z-50 shadow-lg animate-fade-in">
      <nav className="px-4 py-3">
        <ul className="space-y-3">
          <li>
            <Link 
              to="/" 
              className="flex items-center gap-2 py-2 hover:text-primary"
              onClick={onClose}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/board" 
              className="flex items-center gap-2 py-2 hover:text-primary"
              onClick={onClose}
            >
              Board
            </Link>
          </li>
          <li>
            <Link 
              to="/list" 
              className="flex items-center gap-2 py-2 hover:text-primary"
              onClick={onClose}
            >
              List View
            </Link>
          </li>
          <li>
            <Link 
              to="/workflow" 
              className="flex items-center gap-2 py-2 hover:text-primary"
              onClick={onClose}
            >
              Workflow
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MobileMenu;
