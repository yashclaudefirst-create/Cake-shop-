import React, { useState, useEffect } from 'react';
import { Cake, Menu, X, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  onNavClick: (sectionId: string) => void;
  activeSection: string;
  onAdminToggle: () => void;
  isAdminVisible: boolean;
}

export default function Navbar({ onNavClick, activeSection, onAdminToggle, isAdminVisible }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'baking-section', label: 'Baking' },
    { id: 'builder', label: 'Build Cake' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
  ];

  const handleItemClick = (id: string) => {
    onNavClick(id);
    setIsOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#fff8f5]/95 backdrop-blur-md shadow-md border-b border-primary/10 py-3' 
          : 'bg-[#fff8f5]/85 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Brand Logo */}
        <button 
          onClick={() => handleItemClick('home')}
          className="flex items-center gap-2 group text-left cursor-pointer transition-transform duration-200 hover:scale-105"
          id="nav-logo"
        >
          <div className="w-10 h-10 rounded-full bg-[#ffb6c1]/40 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <Cake size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="font-display text-lg md:text-xl font-bold tracking-tight text-primary uppercase select-none block">
              The Sweet Spot
            </span>
            <span className="text-[10px] font-sans text-on-surface-variant font-semibold tracking-widest block uppercase -mt-1">
              Gourmet Home Baking
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`font-semibold text-sm transition-all relative pb-1 scroll-smooth cursor-pointer ${
                activeSection === item.id || (activeSection === 'home' && item.id === 'home')
                  ? 'text-primary drop-shadow-[0_1px_3px_rgba(135,78,88,0.15)] font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
              id={`nav-link-${item.id}`}
            >
              {item.label}
              {(activeSection === item.id || (activeSection === 'home' && item.id === 'home')) && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full transition-all duration-300 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Quick action controls & Admin shortcut */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onAdminToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              isAdminVisible 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-surface-variant/40 text-on-surface-variant hover:bg-primary-container/20 hover:text-primary border border-outline-variant/35'
            }`}
          >
            <ShieldAlert size={14} />
            Admin Board
          </button>
          
          <button
            onClick={() => handleItemClick('builder')}
            className="px-5 py-2.5 bg-primary text-white font-semibold text-xs tracking-wider uppercase rounded-full shadow-md hover:bg-[#6b3741] hover:scale-105 active:scale-95 hover:shadow-lg transition-all duration-300"
            id="nav-btn-order"
          >
            Order Premium Cake
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onAdminToggle}
            className={`p-2 rounded-full transition-all ${
              isAdminVisible 
                ? 'bg-[#ffb6c1] text-primary' 
                : 'text-on-surface-variant hover:bg-primary-container/20 hover:text-primary'
            }`}
            title="Toggle Admin Board"
          >
            <ShieldAlert size={18} />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-primary p-2 hover:bg-primary-container/20 rounded-full transition-colors"
            id="mobile-menu-btn"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#fff8f5] border-b border-primary-container/30 ${
          isOpen ? 'max-h-[350px] opacity-100 py-4 scale-y-100 duration-300' : 'max-h-0 opacity-0 scale-y-95 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-3 px-6 pb-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`text-left py-2 font-semibold text-sm transition-colors border-b border-black/5 last:border-0 ${
                activeSection === item.id 
                  ? 'text-primary pl-2 border-l-2 border-primary' 
                  : 'text-on-surface-variant'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleItemClick('builder')}
            className="mt-2 w-full py-3 bg-primary text-white text-center font-bold text-xs uppercase tracking-wider rounded-full shadow-sm"
          >
            Build Your Cake
          </button>
        </div>
      </div>
    </nav>
  );
}
