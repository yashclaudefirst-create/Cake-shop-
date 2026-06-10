import React, { useState } from 'react';
import { Order } from '../types';
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
  Activity
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  onSeedMockOrders: () => void;
  onClose: () => void;
}

export default function AdminDashboard({ 
  orders, 
  onUpdateStatus, 
  onDeleteOrder, 
  onSeedMockOrders,
  onClose 
}: AdminDashboardProps) {

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);

  // Computed metrics stats
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const statuses: (Order['status'] | 'All')[] = ['All', 'Received', 'Preparing', 'Baking', 'Ready for Delivery', 'Completed', 'Cancelled'];

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  return (
    <section 
      id="admin-dashboard" 
      className="py-16 bg-white border-t border-b border-primary/10 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Block with Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1 text-primary">
              <Activity size={18} className="animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest font-display">
                Real-Time Studio Monitoring
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

        {/* Tab Filters and Order list */}
        <div className="bg-gradient-to-tr from-[#fff8f5] to-white rounded-3xl border border-primary-container/30 overflow-hidden shadow-sm p-4 md:p-6">
          
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
            <div className="text-center py-12 space-y-2">
              <CakeIcon size={44} className="mx-auto text-primary/30 stroke-[1.2]" />
              <h4 className="font-display text-sm font-bold text-primary">No Matching Orders Found</h4>
              <p className="font-sans text-xs text-on-surface-variant max-w-xs mx-auto">
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
                        <span className="text-[10px] text-on-surface-variant font-normal block">
                          📞 {o.customer.phone}
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
                        <span className="text-[9px] text-[#847375] font-normal block">
                          {o.customer.deliveryType === 'delivery' ? '🚗 Delivered' : '📦 Pickup'}
                        </span>
                      </td>

                      {/* Status Selector dropdown */}
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={o.status}
                          onChange={(e) => onUpdateStatus(o.id, e.target.value as Order['status'])}
                          className={`p-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-colors border focus:outline-none ${
                            o.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                            o.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                            o.status === 'Ready for Delivery' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            o.status === 'Baking' ? 'bg-orange-50 text-orange-700 border-orange-250' :
                            'bg-amber-50 text-amber-700 border-amber-200'
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
                        <button
                          onClick={() => {
                            if(confirm(`Are you absolutely sure you want to dismiss recipe order ${o.id}?`)) {
                              onDeleteOrder(o.id);
                            }
                          }}
                          className="p-2 text-[#847375] hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Order Permanently"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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
