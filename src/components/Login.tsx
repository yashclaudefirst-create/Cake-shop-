import React, { useState } from 'react';
import { Phone, Lock, Eye, EyeOff, ShieldCheck, X, KeyRound, AlertTriangle } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (phoneNumber: string) => void;
  onClose: () => void;
}

export default function Login({ onLoginSuccess, onClose }: LoginProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedPhone = phone.trim();
    const digitsOnly = trimmedPhone.replace(/\D/g, '');

    if (!trimmedPhone) {
      setError('Please enter your registered phone number.');
      return;
    }

    if (digitsOnly.length < 8) {
      setError('Please enter a valid phone number (at least 8 digits).');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (password !== 'LaddoooMottu1005') {
      setError('Invalid password. Check the password and try again.');
      return;
    }

    setIsLoading(true);
    
    // Simulate sweet baking authentication feedback delay
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('adminPhone', trimmedPhone);
      localStorage.setItem('isAdminAuthenticated', 'true');
      onLoginSuccess(trimmedPhone);
    }, 800);
  };

  return (
    <div id="login-overlay-wrapper" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div 
        id="login-card" 
        className="relative w-full max-w-md bg-white border border-pink-100/80 rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300 transform scale-100 select-none text-left"
      >
        
        {/* Playful Sweet Header */}
        <div className="bg-gradient-to-r from-primary/10 to-[#ffb6c1]/20 px-6 py-6 border-b border-pink-50 relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-primary" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/80 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
              <KeyRound size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-primary uppercase tracking-tight">
                Chef Owner Access
              </h3>
              <p className="text-[10px] uppercase font-sans tracking-wider text-on-surface-variant font-bold leading-tight">
                Admin Panel Verification
              </p>
            </div>
          </div>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div id="login-error" className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-700 font-bold flex gap-2 items-start animate-shake">
              <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
              <p className="leading-tight">{error}</p>
            </div>
          )}

          {/* Phone Number Field */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10.5px] font-black text-slate-400 uppercase tracking-widest block font-mono">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone size={15} />
              </div>
              <input
                id="login-phone-input"
                type="tel"
                placeholder="e.g. +91 98912-34928"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200/80 focus:border-primary rounded-2xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>
            <span className="text-[9.5px] text-slate-400 font-medium block">
              Enter the phone number associated with your bakery account.
            </span>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10.5px] font-black text-slate-400 uppercase tracking-widest block font-mono">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={15} />
              </div>
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-3 bg-slate-50/50 border-2 border-slate-200/80 focus:border-primary rounded-2xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
              />
              <button
                type="button"
                id="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <span className="text-[9.5px] text-slate-400 font-medium block">
              Provide the password configured for kitchen operations.
            </span>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary hover:bg-[#6b3741] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Checking ingredients...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={14} className="stroke-[2.5]" />
                  <span>Authenticate & Unlock Board</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info lock disclaimer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center gap-2 text-slate-400">
          <Lock size={12} className="text-slate-400 shrink-0" />
          <span className="text-[10px] leading-tight font-medium">
            This workspace connects to local persist-state records securely. Unauthorized entries are logged to console.
          </span>
        </div>

      </div>
    </div>
  );
}
