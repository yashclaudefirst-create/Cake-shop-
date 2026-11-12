import React, { useState } from 'react';
import { 
  CakeCustomization, 
  CustomerDetails, 
  Order, 
  CakeBuilderOptions, 
  WebsiteConfig, 
  CakeSlot 
} from '../types';
import { 
  Cake as CakeIcon, 
  Calendar, 
  Clock, 
  Check, 
  Sparkles, 
  Phone, 
  User, 
  MapPin, 
  Truck, 
  Store, 
  MessageSquare, 
  Send,
  ArrowRight,
  ArrowLeft,
  Heart,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import Cake3DPreview from './Cake3DPreview';

interface CakeBuilderProps {
  onOrderAdded: (newOrder: Order) => void;
  builderOptions?: CakeBuilderOptions;
  websiteConfig?: WebsiteConfig;
  cakeSlots?: CakeSlot[];
  onSlotBooked?: (slotId: string) => void;
}

const INITIAL_CUSTOMER: CustomerDetails = {
  name: '',
  email: '',
  phone: '',
  address: '',
  deliveryType: 'pickup'
};

const POPULAR_FLAVORS = [
  { name: 'Classic Vanilla', category: 'cake', price: 600, color: '#FFF8DC', desc: 'Madagascar vanilla with light sponge' },
  { name: 'Rich Belgian Chocolate', category: 'cake', price: 750, color: '#4A2C2A', desc: 'Dense dark chocolate with silky fudge' },
  { name: 'Velvety Red Velvet', category: 'cake', price: 850, color: '#8B0000', desc: 'Classic cocoa sponge with rich cream' },
  { name: 'Butterscotch Crunch', category: 'cake', price: 850, color: '#DAA520', desc: 'Caramelized praline crunch and cream' },
  { name: 'Real Fruit Mango', category: 'cake', price: 950, color: '#FFD700', desc: 'Seasonal fresh fruit puree and whipped cream' },
  { name: 'Manju Signature Chocolate Drip', category: 'cake', price: 950, color: '#2C1810', desc: "Chef's signature chocolate drip cake with rosettes" },
  { name: 'Fudgy Brownie Slab (600g)', category: 'brownie', price: 750, color: '#1A0A00', desc: 'Thick, chewy dark chocolate walnut brownie' },
  { name: 'Cashew Butter Cookies Box', category: 'cookies', price: 450, color: '#D2691E', desc: '100% cow butter with roasted cashew bites' }
];

const SIZES = [
  { name: 'Small (0.5kg)', priceMultiplier: 0.65, desc: '4-6 servings' },
  { name: 'Standard (1.0kg)', priceMultiplier: 1.0, desc: '8-12 servings' },
  { name: 'Large (2.0kg)', priceMultiplier: 1.9, desc: '16-20 servings' },
  { name: 'Double Tier (3.0kg+)', priceMultiplier: 3.0, desc: 'Celebration showstopper' }
];

export default function CakeBuilder({ 
  onOrderAdded, 
  builderOptions, 
  websiteConfig,
  cakeSlots = [],
  onSlotBooked 
}: CakeBuilderProps) {

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFlavor, setSelectedFlavor] = useState(POPULAR_FLAVORS[1]); // Belgian Chocolate default
  const [selectedSize, setSelectedSize] = useState(SIZES[1]); // 1.0kg
  const [isEggless, setIsEggless] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(() => {
    const active = cakeSlots.find(s => s.isActive && (s.maxCapacity - s.bookedCount) > 0);
    return active ? active.id : '';
  });
  const [customDate, setCustomDate] = useState(() => {
    const d = new Date(Date.now() + 86400000);
    return d.toISOString().split('T')[0];
  });
  const [customTime, setCustomTime] = useState('10:00 AM - 01:00 PM');
  const [messageOnCake, setMessageOnCake] = useState('');
  const [customer, setCustomer] = useState<CustomerDetails>(INITIAL_CUSTOMER);
  const [specialNotes, setSpecialNotes] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  // Active cake slot object
  const activeSlot = cakeSlots.find(s => s.id === selectedSlotId);

  // Price calculation
  const calculateTotal = (): number => {
    let base = Math.round(selectedFlavor.price * selectedSize.priceMultiplier);
    if (isEggless) base += 50;
    if (customer.deliveryType === 'delivery') base += 80;
    return base;
  };

  const totalPrice = calculateTotal();

  const handleNextStep = () => {
    setValidationError('');
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!selectedSlotId && !customDate) {
        setValidationError('Please select a cake baking slot or custom delivery date.');
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setValidationError('');
    setStep(prev => (prev === 3 ? 2 : 1));
  };

  const buildOrderObject = (): Order => {
    const deliveryDate = activeSlot ? activeSlot.date : customDate;
    const deliverySlot = activeSlot ? activeSlot.timeWindow : customTime;

    const customization: CakeCustomization = {
      category: selectedFlavor.category as any,
      shape: 'Classic Round',
      size: selectedSize.name,
      baseFlavor: selectedFlavor.name,
      baseColor: selectedFlavor.color,
      baseColorName: selectedFlavor.name,
      dietary: isEggless ? '100% Pure Eggless' : 'Standard Cream Base',
      fillings: 'Belgian Fudge',
      sweetness: 'Standard Sweetness',
      frostingType: 'Light Whipped Frosting',
      toppings: ['Fresh Cream Rosettes', 'Chocolate Drip'],
      occasion: 'Celebration',
      messageOnCake: messageOnCake.trim(),
      deliveryDate: deliveryDate,
      deliveryTimeSlot: deliverySlot,
      slotId: activeSlot ? activeSlot.id : undefined,
      specialInstructions: specialNotes.trim()
    };

    return {
      id: `KDD-${Math.floor(10000 + Math.random() * 90000)}`,
      customization,
      customer,
      totalPrice,
      status: 'Received',
      createdAt: new Date().toLocaleString('en-US', { hour12: true }),
      slotId: activeSlot ? activeSlot.id : undefined
    };
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim()) return setValidationError('Please enter your name.');
    if (!customer.phone.trim() || customer.phone.length < 8) return setValidationError('Please enter a valid phone number.');
    if (customer.deliveryType === 'delivery' && !customer.address.trim()) return setValidationError('Please provide your delivery address.');

    const newOrder = buildOrderObject();
    onOrderAdded(newOrder);

    if (activeSlot && onSlotBooked) {
      onSlotBooked(activeSlot.id);
    }

    setSubmittedOrder(newOrder);
  };

  const handleWhatsAppOrder = () => {
    if (!customer.name.trim()) return setValidationError('Please enter your name before ordering.');
    if (!customer.phone.trim()) return setValidationError('Please enter your phone number.');

    const newOrder = buildOrderObject();
    onOrderAdded(newOrder);

    if (activeSlot && onSlotBooked) {
      onSlotBooked(activeSlot.id);
    }

    setSubmittedOrder(newOrder);

    const waNum = websiteConfig?.whatsappNumber || '919865621880';
    const text = encodeURIComponent(
      `Hello Krish Dreamy Delight! 🍰\n\nI want to book a cake:\n• Order ID: ${newOrder.id}\n• Flavour: ${selectedFlavor.name}\n• Size: ${selectedSize.name}\n• Diet: ${isEggless ? 'Pure Eggless' : 'Standard'}\n• Slot: ${activeSlot ? `${activeSlot.title} (${activeSlot.date} @ ${activeSlot.timeWindow})` : `${customDate} @ ${customTime}`}\n• Inscription: "${messageOnCake || 'None'}"\n• Total: ₹${totalPrice}\n• Name: ${customer.name}\n• Phone: ${customer.phone}\n• Method: ${customer.deliveryType === 'delivery' ? `Delivery (${customer.address})` : 'Self Pickup'}\n\nPlease confirm my baking slot!`
    );

    window.open(`https://wa.me/${waNum}?text=${text}`, '_blank');
  };

  const resetForm = () => {
    setSubmittedOrder(null);
    setStep(1);
    setMessageOnCake('');
    setCustomer(INITIAL_CUSTOMER);
    setSpecialNotes('');
  };

  return (
    <section id="builder" className="py-20 bg-gradient-to-b from-white via-[#fff8f5] to-white select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <span className="p-1 px-3.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full tracking-widest uppercase inline-block">
            Easy 3-Step Cake Booking
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary tracking-tight">
            Reserve Your Fresh Cake Slot
          </h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-lg mx-auto font-medium">
            Handmade from scratch for your special celebration. Pick your flavor, reserve your daily slot, and enjoy warm oven-fresh quality.
          </p>
        </div>

        {/* ORDER SUCCESS DISPLAY */}
        {submittedOrder ? (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border-2 border-emerald-300 shadow-xl text-center space-y-6 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Booking Confirmed • {submittedOrder.id}
              </span>
              <h3 className="font-display text-2xl font-black text-primary">
                Thank You, {submittedOrder.customer.name}!
              </h3>
              <p className="font-sans text-xs text-zinc-650 max-w-md mx-auto leading-relaxed">
                Your cake slot has been successfully scheduled at Krish Dreamy Delight. Chef Krish has logged your recipe into the kitchen batch!
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#fff8f5] p-5 rounded-2xl border border-primary/10 text-left text-xs space-y-2 font-sans">
              <div className="flex justify-between border-b border-[#d6c2c3]/40 pb-2">
                <span className="text-zinc-500 font-bold uppercase text-[10px]">Item / Flavour:</span>
                <span className="font-bold text-primary">{submittedOrder.customization.baseFlavor}</span>
              </div>
              <div className="flex justify-between border-b border-[#d6c2c3]/40 pb-2">
                <span className="text-zinc-500 font-bold uppercase text-[10px]">Portion & Diet:</span>
                <span className="font-semibold">{submittedOrder.customization.size} • {submittedOrder.customization.dietary}</span>
              </div>
              <div className="flex justify-between border-b border-[#d6c2c3]/40 pb-2">
                <span className="text-zinc-500 font-bold uppercase text-[10px]">Reserved Slot:</span>
                <span className="font-mono font-bold text-primary">
                  {submittedOrder.customization.deliveryDate} ({submittedOrder.customization.deliveryTimeSlot})
                </span>
              </div>
              {submittedOrder.customization.messageOnCake && (
                <div className="flex justify-between border-b border-[#d6c2c3]/40 pb-2">
                  <span className="text-zinc-500 font-bold uppercase text-[10px]">Cake Inscription:</span>
                  <span className="font-bold italic text-[#874e58]">"{submittedOrder.customization.messageOnCake}"</span>
                </div>
              )}
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-primary font-display">Total Amount:</span>
                <span className="text-primary font-mono text-base">₹{submittedOrder.totalPrice}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const waNum = websiteConfig?.whatsappNumber || '919865621880';
                  const text = encodeURIComponent(
                    `Hi Krish Dreamy Delight! Here is my confirmed order ID: ${submittedOrder.id} for ${submittedOrder.customization.baseFlavor} on ${submittedOrder.customization.deliveryDate}.`
                  );
                  window.open(`https://wa.me/${waNum}?text=${text}`, '_blank');
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare size={16} /> Open on WhatsApp
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Book Another Cake
              </button>
            </div>
          </div>
        ) : (

          /* 3-STEP BOOKING CARD */
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-primary/10 shadow-lg overflow-hidden">
            
            {/* Step Progress Bar */}
            <div className="bg-[#fff8f5] px-6 py-4 border-b border-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {[
                  { num: 1, title: 'Flavour & Size' },
                  { num: 2, title: 'Choose Slot' },
                  { num: 3, title: 'Order Details' }
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                      step === s.num
                        ? 'bg-primary text-white scale-110 shadow-xs'
                        : step > s.num
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-200 text-zinc-500'
                    }`}>
                      {step > s.num ? <Check size={13} /> : s.num}
                    </div>
                    <span className={`text-xs font-bold hidden sm:inline ${
                      step === s.num ? 'text-primary' : 'text-zinc-500'
                    }`}>
                      {s.title}
                    </span>
                    {s.num < 3 && <div className="w-6 h-[1px] bg-zinc-300 hidden sm:block mx-1" />}
                  </div>
                ))}
              </div>

              {/* Total Price preview */}
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-primary/15 shadow-xs">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Estimated:</span>
                <span className="font-mono font-black text-sm text-primary">₹{totalPrice}</span>
              </div>
            </div>

            {/* Form Validation Alert */}
            {validationError && (
              <div className="m-6 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-bold">
                ⚠️ {validationError}
              </div>
            )}

            {/* STEP 1: FLAVOUR & SIZE */}
            {step === 1 && (
              <div className="p-6 md:p-8 space-y-8 animate-fade-in text-left">
                {/* Flavours Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-base text-primary flex items-center gap-2">
                      <Sparkles size={16} className="text-yellow-500" /> 1. Select Artisanal Flavour
                    </h3>
                    <span className="text-[11px] text-zinc-500 font-medium">Boutique small-batch recipes</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {POPULAR_FLAVORS.map((flavor) => {
                      const isSelected = selectedFlavor.name === flavor.name;
                      return (
                        <button
                          key={flavor.name}
                          type="button"
                          onClick={() => setSelectedFlavor(flavor)}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#fff1ed] border-primary shadow-sm ring-1 ring-primary'
                              : 'bg-white border-zinc-200 hover:border-primary/40 hover:bg-[#fffbf9]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span 
                                className="w-4 h-4 rounded-full border border-black/10 shrink-0" 
                                style={{ backgroundColor: flavor.color }}
                              />
                              <span className="font-display font-bold text-xs text-primary leading-tight">
                                {flavor.name}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-500 leading-snug line-clamp-2">
                              {flavor.desc}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between">
                            <span className="text-[9px] uppercase font-bold text-zinc-400">Base</span>
                            <span className="font-mono text-xs font-black text-primary">₹{flavor.price}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sizing & Dietary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Size Selector */}
                  <div className="space-y-3">
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-primary">
                      2. Choose Size & Portions
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      {SIZES.map((size) => {
                        const isSelected = selectedSize.name === size.name;
                        return (
                          <button
                            key={size.name}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-white border-primary shadow-xs'
                                : 'bg-[#fff8f5] text-zinc-700 border-zinc-200 hover:border-primary/40'
                            }`}
                          >
                            <span className="font-bold text-xs block leading-tight">{size.name}</span>
                            <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-white/80' : 'text-zinc-500'}`}>
                              {size.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dietary Preference */}
                  <div className="space-y-3">
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-primary">
                      3. Dietary Preference
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsEggless(false)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          !isEggless
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-[#fff8f5] text-zinc-700 border-zinc-200 hover:border-primary/40'
                        }`}
                      >
                        <span className="font-bold text-xs block leading-tight">Standard Dairy Base</span>
                        <span className={`text-[10px] block mt-0.5 ${!isEggless ? 'text-white/80' : 'text-zinc-500'}`}>
                          Fresh farm eggs & butter
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsEggless(true)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isEggless
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-[#fff8f5] text-zinc-700 border-zinc-200 hover:border-emerald-500'
                        }`}
                      >
                        <span className="font-bold text-xs block leading-tight">100% Pure Eggless</span>
                        <span className={`text-[10px] block mt-0.5 ${isEggless ? 'text-white/80' : 'text-zinc-500'}`}>
                          Pure vegetarian sponge (+₹50)
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 1 Actions */}
                <div className="pt-4 border-t border-zinc-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-primary hover:bg-[#6b3741] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Select Baking Slot <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: RESERVE CAKE SLOT */}
            {step === 2 && (
              <div className="p-6 md:p-8 space-y-6 animate-fade-in text-left">
                <div className="border-b border-[#d6c2c3]/30 pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Limited Daily Capacity
                  </span>
                  <h3 className="font-display font-bold text-lg text-primary mt-2">
                    Select Your Fresh Baking Slot
                  </h3>
                  <p className="font-sans text-xs text-zinc-600 mt-1">
                    To maintain strict artisanal freshness and hygiene, we bake in small batches. Choose an available slot:
                  </p>
                </div>

                {/* Available Slots List */}
                <div className="space-y-3">
                  <h4 className="font-display text-xs font-black uppercase tracking-wider text-primary">
                    Active Scheduled Baking Slots
                  </h4>

                  {cakeSlots.length === 0 ? (
                    <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 text-center text-xs text-zinc-500">
                      No batch slots scheduled for this week. You can enter a custom date and time below!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {cakeSlots.map((slot) => {
                        const remaining = Math.max(0, slot.maxCapacity - slot.bookedCount);
                        const isFull = remaining === 0;
                        const isSelected = selectedSlotId === slot.id;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={!slot.isActive || isFull}
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                              isSelected
                                ? 'bg-[#fff1ed] border-primary ring-2 ring-primary shadow-md'
                                : !slot.isActive || isFull
                                ? 'bg-zinc-50 border-zinc-200 opacity-50 cursor-not-allowed'
                                : 'bg-white border-zinc-200 hover:border-primary/50 hover:bg-[#fffcfb]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-display font-bold text-xs text-primary block">
                                  {slot.title}
                                </span>
                                <div className="flex items-center gap-2 mt-1 font-mono text-[11px] text-zinc-600">
                                  <span>📅 {slot.date}</span>
                                  <span>⏰ {slot.timeWindow}</span>
                                </div>
                                {slot.notes && (
                                  <p className="text-[10px] text-zinc-500 mt-1.5 font-sans">
                                    {slot.notes}
                                  </p>
                                )}
                              </div>

                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                isFull
                                  ? 'bg-rose-100 text-rose-800'
                                  : remaining <= 2
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {isFull ? 'Sold Out' : `${remaining} left`}
                              </span>
                            </div>

                            {isSelected && (
                              <div className="mt-2.5 pt-2 border-t border-primary/20 flex items-center gap-1 text-[10px] font-bold text-primary">
                                <Check size={12} /> Selected Slot
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Custom Slot / Date Option */}
                <div className="pt-4 border-t border-zinc-100 space-y-3">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-zinc-600">
                    Need a Different Date / Time?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-zinc-500 block">Preferred Date</label>
                      <input 
                        type="date"
                        value={customDate}
                        onChange={(e) => {
                          setCustomDate(e.target.value);
                          setSelectedSlotId(''); // Deselect slot to use custom
                        }}
                        className="w-full bg-[#fff8f5] border border-zinc-200 rounded-xl px-3 py-2 text-xs font-mono font-medium focus:outline-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-zinc-500 block">Preferred Time Slot</label>
                      <input 
                        type="text"
                        value={customTime}
                        onChange={(e) => {
                          setCustomTime(e.target.value);
                          setSelectedSlotId('');
                        }}
                        placeholder="e.g. 11:00 AM - 01:00 PM"
                        className="w-full bg-[#fff8f5] border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2 Actions */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-2.5 text-zinc-600 hover:text-zinc-900 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-primary hover:bg-[#6b3741] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Add Message & Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: MESSAGE & CHECKOUT */}
            {step === 3 && (
              <form onSubmit={handleConfirmOrder} className="p-6 md:p-8 space-y-6 animate-fade-in text-left">
                <div className="border-b border-[#d6c2c3]/30 pb-4">
                  <h3 className="font-display font-bold text-lg text-primary">
                    Message On Cake & Contact Details
                  </h3>
                  <p className="font-sans text-xs text-zinc-600 mt-1">
                    Almost there! Provide your name, contact phone, and custom message to seal your fresh cake slot.
                  </p>
                </div>

                {/* Message on Cake */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-bold uppercase text-zinc-600 block">
                    Custom Message on Cake <span className="text-zinc-400 font-normal">(Free custom chocolate plaque)</span>
                  </label>
                  <input 
                    type="text"
                    maxLength={35}
                    value={messageOnCake}
                    onChange={(e) => setMessageOnCake(e.target.value)}
                    placeholder="e.g. Happy Birthday Appa! or Happy Anniversary"
                    className="w-full bg-[#fff8f5] border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-primary"
                  />
                  <span className="text-[10px] text-zinc-400 block font-mono">
                    {35 - messageOnCake.length} characters remaining
                  </span>
                </div>

                {/* Customer Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-zinc-600 block">Your Name *</label>
                    <input 
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="e.g. Priyanjali Sen"
                      className="w-full bg-[#fff8f5] border border-zinc-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-zinc-600 block">Phone / WhatsApp Number *</label>
                    <input 
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="e.g. 9865621880"
                      className="w-full bg-[#fff8f5] border border-zinc-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-primary"
                    />
                  </div>
                </div>

                {/* Pickup or Delivery */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-zinc-600 block">Fulfillment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomer({ ...customer, deliveryType: 'pickup' })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        customer.deliveryType === 'pickup'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-[#fff8f5] text-zinc-700 border-zinc-200'
                      }`}
                    >
                      <Store size={16} />
                      <div>
                        <span className="font-bold text-xs block leading-tight">Self Pickup</span>
                        <span className="text-[10px] opacity-80">Free direct from kitchen</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomer({ ...customer, deliveryType: 'delivery' })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        customer.deliveryType === 'delivery'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-[#fff8f5] text-zinc-700 border-zinc-200'
                      }`}
                    >
                      <Truck size={16} />
                      <div>
                        <span className="font-bold text-xs block leading-tight">Doorstep Delivery</span>
                        <span className="text-[10px] opacity-80">+₹80 city delivery</span>
                      </div>
                    </button>
                  </div>
                </div>

                {customer.deliveryType === 'delivery' && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[10px] font-bold uppercase text-zinc-600 block">Delivery Address *</label>
                    <textarea 
                      rows={2}
                      required
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      placeholder="House/Flat No., Street, Landmark, Area..."
                      className="w-full bg-[#fff8f5] border border-zinc-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-primary resize-none"
                    />
                  </div>
                )}

                {/* Final Order Summary Bar */}
                <div className="p-4 bg-[#fff8f5] rounded-2xl border border-primary/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-primary block font-display text-sm">
                      {selectedFlavor.name} ({selectedSize.name})
                    </span>
                    <span className="text-zinc-500 font-mono text-[11px]">
                      Slot: {activeSlot ? `${activeSlot.date} @ ${activeSlot.timeWindow}` : `${customDate} @ ${customTime}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 uppercase text-[10px] font-bold">Total:</span>
                    <span className="font-mono text-lg font-black text-primary">₹{totalPrice}</span>
                  </div>
                </div>

                {/* Two Checkout Buttons: Instant WhatsApp & Direct Online Booking */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-3 text-zinc-600 hover:text-zinc-900 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer sm:w-auto"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageSquare size={16} /> Instant Order on WhatsApp
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary hover:bg-[#6b3741] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Check size={16} /> Confirm Online Slot
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
