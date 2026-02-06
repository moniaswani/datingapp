import React from 'react';
import { Heart, X, MessageCircle, Sparkles } from 'lucide-react';

interface Photo {
  url: string;
  caption?: string;
  rotation: number;
}

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  pitchedBy: string;
  mainPhoto: string;
  photos: Photo[];
  pitch: string;
  interests: string[];
  funFact: string;
  stickers: Array<{ emoji: string; rotation: number; top: string; left: string }>;
}

interface ProfileCardProps {
  profile: Profile;
  onLike: () => void;
  onPass: () => void;
}

export function ProfileCard({ profile, onLike, onPass }: ProfileCardProps) {
  return (
    <div className="relative w-full h-full bg-[#FFF5E4] rounded-3xl shadow-2xl overflow-hidden">
      {/* Scrapbook background texture */}
      <div className="absolute inset-0 opacity-30" 
           style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }}>
      </div>
      
      {/* Content */}
      <div className="relative h-full overflow-y-auto p-6 pb-24">
        {/* Header with tape effect */}
        <div className="relative mb-6">
          <div className="absolute -top-3 left-1/4 w-16 h-6 bg-[#F4A261] opacity-50 rotate-[-5deg]"></div>
          <div className="absolute -top-3 right-1/4 w-16 h-6 bg-[#F4A261] opacity-50 rotate-[8deg]"></div>
          
          <div className="bg-white p-4 shadow-lg border-4 border-white" 
               style={{ transform: 'rotate(-1deg)' }}>
            <p className="text-sm text-[#8B4513]" style={{ fontFamily: "'Caveat', cursive" }}>
              Pitched by: {profile.pitchedBy}
            </p>
          </div>
        </div>

        {/* Main polaroid photo */}
        <div className="relative mb-6">
          <div className="bg-white p-3 pb-12 shadow-2xl border border-[#E9C7A6]" 
               style={{ transform: 'rotate(-2deg)' }}>
            <img 
              src={profile.mainPhoto} 
              alt={profile.name}
              className="w-full aspect-[3/4] object-cover"
            />
            <p className="mt-3 text-center text-[#8B4513]" 
               style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '20px', fontWeight: 600 }}>
              {profile.name}, {profile.age}
            </p>
          </div>
          
          {/* Decorative stickers */}
          {profile.stickers.map((sticker, idx) => (
            <div 
              key={idx}
              className="absolute text-4xl"
              style={{ 
                top: sticker.top, 
                left: sticker.left,
                transform: `rotate(${sticker.rotation}deg)`,
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
              }}
            >
              {sticker.emoji}
            </div>
          ))}
        </div>

        {/* Friend's pitch */}
        <div className="relative mb-6">
          <div className="absolute -top-2 left-8 w-12 h-5 bg-[#E76F51] opacity-60 rotate-[5deg]"></div>
          <div className="bg-[#FFDAB9] p-4 shadow-md border-l-4 border-[#E76F51]" 
               style={{ transform: 'rotate(1deg)' }}>
            <div className="flex items-start gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#D2691E] flex-shrink-0 mt-1" />
              <p className="text-lg text-[#8B4513]" style={{ fontFamily: "'Lilita One', cursive" }}>
                Why you'll love them:
              </p>
            </div>
            <p className="text-[#6B4423] leading-relaxed" style={{ fontFamily: "'Caveat', cursive", fontSize: '20px' }}>
              "{profile.pitch}"
            </p>
          </div>
        </div>

        {/* Additional photos grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {profile.photos.map((photo, idx) => (
            <div 
              key={idx}
              className="bg-white p-2 pb-8 shadow-lg border border-[#E9C7A6]"
              style={{ transform: `rotate(${photo.rotation}deg)` }}
            >
              <img 
                src={photo.url} 
                alt={`Photo ${idx + 1}`}
                className="w-full aspect-square object-cover"
              />
              {photo.caption && (
                <p className="mt-2 text-center text-sm text-[#8B4513]" 
                   style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {photo.caption}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Interests tags */}
        <div className="mb-6">
          <p className="text-lg mb-3 text-[#8B4513]" style={{ fontFamily: "'Lilita One', cursive" }}>
            Loves:
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, idx) => (
              <div 
                key={idx}
                className="bg-[#F4A261] px-3 py-1 shadow-sm border-2 border-white text-white"
                style={{ 
                  transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * (idx % 3 + 1)}deg)`,
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: '15px',
                  fontWeight: 500
                }}
              >
                {interest}
              </div>
            ))}
          </div>
        </div>

        {/* Fun fact */}
        <div className="relative">
          <div className="absolute -top-3 right-4 w-14 h-6 bg-[#E76F51] opacity-50 rotate-[-8deg]"></div>
          <div className="bg-[#FFE5D9] p-4 shadow-md" 
               style={{ transform: 'rotate(-1deg)' }}>
            <p className="text-sm mb-1 text-[#8B4513]" style={{ fontFamily: "'Lilita One', cursive" }}>
              Fun fact:
            </p>
            <p className="text-[#6B4423]" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '20px', letterSpacing: '0.5px' }}>
              {profile.funFact}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent p-6 flex justify-center gap-6">
        <button
          onClick={onPass}
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-[#E9C7A6] hover:scale-110 transition-transform active:scale-95"
        >
          <X className="w-8 h-8 text-[#8B4513]" />
        </button>
        
        <button
          onClick={onLike}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E76F51] to-[#C84A31] shadow-xl flex items-center justify-center border-4 border-white hover:scale-110 transition-transform active:scale-95"
        >
          <Heart className="w-10 h-10 text-white fill-white" />
        </button>
        
        <button
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-[#E9C7A6] hover:scale-110 transition-transform active:scale-95"
        >
          <MessageCircle className="w-8 h-8 text-[#D2691E]" />
        </button>
      </div>
    </div>
  );
}