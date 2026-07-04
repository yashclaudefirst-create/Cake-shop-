import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, X, Phone, Mail, Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import BakingAnimation from './components/BakingAnimation';
import CakeBuilder from './components/CakeBuilder';
import Gallery from './components/Gallery';
import About from './components/About';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Footer from './components/Footer';
import { Order, WebsiteConfig, GalleryItem, CakeBuilderOptions } from './types';

const DEFAULT_BUILDER_OPTIONS: CakeBuilderOptions = {
  sizes: [
    { id: 'sz-1', name: 'Small (0.5kg) - 4-6 servings', description: 'Cute mini birthday standard size', price: 0 },
    { id: 'sz-2', name: 'Medium (1.0kg) - 8-12 servings', description: 'Perfect family parlor gathering', price: 250 },
    { id: 'sz-3', name: 'Large (2.0kg) - 16-20 servings', description: 'Festive office & larger groups', price: 550 },
    { id: 'sz-4', name: 'Double Tier Luxury (3.0kg+) - 25-30 servings', description: 'Grand showstopper custom stacked tiers', price: 1050 }
  ],
  flavors: [
    { id: 'fl-1', name: 'Classic Madagascar Vanilla Butter', price: 0 },
    { id: 'fl-2', name: 'Rich Belgian Fudge Chocolate', price: 100 },
    { id: 'fl-3', name: 'Velvety Red Velvet Cocoa', price: 150 },
    { id: 'fl-4', name: 'Creamcheese Salted Butterscotch', price: 80 },
    { id: 'fl-5', name: 'Summer Fresh Strawberry Cream', price: 80 },
    { id: 'fl-6', name: 'Summer Juicy Red Watermelon', price: 180 }
  ],
  colors: [
    { id: 'cl-1', name: 'Millennial Pink', code: '#ffb6c1', price: 0 },
    { id: 'cl-2', name: 'Belgian Charcoal Fudge', code: '#4a3538', price: 0 },
    { id: 'cl-3', name: 'Golden Banana Cream', code: '#e9c400', price: 0 },
    { id: 'cl-4', name: 'Lavender Dreams', code: '#d8b4fe', price: 0 },
    { id: 'cl-5', name: 'Mint Meadow', code: '#a7f3d0', price: 0 },
    { id: 'cl-6', name: 'Emerald Watermelon Rind', code: '#2ecc71', price: 0 },
    { id: 'cl-7', name: 'Pure Snow White', code: '#ffffff', price: 0 }
  ],
  dietary: [
    { id: 'dt-1', name: 'Standard Cream Base', description: 'Fresh farm eggs and rich dairy cream', price: 0 },
    { id: 'dt-2', name: '100% Pure Eggless Sponge', description: 'No eggs used inside workspace', price: 50 },
    { id: 'dt-3', name: 'Certified Gluten-Free Base', description: 'Using organic almond or coconut starch', price: 120 },
    { id: 'dt-4', name: 'Organic Vegan Dairy-Free', description: 'Using coconut butter and almond milk cream', price: 150 },
    { id: 'dt-5', name: 'Healthy Sugar-Free Stevia Blend', description: 'Zero added processed refine sugar', price: 180 }
  ],
  fillings: [
    { id: 'fi-1', name: 'Belgian Fudge', price: 80 },
    { id: 'fi-2', name: 'Strawberry Cream', price: 90 },
    { id: 'fi-3', name: 'Salted Caramel', price: 80 },
    { id: 'fi-4', name: 'Nutella Blast', price: 120 },
    { id: 'fi-5', name: 'Cookies n Cream', price: 70 },
    { id: 'fi-6', name: 'Standard Cream Paste', price: 0 }
  ],
  toppings: [
    { id: 'tp-1', name: 'Rainbow Sprinkles', price: 30 },
    { id: 'tp-2', name: 'French Macarons & Organic Berries', price: 150 },
    { id: 'tp-3', name: 'Edible 24k Gold Foil flakes', price: 200 },
    { id: 'tp-4', name: 'Chocolate Ganache Drip', price: 60 },
    { id: 'tp-5', name: 'Artisan Whipped Sugar Flowers', price: 80 },
    { id: 'tp-6', name: 'Magic Edible Butterflies', price: 100 }
  ],
  sweetness: [
    { id: 'sw-1', name: 'Balanced (Muted Sweetness)', description: 'Keeps cream taste primary with very mild sugars', price: 0 },
    { id: 'sw-2', name: 'Standard Sweetness', description: 'Traditional perfect balanced sweet index', price: 0 },
    { id: 'sw-3', name: 'Extra Sweet Richness', description: 'Bold sugary pop, perfect for chocoholics', price: 0 },
    { id: 'sw-4', name: 'Stevia / Monk Fruit Sweetener', description: 'No spikes! Organic premium leaf crystals', price: 40 }
  ],
  frostings: [
    { id: 'fr-1', name: 'Light Whipped Frosting', description: 'Fluffy air whipped sugar cream', price: 0 },
    { id: 'fr-2', name: 'Swiss Meringue Buttercream', description: 'Rich velvety luxury finish', price: 100 },
    { id: 'fr-3', name: 'New York Cream Cheese Frosting', description: 'Tangy dessert pastry favorite', price: 120 },
    { id: 'fr-4', name: 'Rigid Rolled Fondant Sheet', description: 'Sleek custom sculpted cake finish', price: 150 }
  ]
};

