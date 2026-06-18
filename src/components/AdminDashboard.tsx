import React, { useState } from 'react';
import { Order, WebsiteConfig, GalleryItem, CakeBuilderOptions, CakeBuilderOptionItem } from '../types';
import { 
  TrendingUp, 
  ShoppingBag, 
  Hourglass, 
  CheckCircle, 
  Truck, 
  Trash2, 
  X, 
  User, 
  Cake as CakeIcon, 
  RefreshCw, 
  Mail, 
  Phone,
  Activity,
  LogOut,
  Edit,
  Plus,
  Save,
  Undo
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  onSeedMockOrders: () => void;
  onClose: () => void;
  onLogout?: () => void;
  adminPhone?: string;
  websiteConfig: WebsiteConfig;
  onSaveConfig: (newConfig: WebsiteConfig) => void;
  galleryItems: GalleryItem[];
  onUpdateGalleryItems: (newItems: GalleryItem[]) => void;
  builderOptions: CakeBuilderOptions;
  onUpdateBuilderOptions: (newOptions: CakeBuilderOptions) => void;
}

export default function AdminDashboard({ 
  orders, 
  onUpdateStatus, 
  onDeleteOrder, 
  onSeedMockOrders,
  onClose,
  onLogout,
  adminPhone,
  websiteConfig,
  onSaveConfig,
  galleryItems,
  onUpdateGalleryItems,
  builderOptions,
  onUpdateBuilderOptions
}: AdminDashboardProps) {

  const [filterStatus, setFilterStatus] = useState<string>('All Active');
  const [ordersSubTab, setOrdersSubTab] = useState<'active' | 'history'>('active');
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Switch tabs to include custom options manager
  const [activeTab, setActiveTab] = useState<'orders' | 'editWebsite' | 'builderOptions'>('orders');
  const [editedConfig, setEditedConfig] = useState<WebsiteConfig>(() => ({ ...websiteConfig }));
  
  // Gallery additions/editions inputs
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Cakes');
  const [newImage, setNewImage] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galleryValidationError, setGalleryValidationError] = useState('');

  // Cake custom design builder options editor states
  const [activeCategory, setActiveCategory] = useState<keyof CakeBuilderOptions>('sizes');
  const [optionName, setOptionName] = useState('');
  const [optionPrice, setOptionPrice] = useState<number>(0);
  const [optionDescription, setOptionDescription] = useState('');
  const [optionCode, setOptionCode] = useState('#ffb6c1');
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [optionValidationError, setOptionValidationError] = useState('');

  // Sync edits if prop updates
  React.useEffect(() => {
    setEditedConfig({ ...websiteConfig });
  }, [websiteConfig]);

  const handleSaveWebsiteCopy = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(editedConfig);
  };

  const handleAddOrEditGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return setGalleryValidationError('Please enter a dessert item name.');
    if (!newImage.trim()) return setGalleryValidationError('Please provide a valid product image link.');
    if (!newDescription.trim()) return setGalleryValidationError('Please explain the visual taste description.');

    if (editingGalleryId) {
      // Edit mode
      const updatedList = galleryItems.map(item => {
        if (item.id === editingGalleryId) {
          return {
            ...item,
            title: newTitle.trim(),
            category: newCategory,
            image: newImage.trim(),
            description: newDescription.trim()
          };
        }
        return item;
      });
      onUpdateGalleryItems(updatedList);
      setEditingGalleryId(null);
    } else {
      // Create mode
      const newItem: GalleryItem = {
        id: `gal-custom-${Date.now()}`,
        title: newTitle.trim(),
        category: newCategory,
        image: newImage.trim(),
        description: newDescription.trim()
      };
      onUpdateGalleryItems([newItem, ...galleryItems]);
    }

    setNewTitle('');
    setNewImage('');
    setNewDescription('');
    setGalleryValidationError('');
  };

  const handleStartEditGalleryItem = (item: GalleryItem) => {
    setEditingGalleryId(item.id);
    setNewTitle(item.title);
    setNewCategory(item.category);
    setNewImage(item.image);
    setNewDescription(item.description);
  };

  const handleDeleteGalleryItem = (id: string) => {
    const nextList = galleryItems.filter(item => item.id !== id);
    onUpdateGalleryItems(nextList);
    if (editingGalleryId === id) {
      setEditingGalleryId(null);
      setNewTitle('');
      setNewImage('');
      setNewDescription('');
    }
  };

  // Option CRUD actions
  const handleAddOrEditOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!optionName.trim()) {
      return setOptionValidationError('Please enter option label name.');
    }

    const currentCatOptions = builderOptions[activeCategory] || [];

    if (editingOptionId) {
      // Edit Mode
      const updatedList = currentCatOptions.map((opt) => {
        if (opt.id === editingOptionId) {
          return {
            ...opt,
            name: optionName.trim(),
            price: Number(optionPrice),
            description: optionDescription.trim() || undefined,
            code: activeCategory === 'colors' ? optionCode : undefined
          };
        }
        return opt;
      });

      onUpdateBuilderOptions({
        ...builderOptions,
        [activeCategory]: updatedList
      });

      setEditingOptionId(null);
    } else {
      // Create Mode
      const newOpt: CakeBuilderOptionItem = {
        id: `opt-${activeCategory}-${Date.now()}`,
        name: optionName.trim(),
        price: Number(optionPrice),
        description: optionDescription.trim() || undefined,
        code: activeCategory === 'colors' ? optionCode : undefined
      };

      onUpdateBuilderOptions({
        ...builderOptions,
        [activeCategory]: [...currentCatOptions, newOpt]
      });
    }

    setOptionName('');
    setOptionPrice(0);
    setOptionDescription('');
    setOptionCode('#ffb6c1');
    setOptionValidationError('');
  };

  const handleDeleteOption = (id: string) => {
    const currentList = builderOptions[activeCategory] || [];
    const updatedList = currentList.filter(opt => opt.id !== id);
    onUpdateBuilderOptions({
      ...builderOptions,
      [activeCategory]: updatedList
    });
    if (editingOptionId === id) {
      setEditingOptionId(null);
      setOptionName('');
      setOptionPrice(0);
      setOptionDescription('');
      setOptionCode('#ffb6c1');
    }
  };

  const handleStartEditOption = (opt: CakeBuilderOptionItem) => {
    setEditingOptionId(opt.id);
    setOptionName(opt.name);
    setOptionPrice(opt.price);
    setOptionDescription(opt.description || '');
    setOptionCode(opt.code || '#ffb6c1');
  };

  const handleRestoreDefaultCopy = () => {
    const defaults = {
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
      card4Desc: "Dispatched warm within 3 hrs of setup"
    };
    setEditedConfig(defaults);
    onSaveConfig(defaults);
  };



  // Computed metrics stats
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const statuses = ordersSubTab === 'active'
    ? ['All Active', 'Received', 'Preparing', 'Baking', 'Ready for Delivery']
    : ['All History', 'Completed', 'Cancelled'];

  const filteredOrders = ordersSubTab === 'active'
    ? (filterStatus === 'All Active' || filterStatus === 'All'
        ? orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled')
        : orders.filter(o => o.status === filterStatus))
    : (filterStatus === 'All History' || filterStatus === 'All'
        ? orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled')
        : orders.filter(o => o.status === filterStatus));

  return (
    <section 
      id="admin-dashboard" 
      className="py-16 bg-white border-t border-b border-primary/10 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Block with Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-primary">
              <Activity size={18} className="animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest font-display flex items-center gap-1.5 flex-wrap">
                Real-Time Studio Monitoring
                {adminPhone && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] px-2 py-0.5 rounded-full font-sans tracking-normal uppercase font-extrabold shadow-2xs">
                    verified active: {adminPhone}
                  </span>
                )}
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">
              Chef Owner Kitchen Board
            </h2>
            <p className="font-sans text-xs text-on-surface-variant mt-0.5">
              Handle incoming custom cake configurations, track status, and view dynamic metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onSeedMockOrders}
              className="px-4 py-2 bg-secondary-container/30 hover:bg-secondary-container text-secondary text-xs font-bold rounded-full transition-all flex items-center gap-1 cursor-pointer"
              title="Populate table with demo orders"
            >
              <RefreshCw size={13} />
              Seed Demo Orders
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-on-surface-variant text-xs font-bold rounded-full transition-all cursor-pointer"
            >
              Hide Dashboard
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                title="Log out of session"
              >
                <LogOut size={13} />
                Log Out
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid widgets counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-[#fff8f5] p-5 rounded-3xl border border-primary/10 flex items-center gap-4 hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#ffb6c1]/25 text-primary flex items-center justify-center">
              <ShoppingBag size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                Total Orders
              </span>
              <span className="font-display text-xl md:text-2xl font-bold text-primary block mt-0.5">
                {totalOrders}
              </span>
            </div>
          </div>

          <div className="bg-[#fff8f5] p-5 rounded-3xl border border-primary/10 flex items-center gap-4 hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container/20 text-secondary flex items-center justify-center">
              <Hourglass size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                Active Bakers
              </span>
              <span className="font-display text-xl md:text-2xl font-bold text-secondary block mt-0.5">
                {activeOrders}
              </span>
            </div>
          </div>

          <div className="bg-[#fff8f5] p-5 rounded-3xl border border-primary/10 flex items-center gap-4 hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <CheckCircle size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                Completed
              </span>
              <span className="font-display text-xl md:text-2xl font-bold text-emerald-800 block mt-0.5">
                {completedOrders}
              </span>
            </div>
          </div>

          <div className="bg-[#fff8f5] p-5 rounded-3xl border border-primary/10 flex items-center gap-4 hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#ffeade] text-amber-900 flex items-center justify-center">
              <TrendingUp size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                Gross Revenue
              </span>
              <span className="font-display text-xl md:text-2xl font-bold text-amber-800 block mt-0.5">
                ₹{totalRevenue}
              </span>
            </div>
          </div>

        </div>

        {/* Navigation Tabs for Owner Content Admin */}
        <div className="flex border-b border-[#d6c2c3]/40 gap-6 mb-8 mt-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-display font-black text-sm relative transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders' 
              ? 'text-primary' 
              : 'text-[#847375] hover:text-[#874e58]'
            }`}
          >
            <ShoppingBag size={16} />
            Orders Workspace ({orders.length})
            {activeTab === 'orders' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-pulse" />}
          </button>
          
          <button
            onClick={() => setActiveTab('editWebsite')}
            className={`pb-3 font-display font-black text-sm relative transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'editWebsite' 
              ? 'text-primary' 
              : 'text-[#847375] hover:text-[#874e58]'
            }`}
          >
            <Edit size={16} />
            Website Content & Gallery Editor
            {activeTab === 'editWebsite' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-pulse" />}
          </button>

          <button
            onClick={() => setActiveTab('builderOptions')}
            className={`pb-3 font-display font-black text-sm relative transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'builderOptions' 
              ? 'text-primary' 
              : 'text-[#847375] hover:text-[#874e58]'
            }`}
          >
            <CakeIcon size={16} />
            Cake Customizer Options Manager
            {activeTab === 'builderOptions' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-pulse" />}
          </button>
        </div>

        {activeTab === 'editWebsite' && (
          <div className="space-y-10 animate-fade-in pb-16">
            
            {/* Form for general website copy */}
            <form onSubmit={handleSaveWebsiteCopy} className="bg-white rounded-3xl border border-primary-container/30 p-6 md:p-8 space-y-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#d6c2c3]/30 pb-4 gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                    <Edit size={18} /> Owner Copywriting Panel
                  </h3>
                  <p className="font-sans text-[11px] text-[#847375]">
                    Customize the text, subtitles, and headings shown in the Hero and About Us blocks.
                  </p>
                </div>
                
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleRestoreDefaultCopy}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-250 text-neutral-700 text-[10px] font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Undo size={12} />
                    Restore Standards
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-[#6b3741] text-white text-[11px] font-black rounded-lg shadow-sm flex items-center gap-2 hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Save size={13} />
                    Save Website Copies
                  </button>
                </div>
              </div>

              {/* Grid 1: Hero Block Copies */}
              <div className="space-y-4">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2.5">
                  1. Hero Masthead Copies
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[#874e58] tracking-widest block font-sans">Badge Tagline</label>
                    <input
                      type="text"
                      className="w-full p-2.5 bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl font-sans text-xs font-semibold focus:outline-primary"
                      value={editedConfig.heroBadge}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, heroBadge: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[#874e58] tracking-widest block font-sans">Main Title (Cursive)</label>
                    <input
                      type="text"
                      className="w-full p-2.5 bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl font-sans text-xs font-semibold focus:outline-primary"
                      value={editedConfig.heroTitleCursive}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, heroTitleCursive: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[#874e58] tracking-widest block font-sans">Title Focus (Gradient Accent)</label>
                    <input
                      type="text"
                      className="w-full p-2.5 bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl font-sans text-xs font-semibold focus:outline-primary"
                      value={editedConfig.heroTitleGradient}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, heroTitleGradient: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#874e58] tracking-widest block font-sans">Hero Intro Description</label>
                  <textarea
                    rows={3}
                    className="w-full p-2.5 bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl font-sans text-xs font-semibold focus:outline-primary resize-none"
                    value={editedConfig.heroDescription}
                    onChange={(e) => setEditedConfig(prev => ({ ...prev, heroDescription: e.target.value }))}
                  />
                </div>
              </div>

              {/* Grid 2: About Story copies */}
              <div className="space-y-4 pt-4 border-t border-[#d6c2c3]/20">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2.5">
                  2. About Baker Story Copies
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[#874e58] tracking-widest block font-sans">Pill Tag</label>
                    <input
                      type="text"
                      className="w-full p-2.5 bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl font-sans text-xs font-semibold focus:outline-primary"
                      value={editedConfig.aboutTag}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, aboutTag: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[#874e58] tracking-widest block font-sans">Main Narrative Title</label>
                    <input
                      type="text"
                      className="w-full p-2.5 bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl font-sans text-xs font-semibold focus:outline-primary"
                      value={editedConfig.aboutTitle}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, aboutTitle: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#874e58] tracking-widest block font-sans">Secondary Narrative Paragraph Intro</label>
                  <textarea
                    rows={2}
                    className="w-full p-2.5 bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl font-sans text-xs font-semibold focus:outline-primary resize-none"
                    value={editedConfig.aboutSubtitle}
                    onChange={(e) => setEditedConfig(prev => ({ ...prev, aboutSubtitle: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#874e58] tracking-widest block font-sans">Main Story Sub-Heading Headline</label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl font-sans text-xs font-semibold focus:outline-primary"
                    value={editedConfig.aboutMainTitle}
                    onChange={(e) => setEditedConfig(prev => ({ ...prev, aboutMainTitle: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[#874e58] tracking-widest block font-sans">Story Essay Block #1</label>
                    <textarea
                      rows={5}
                      className="w-full p-3 bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl font-sans text-xs font-semibold focus:outline-primary"
                      value={editedConfig.aboutDesc1}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, aboutDesc1: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-[#874e58] tracking-widest block font-sans">Story Essay Block #2</label>
                    <textarea
                      rows={5}
                      className="w-full p-3 bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl font-sans text-xs font-semibold focus:outline-primary"
                      value={editedConfig.aboutDesc2}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, aboutDesc2: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Grid 3: Highlights Badges */}
              <div className="space-y-4 pt-4 border-t border-[#d6c2c3]/20">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2.5">
                  3. Key Highlights Badges
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Badge 1 */}
                  <div className="bg-[#fff8f5] p-3 rounded-2xl border border-primary/10 space-y-2">
                    <span className="text-[8px] font-bold tracking-widest uppercase text-primary block font-sans">Badge 1 (FSSAI)</span>
                    <input
                      type="text"
                      className="w-full p-2 bg-white border border-[#d6c2c3]/40 rounded-lg font-sans text-[11px] font-semibold"
                      value={editedConfig.card1Title}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, card1Title: e.target.value }))}
                    />
                    <input
                      type="text"
                      className="w-full p-2 bg-white border border-[#d6c2c3]/40 rounded-lg font-sans text-[10px]"
                      value={editedConfig.card1Desc}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, card1Desc: e.target.value }))}
                    />
                  </div>

                  {/* Badge 2 */}
                  <div className="bg-[#fff8f5] p-3 rounded-2xl border border-primary/10 space-y-2">
                    <span className="text-[8px] font-bold tracking-widest uppercase text-secondary block font-sans">Badge 2 (Homemade)</span>
                    <input
                      type="text"
                      className="w-full p-2 bg-white border border-[#d6c2c3]/40 rounded-lg font-sans text-[11px] font-semibold"
                      value={editedConfig.card2Title}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, card2Title: e.target.value }))}
                    />
                    <input
                      type="text"
                      className="w-full p-2 bg-white border border-[#d6c2c3]/40 rounded-lg font-sans text-[10px]"
                      value={editedConfig.card2Desc}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, card2Desc: e.target.value }))}
                    />
                  </div>

                  {/* Badge 3 */}
                  <div className="bg-[#fff8f5] p-3 rounded-2xl border border-primary/10 space-y-2">
                    <span className="text-[8px] font-bold tracking-widest uppercase text-amber-700 block font-sans">Badge 3 (Artisan)</span>
                    <input
                      type="text"
                      className="w-full p-2 bg-white border border-[#d6c2c3]/40 rounded-lg font-sans text-[11px] font-semibold"
                      value={editedConfig.card3Title}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, card3Title: e.target.value }))}
                    />
                    <input
                      type="text"
                      className="w-full p-2 bg-white border border-[#d6c2c3]/40 rounded-lg font-sans text-[10px]"
                      value={editedConfig.card3Desc}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, card3Desc: e.target.value }))}
                    />
                  </div>

                  {/* Badge 4 */}
                  <div className="bg-[#fff8f5] p-3 rounded-2xl border border-primary/10 space-y-2">
                    <span className="text-[8px] font-bold tracking-widest uppercase text-rose-700 block font-sans">Badge 4 (Fresh Baked)</span>
                    <input
                      type="text"
                      className="w-full p-2 bg-white border border-[#d6c2c3]/40 rounded-lg font-sans text-[11px] font-semibold"
                      value={editedConfig.card4Title}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, card4Title: e.target.value }))}
                    />
                    <input
                      type="text"
                      className="w-full p-2 bg-white border border-[#d6c2c3]/40 rounded-lg font-sans text-[10px]"
                      value={editedConfig.card4Desc}
                      onChange={(e) => setEditedConfig(prev => ({ ...prev, card4Desc: e.target.value }))}
                    />
                  </div>

                </div>
              </div>

              {/* Submit Buttons footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#d6c2c3]/20">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-[#6b3741] text-white text-[12px] font-black rounded-xl shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save size={14} />
                  Save Draft Copies To Live Site
                </button>
              </div>
            </form>

            {/* Gallery dessert creator & list catalog CRUD */}
            <div className="bg-white rounded-3xl border border-primary-container/30 p-6 md:p-8 space-y-8 shadow-xs">
              <div>
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <CakeIcon size={18} /> Confectionery Catalog Manager ({galleryItems.length})
                </h3>
                <p className="font-sans text-[11px] text-[#847375]">
                  Publish new high-end delicacies or remove outdated treats from the live Creations gallery showcase.
                </p>
              </div>

              {/* Add Dessert Form Block */}
              <form onSubmit={handleAddOrEditGalleryItem} className="bg-[#fff8f5] p-5 rounded-2xl border border-primary-container/20 space-y-4">
                <h4 className="font-display text-xs font-black uppercase text-primary tracking-widest block flex items-center gap-1.5">
                  {editingGalleryId ? <Edit size={14} /> : <Plus size={14} />} 
                  {editingGalleryId ? 'Edit Selected Dessert details' : 'Publish a New Creation on the Website Gallery'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-600 uppercase block font-sans">Delicacy Title</label>
                    <input
                      type="text"
                      className="w-full p-2.5 bg-white border border-[#d6c2c3]/40 rounded-xl text-xs font-semibold"
                      placeholder="e.g. Raspberry Saffron Gateau"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-600 uppercase block font-sans">Category Tab</label>
                    <select
                      className="w-full p-2.5 bg-white border border-[#d6c2c3]/40 rounded-xl text-xs font-bold text-primary"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      <option value="Cakes">Cakes</option>
                      <option value="Brownies font-sans">Brownies</option>
                      <option value="Special Cakes">Special Cakes</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#847375] uppercase block flex justify-between font-sans">
                      <span>Image URL Link</span>
                      <button
                        type="button"
                        onClick={() => setNewImage('https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop')}
                        className="text-[9px] text-[#874e58] font-black underline hover:text-[#primary] cursor-pointer"
                      >
                        Use Stock Cake Pic
                      </button>
                    </label>
                    <input
                      type="url"
                      className="w-full p-2.5 bg-white border border-[#d6c2c3]/40 rounded-xl text-xs font-semibold font-mono"
                      placeholder="https://images.unsplash.com/..."
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase block font-sans">Delectable description (Shown in Pop-up card detail viewer)</label>
                  <textarea
                    rows={2}
                    className="w-full p-2.5 bg-white border border-[#d6c2c3]/40 rounded-xl text-xs font-semibold"
                    placeholder="Whip up rich sensory details like authentic cocoa, organic cream layers, organic zest..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                {galleryValidationError && (
                  <p className="text-[11px] font-bold text-red-600 font-sans">{galleryValidationError}</p>
                )}

                <div className="flex justify-end gap-2">
                  {editingGalleryId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGalleryId(null);
                        setNewTitle('');
                        setNewCategory('Cakes');
                        setNewImage('');
                        setNewDescription('');
                      }}
                      className="px-4 py-2 hover:bg-neutral-100 border border-[#d6c2c3]/60 text-zinc-650 text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary hover:bg-[#6b3741] text-white text-[11px] font-black rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    {editingGalleryId ? <Save size={14} /> : <Plus size={14} />}
                    {editingGalleryId ? 'Update Dessert Details' : 'Deploy Dessert to Catalog'}
                  </button>
                </div>
              </form>

              {/* Current Active Items List */}
              <div className="space-y-3">
                <h4 className="font-display text-xs font-black uppercase tracking-wider text-primary">
                  Inventory Catalog Items ({galleryItems.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryItems.map(item => (
                    <div key={item.id} className="border border-[#d6c2c3]/30 rounded-2xl overflow-hidden bg-[#fff8f5]/20 flex flex-col justify-between group">
                      <div>
                        <div className="h-32 w-full overflow-hidden relative bg-neutral-100">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 animate-fade-in"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full shadow-xs">
                            {item.category}
                          </span>
                        </div>
                        <div className="p-3.5 space-y-1">
                          <h5 className="font-display font-black text-xs text-primary line-clamp-1">{item.title}</h5>
                          <p className="font-sans text-[10px] text-zinc-600 line-clamp-2 leading-relaxed font-semibold">{item.description}</p>
                        </div>
                      </div>
                      
                      <div className="p-2 border-t border-primary/5 bg-[#fff8f5]/40 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="px-2.5 py-1 text-[9px] font-black text-red-650 hover:bg-red-50 hover:text-red-700 rounded-md border border-red-200 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={11} />
                          Remove Dessert
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-gradient-to-tr from-[#fff8f5] to-white rounded-3xl border border-primary-container/30 overflow-hidden shadow-sm p-4 md:p-6 animate-fade-in">
            
            {/* Sub-navigation Segment Selector for Orders tab */}
            <div className="flex bg-[#fff8f5] p-1.5 rounded-2xl border border-primary/5 max-w-lg mb-6 shadow-2xs gap-1 select-none">
              <button
                onClick={() => {
                  setOrdersSubTab('active');
                  setFilterStatus('All Active');
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-display text-[10px] md:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  ordersSubTab === 'active'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-[#847375] hover:text-[#874e58] hover:bg-white/40'
                }`}
              >
                <Hourglass size={14} />
                Kitchen Queues ({orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length})
              </button>
              
              <button
                onClick={() => {
                  setOrdersSubTab('history');
                  setFilterStatus('All History');
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-display text-[10px] md:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  ordersSubTab === 'history'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-[#847375] hover:text-[#874e58] hover:bg-white/40'
                }`}
              >
                <CheckCircle size={14} />
                Order History ({orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled').length})
              </button>
            </div>

            {/* Internal filters tabs */}
            <div className="flex flex-wrap gap-2 mb-6 items-center border-b border-primary/5 pb-4">
              <span className="font-display text-xs font-bold uppercase text-primary tracking-wider mr-2">
                Filter Status:
              </span>
              {statuses.map((stat) => (
                <button
                  key={stat}
                  onClick={() => setFilterStatus(stat)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                    filterStatus === stat
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-on-surface-variant border border-[#d6c2c3]/60 hover:bg-neutral-50'
                  }`}
                >
                  {stat}
                </button>
              ))}
            </div>

            {/* Orders log table */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 space-y-2 animate-fade-in">
                <CakeIcon size={44} className="mx-auto text-primary/30 stroke-[1.2]" />
                <h4 className="font-display text-sm font-bold text-primary">No Matching Orders Found</h4>
                <p className="font-sans text-xs text-on-surface-variant max-w-xs mx-auto font-semibold">
                  No orders are currently listed under filter '{filterStatus}'. Place some custom cake orders or seed demo orders using the action button!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse divide-y divide-[#d6c2c3]/30">
                  <thead>
                    <tr className="text-on-surface-variant font-bold text-[10px] uppercase tracking-wider bg-[#ffeade]/35 rounded-t-xl">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Client Customer</th>
                      <th className="py-3 px-4">Core Dessert Specifications</th>
                      <th className="py-3 px-4">Total Price</th>
                      <th className="py-3 px-4">Calibrate Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d6c2c3]/20 font-sans font-semibold">
                    {filteredOrders.map((o) => (
                      <tr 
                        key={o.id} 
                        className="hover:bg-[#fff8f5]/40 transition-colors cursor-pointer group"
                        onClick={() => setSelectedOrderDetail(o)}
                      >
                        {/* ID */}
                        <td className="py-4 px-4">
                          <span className="font-mono text-primary font-bold group-hover:underline">
                            {o.id}
                          </span>
                          <span className="text-[9px] text-[#847375] font-normal block">
                            {o.createdAt.split(',')[0]}
                          </span>
                        </td>

                        {/* Client */}
                        <td className="py-4 px-4 space-y-0.5">
                          <span className="text-on-surface font-bold text-[13px] block">
                            {o.customer.name}
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-normal flex items-center gap-1">
                            <Phone size={10} className="text-primary shrink-0" /> {o.customer.phone}
                          </span>
                        </td>

                        {/* Specs Summary */}
                        <td className="py-4 px-4 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wide ${
                              o.customization.category === 'cake' ? 'bg-pink-100 text-pink-700' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {o.customization.category}
                            </span>
                            <span className="font-bold text-on-surface text-[11px] truncate max-w-[180px] block">
                              {o.customization.baseFlavor} ({o.customization.size.split(' ')[0]})
                            </span>
                          </div>
                          {o.customization.messageOnCake && (
                            <span className="text-[10px] italic text-[#874e58] font-bold block truncate max-w-[200px]">
                              "Letters: {o.customization.messageOnCake}"
                            </span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4">
                          <span className="text-sm font-bold text-primary font-display block">
                            ₹{o.totalPrice}
                          </span>
                          <span className="text-[9px] text-[#847375] font-normal flex items-center gap-1 mt-0.5">
                            {o.customer.deliveryType === 'delivery' ? (
                              <>
                                <Truck size={10} className="text-[#847375] shrink-0" /> Delivery
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={10} className="text-[#847375] shrink-0" /> Pickup
                              </>
                            )}
                          </span>
                        </td>

                        {/* Status Selector dropdown */}
                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={o.status}
                            onChange={(e) => onUpdateStatus(o.id, e.target.value as Order['status'])}
                            className={`p-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-colors border focus:outline-none ${
                              o.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-[#6ee7b7]' :
                              o.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-[#fecaca]' :
                              o.status === 'Ready for Delivery' ? 'bg-blue-50 text-blue-700 border-[#bfdbfe]' :
                              o.status === 'Baking' ? 'bg-orange-50 text-orange-700 border-[#fdbb91]' :
                              'bg-amber-50 text-amber-700 border-[#fde68a]'
                            }`}
                          >
                            <option value="Received">Received</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Baking">Baking</option>
                            <option value="Ready for Delivery">Ready for Delivery</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions delete */}
                        <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          {deleteConfirmId === o.id ? (
                            <div className="flex items-center justify-center gap-1.5 animate-bounce-slight font-sans">
                              <button
                                onClick={() => {
                                  onDeleteOrder(o.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2.5 py-1 bg-red-650 hover:bg-red-700 text-white rounded-lg text-[10px] font-black shadow-xs transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setDeleteConfirmId(o.id);
                              }}
                              className="p-2 text-[#847375] hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete Order Permanently"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Builder Options Tab Panel */}
        {activeTab === 'builderOptions' && (
          <div className="space-y-8 animate-fade-in pb-16">
            <div className="bg-white rounded-3xl border border-primary-container/30 p-6 md:p-8 space-y-6 shadow-xs">
              <div>
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <CakeIcon size={18} /> Cake Customizer Options Manager
                </h3>
                <p className="font-sans text-[11px] text-[#847375]">
                  Add, modify, and delete sizes, base flavors, dress colors, toppings, and other options. Every change immediately updates the frontend customized ordering flow and prices!
                </p>
              </div>

              {/* Sub-Tabs for configuration categories */}
              <div className="flex flex-wrap gap-2 border-b border-primary/5 pb-4">
                {[
                  { key: 'sizes', label: '1. Sizing' },
                  { key: 'flavors', label: '2. Flavors' },
                  { key: 'colors', label: '3. Colors' },
                  { key: 'dietary', label: '4. Dietary' },
                  { key: 'fillings', label: '5. Fillings' },
                  { key: 'sweetness', label: '6. Sweetness' },
                  { key: 'frostings', label: '7. Frostings' },
                  { key: 'toppings', label: '8. Toppings' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.key as keyof CakeBuilderOptions);
                      setEditingOptionId(null);
                      setOptionName('');
                      setOptionPrice(0);
                      setOptionDescription('');
                      setOptionCode('#ffb6c1');
                      setOptionValidationError('');
                    }}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                      activeCategory === cat.key
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-[#fff8f5] text-primary border border-primary/10 hover:bg-primary-container/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* FORM COLUMN (Left 4) */}
                <div className="lg:col-span-4 space-y-4">
                  <form onSubmit={handleAddOrEditOption} className="bg-[#fff8f5] p-5 rounded-2xl border border-primary-container/20 space-y-4">
                    <h4 className="font-display text-xs font-black uppercase text-primary tracking-widest block flex items-center gap-1.5">
                      {editingOptionId ? <Edit size={14} /> : <Plus size={14} />} 
                      {editingOptionId ? 'Edit Selected option' : 'Create New Option'}
                    </h4>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-650 uppercase block font-sans">Option Name / Name Label</label>
                      <input
                        type="text"
                        className="w-full p-2.5 bg-white border border-[#d6c2c3]/40 rounded-xl text-xs font-semibold"
                        placeholder="e.g. Premium Chocolate Fudge"
                        value={optionName}
                        onChange={(e) => setOptionName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-650 uppercase block font-sans">Price Surcharge (₹ INR, Use 0 for base options)</label>
                      <input
                        type="number"
                        className="w-full p-2.5 bg-white border border-[#d6c2c3]/40 rounded-xl text-xs font-semibold font-mono"
                        placeholder="e.g. 150"
                        value={optionPrice === 0 ? '' : optionPrice}
                        onChange={(e) => setOptionPrice(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-650 uppercase block font-sans">Optional Subtext description</label>
                      <input
                        type="text"
                        className="w-full p-2.5 bg-white border border-[#d6c2c3]/40 rounded-xl text-xs font-semibold"
                        placeholder="e.g. Organic Madagascar pods"
                        value={optionDescription}
                        onChange={(e) => setOptionDescription(e.target.value)}
                      />
                    </div>

                    {activeCategory === 'colors' && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-650 uppercase block font-sans">Hex Color Code (For live visual display preview)</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            className="w-10 h-10 border border-zinc-300 rounded-lg cursor-pointer bg-transparent"
                            value={optionCode}
                            onChange={(e) => setOptionCode(e.target.value)}
                          />
                          <input
                            type="text"
                            maxLength={7}
                            className="flex-1 p-2 bg-white border border-[#d6c2c3]/40 rounded-xl text-xs font-bold font-mono text-primary"
                            placeholder="#ffb6c1"
                            value={optionCode}
                            onChange={(e) => setOptionCode(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {optionValidationError && (
                      <p className="text-[10px] font-bold text-red-600 font-sans">{optionValidationError}</p>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      {editingOptionId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingOptionId(null);
                            setOptionName('');
                            setOptionPrice(0);
                            setOptionDescription('');
                            setOptionCode('#ffb6c1');
                          }}
                          className="px-3.5 py-2 hover:bg-neutral-100 border border-[#d6c2c3]/60 text-zinc-650 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary hover:bg-[#6b3741] text-white text-[10px] font-black rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      >
                        {editingOptionId ? <Save size={12} /> : <Plus size={12} />}
                        {editingOptionId ? 'Update Option' : 'Insert Option'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* ACTIVE LIST COLUMN (Right 8) */}
                <div className="lg:col-span-8 space-y-3">
                  <h4 className="font-display text-xs font-black uppercase tracking-wider text-primary">
                    Active Options in Category '{activeCategory}' ({(builderOptions[activeCategory] || []).length})
                  </h4>

                  <div className="bg-white border border-[#d6c2c3]/30 rounded-2xl overflow-hidden shadow-xs divide-y divide-[#d6c2c3]/20">
                    {(builderOptions[activeCategory] || []).length === 0 ? (
                      <div className="p-8 text-center text-zinc-400 font-sans text-xs">
                        No custom options defined inside this category. Click the left form to deploy one.
                      </div>
                    ) : (
                      (builderOptions[activeCategory] || []).map((opt) => (
                        <div key={opt.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#fff8f5]/25 transition-colors">
                          <div className="flex items-center gap-3">
                            {activeCategory === 'colors' && opt.code && (
                              <div
                                className="w-6 h-6 rounded-full border border-primary/20 shadow-inner"
                                style={{ backgroundColor: opt.code }}
                              />
                            )}
                            <div>
                              <span className="font-display font-black text-xs text-primary block">
                                {opt.name}
                              </span>
                              {opt.description && (
                                <span className="text-[10px] text-[#847375] block mt-0.5 font-sans font-normal leading-tight">
                                  {opt.description}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-xs font-bold font-mono text-primary bg-[#ffeade]/50 px-2.5 py-1 rounded-lg">
                              {opt.price === 0 ? '₹0 (Free)' : `+₹${opt.price}`}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleStartEditOption(opt)}
                                className="p-1.5 text-[#847375] hover:text-primary hover:bg-primary-container/10 rounded-lg transition-colors cursor-pointer"
                                title="Edit this option"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteOption(opt.id)}
                                className="p-1.5 text-[#847375] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete this option"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Detail Modal for individual order inspectors */}
        {selectedOrderDetail && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 text-left border border-primary-container relative animate-bounce-slight text-xs font-semibold">
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-on-surface-variant hover:text-red-700"
              >
                <X size={15} />
              </button>

              <div className="space-y-4">
                <div className="border-b border-[#d6c2c3]/30 pb-3">
                  <span className="text-[10px] text-primary block uppercase font-bold tracking-wider">
                    Full Chef Order Ticket
                  </span>
                  <h3 className="font-display text-lg font-bold text-primary">
                    Ticket {selectedOrderDetail.id}
                  </h3>
                </div>

                {/* Cliente specifications */}
                <div className="space-y-2">
                  <h4 className="font-display text-xs font-bold text-primary uppercase tracking-widest block">
                    Customer Info
                  </h4>
                  <div className="bg-[#fff8f5] p-3 rounded-xl border border-primary-container/20 space-y-1.5 font-sans font-semibold">
                    <div className="flex items-center gap-2"><User size={12} className="text-[#874e58]" /> Name: <strong>{selectedOrderDetail.customer.name}</strong></div>
                    <div className="flex items-center gap-2"><Mail size={12} className="text-[#874e58]" /> Email: <span className="text-zinc-600 font-normal">{selectedOrderDetail.customer.email}</span></div>
                    <div className="flex items-center gap-2"><Phone size={12} className="text-[#874e58]" /> Phone: <span className="font-mono">{selectedOrderDetail.customer.phone}</span></div>
                    <div className="flex items-start gap-2"><Truck size={12} className="text-[#874e58] shrink-0 mt-0.5" /> Address: <span className="text-zinc-600 font-normal">{selectedOrderDetail.customer.deliveryType === 'delivery' ? selectedOrderDetail.customer.address : 'Self-Pickup from Master Studio Kitchen'}</span></div>
                  </div>
                </div>

                {/* Cake configuration recipe */}
                <div className="space-y-2">
                  <h4 className="font-display text-xs font-bold text-primary uppercase tracking-widest block">
                    Gourmet Recipe
                  </h4>
                  <div className="bg-[#fff8f5] p-3 rounded-xl border border-primary-container/20 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between"><span>Base:</span> <span className="font-bold">{selectedOrderDetail.customization.category.toUpperCase()}</span></div>
                    <div className="flex justify-between"><span>Weight size:</span> <span className="font-bold">{selectedOrderDetail.customization.size}</span></div>
                    <div className="flex justify-between"><span>Sponge Taste:</span> <span className="font-bold">{selectedOrderDetail.customization.baseFlavor}</span></div>
                    <div className="flex justify-between"><span>Frost Color:</span> <span className="font-bold">{selectedOrderDetail.customization.baseColorName}</span></div>
                    <div className="flex justify-between"><span>Dietary preferences:</span> <span className="font-bold text-amber-800">{selectedOrderDetail.customization.dietary}</span></div>
                    <div className="flex justify-between"><span>Toppings stack:</span> <span className="font-bold truncate max-w-[180px] text-right">{selectedOrderDetail.customization.toppings.join(', ')}</span></div>
                    {selectedOrderDetail.customization.messageOnCake && (
                      <div className="flex justify-between text-pink-700 italic border-t border-primary/5 pt-1.5 mt-1.5"><span>Piped Label:</span> <span className="font-bold">"{selectedOrderDetail.customization.messageOnCake}"</span></div>
                    )}
                    {selectedOrderDetail.customization.specialInstructions && (
                      <div className="pt-2 border-t border-primary/5 mt-1">
                        <span className="text-[10px] text-zinc-500 block">Custom Notes:</span>
                        <p className="text-[11px] text-zinc-700 font-sans italic mt-0.5">"{selectedOrderDetail.customization.specialInstructions}"</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center bg-[#ffeade] p-3 rounded-xl border border-primary/10">
                  <span className="font-display font-bold text-xs uppercase text-primary">Settled Price:</span>
                  <span className="text-base font-display font-bold text-primary">₹{selectedOrderDetail.totalPrice}</span>
                </div>

                <button
                  onClick={() => setSelectedOrderDetail(null)}
                  className="w-full py-2.5 bg-neutral-150 border border-neutral-300 rounded-xl font-bold hover:bg-neutral-200 text-center transition-colors block text-[11px]"
                >
                  Close Ticket Details
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
