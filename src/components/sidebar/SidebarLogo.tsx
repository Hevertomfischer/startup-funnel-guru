
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SidebarLogo = () => {
  const [isLightMode, setIsLightMode] = useState(false);
  
  useEffect(() => {
    // Check if light mode is active and update state when theme changes
    const checkTheme = () => {
      setIsLightMode(document.documentElement.classList.contains('light'));
    };
    
    // Initial check
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-16 items-center border-b px-6">
      <Link to="/" className="flex items-center gap-2">
        <img 
          src={isLightMode 
            ? "/lovable-uploads/d882938e-4517-400d-aeac-d32ae1759a49.png" 
            : "/lovable-uploads/52b2437c-f1ce-4662-9136-9d1b36a72734.png"} 
          alt="Logo" 
          className="h-8 w-auto"
        />
      </Link>
    </div>
  );
};

export default SidebarLogo;