const DEFAULT_WEBSITE_CONFIG: WebsiteConfig = {
  heroBadge: "FSSAI Certified Baker",
  heroTitleCursive: "Hand Made",
  heroTitleGradient: "With Pure Love",
  heroDescription: "Lavanya Dreamy Delight is a gourmet boutique home baking kitchen. We craft dreamy, whimsical cakes and custom treats with only the finest premium chocolate, fresh organic seasonal fruits, and butter.",
  aboutTag: "Our Baker Story",
  aboutTitle: "Craving for Confectionery Perfection",
  aboutSubtitle: "At Lavanya Dreamy Delight, we elevate premium baking into a fine art form, blending pure organic Jersey dairy cream, authentic Belgian chocolates, and a sprinkle of magic.",
  aboutMainTitle: "Choosy Baking, Small Batch Delicacies & Genuine Care",
  aboutDesc1: "Founded under the simple tenet that cake should never taste ordinary or artificial, Lavanya Dreamy Delight operates as a localized boutique micro-bakery. Every recipe sponge is individually whipped from scratch—there are zero premixes, zero high-fructose corn syrups, and strictly no artificial stabilizers inside our pantry.",
  aboutDesc2: "We sourcing fresh seasonal sweet strawberries, organic eggs, natural Madagascar vanilla pods, and genuine imported cocoa powders. This uncompromising devotion to raw ingredients translates directly into dense, velvety moist finishes that melt on your tongue.",
  card1Title: "FSSAI Certified",
  card1Desc: "Strict sanitary food workspace checks",
  card2Title: "100% Homemade",
  card2Desc: "Real cow ghee and rich dairy butter",
  card3Title: "Artisan Crafting",
  card3Desc: "Tailored ribbons & handwritten letters",
  card4Title: "Baked to Hour",
  card4Desc: "Dispatched warm within 3 hrs of setup",
  whatsappNumber: "919865621880",
  whatsappMsgTemplate: `Hi Lavanya Dreamy Delight!
I want to place an order:

- Category: {category}
- Flavour: {flavor}
- Price: ₹{price}
- Shape: {shape}
- Size: {size}
- Cream: {cream}
- Toppings: {toppings}
- Diet: {diet}
- Name on cake: {message}
- Delivery date: {deliveryDate}

Please confirm availability!`,
  customerAutoMsg: "We've locked in your recipe slot. A sweet confirmation slip has been logged under ID: {orderId}. We will reach out to you shortly via WhatsApp to confirm details!"
};

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-custom-akka",
    title: "Manju Akka's Signature Chocolate Drip Cake",
    category: "Cakes",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=60",
    description: "A gorgeous premium home-baked celebration cake crafted completely from scratch with flour, sugar, milk, fresh eggs, and rich cocoa powder. Strictly contains no premixes, no cake gels, and no preservatives. Adorned with delicate cocoa rosettes, dark chocolate drip, and a customizable central white chocolate message plate."
  },
  {
    id: "gal-1",
    title: "Signature Strawberry Luxury Peak",
    category: "Cakes",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL7Lz3fGNOqtxv5Mtv2O9UKxXh3LiG5rGCbQqBEi0trMJiPxZejHF_g-hpT7E2dIcX2jGRiONAVvKyTp8hiMh2PTYQM-pMfBNuTmrkjE7fymm8a_VfI8A0LkclNyQ4pw6I1-KBvXOyOJN0RACYG1KTZhLlJzy7UMRJaq4-l1u9FC75fIR89IjLFqbCb4tgMVwD9nNAUX0YjKfgxptEmnKM-J-z0D5pJbqJVIzhN_6TTjS-H8Dlh1sKMsNrzhG6pHYIwUASCNlpifo",
    description: "A gorgeous, elaborate double tier custom cake garnished with fresh handpicked strawberries, royal cream rosettes, and whimsical sugar butterflies."
  },
  {
    id: "gal-2",
    title: "Vivid Confetti Cupcakes",
    category: "Special Cakes",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2nH6z8eHE0d3DYjSLpTJolZSLAEmJmzwyt_PE2J3ESXLCdtxVZUDm_wEs3GrzqltZxLVeMdrUEB1UA6GroETcb3fYOGQyOo0-gcOSELxqdLPzpkPSyKExQlULAD6PZIWDd8PcUhMp9ZwPRXulkQoJUDhecEjYre7LR63xirPtB-iwOZc1KQKqjsBeAyOH053CNqwHcJGsTgycdbK9NHWrrEtLhs6-qLOVvq8SJeoS4gJe4-Zugp8EWpcBidQLzSx6Yg9KLUq5_0M",
    description: "Miniature sponge fluffy cupcakes topped with creamy strawberry frosting icing and premium edible crystal sprinkles."
  },
  {
    id: "gal-3",
    title: "Gooey Belgian Walnut Brownies",
    category: "Brownies",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDg9Lr3k2hwBV9__-xXoWuJVpHRQ1b8W4ZHN-MK1bmNn092Tl58KNaTb2bRLzQIfchxucorWhJLbmj5hqCguH1M9fY76p5MKlFm1WEEp8BSljnyKqZT7MtIjwpn_GMHYmgtbwRxqczzLy4UxDFICAj8eWNG2gb1lPdR1bEqz5B3BZBYJ8MICSeoFtPHOPJyU_XDig8sf_nLuiDkKHzjbTFHJPwL_nRcKa5EaYMsk2DmOGSokyhYjkaCtaxJnTIGN0_7alk-_xx0XXQ",
    description: "Moist chocolate square bites crafted from rich organic 74% dark chocolate, butter cream, and roasted Kashmiri walnuts."
  },
  {
    id: "gal-4",
    title: "Esterhazy Custard Milfoil",
    category: "Special Cakes",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUZC1h1eqrOD7tUOhKag3aVnSBhrJGe9u_kIWX49md6TGh3yOI_1Z6AqMc68QX61twozVGU93Uniwjs9IjKnBr7f3r-wrWo0JK8yMvLjclSS2_EE59a0sG8zuUcbQ0Qbjys18NwIbf3By7JRLnOhkzYwi4u7srpcwllVy7BW9MdD5bDrSOY-4-ktzUBwoo5iJbjhftnYCwOyVxsqTJX6X9loF34z88jsSMajyQ34Og4DU2C_uGcNN0XOgv--uTkTgMejBUZmJ45uI",
    description: "Multi-layered delicate puff pastry stuffed with Madagascar custard pudding and topped with white chocolate cobweb glazes."
  },
  {
    id: "gal-5",
    title: "Custom Birthday Macaron Castle",
    category: "Cakes",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1fZMjX_oG4jCntDV434e2IR035wogrWMak7a_X4mHryhMtp-nv-ThXwThb1oj-lWVjdBD-comvTsnrYmYPUhO0Th52JuNNYPi8zCRfXpFWu0cS2pUlFdKd1A2PzAxv7edkCmgc_Wn-HAkKip3LkYFCCV7OKTDn0mC6ewvOXKbi1WUAAkVW5G41csEdG1zCYhFgTdscsGN5iwXJ3SyAHLV2tKrbiBoYcuSj6P1_GiZO4JWb-UYjw2jP4CPi1HshhiJt4j8NQbbkek",
    description: "Three tier customized cake loaded with authentic French almond flour macarons, edible gold sprinkles, and a customized Happy Birthday topper."
  },
  {
    id: "gal-6",
    title: "Artisanal High Tea Bakery Assortments",
    category: "Brownies",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6gUk4Lax0y7Nppc6RIvUkd91fDIJVRF5EnwNUD1-1Nsz66PANG9fwmUU3eC1E-CmysDUOfOTn4M28O9Tn9GJsXqqL6psXnoD3hNi_wtjHTrLSQ7fOgIaXvnJJ0wJ-CceZNVOdOfrzfJjKaKTR2Fdh0-Gai2PhNEAvEg3vUIeViiqnfA4Gc2fE7RUBtu8poemZWH3rGKy9MTtFcKjWngqmtHsUyFYSZVv6FPA_FDHCd9YK6__kYFb4fNNb0LNkMbktgHeIvBUCcnk",
    description: "A signature platter of custom-baked products including fudge slices, red velvet pastry bites, chocolate macaron treats, and butter cookies."
  }
];


