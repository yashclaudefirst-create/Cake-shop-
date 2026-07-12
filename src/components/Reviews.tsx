import React, { useState } from 'react';
import { Review } from '../types';
import { Star, MessageSquare, Quote, Sparkles, X, PenTool, Heart, Check } from 'lucide-react';

interface ReviewsProps {
  reviews: Review[];
  onSubmitReview?: (review: Review) => void;
}

export default function Reviews({ reviews, onSubmitReview }: ReviewsProps) {
  const displayReviews = reviews || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form fields
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [cakeName, setCakeName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [validationError, setValidationError] = useState('');

  // Rating labels for interactive fun
  const ratingLabels: { [key: number]: string } = {
    1: "Needs improvement 🍰",
    2: "Good 🧁",
    3: "Very delicious! 😋",
    4: "Exquisite craft! ✨",
    5: "Pure baking perfection! 👑"
  };

  const handleOpenModal = () => {
    setAuthor('');
    setRating(5);
    setComment('');
    setCakeName('');
    setAvatar('');
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!comment.trim()) {
      setValidationError('Please share some words about your experience.');
      return;
    }

    const newReview: Review = {
      id: `rev-user-${Date.now()}`,
      author: author.trim(),
      rating: rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      cakeName: cakeName.trim() || undefined,
      avatar: avatar.trim() || undefined
    };

    if (onSubmitReview) {
      onSubmitReview(newReview);
    }

    setIsModalOpen(false);
  };

  return (
    <section id="reviews" className="py-20 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3 relative">
          <span className="p-1 px-3 bg-primary/10 text-primary text-[10px] font-bold rounded-full tracking-widest uppercase">
            Customer Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary tracking-tight flex items-center justify-center gap-2">
            Sweet Whispers of Joy <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto">
            Read real stories from families who celebrated their dreamy moments with our scratch-baked gourmet confectioneries.
          </p>

          <div className="pt-2">
            <button
              onClick={handleOpenModal}
              className="px-5 py-2.5 bg-primary hover:bg-[#6b3741] text-white text-xs font-bold rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 mx-auto cursor-pointer"
            >
              <PenTool size={13} /> Share Your Story
            </button>
          </div>
        </div>

        {/* Testimonials Grid Layout */}
        {displayReviews.length === 0 ? (
          <div className="text-center py-10 bg-[#fff8f5] rounded-3xl border border-primary/5">
            <MessageSquare className="w-10 h-10 text-primary/30 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-500">No customer reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayReviews.map((rev) => (
              <div 
                key={rev.id}
                className="bg-[#fff8f5] rounded-3xl p-6 md:p-8 border border-primary-container/10 relative hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group text-left"
              >
                {/* Quote Icon Background Accent */}
                <div className="absolute top-6 right-6 text-primary/5 group-hover:text-primary/10 transition-colors">
                  <Quote size={50} className="stroke-[1.5]" />
                </div>

                <div className="space-y-4">
                  {/* Star Ratings */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={`${
                          i < rev.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-zinc-200'
                        }`} 
                      />
                    ))}
                  </div>

                  {/* Comment Text */}
                  <p className="font-sans text-xs md:text-sm text-slate-700 leading-relaxed font-medium italic relative z-10">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Author profile & cake tag */}
                <div className="mt-6 pt-6 border-t border-[#d6c2c3]/30 flex items-center gap-3">
                  {rev.avatar ? (
                    <img 
                      src={rev.avatar} 
                      alt={rev.author} 
                      className="w-10 h-10 rounded-full object-cover border border-primary/10"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm font-display">
                      {rev.author.charAt(0)}
                    </div>
                  )}
                  <div className="space-y-0.5 text-left">
                    <h4 className="font-display text-xs font-bold text-primary">
                      {rev.author}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] text-zinc-400 font-semibold font-mono">
                        {rev.date}
                      </span>
                      {rev.cakeName && (
                        <>
                          <span className="text-[9px] text-zinc-300">•</span>
                          <span className="bg-[#fff1ed] text-primary text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider font-sans">
                            {rev.cakeName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CUSTOMER REVIEW SUBMISSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-primary/15 shadow-2xl animate-scale-up text-left flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary to-[#8c525d] text-white p-5 relative shrink-0">
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
              <span className="text-[10px] font-sans text-[#ffcad4] tracking-widest font-bold uppercase block mb-1">
                Sweet Whispers Feedback
              </span>
              <h3 className="font-display text-lg font-black tracking-tight flex items-center gap-2">
                <Heart size={16} className="fill-current" /> Share Your Happy Experience!
              </h3>
            </div>

            {/* Modal Content Scroll Area */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              {validationError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl font-medium leading-relaxed animate-shake">
                  ⚠️ {validationError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-650 uppercase block font-sans">
                  Your Name <span className="text-primary">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Priyanjali Sen"
                  className="w-full bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-primary focus:ring-1 focus:ring-primary placeholder-zinc-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-650 uppercase block font-sans">
                  Your Overall Delight Rating <span className="text-primary">*</span>
                </label>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setRating(starValue)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star 
                          size={24} 
                          className={`${
                            starValue <= rating 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-zinc-200 stroke-zinc-300'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-primary font-mono bg-[#fff1ed] px-2.5 py-1 rounded-full border border-primary/5">
                    {ratingLabels[rating]}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-650 uppercase block font-sans">
                  What item did you purchase? <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <input 
                  type="text"
                  value={cakeName}
                  onChange={(e) => setCakeName(e.target.value)}
                  placeholder="e.g. Belgian Truffle Classic, Macaron Assortment"
                  className="w-full bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-primary focus:ring-1 focus:ring-primary placeholder-zinc-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-650 uppercase block font-sans">
                  Your Review / Experience <span className="text-primary">*</span>
                </label>
                <textarea 
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the fluffiness, the richness of flavor, or how the presentation made your event perfect..."
                  className="w-full bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-primary focus:ring-1 focus:ring-primary placeholder-zinc-400 leading-relaxed resize-none h-24"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-650 uppercase block font-sans">
                  Profile Photo Image URL <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <input 
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#fff8f5] border border-[#d6c2c3]/40 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-primary focus:ring-1 focus:ring-primary placeholder-zinc-400"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary hover:bg-[#6b3741] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Check size={14} /> Submit Review
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </section>
  );
}
