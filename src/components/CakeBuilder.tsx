import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { CakeCustomization, CustomerDetails, Order, CakeBuilderOptions } from '../types';
import { 
  Cake as CakeIcon, 
  ChevronLeft, 
  ChevronRight, 
  UtensilsCrossed, 
  Flame, 
  Calendar, 
  Clock, 
  HelpCircle, 
  Check, 
  Sparkles, 
  TrendingUp, 
  ShoppingBag, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Truck, 
  Store,
  MessageSquare,
  Cookie,
  Heart
} from 'lucide-react';

const FLAVOUR_GROUPS: Record<string, { name: string; price: number; color: string }[]> = {
  'EVERYDAY CLASSICS': [
    { name: 'Classic Vanilla', price: 600, color: '#FFF8DC' },
    { name: 'Black Forest', price: 700, color: '#3D1C02' },
    { name: 'White Forest', price: 750, color: '#F5F5F5' },
    { name: 'Chocolate', price: 750, color: '#4A2C2A' },
    { name: 'Butterscotch', price: 850, color: '#DAA520' }
  ],
  'PREMIUM FAVOURITES': [
    { name: 'Red Velvet', price: 850, color: '#8B0000' },
    { name: 'Real Fruit Mango', price: 950, color: '#FFD700' },
    { name: 'Honey Cake', price: 1250, color: '#FFA500' },
    { name: 'Rose Milk', price: 1350, color: '#FFB6C1' },
    { name: 'Tender Coconut', price: 1250, color: '#F5DEB3' }
  ],
  'CHOCOLATE & FUSION': [
    { name: 'Chocolate Truffles', price: 1150, color: '#2C1810' },
    { name: 'White Truffle', price: 1250, color: '#FFFACD' },
    { name: 'Oreo Truffle', price: 1250, color: '#1C1C1C' },
    { name: 'Tresleches Cake', price: 1250, color: '#FFF8F0' },
    { name: 'Rasamalai', price: 1250, color: '#FFFACD' },
    { name: 'Gulab Jamun', price: 1250, color: '#8B0000' },
    { name: 'Milk Gova', price: 1350, color: '#FFDAB9' }
  ],
  'CELEBRATION SPECIALS': [
    { name: 'KitKat', price: 1500, color: '#C0392B' },
    { name: 'Ferro Rocher', price: 1600, color: '#8B6914' },
    { name: 'Nutella', price: 1400, color: '#3E1C00' }
  ],
  'BROWNIES': [
    { name: 'Brownie Slab 600g', price: 750, color: '#1A0A00' }
  ],
  'CUPCAKES': [
    { name: 'Vanilla Cream Cupcake', price: 80, color: '#FFF8DC' },
    { name: 'Belgian Chocolate Cupcake', price: 90, color: '#4A2C2A' },
    { name: 'Strawberry Red Velvet Cupcake', price: 100, color: '#8B0000' }
  ],
  'MUFFINS': [
    { name: 'Blueberry Soft Muffin', price: 90, color: '#4682B4' },
    { name: 'Double Choc Chip Muffin', price: 100, color: '#2C1810' }
  ],
  'TRES LECHES': [
    { name: 'Classic Tres Leches Soak', price: 350, color: '#FFF8F0' },
    { name: 'Mango Season Tres Leches', price: 420, color: '#FFD700' },
    { name: 'Rose Petal Milk Tres Leches', price: 450, color: '#FFB6C1' }
  ],
  'COOKIES': [
    { name: 'Warm Chocolate Chip Cookie', price: 60, color: '#D2691E' },
    { name: 'Rich Macadamia Oat Cookie', price: 70, color: '#F4A460' }
  ]
};

const getFlavorPriceAndColor = (flavorName: string) => {
  for (const group of Object.values(FLAVOUR_GROUPS)) {
    const found = group.find(f => f.name === flavorName);
    if (found) {
      return { price: found.price, color: found.color };
    }
  }
  return { price: 600, color: '#FFF8DC' };
};

interface CakeBuilderProps {
  onOrderAdded: (newOrder: Order) => void;
  builderOptions?: CakeBuilderOptions;
}

const INITIAL_CUSTOMER: CustomerDetails = {
  name: '',
  email: '',
  phone: '',
  address: '',
  deliveryType: 'pickup'
};