const MOCK_ORDERS: Order[] = [
  {
    id: "LAVANYA-70492",
    createdAt: new Date(Date.now() - 3 * 3600000).toLocaleString(),
    totalPrice: 1980,
    status: "Baking",
    customer: {
      name: "Lavanya",
      email: "lavanya@dreamydelight.com",
      phone: "+91-98912-34928",
      address: "M-Block, Greater Kailash 1, New Delhi",
      deliveryType: "delivery"
    },
    customization: {
      category: "cake",
      shape: "Classic Round",
      size: "Large (2kg)",
      baseFlavor: "Summer Juicy Red Watermelon",
      baseColor: "#2ecc71",
      baseColorName: "Emerald Watermelon Rind",
      dietary: "Eggless",
      fillings: "Strawberry Cream",
      sweetness: "Standard",
      frostingType: "Buttercream",
      toppings: ["Fresh Berries", "Rainbow Sprinkles"],
      occasion: "Celebration",
      messageOnCake: "Happy Watermelon Summer!",
      deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      deliveryTimeSlot: "04:00 PM - 07:00 PM",
      specialInstructions: "Please draw cute little black watermelon seeds on the frosting side drips!"
    }
  },
  {
    id: "LAVANYA-81204",
    createdAt: new Date(Date.now() - 24 * 3600000).toLocaleString(),
    totalPrice: 1450,
    status: "Received",
    customer: {
      name: "Roshni Sen",
      email: "roshni.sen@gmail.com",
      phone: "+91-95601-38294",
      address: "F-Block, Connaught Place, New Delhi",
      deliveryType: "pickup"
    },
    customization: {
      category: "cake",
      shape: "Classic Round",
      size: "Medium (1kg)",
      baseFlavor: "Velvety Red Velvet Cocoa",
      baseColor: "#ffb6c1",
      baseColorName: "Millennial Pink",
      dietary: "Standard",
      fillings: "Belgian Fudge",
      sweetness: "Standard",
      frostingType: "Cream Cheese",
      toppings: ["Choco-Stars"],
      occasion: "Anniversary",
      messageOnCake: "Happy Annual!",
      deliveryDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      deliveryTimeSlot: "10:00 AM - 01:00 PM",
      specialInstructions: "Make it extra moist, please."
    }
  }
];

