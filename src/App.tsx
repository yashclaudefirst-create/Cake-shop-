import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BakingAnimation from './components/BakingAnimation';
import CakeBuilder from './components/CakeBuilder';
import Gallery from './components/Gallery';
import About from './components/About';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { Order } from './types';
import { MessageSquare, ExternalLink, X, Send } from 'lucide-react';

const MOCK_ORDERS: Order[] = [
  {
    id: "SPOT-77541",
    customization: {
      category: 'cake',
      size: 'Medium (1.0kg) - 8-12 servings',
      baseFlavor: 'Rich Belgian Chocolate',
      baseColor: '#d8b4fe',
      baseColorName: 'Lavender Dreams',
      dietary: '100% Pure Eggless Sponge',
      fillings: 'Belgian Fudge',
      sweetness: 'Standard Sweetness',
      frostingType: 'Swiss Meringue Buttercream',
      toppings: ['French Macarons & Organic Berries', 'Edible 24k Gold Foil flakes'],
      occasion: 'Anniversary Milestone',
      messageOnCake: 'Happy 25th Mom & Dad!',
      deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      deliveryTimeSlot: 'Evening Twilight (06:00 PM - 09:00 PM)',
      specialInstructions: 'Please make sure writing is in gold icing if possible.'
    },
    customer: {
      name: 'Priya Malhotra',
      email: 'priya.m@example.com',
      phone: '9812345678',
      address: 'Apt-402, Block C, Signature Greens, South Delhi',
      deliveryType: 'delivery'
    },
    totalPrice: 1210,
    status: 'Baking',
    createdAt: new Date(Date.now() - 7200000).toLocaleString('en-US', { hour12: true }) // 2 hrs ago
  },
  {
    id: "SPOT-44210",
    customization: {
      category: 'brownie',
      size: 'Small (0.5kg) - 4-6 servings',
      baseFlavor: 'Rich Belgian Fudge Chocolate',
      baseColor: '#4a3538',
      baseColorName: 'Belgian Charcoal Fudge',
      dietary: 'Standard Cream Base',
      fillings: 'Salted Caramel',
      sweetness: 'Standard Sweetness',
      frostingType: 'Light Whipped Frosting',
      toppings: ['Rainbow Sprinkles', 'Chocolate Ganache Drip'],
      occasion: 'Birthday Celebration',
      messageOnCake: '',
      deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      deliveryTimeSlot: 'Hi-Noon Lunch (12:00 PM - 03:00 PM)',
      specialInstructions: 'Deliver cold in an ice pack.'
    },
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul.s@example.com',
      phone: '9988776655',
      address: '',
      deliveryType: 'pickup'
    },
    totalPrice: 520,
    status: 'Ready for Delivery',
    createdAt: new Date(Date.now() - 14400000).toLocaleString('en-US', { hour12: true }) // 4 hrs ago
  }
];

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppText, setWhatsAppText] = useState('Hello! I would like to inquire about baking slot custom cake availability today.');

  // Load orders on startup
  useEffect(() => {
    const saved = localStorage.getItem('sweet_spot_orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        setOrders(MOCK_ORDERS);
      }
    } else {
      setOrders(MOCK_ORDERS);
      localStorage.setItem('sweet_spot_orders', JSON.stringify(MOCK_ORDERS));
    }
  }, []);

  // Update Section Tracker based on scroll offsets
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'baking-section', 'builder', 'gallery', 'about'];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const offsetTop = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // height of sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const syncOrders = (updatedList: Order[]) => {
    setOrders(updatedList);
    localStorage.setItem('sweet_spot_orders', JSON.stringify(updatedList));
  };

  const handleOrderAdded = (newOrder: Order) => {
    const nextList = [newOrder, ...orders];
    syncOrders(nextList);
    // Open admin automatically so they can see their order loaded
    setIsAdminVisible(true);
    setTimeout(() => {
      const adminEl = document.getElementById('admin-dashboard');
      if (adminEl) adminEl.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    const nextList = orders.map((o) => o.id === orderId ? { ...o, status: newStatus } : o);
    syncOrders(nextList);
  };

  const handleDeleteOrder = (orderId: string) => {
    const nextList = orders.filter((o) => o.id !== orderId);
    syncOrders(nextList);
  };

  const handleSeedMockOrders = () => {
    // Generate new mock orders and append to keep things fresh
    const randId = `SPOT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newDemo: Order = {
      id: randId,
      customization: {
        category: 'cake',
        size: 'Large (2.0kg) - 16-20 servings',
        baseFlavor: 'Velvety Red Velvet Cocoa',
        baseColor: '#ffb6c1',
        baseColorName: 'Millennial Pink',
        dietary: 'Standard Cream Base',
        fillings: 'Strawberry Cream',
        sweetness: 'Extra Sweet Richness',
        frostingType: 'New York Cream Cheese Frosting',
        toppings: ['French Macarons & Organic Berries', 'Artisan Whipped Sugar Flowers'],
        occasion: 'Birthday Celebration',
        messageOnCake: 'Happy 18th Sarah!',
        deliveryDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        deliveryTimeSlot: 'Morning Breakfast (09:00 AM - 12:00 PM)',
        specialInstructions: 'Add birthday candle set inside.'
      },
      customer: {
        name: 'Gaurav Kapoor',
        email: 'gaurav@example.com',
        phone: '9876501234',
        address: 'Villa 12, Nirvana Greens, Gurugram',
        deliveryType: 'delivery'
      },
      totalPrice: 1530,
      status: 'Received',
      createdAt: new Date().toLocaleString('en-US', { hour12: true })
    };

    const nextList = [newDemo, ...orders];
    syncOrders(nextList);
  };

  const handleAdminToggle = () => {
    setIsAdminVisible(!isAdminVisible);
    if (!isAdminVisible) {
      setTimeout(() => {
        const dashboard = document.getElementById('admin-dashboard');
        if (dashboard) {
          dashboard.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const triggerWhatsAppRedirect = () => {
    const encodedText = encodeURIComponent(whatsAppText);
    const url = `https://wa.me/919876543210?text=${encodedText}`;
    window.open(url, '_blank', 'noreferrer,noopener');
    setIsWhatsAppModalOpen(false);
  };

  return (
    <div className="font-sans bg-[#fff8f5] text-on-surface text-sm antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      
      {/* Sticky Top Header */}
      <Navbar 
        onNavClick={handleNavClick} 
        activeSection={activeSection} 
        onAdminToggle={handleAdminToggle}
        isAdminVisible={isAdminVisible}
      />

      {/* Main landing section blocks */}
      <Hero onNavClick={handleNavClick} />

      <BakingAnimation />

      <CakeBuilder onOrderAdded={handleOrderAdded} />

      <Gallery />

      <About />

      {/* Conditional Chef Owner Control Board pane */}
      {isAdminVisible && (
        <AdminDashboard 
          orders={orders}
          onUpdateStatus={handleUpdateStatus}
          onDeleteOrder={handleDeleteOrder}
          onSeedMockOrders={handleSeedMockOrders}
          onClose={() => setIsAdminVisible(false)}
        />
      )}

      {/* Brand Footer */}
      <Footer 
        onAdminToggle={handleAdminToggle} 
        onLinkClick={handleNavClick} 
        isAdminVisible={isAdminVisible}
      />

      {/* Floating Interactive WhatsApp Action Widget bottom right */}
      <button 
        onClick={() => setIsWhatsAppModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 z-50 animate-pulse"
        title="Chat on WhatsApp"
        id="btn-whatsapp-floating"
      >
        <MessageSquare size={24} className="fill-current" />
      </button>

      {/* Custom high-fidelity WhatsApp helper modal */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999]">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-primary-container relative text-left text-xs font-semibold space-y-4 animate-bounce-slight">
            <button
              onClick={() => setIsWhatsAppModalOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-on-surface-variant hover:text-red-700"
            >
              <X size={14} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#25D366]/20 rounded-full flex items-center justify-center text-[#25D366]">
                <MessageSquare size={20} className="fill-current" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-primary">Chat with Sweet Spot Kitchen</h4>
                <p className="text-[10px] text-zinc-500 font-normal">Direct support inquiry with Chef Krish</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-primary uppercase block tracking-wider">
                Type Your WhatsApp Message:
              </label>
              <textarea 
                rows={3}
                value={whatsAppText}
                onChange={(e) => setWhatsAppText(e.target.value)}
                className="w-full text-xs p-3 border border-primary/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                placeholder="Type here..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={triggerWhatsAppRedirect}
                className="flex-1 py-3 bg-[#25D366] text-white rounded-full font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-1 hover:brightness-105 transition-all cursor-pointer"
              >
                Launch Chat
                <ExternalLink size={12} />
              </button>
              <button
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="px-4 py-3 bg-neutral-100 text-on-surface-variant rounded-full font-bold uppercase text-[10px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