export default function CakeBuilder({ onOrderAdded, builderOptions }: CakeBuilderProps) {
  // Safe fallback to match original values if no custom ones are stored
  const options = builderOptions || {
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

  const getInitialCustomization = (): CakeCustomization => ({
    category: 'cake',
    shape: 'Classic Round',
    size: '1kg Portion (approx. 8-12 servings)',
    baseFlavor: 'Classic Vanilla',
    baseColor: '#FFF8DC',
    baseColorName: 'Classic Vanilla',
    dietary: options.dietary[0]?.name || '',
    fillings: options.fillings[0]?.name || '',
    sweetness: options.sweetness[1]?.name || options.sweetness[0]?.name || '',
    frostingType: options.frostings[0]?.name || '',
    toppings: [],
    occasion: 'Birthday Celebration',
    messageOnCake: '',
    deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    deliveryTimeSlot: 'Evening Twilight (06:00 PM - 09:00 PM)',
    specialInstructions: ''
  });

  const [step, setStep] = useState(1);
  const [customization, setCustomization] = useState<CakeCustomization>(getInitialCustomization);
  const [customer, setCustomer] = useState<CustomerDetails>(INITIAL_CUSTOMER);
  const [validationError, setValidationError] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  // GSAP Baking Sequence state indicators
  const [isBaking, setIsBaking] = useState(false);
  const [bakingPercent, setBakingPercent] = useState(0);
  const [bakingStage, setBakingStage] = useState<'prep' | 'mix' | 'oven' | 'ice' | 'decor' | 'finish'>('prep');
  const [bakingStatusMessage, setBakingStatusMessage] = useState('Preheating luxury deck ovens...');

  // Pricing calculation helper linked completely to dynamic builderOptions
  const calculatePrice = (): number => {
    const { price: baseFlavorPrice } = getFlavorPriceAndColor(customization.baseFlavor);
    let basePrice = baseFlavorPrice;

    // Size multiplier
    let sizeMultiplier = 1.0;
    if (customization.category === 'cake') {
      if (customization.size.includes('500g') || customization.size.includes('0.5kg')) {
        sizeMultiplier = 0.6;
      } else if (customization.size.includes('2kg') || customization.size.includes('2.0kg')) {
        sizeMultiplier = 1.8;
      } else if (customization.size.includes('1kg') || customization.size.includes('1.0kg')) {
        sizeMultiplier = 1.0;
      }
    } else if (customization.category === 'cupcake' || customization.category === 'muffin' || customization.category === 'cookies') {
      if (customization.size.includes('Box of 6')) {
        sizeMultiplier = 6.0;
      } else if (customization.size.includes('Box of 12')) {
        sizeMultiplier = 11.0;
      } else {
        sizeMultiplier = 1.0;
      }
    } else if (customization.category === 'tres_leches') {
      if (customization.size.includes('Medium')) {
        sizeMultiplier = 2.0;
      } else if (customization.size.includes('Party')) {
        sizeMultiplier = 3.5;
      } else {
        sizeMultiplier = 1.0;
      }
    }

    let calculated = Math.round(basePrice * sizeMultiplier);

    // Dietary additions
    const dietaryOpt = options.dietary.find(d => d.name === customization.dietary);
    if (dietaryOpt) calculated += dietaryOpt.price;

    // Fillings
    const fillingsOpt = options.fillings.find(f => f.name === customization.fillings);
    if (fillingsOpt) calculated += fillingsOpt.price;

    // Sweetness
    const sweetnessOpt = options.sweetness.find(sw => sw.name === customization.sweetness);
    if (sweetnessOpt) calculated += sweetnessOpt.price;

    // Frosting
    const frostingOpt = options.frostings.find(fr => fr.name === customization.frostingType);
    if (frostingOpt) calculated += frostingOpt.price;

    // Toppings cumulative sum
    customization.toppings.forEach(top => {
      const toppingOpt = options.toppings.find(t => t.name === top);
      if (toppingOpt) calculated += toppingOpt.price;
    });

    // Special slots (e.g. Midnight)
    if (customization.deliveryTimeSlot.includes('Midnight')) calculated += 150;

    // Delivery charge
    if (customer.deliveryType === 'delivery') calculated += 80;

    return calculated;
  };

  const darkenColour = (hex: string): string => {
    return hex + 'CC';
  };

  const updatePreviewColour = (colour: string) => {
    ['sv-base', 'sv-top'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('fill', colour);
    });
    const dark = darkenColour(colour);
    ['sv-base-top', 'sv-top-top'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('fill', dark);
    });
  };

  const updatePreviewCream = (show: boolean) => {
    const el = document.getElementById('sv-cream');
    if (el) el.setAttribute('opacity', show ? '1' : '0');
  };

  const updatePreviewName = (name: string) => {
    const el = document.getElementById('sv-name');
    if (el) el.textContent = name;
  };

  const updatePreviewTopper = (text: string) => {
    const el = document.getElementById('sv-topper');
    if (el) {
      el.textContent = text;
      el.setAttribute('opacity', '1');
    }
  };

  const updatePreviewDiet = (diet: string) => {
    const badges: Record<string, string> = {
      'Egg': 'EGG',
      'Eggless': 'VEG',
      'Wheat': 'GF'
    };
    const el = document.getElementById('sv-badge');
    if (el) {
      el.textContent = badges[diet] || '';
      el.setAttribute('opacity', '1');
    }
  };

  // Live Sync Effect for cake-svg preview elements
  useEffect(() => {
    if (customization.baseColor) {
      updatePreviewColour(customization.baseColor);
    }
    
    // Determine whether cream drops are shown
    const hasCream = customization.frostingType || (customization.fillings && customization.fillings !== 'None');
    updatePreviewCream(!!hasCream);
    
    // Message label on cake slab
    updatePreviewName(customization.messageOnCake || '');
    
    // Choose premium topping label representing selected toppings
    let topperLabel = '✦ DELIGHT ✦';
    if (customization.toppings && customization.toppings.length > 0) {
      const top = customization.toppings[0];
      if (top.includes('Gold')) topperLabel = '✦ GOLD ✦';
      else if (top.includes('Sprinkles')) topperLabel = '✿ SWEETS ✿';
      else if (top.includes('Flower')) topperLabel = '✿ FLOWERS ✿';
      else if (top.includes('Butterflies')) topperLabel = '✦ DECORS ✦';
      else if (top.includes('Ganache')) topperLabel = '✦ GANACHE ✦';
      else if (top.includes('Macarons')) topperLabel = '✦ MACARONS ✦';
    }
    updatePreviewTopper(topperLabel);
    
    // Choose badge representing dietary choice
    let dietType = 'Egg';
    if (customization.dietary) {
      if (customization.dietary.includes('Eggless') || customization.dietary.includes('Vegan')) {
        dietType = 'Eggless';
      } else if (customization.dietary.includes('Gluten-Free')) {
        dietType = 'Wheat';
      }
    }
    updatePreviewDiet(dietType);
  }, [
    customization.baseColor,
    customization.messageOnCake,
    customization.toppings,
    customization.fillings,
    customization.frostingType,
    customization.dietary
  ]);

  // Step Navigators
  const nextStep = () => {
    if (step === 13) {
      if (!customer.name.trim()) return setValidationError('Please provide your name.');
      if (!customer.email.trim() || !customer.email.includes('@')) return setValidationError('Please enter a valid email address.');
      if (!customer.phone.trim() || customer.phone.length < 8) return setValidationError('Please enter a valid phone contact.');
      if (customer.deliveryType === 'delivery' && !customer.address.trim()) return setValidationError('Please provide an address for home delivery.');
    }
    setValidationError('');
    setStep((prev) => Math.min(prev + 1, 14));
  };

  const prevStep = () => {
    setValidationError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleToppingToggle = (topping: string) => {
    setCustomization((prev) => {
      const exists = prev.toppings.includes(topping);
      const nextToppings = exists
        ? prev.toppings.filter((t) => t !== topping)
        : [...prev.toppings, topping];
      return { ...prev, toppings: nextToppings };
    });
  };

  const resetBuilder = () => {
    setCustomization(getInitialCustomization());
    setCustomer(INITIAL_CUSTOMER);
    setStep(1);
    setSubmittedOrder(null);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Start gorgeous GSAP baking sequence!
    setIsBaking(true);
  };

  // GSAP animated sequence scheduler
  useEffect(() => {
    if (!isBaking) return;

    setBakingPercent(0);
    setBakingStage('prep');
    setBakingStatusMessage('Preheating deck ovens and calling chef assistants...');

    const tl = gsap.timeline({
      onComplete: () => {
        const newOrder: Order = {
          id: `SPOT-${Math.floor(10000 + Math.random() * 90000)}`,
          customization,
          customer,
          totalPrice: calculatePrice(),
          status: 'Received',
          createdAt: new Date().toLocaleString('en-US', { hour12: true })
        };
        // Save to dynamic lists
        onOrderAdded(newOrder);
        setSubmittedOrder(newOrder);
        setIsBaking(false);
      }
    });

    // 1. Preparation Stage
    tl.to({}, {
      duration: 1.5,
      onStart: () => {
        setBakingStage('prep');
        setBakingStatusMessage('Measuring organic flour, brown sugar, and high-fat creamery butter...');
      },
      onUpdate: function() {
        setBakingPercent(Math.floor(this.progress() * 25));
      }
    });

    // 2. Mixing Stage
    tl.to({}, {
      duration: 1.5,
      onStart: () => {
        setBakingStage('mix');
        setBakingStatusMessage('Whisking premium egg batters with organic vanilla extracts...');
      },
      onUpdate: function() {
        setBakingPercent(25 + Math.floor(this.progress() * 25));
      }
    });

    // 3. Baking In Oven
    tl.to({}, {
      duration: 1.8,
      onStart: () => {
        setBakingStage('oven');
        setBakingStatusMessage(`Baking the fluffy ${customization.baseFlavor} base core at 175°C...`);
      },
      onUpdate: function() {
        setBakingPercent(50 + Math.floor(this.progress() * 25));
      }
    });

    // 4. Frosting Application
    tl.to({}, {
      duration: 1.4,
      onStart: () => {
        setBakingStage('ice');
        setBakingStatusMessage(`Cooling core, preparing piping bags, and sifting ${customization.baseColorName} frosting...`);
      },
      onUpdate: function() {
        setBakingPercent(75 + Math.floor(this.progress() * 20));
      }
    });

    // 5. Finishing Decorations
    tl.to({}, {
      duration: 1.3,
      onStart: () => {
        setBakingStage('decor');
        setBakingStatusMessage('Securing dynamic toppings, piping details, and boxing order...');
      },
      onUpdate: function() {
        setBakingPercent(95 + Math.floor(this.progress() * 5));
      }
    });

    tl.to({}, {
      duration: 0.5,
      onStart: () => {
        setBakingStage('finish');
        setBakingStatusMessage('Master creation fully boxed and sealed!');
      }
    });

    return () => {
      tl.kill();
    };
  }, [isBaking, customization, customer]);

  return (
    <section id="builder" className="py-20 bg-[#fff1ea]/60 relative select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Intro branding */}
        <div className="text-center mb-12">
          <span className="p-1 px-3 bg-primary/15 text-primary text-[10px] font-bold rounded-full tracking-widest uppercase">
            Artisanal Confectionery Engine
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-2">
            Design Your Dream Confection
          </h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto mt-2">
            Customize every tier, flavor, and decoration step-by-step. Watch your cake update dynamically in real-time.
          </p>
        </div>

        {isBaking ? (
          /* GSAP Animated Baking Sequence overlay */
          <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md border border-primary-container/40 rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center min-h-[520px] shadow-xl relative overflow-hidden animate-fade-in text-left">
            {/* Decorative background blurs */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 filter blur-2xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/5 filter blur-2xl rounded-full" />

            <div className="text-center mb-8 max-w-md z-15">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-850 text-[10px] font-bold rounded-full tracking-widest uppercase mb-3 animate-pulse">
                <Sparkles size={11} className="text-[#e9c400] fill-current" /> Bakery Laboratory Slot Active <Sparkles size={11} className="text-[#e9c400] fill-current" />
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-black text-primary tracking-tight">
                Baking Your Dream Recipe...
              </h3>
              <p className="font-sans text-xs text-[#847375] mt-2">
                Our kitchen artisans are composing your exact details into a glorious confection slab.
              </p>
            </div>

            {/* GSAP Target Workbench Card */}
            <div className="relative w-full max-w-lg h-72 bg-gradient-to-br from-[#fffdfc] to-[#fff8f5] border border-[#d6c2c3]/30 rounded-2xl flex flex-col items-center justify-center overflow-hidden p-6 shadow-inner z-10">
              
              {/* OVEN STEAM RAYS */}
              <div className="absolute top-4 inset-x-6 flex justify-between px-4 opacity-40">
                <div className="h-1 w-16 bg-primary/20 rounded-full animate-pulse" />
                <div className="h-1 w-12 bg-primary/20 rounded-full animate-pulse delay-75" />
                <div className="h-1 w-20 bg-primary/20 rounded-full animate-pulse delay-150" />
              </div>

              {/* STAGE-SPECIFIC ANIMATED CONTAINER */}
              <div className="flex-1 w-full flex items-center justify-center relative">
                
                {/* 1. PREP STAGE */}
                {bakingStage === 'prep' && (
                  <div className="flex items-center gap-8 justify-center animate-fade-in text-left">
                    <div className="baking-egg flex flex-col items-center justify-center bg-white p-4 h-24 w-24 rounded-2xl shadow-sm border border-primary/10">
                      <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                      <span className="text-[9px] font-black text-primary mt-2 uppercase tracking-wider text-center leading-none">Fresh Eggs</span>
                    </div>
                    <div className="baking-flour flex flex-col items-center justify-center bg-white p-4 h-24 w-24 rounded-2xl shadow-sm border border-primary/10">
                      <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                      <span className="text-[9px] font-black text-primary mt-2 uppercase tracking-wider text-center leading-none">Flour</span>
                    </div>
                    <div className="baking-sugar flex flex-col items-center justify-center bg-white p-4 h-24 w-24 rounded-2xl shadow-sm border border-primary/10">
                      <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                      <span className="text-[9px] font-black text-primary mt-2 uppercase tracking-wider text-center leading-none">Organic Nectar</span>
                    </div>
                  </div>
                )}

                {/* 2. MIXING STAGE */}
                {bakingStage === 'mix' && (
                  <div className="flex flex-col items-center justify-center animate-fade-in text-left">
                    <div className="baking-bowl relative w-28 h-20 bg-neutral-200 border-b-8 border-x-4 border-neutral-300 rounded-b-full shadow-inner flex items-center justify-center">
                      <div className="absolute bottom-1 inset-x-1 h-9 bg-amber-100 rounded-b-full animate-pulse" />
                      <div className="baking-whisk absolute bottom-4 text-primary">
                        <Sparkles className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-amber-800 uppercase mt-4 block tracking-wider animate-pulse">
                      High-Speed Electric Whisk Action...
                    </span>
                  </div>
                )}

                {/* 3. baking OVEN STAGE */}
                {bakingStage === 'oven' && (
                  <div className="flex flex-col items-center justify-center animate-fade-in w-full text-left">
                    <div className="relative w-56 h-36 bg-zinc-800 rounded-2xl border-4 border-zinc-700 shadow-2xl flex flex-col justify-between overflow-hidden">
                      <div className="bg-zinc-700 h-6 border-b border-zinc-650 flex items-center justify-between px-3 text-[8px] text-orange-400 font-mono">
                        <span>CONVECTION</span>
                        <span>175°C [ACTIVE]</span>
                      </div>
                      
                      <div className="flex-1 bg-zinc-950/90 relative flex items-center justify-center p-3">
                        <div className="oven-glow absolute inset-0 bg-radial-at-t from-orange-600/30 via-transparent to-transparent pointer-events-none" />
                        
                        <div className="relative w-28 h-16 flex flex-col justify-end">
                          <div className="baking-sponge w-24 h-12 bg-amber-800 border-t-2 border-amber-500 rounded-t-xl mx-auto z-10" />
                          <div className="w-28 h-4 bg-zinc-400 rounded-b-md border-t border-zinc-300 relative z-20" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-[#874e58] uppercase mt-3 block tracking-wide">
                      Core sponge rising inside convection oven...
                    </span>
                  </div>
                )}

                {/* 4. FROSTING ASSEMBLY STAGE */}
                {bakingStage === 'ice' && (
                  <div className="flex flex-col items-center justify-center animate-fade-in text-left">
                    <div className="relative flex flex-col items-center justify-center">
                      <div className="baking-sponge-color w-32 h-16 rounded-t-xl relative border-b-2 border-primary/25 flex flex-col items-center justify-center shadow-lg"
                           style={{ backgroundColor: customization.baseColor }}>
                        <div className="w-full h-1 bg-white/40 absolute top-1/2" />
                      </div>
                      
                      <div className="baking-spatula absolute -top-4 z-30 filter drop-shadow-md text-white">
                        <Sparkles className="w-8 h-8 text-white fill-amber-200 animate-bounce" />
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-[#874e58] uppercase mt-4 block tracking-wide">
                      Coat application in progress...
                    </span>
                  </div>
                )}

                {/* 5. FINISHING DECOR STAGE */}
                {bakingStage === 'decor' && (
                  <div className="flex flex-col items-center justify-center animate-fade-in w-full text-left">
                    <div className="relative flex flex-col items-center pt-8 scale-110">
                      <div className="w-32 h-18 rounded-t-xl rounded-b-md relative border-b-4 border-amber-950/20 flex flex-col items-center justify-center shadow-lg"
                           style={{ backgroundColor: customization.baseColor }}>
                        
                        <div className="w-full h-1 bg-white/30 absolute top-1/3" />
                        
                        {customization.messageOnCake && (
                          <div className="absolute top-[25%] inset-x-2 text-center pointer-events-none">
                            <span className="font-cursive text-[7px] px-1 py-0.5 rounded text-amber-950 bg-white/80 font-bold block truncate max-w-[75px] mx-auto">
                              {customization.messageOnCake}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="baking-topping-particles absolute -top-8 flex gap-2 text-lg">
                        {customization.toppings.slice(0, 3).map((top, idx) => {
                          let color = '#FFD700';
                          if (top.includes('Sprinkles')) color = '#FF69B4';
                          else if (top.includes('Flower')) color = '#FF81C1';
                          else if (top.includes('Butterflies')) color = '#E6C280';
                          else if (top.includes('Ganache')) color = '#4A2C2A';
                          return (
                            <span key={idx} className="animate-bounce" style={{ animationDelay: `${idx * 0.1}s` }}>
                              <Sparkles className="w-5 h-5" style={{ color }} />
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. COMPLETE STAGE */}
                {bakingStage === 'finish' && (
                  <div className="flex flex-col items-center justify-center animate-fade-in text-center text-left">
                    <span className="text-5xl animate-bounce">🎁</span>
                    <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase mt-4 block">
                      Perfect Recipe Complete!
                    </span>
                  </div>
                )}

              </div>

            </div>

            {/* PROGRESS TICKER FOR USER ACCESSIBILITY */}
            <div className="w-full max-w-lg mt-6 space-y-3 z-10 text-left">
              <div className="flex justify-between items-center text-[11px] font-black uppercase text-primary tracking-wider font-mono">
                <span>Confection Assembly Status:</span>
                <span>{bakingPercent}%</span>
              </div>

              <div className="w-full h-3 bg-primary/10 rounded-full p-0.5 overflow-hidden border border-primary/20">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-secondary to-emerald-600 rounded-full transition-all duration-100 shadow-inner" 
                  style={{ width: `${bakingPercent}%` }}
                />
              </div>

              <p className="text-center font-display text-xs font-black uppercase text-primary tracking-widest animate-pulse h-6">
                {bakingStatusMessage}
              </p>

              {/* Human step indicators */}
              <div className="grid grid-cols-5 gap-1 pt-2 text-[8px] font-black tracking-wider text-[#847375] uppercase font-sans text-center">
                <span className={`p-1.5 rounded-lg border ${bakingStage === 'prep' ? 'bg-primary text-white border-primary' : 'bg-white border-primary/10'}`}>1. Prep</span>
                <span className={`p-1.5 rounded-lg border ${bakingStage === 'mix' ? 'bg-primary text-white border-primary' : 'bg-white border-primary/10'}`}>2. Mix</span>
                <span className={`p-1.5 rounded-lg border ${bakingStage === 'oven' ? 'bg-primary text-white border-primary' : 'bg-white border-primary/10'}`}>3. Bake</span>
                <span className={`p-1.5 rounded-lg border ${bakingStage === 'ice' ? 'bg-primary text-white border-primary' : 'bg-white border-primary/10'}`}>4. Frost</span>
                <span className={`p-1.5 rounded-lg border ${['decor', 'finish'].includes(bakingStage) ? 'bg-primary text-white border-primary' : 'bg-white border-primary/10'}`}>5. Decor</span>
              </div>
            </div>

          </div>
        ) : submittedOrder ? (
          /* Confirmation Success Panel */
          <div className="max-w-xl mx-auto glass-card rounded-3xl p-8 text-center border border-primary-container space-y-6 animate-bounce-slight">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
              <Check size={36} className="stroke-[3]" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-widest bg-emerald-500/10 text-emerald-800 px-3 py-1 rounded-full uppercase">
                Order Received Successfully
              </span>
              <h3 className="font-display text-2xl font-bold text-primary">
                Your Baking Slot is Booked!
              </h3>
              <p className="font-sans text-xs text-on-surface-variant">
                We've locked in your recipe slot. A sweet confirmation slip has been logged under ID: <strong className="text-primary font-bold">{submittedOrder.id}</strong>.
              </p>
            </div>

            {/* Structured Recipe Summary */}
            <div className="bg-[#fff8f5] p-5 rounded-2xl text-left border border-primary-container/20 text-xs space-y-2 font-mono divide-y divide-primary-container/20">
              <div className="py-1.5 flex justify-between"><span className="text-on-surface-variant">Baker Code:</span> <span className="font-bold text-primary">{submittedOrder.id}</span></div>
              <div className="py-1.5 flex justify-between"><span className="text-on-surface-variant">Recipient:</span> <span className="font-bold">{submittedOrder.customer.name}</span></div>
              <div className="py-1.5 flex justify-between"><span className="text-on-surface-variant">Selected Base:</span> <span className="font-bold">{submittedOrder.customization.category.toUpperCase()} ({submittedOrder.customization.baseFlavor})</span></div>
              <div className="py-1.5 flex justify-between"><span className="text-on-surface-variant">Frosting Color:</span> <span className="font-bold">{submittedOrder.customization.baseColorName}</span></div>
              <div className="py-1.5 flex justify-between"><span className="text-on-surface-variant">Dietary Preference:</span> <span className="font-bold">{submittedOrder.customization.dietary}</span></div>
              {submittedOrder.customization.messageOnCake && (
                <div className="py-1.5 flex justify-between text-pink-700 italic"><span className="text-on-surface-variant">Topper Inscription:</span> <span>"{submittedOrder.customization.messageOnCake}"</span></div>
              )}
              <div className="py-1.5 flex justify-between">
                <span className="text-on-surface-variant">Dispatch:</span> 
                <span className="font-bold flex items-center gap-1">
                  {submittedOrder.customer.deliveryType === 'delivery' ? (
                    <>
                      <Truck size={13} className="text-primary" />
                      <span>Home Delivery</span>
                    </>
                  ) : (
                    <>
                      <Store size={13} className="text-primary" />
                      <span>Studio Self-Pickup</span>
                    </>
                  )}
                </span>
              </div>
              <div className="py-2 flex justify-between text-base font-bold text-primary pt-3"><span className="font-display uppercase tracking-wider text-xs">Settled Total:</span> <span>₹{submittedOrder.totalPrice}</span></div>
            </div>

            <div className="pt-2 space-y-3">
              <a
                href={(() => {
                  const orderDetails = `Hi Krish Dreamy Delight!
I want to place an order:

- Category: ${submittedOrder.customization.category}
- Flavour: ${submittedOrder.customization.baseFlavor}
- Price: ₹${submittedOrder.totalPrice}
- Shape: ${submittedOrder.customization.shape}
- Size: ${submittedOrder.customization.size}
- Cream: ${submittedOrder.customization.frostingType}
- Theme: ${submittedOrder.customization.occasion}
- Stickers: ${submittedOrder.customization.toppings.join(', ') || 'None'}
- Toppings: ${submittedOrder.customization.toppings.join(', ') || 'None'}
- Occasion: ${submittedOrder.customization.occasion}
- Diet: ${submittedOrder.customization.dietary}
- Name on cake: ${submittedOrder.customization.messageOnCake || 'None'}
- Delivery date: ${submittedOrder.customization.deliveryDate}

Please confirm availability!`;
                  return `https://wa.me/919865621880?text=${encodeURIComponent(orderDetails)}`;
                })()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase rounded-full shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer text-center"
              >
                <MessageSquare size={14} className="stroke-[2.5]" />
                Direct Message Order details to Baker (WhatsApp DM)
              </a>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={resetBuilder}
                  className="flex-1 py-3 bg-primary text-white text-xs font-bold uppercase rounded-full shadow-md hover:bg-[#6b3741] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Bake Another Custom Order
                </button>
                <button
                  onClick={() => {
                    const dashboard = document.getElementById('admin-dashboard');
                    if (dashboard) {
                      dashboard.classList.remove('hidden');
                      dashboard.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex-1 py-3 bg-[#fff8f5] text-primary border border-primary/20 text-xs font-bold uppercase rounded-full hover:bg-primary-container/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Inspect Live Order Queue
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Two-Column Creator Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Controls & Selections (Col 7) */}
            <div className="lg:col-span-7 bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-primary-container/40 flex flex-col min-h-[580px] shadow-sm">
              
              {/* Stepper Header Metrics */}
              <div className="mb-6 flex justify-between items-center bg-[#fff8f5] p-3 rounded-2xl border border-primary/5">
                <div>
                  <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest block">
                    STAGE {step} OF 14
                  </span>
                  <span className="font-display text-sm font-bold text-primary block mt-0.5">
                    {
                      [
                        "Choose Dessert Style",
                        "Portions & Physical Sizing",
                        "Artisanal Sponge Flavor",
                        "Frosting Outer Dress Color",
                        "Dietary Preference",
                        "Inner Layer Cake Filling",
                        "Calibrated Sweetness Level",
                        "Frosting Texture Coat",
                        "Gourmet Crown Toppings",
                        "Special Occasion Theme",
                        "Frosting Letter Message",
                        "Date Booking Slot",
                        "Delivery Mode & Address",
                        "Slab Recipe Overlook"
                      ][step - 1]
                    }
                  </span>
                </div>
                <div className="w-14 h-1.5 bg-primary-container/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(step / 14) * 100}%` }}
                  />
                </div>
              </div>

              {/* Dynamic STEP Option Bodies */}
              <div className="flex-grow space-y-4">
                
                {/* STEP 1: Category Selection */}
                {step === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="font-display font-bold text-lg text-primary">Choose Your Desserts Base</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Choose from our whimsical range of sweet bakes, customized fresh to order.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                      {[
                        { id: 'cake', title: 'Fresh Cream Cake', desc: 'Beautiful custom layered frosting birthday & celebration mainstays from ₹500', icon: CakeIcon },
                        { id: 'cupcake', title: 'Cupcake', desc: 'Cute single-serving whipped cream frosted delights from ₹80', icon: CakeIcon },
                        { id: 'muffin', title: 'Muffin', desc: 'Warm local berry-studded soft morning bakes from ₹90', icon: Sparkles },
                        { id: 'tres_leches', title: 'Tres Leches', desc: 'Rich, moisture layers of three milks soaked sponge cake from ₹350', icon: CakeIcon },
                        { id: 'cookies', title: 'Cookies', desc: 'Crisp, premium hand-scooped chocolate chip bakery cookies from ₹60', icon: Cookie },
                        { id: 'brownie', title: 'Fudgy Brownies', desc: 'Deep organic chocolate fudge squares drizzled with toppings from ₹350', icon: Cookie }
                      ].map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setCustomization(prev => ({ ...prev, category: cat.id as any }));
                              nextStep();
                            }}
                            className={`p-5 rounded-2xl border-2 text-left flex flex-col gap-3 transition-all cursor-pointer hover:scale-[1.02] ${
                              customization.category === cat.id
                                ? 'border-primary bg-primary-container/15 font-bold'
                                : 'border-outline-variant bg-white/50'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center p-2 text-primary shrink-0">
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-sm text-primary">{cat.title}</h4>
                              <span className="text-[10px] text-on-surface-variant leading-relaxed block mt-0.5">{cat.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: Shape Choice */}
                {step === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="font-display font-bold text-lg text-primary">Portion Shape Design</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Choose the geometric canvas for your custom hand-made bake.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      {[
                        { id: 'round', name: 'Classic Round', desc: 'Traditional elegant circle', element: <div className="w-5 h-5 rounded-full border-2 border-current" /> },
                        { id: 'heart', name: 'Sweet Heart', desc: 'Perfect romantic choice', element: <Heart className="w-5 h-5 fill-current" /> },
                        { id: 'square', name: 'Modern Square', desc: 'Bold contemporary finish', element: <div className="w-5 h-5 border-2 border-current rounded-xs" /> }
                      ].map((sh) => (
                        <button
                          key={sh.name}
                          type="button"
                          onClick={() => setCustomization(prev => ({ ...prev, shape: sh.name }))}
                          className={`p-5 rounded-2xl border-2 text-left flex flex-col gap-3 transition-all cursor-pointer hover:scale-[1.02] ${
                            customization.shape === sh.name
                              ? 'border-primary bg-primary-container/15 font-bold text-primary shadow-[0_4px_12px_rgba(219,39,119,0.1)]'
                              : 'border-outline-variant bg-white/50 text-neutral-600'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            {sh.element}
                          </div>
                          <div>
                            <h4 className="font-display font-semibold text-sm text-primary">{sh.name}</h4>
                            <span className="text-[10px] text-on-surface-variant leading-tight block mt-1">{sh.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: Size Choice with Prices */}
                {step === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="font-display font-bold text-lg text-primary">Physical Sizing & Serving Yield</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Calibrate the portion size to fit your guest list perfectly. Price adjusts automatically!
                    </p>
                    <div className="grid grid-cols-1 gap-3 pt-2">
                      {(() => {
                        const getAvailableSizes = () => {
                          if (customization.category === 'cake') {
                            return [
                              { name: '500g Portion (approx. 4-6 servings)', desc: 'Base Price × 0.6 multiplier', priceLabel: '0.6x base' },
                              { name: '1kg Portion (approx. 8-12 servings)', desc: 'Standard weight - Base Price × 1.0', priceLabel: '1.0x base' },
                              { name: '2kg Portion (approx. 16-20 servings)', desc: 'Large celebration - Base Price × 1.8', priceLabel: '1.8x base' }
                            ];
                          } else if (customization.category === 'brownie') {
                            return [
                              { name: '600g Slab (Box of 6-9 pieces)', desc: 'Freshly baked organic chocolate brownie slab', priceLabel: '₹750' }
                            ];
                          } else if (customization.category === 'cupcake' || customization.category === 'muffin' || customization.category === 'cookies') {
                            return [
                              { name: 'Single Portion', desc: 'Just a single fresh bake', priceLabel: '1x base' },
                              { name: 'Box of 6 Pack', desc: 'Sweet savings - 6x base price', priceLabel: '6x base' },
                              { name: 'Box of 12 Party', desc: 'Grand pack - 11x base price (1 free!)', priceLabel: '11x base' }
                            ];
                          } else if (customization.category === 'tres_leches') {
                            return [
                              { name: 'Single Cup serving', desc: 'Moist and delicious single portion', priceLabel: '1x base' },
                              { name: 'Medium Tub (0.5kg)', desc: 'Perfect sharing tub - 2x base price', priceLabel: '2x base' },
                              { name: 'Party Bowl (1kg)', desc: 'Grand feast bowl - 3.5x base price', priceLabel: '3.5x base' }
                            ];
                          }
                          return [
                            { name: 'Standard Portion', desc: 'Standard single piece serving', priceLabel: '1.0x base' }
                          ];
                        };
                        return getAvailableSizes().map((sizeItem) => {
                          const isSelected = customization.size === sizeItem.name;
                          return (
                            <button
                              key={sizeItem.name}
                              type="button"
                              onClick={() => {
                                setCustomization(prev => ({ ...prev, size: sizeItem.name }));
                              }}
                              className={`p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-primary bg-primary-container/15 font-bold'
                                  : 'border-outline-variant/55 bg-white/50'
                              }`}
                            >
                              <div>
                                <span className="font-display text-xs text-primary block">{sizeItem.name}</span>
                                <span className="text-[10px] text-on-surface-variant font-normal block">{sizeItem.desc}</span>
                              </div>
                              <span className="text-xs text-pink-500 font-bold">
                                {sizeItem.priceLabel}
                              </span>
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}

                {/* STEP 4: FLAVOUR Selection with groups */}
                {step === 4 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="font-display font-bold text-lg text-primary">Select Custom Flavour</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Each recipe is hand-whipped fresh by standard premium menu criteria.
                    </p>

                    <div className="space-y-6 max-h-[320px] overflow-y-auto pr-1">
                      {Object.keys(FLAVOUR_GROUPS)
                        .filter(groupName => {
                          if (customization.category === 'cake') {
                            return ['EVERYDAY CLASSICS', 'PREMIUM FAVOURITES', 'CHOCOLATE & FUSION', 'CELEBRATION SPECIALS'].includes(groupName);
                          } else if (customization.category === 'brownie') {
                            return groupName === 'BROWNIES';
                          } else if (customization.category === 'cupcake') {
                            return groupName === 'CUPCAKES';
                          } else if (customization.category === 'muffin') {
                            return groupName === 'MUFFINS';
                          } else if (customization.category === 'tres_leches') {
                            return groupName === 'TRES LECHES';
                          } else if (customization.category === 'cookies') {
                            return groupName === 'COOKIES';
                          }
                          return true;
                        })
                        .map(groupName => (
                          <div key={groupName} className="space-y-2">
                            <h4 className="text-[10px] font-bold tracking-wider text-primary/70 uppercase">
                              {groupName}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {FLAVOUR_GROUPS[groupName].map(flav => {
                                const isSelected = customization.baseFlavor === flav.name;
                                return (
                                  <button
                                    key={flav.name}
                                    type="button"
                                    onClick={() => {
                                      setCustomization(prev => ({
                                        ...prev,
                                        baseFlavor: flav.name,
                                        baseColor: flav.color,
                                        baseColorName: flav.name
                                      }));
                                    }}
                                    className={`p-3 rounded-xl border-2 text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                                      isSelected
                                        ? 'border-yellow-400 bg-amber-50/40 shadow-[0_0_12px_rgba(250,204,21,0.4)] scale-[1.01]'
                                        : 'border-outline-variant/50 bg-white/50 hover:bg-neutral-50/50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-4 h-4 rounded-full border border-primary/10 shadow-inner shrink-0" style={{ backgroundColor: flav.color }} />
                                      <span className="font-display text-xs font-bold text-slate-800">
                                        {flav.name}
                                      </span>
                                    </div>
                                    <span className="text-xs font-bold text-pink-500 shrink-0">
                                      ₹{flav.price}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: Dietary */}
                {step === 5 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Dietary Adaptations</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      We offer fully isolated sanitary workstations for special baker requests (eggless sponge, zero gluten flour blends).
                    </p>
                    <div className="grid grid-cols-1 gap-2.5 pt-1">
                      {options.dietary.map((diet) => (
                        <button
                          key={diet.id}
                          onClick={() => setCustomization({ ...customization, dietary: diet.name })}
                          className={`p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all cursor-pointer ${
                            customization.dietary === diet.name
                              ? 'border-primary bg-primary-container/15'
                              : 'border-outline-variant/50 bg-white/50'
                          }`}
                        >
                          <div>
                            <span className="font-display text-xs font-bold text-primary block">{diet.name}</span>
                            {diet.description && (
                              <span className="text-[10px] text-on-surface-variant block">{diet.description}</span>
                            )}
                          </div>
                          <span className="text-xs text-primary font-bold">
                            {diet.price === 0 ? '₹0' : `+₹${diet.price}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: Layer Filings */}
                {step === 6 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Interior Core Sponge Layer Filling</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Gourmet premium fillings stuffed cleanly between sponge cake bread decks.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {options.fillings.map((fil) => (
                        <button
                          key={fil.id}
                          onClick={() => setCustomization({ ...customization, fillings: fil.name })}
                          className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                            customization.fillings === fil.name
                              ? 'border-primary bg-primary-container/15 font-bold'
                              : 'border-outline-variant/40 bg-white/40'
                          }`}
                        >
                          <span className="font-display text-xs text-primary">{fil.name}</span>
                          <span className="text-[10px] text-on-surface-variant font-semibold">
                            {fil.price === 0 ? '₹0' : `+₹${fil.price}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 7: Sweetness Level */}
                {step === 7 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Calibrated Sweetness Level</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Choose how much sugar or stevia sweet index to apply.
                    </p>
                    <div className="grid grid-cols-1 gap-3 pt-2">
                      {options.sweetness.map((swt) => (
                        <button
                          key={swt.id}
                          onClick={() => setCustomization({ ...customization, sweetness: swt.name })}
                          className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            customization.sweetness === swt.name
                              ? 'border-primary bg-primary-container/15'
                              : 'border-outline-variant/50 bg-white/50'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <div>
                              <span className="font-display text-xs font-bold text-primary block">{swt.name}</span>
                              {swt.description && (
                                <span className="text-[10px] text-on-surface-variant block">{swt.description}</span>
                              )}
                            </div>
                            {swt.price > 0 && (
                              <span className="text-xs font-bold text-primary shrink-0 ml-2">
                                +₹{swt.price}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 8: Frosting type */}
                {step === 8 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Outer Body Frosting Texture coat</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Swiss buttercreams provide heavy piping options while whipped cream is fluffy and feather-light.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {options.frostings.map((fs) => (
                        <button
                          key={fs.id}
                          onClick={() => setCustomization({ ...customization, frostingType: fs.name })}
                          className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                            customization.frostingType === fs.name
                              ? 'border-primary bg-primary-container/15'
                              : 'border-outline-variant/40 bg-white/40'
                          }`}
                        >
                          <div>
                            <span className="font-display text-xs font-bold text-primary block">{fs.name}</span>
                            {fs.description && (
                              <span className="text-[10px] text-on-surface-variant block">{fs.description}</span>
                            )}
                          </div>
                          <span className="text-xs text-primary font-bold mt-2 block">
                            {fs.price === 0 ? '₹0' : `+₹${fs.price}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 9: Toppings */}
                {step === 9 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-display font-bold text-lg text-primary">Gourmet Toppings (Multi-Select)</h3>
                      <span className="text-[10px] bg-primary/10 text-primary uppercase p-1 px-2.5 rounded-full font-bold">
                        Add Multiple
                      </span>
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Decorate the top and side panels! Watch stars, berries, and butterflies appear on the live review cake.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {options.toppings.map((top) => {
                        const isChosen = customization.toppings.includes(top.name);
                        return (
                          <button
                            key={top.id}
                            onClick={() => handleToppingToggle(top.name)}
                            className={`p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all cursor-pointer ${
                              isChosen
                                ? 'border-primary bg-primary-container/15 font-bold'
                                : 'border-outline-variant/40 bg-white/40'
                            }`}
                          >
                            <span className="font-display text-xs text-primary">{top.name}</span>
                            <span className="text-[10px] text-on-surface-variant font-bold">
                              {top.price === 0 ? '₹0' : `+₹${top.price}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 10: Occasion */}
                {step === 10 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Special Occasion Theme</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      This helps our kitchen team select custom box ribbons and visual design matches.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {[
                        "Birthday Celebration",
                        "Anniversary Milestone",
                        "Grand Wedding Reception",
                        "Baby Shower Welcome",
                        "Sweet Graduation Party",
                        "Just Because / Sweet Tooth"
                      ].map((occ) => (
                        <button
                          key={occ}
                          onClick={() => setCustomization({ ...customization, occasion: occ })}
                          className={`p-4 rounded-2xl border-2 text-center text-xs font-semibold flex items-center justify-center min-h-[70px] transition-all cursor-pointer ${
                            customization.occasion === occ
                              ? 'border-primary bg-primary-container/20 text-primary font-bold scale-[1.03]'
                              : 'border-outline-variant/40 bg-white/30 text-on-surface'
                          }`}
                        >
                          {occ}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 11: Personal message */}
                {step === 11 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Letter Message On Sponge Cake</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      We'll hand-pipe this cleanly on top of the cake. Watch it appear on the live preview cylinder!
                    </p>
                    <div className="pt-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
                        Piped Text (Max 30 Characters)
                      </label>
                      <input 
                        type="text"
                        value={customization.messageOnCake}
                        onChange={(e) => setCustomization({ ...customization, messageOnCake: e.target.value.slice(0, 30) })}
                        placeholder="Happy Birthday Sarah!"
                        className="w-full p-4 rounded-xl border border-primary/20 bg-white/70 text-on-surface font-semibold placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 12: Delivery Date & Slot */}
                {step === 12 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Delivery Date & Precise Time Slot</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Cakes are baked 3 hours prior to dispatch to preserve exquisite flavor. Minimum 24 hour booking is recommended.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
                          Select Delivery Date
                        </label>
                        <div className="relative">
                          <input 
                            type="date"
                            value={customization.deliveryDate}
                            onChange={(e) => setCustomization({ ...customization, deliveryDate: e.target.value })}
                            className="w-full p-3 border border-primary/10 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
                          Select Time Session Slot
                        </label>
                        <select
                          value={customization.deliveryTimeSlot}
                          onChange={(e) => setCustomization({ ...customization, deliveryTimeSlot: e.target.value })}
                          className="w-full p-3 border border-primary/10 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold"
                        >
                          <option>Morning Breakfast (09:00 AM - 12:00 PM)</option>
                          <option>Hi-Noon Lunch (12:00 PM - 03:00 PM)</option>
                          <option>High Tea Evening (03:00 PM - 06:00 PM)</option>
                          <option>Evening Twilight (06:00 PM - 09:00 PM)</option>
                          <option>Midnight Birthday Surprise (09:00 PM - 11:59 PM) (+₹150)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 13: Delivery Mode & Customer Details */}
                {step === 13 && (
                  <form className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Client Details & Dispatch Mode</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Please enter delivery details to finalize pricing.
                    </p>
                    
                    {/* Toggle Pickup vs Delivery */}
                    <div className="grid grid-cols-2 gap-3 pb-2">
                      <button
                        type="button"
                        onClick={() => setCustomer({ ...customer, deliveryType: 'pickup' })}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          customer.deliveryType === 'pickup'
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-white text-on-surface border-[#d6c2c3]/60 hover:bg-neutral-50'
                        }`}
                      >
                        <Store size={15} />
                        Self-Pickup from Studio (Free)
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomer({ ...customer, deliveryType: 'delivery' })}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          customer.deliveryType === 'delivery'
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-white text-on-surface border-[#d6c2c3]/60 hover:bg-neutral-50'
                        }`}
                      >
                        <Truck size={15} />
                        Home Delivery (+₹80)
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-[#874e58] uppercase text-[10px]">Your Name</label>
                        <input 
                          type="text"
                          required
                          value={customer.name}
                          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                          className="w-full p-2.5 rounded-xl border-2 border-outline-variant/40 bg-white"
                          placeholder="Rahul Sharma"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-[#874e58] uppercase text-[10px]">Email Address</label>
                        <input 
                          type="email"
                          required
                          value={customer.email}
                          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                          className="w-full p-2.5 rounded-xl border-2 border-outline-variant/40 bg-white"
                          placeholder="rahul@example.com"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-[#874e58] uppercase text-[10px]">Phone Number</label>
                        <input 
                          type="tel"
                          required
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          className="w-full p-2.5 rounded-xl border-2 border-outline-variant/40 bg-white"
                          placeholder="98656 21880"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-[#874e58] uppercase text-[10px]">Special Custom Demands</label>
                        <textarea 
                          rows={1}
                          value={customization.specialInstructions}
                          onChange={(e) => setCustomization({ ...customization, specialInstructions: e.target.value })}
                          className="w-full p-2 rounded-xl border-2 border-outline-variant/40 bg-white"
                          placeholder="Please pack strawberries on side..."
                        />
                      </div>
                    </div>

                    {customer.deliveryType === 'delivery' && (
                      <div className="space-y-1 text-xs text-left">
                        <label className="font-bold text-[#874e58] uppercase text-[10px]">Home Street Address Location</label>
                        <input 
                          type="text"
                          required
                          value={customer.address}
                          onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                          className="w-full p-2.5 rounded-xl border-2 border-outline-variant/40 bg-white"
                          placeholder="Apt-402, Signature Residency, Connaught Place, New Delhi"
                        />
                      </div>
                    )}
                  </form>
                )}

                {/* STEP 14: Final Invoice Review */}
                {step === 14 && (
                  <div className="space-y-4 text-xs font-sans text-left">
                    <h3 className="font-display font-bold text-lg text-primary text-center">Verify Selected Slab Recipe</h3>
                    <p className="font-sans text-[11px] text-on-surface-variant text-center">
                      Review your summary instructions before submitting baking request to kitchen.
                    </p>

                    <div className="bg-white/90 p-4 rounded-2xl border border-primary/10 max-h-[250px] overflow-y-auto space-y-2 divide-y divide-[#ffade]/20">
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Selected Base:</span> <span className="font-bold uppercase">{customization.category}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Size Scale:</span> <span className="font-bold">{customization.size}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Baked Sponge Flavor:</span> <span className="font-bold">{customization.baseFlavor}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Frosting Style Color:</span> <span className="font-bold">{customization.baseColorName}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Dietary Adjustment:</span> <span className="font-bold">{customization.dietary}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Sponge Core Filling:</span> <span className="font-bold">{customization.fillings}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Sweet Index Level:</span> <span className="font-bold">{customization.sweetness}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Icing Surface Coat:</span> <span className="font-bold">{customization.frostingType}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Toppings loaded:</span> <span className="font-bold max-w-[170px] truncate block text-right">{customization.toppings.join(', ')}</span></div>
                      <div className="flex justify-between py-1 text-pink-700 italic"><span className="text-on-surface-variant font-semibold">Frosting Message:</span> <span className="font-bold">"{customization.messageOnCake || 'None'}"</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Occasion Intended:</span> <span className="font-bold">{customization.occasion}</span></div>
                      <div className="flex justify-between py-1 text-secondary"><span className="text-on-surface-variant">Dispatch:</span> <span className="font-bold uppercase">{customer.deliveryType}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">DateTime Schedule:</span> <span className="font-bold text-slate-800">{customization.deliveryDate} @ {customization.deliveryTimeSlot.slice(0, 15)}</span></div>
                    </div>
                  </div>
                )}

              </div>

              {/* Validation errors */}
              {validationError && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 text-xs font-semibold animate-pulse border border-red-200">
                  <HelpCircle size={15} />
                  {validationError}
                </div>
              )}

              {/* Control Panel Nav Buttons */}
              <div className="mt-8 pt-4 border-t border-[#d6c2c3]/50 flex justify-between items-center bg-white/40 p-2 rounded-2xl">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className="px-5 py-2.5 rounded-full text-xs font-bold border border-outline-variant/60 text-on-surface-variant hover:bg-[#ffeade]/30 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer flex items-center gap-1 transition-all"
                  id="btn-prev"
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>

                {step < 14 ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md hover:bg-[#6b3741] active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1"
                    id="btn-next"
                  >
                    Next Step
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitOrder}
                    className="px-8 py-3 bg-primary text-white font-bold text-sm tracking-wider uppercase rounded-full shadow-lg hover:bg-[#6b3741] animate-pulse transition-all cursor-pointer flex items-center gap-1"
                    id="btn-checkout"
                  >
                    <ShoppingBag size={16} />
                    Submit Custom Recipe Request
                  </button>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Live Interactive Aesthetic Preview (Col 5) */}
            <div className="lg:col-span-5 bg-gradient-to-tr from-white to-[#fff8f5] border border-primary-container/40 rounded-3xl p-6 flex flex-col items-center justify-between min-h-[580px] shadow-pink relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/20 filter blur-xl rounded-full" />
              
              <div className="text-center">
                <span className="p-1 px-3 bg-[#e9c400]/10 text-amber-700 text-[10px] font-bold rounded-full tracking-wider uppercase inline-block">
                  Aesthetic Preview Layer
                </span>
                <h3 className="font-display text-sm font-bold text-primary mt-1">
                  Active Confection Configuration
                </h3>
              </div>

              {/* The Visual Cake Stack Object */}
              <div className="relative w-64 h-64 flex items-center justify-center animate-float">
                {/* Visual shadow glow */}
                <div className="w-52 h-6 bg-primary/10 rounded-full blur-md absolute bottom-2 pointer-events-none" />

                <svg 
                  id="cake-svg" 
                  viewBox="0 0 200 220"
                  width="200" 
                  height="220"
                  className="relative z-10 filter drop-shadow-md"
                >
                  <rect 
                    id="sv-base" 
                    x="20" y="140" 
                    width="160" height="60"
                    rx="8" fill="#FFB6C1"
                    style={{ transition: 'fill 0.5s' }}
                  />
                    
                  <ellipse 
                    id="sv-base-top"
                    cx="100" cy="140"
                    rx="80" ry="12"
                    fill="#FF69B4"
                    style={{ transition: 'fill 0.5s' }}
                  />
                    
                  <rect 
                    id="sv-top"
                    x="45" y="90"
                    width="110" height="50"
                    rx="8" fill="#FFB6C1"
                    style={{ transition: 'fill 0.5s' }}
                  />
                    
                  <ellipse 
                    id="sv-top-top"
                    cx="100" cy="90"
                    rx="55" ry="10"
                    fill="#FF69B4"
                    style={{ transition: 'fill 0.5s' }}
                  />
                    
                  <rect 
                    id="sv-cream"
                    x="45" y="83"
                    width="110" height="10"
                    rx="5" fill="white"
                    opacity="0"
                    style={{ transition: 'opacity 0.5s' }}
                  />
                    
                  <text 
                    id="sv-name"
                    x="100" y="175"
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="cursive"
                    fill="white"
                    fontWeight="bold"
                  />
                    
                  <text 
                    id="sv-topper"
                    x="100" y="70"
                    textAnchor="middle"
                    fontSize="20"
                    opacity="0"
                    style={{ transition: 'opacity 0.3s' }}
                  />
                    
                  <text 
                    id="sv-badge"
                    x="170" y="155"
                    fontSize="14"
                    opacity="0"
                    style={{ transition: 'opacity 0.3s' }}
                  />
                </svg>
              </div>

              {/* Computed live invoice ticker badge pricing */}
              <div className="w-full bg-[#ffeade]/60 hover:bg-[#ffeade]/80 rounded-2xl p-4 border border-primary/5 text-center mt-4 transition-all" id="estimated-total-container">
                <span className="text-[10px] text-[#847375] font-extrabold uppercase tracking-widest block">
                  Estimated Total
                </span>
                <span className="font-display text-2xl font-black text-primary block mt-1 hover:scale-105 transition-transform duration-205">
                  ₹{calculatePrice()}
                </span>
                <span className="text-[9px] text-[#847375] font-semibold block uppercase">
                  (Includes taxes, FSSAI certified slab slot)
                </span>
              </div>

            </div>

          </div>
        )}
      </div>
    </section>
  );
}