export default function App() {
  // Direct Message & Chat states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Home website structural states
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminVisible, setIsAdminVisible] = useState(false);

  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>(() => {
    const saved = localStorage.getItem('lavanya_website_config') || localStorage.getItem('krish_website_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_WEBSITE_CONFIG;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('lavanya_gallery_items') || localStorage.getItem('krish_gallery_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_GALLERY_ITEMS;
  });

  const [builderOptions, setBuilderOptions] = useState<CakeBuilderOptions>(() => {
    const saved = localStorage.getItem('lavanya_builder_options') || localStorage.getItem('krish_builder_options');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_BUILDER_OPTIONS;
  });

  // Track web contents persistence
  useEffect(() => {
    localStorage.setItem('lavanya_website_config', JSON.stringify(websiteConfig));
  }, [websiteConfig]);

  useEffect(() => {
    localStorage.setItem('lavanya_gallery_items', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('lavanya_builder_options', JSON.stringify(builderOptions));
  }, [builderOptions]);

  // Administrator login authentication states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [adminPhone, setAdminPhone] = useState<string>(() => {
    return localStorage.getItem('adminPhone') || '';
  });
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const handleAdminToggle = () => {
    if (isAdminAuthenticated) {
      setIsAdminVisible(!isAdminVisible);
    } else {
      setIsLoginVisible(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminPhone('');
    setIsAdminVisible(false);
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminPhone');
    showToast('Logged out of administrator session securely.', 'info');
  };

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lavanya_orders_list') || localStorage.getItem('krish_orders_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return MOCK_ORDERS;
  });

  // Track orders persistence
  useEffect(() => {
    localStorage.setItem('lavanya_orders_list', JSON.stringify(orders));
  }, [orders]);

  const handleOrderAdded = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Notify customer
    showToast(`Order received successfully! Your sweet Order ID is ${newOrder.id}. We are getting to work!`, 'success');
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter(o => o.id !== orderId));
  };

  const handleSeedMockOrders = () => {
    setOrders(() => MOCK_ORDERS);
  };

  return (
    <div className="font-sans bg-[#FFF8F5] text-slate-800 antialiased min-h-screen selection:bg-pink-300 selection:text-pink-900 pb-4 overflow-x-hidden">
      {/* 1. Header/Navigation Bar */}
      <Navbar 
        onNavClick={handleNavClick} 
        activeSection={activeSection} 
        onAdminToggle={handleAdminToggle}
        isAdminVisible={isAdminVisible}
        isAdminAuthenticated={isAdminAuthenticated}
        onLoginClick={() => setIsLoginVisible(true)}
      />

      {/* Fixed top margin to prevent navbar clash */}
      <div className="h-16" />

      {/* 2. Admin Dashboard Board overlay if toggled true */}
      {isAdminVisible && (
        <div id="admin-dashboard">
          <AdminDashboard 
            orders={orders}
            onUpdateStatus={handleUpdateStatus}
            onDeleteOrder={handleDeleteOrder}
            onSeedMockOrders={handleSeedMockOrders}
            onClose={() => setIsAdminVisible(false)}
            onLogout={handleAdminLogout}
            adminPhone={adminPhone}
            websiteConfig={websiteConfig}
            onSaveConfig={(newConfig) => {
              setWebsiteConfig(newConfig);
              showToast('Website general copywriting updated!', 'success');
            }}
            galleryItems={galleryItems}
            onUpdateGalleryItems={(newItems) => {
              setGalleryItems(newItems);
              showToast('Creations catalog updated successfully!', 'success');
            }}
            builderOptions={builderOptions}
            onUpdateBuilderOptions={(newOptions) => {
              setBuilderOptions(newOptions);
              showToast('Cake custom design builder options updated successfully!', 'success');
            }}
          />
        </div>
      )}

      {/* 3. Hero Section block */}
      <div id="home">
        <Hero onNavClick={handleNavClick} config={websiteConfig} />
      </div>

      {/* 4. Boutique Menu and Selection section */}
      <Menu />

      {/* 4.5 Auto Baking Simulator Visualizer */}
      <BakingAnimation 
        isAdminAuthenticated={isAdminAuthenticated} 
        onLoginClick={() => setIsLoginVisible(true)} 
      />

      {/* 5. Custom cake builder (Cake creator) module */}
      <div id="builder">
        <CakeBuilder onOrderAdded={handleOrderAdded} builderOptions={builderOptions} websiteConfig={websiteConfig} />
      </div>

      {/* 6. Creations catalog gallery showcase */}
      <div id="gallery">
        <Gallery items={galleryItems} />
      </div>

      {/* 7. Kitchen narrative story (About Us) */}
      <div id="about">
        <About config={websiteConfig} />
      </div>

      {/* 8. Unified page footer */}
      <Footer 
        onAdminToggle={handleAdminToggle} 
        onLinkClick={handleNavClick} 
        isAdminVisible={isAdminVisible} 
      />

      {/* Login Verification Page Overlay */}
      {isLoginVisible && (
        <Login 
          onLoginSuccess={(phone) => {
            setIsAdminAuthenticated(true);
            setAdminPhone(phone);
            setIsLoginVisible(false);
            setIsAdminVisible(true);
            showToast('Welcome back! Admin Dashboard successfully unlocked.', 'success');
            setTimeout(() => {
              const element = document.getElementById('admin-dashboard');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }}
          onClose={() => setIsLoginVisible(false)}
        />
      )}

      {/* Modern Inline Success Toast overlay */}
      {toast && (
        <div id="app-toast-alert" className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border-2 border-emerald-400 rounded-3xl p-4 shadow-2xl flex items-start gap-3 transition-transform duration-300 pointer-events-auto leading-relaxed">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 font-bold select-none text-md">
            ✓
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#874e58] uppercase tracking-wider leading-none">Sweet Notification</h4>
            <p className="text-[11px] font-medium text-slate-700 mt-1.5 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-650 font-bold text-xs p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 9. Floating Direct Message (DM) / WhatsApp Support Chat Overlay */}
      <div className="fixed bottom-6 right-6 z-[45] font-sans">
        {/* Floating Bubble Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-[#6b3741] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 relative cursor-pointer group"
          title="Direct Message Chef"
          id="floating-dm-btn"
        >
          {isChatOpen ? (
            <X size={22} className="stroke-[2.5]" />
          ) : (
            <>
              <MessageSquare size={22} className="stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[8px] font-black items-center justify-center text-white">1</span>
              </span>
            </>
          )}
          
          {/* Action Tooltip */}
          {!isChatOpen && (
            <span className="absolute right-16 bg-white border border-primary/10 text-primary text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Direct Msg Chef
            </span>
          )}
        </button>

        {/* Support Direct Messager Card */}
        {isChatOpen && (
          <div className="absolute bottom-18 right-0 w-[310px] bg-white border border-primary-container/40 rounded-3xl shadow-2xl overflow-hidden animate-fade-in divide-y divide-[#d6c2c3]/20">
            {/* Owner Header */}
            <div className="bg-gradient-to-r from-primary to-[#874e58] p-4 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-display font-black text-xs">
                    Chef
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight font-display uppercase tracking-wider">Chef Lavanya</h4>
                    <span className="text-[9px] text-[#ffb6c1] flex items-center gap-1 font-semibold">
                      <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                      Studio Live Support (Inquiries)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-white/80 hover:text-white p-1 hover:bg-white/15 rounded-full transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Simulated Live Messages Container */}
            <div className="p-4 space-y-3 bg-[#fff8f5]/45 h-40 overflow-y-auto text-left">
              <div className="space-y-1 bg-white p-3 rounded-2xl border border-primary/5 text-[11px] leading-relaxed text-slate-700 shadow-2xs">
                <span className="font-bold text-primary block text-[9.5px] uppercase tracking-wider">Kitchen Outpost</span>
                <p>
                  Hari Om! Feel free to direct message me with design reference pictures, customized catering queries, eggless variations, or rush delivery requests under Connaught Outpost.
                </p>
                <p className="mt-1 font-bold text-emerald-700">
                  Compose your direct question below and send to WhatsApp!
                </p>
              </div>
            </div>

            {/* Customizer DM compositors */}
            <div className="p-4 bg-white space-y-3 text-left">
              <textarea
                placeholder="Type details / questions to Chef Lavanya directly..."
                className="w-full p-2.5 bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl text-xs font-semibold placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary h-16 resize-none"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <a
                href={`https://wa.me/919865621880?text=${encodeURIComponent(chatMessage ? `Hi Chef Lavanya! ${chatMessage}` : 'Hi Lavanya Dreamy Delight baking kitchen!')}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setChatMessage('')}
                className="w-full py-2.5 bg-secondary hover:bg-[#a84457] text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
              >
                <Send size={11} />
                Direct Message (WhatsApp DM)
              </a>

              {/* Direct Fast Outlets */}
              <div className="pt-2 flex justify-between text-[9px] text-[#847375] border-t border-primary/5 font-extrabold uppercase tracking-wide">
                <a href="tel:+919865621880" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Phone size={10} className="text-primary" /> Call +91 98656
                </a>
                <a href="mailto:orders@lavanyadreamydelight.com" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Mail size={10} className="text-primary" /> Mail Studio
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
