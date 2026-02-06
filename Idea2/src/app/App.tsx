import React, { useEffect, useMemo, useState } from 'react';
import { ProfileCard } from './components/ProfileCard';
import { Heart, Users } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:5174';

type Profile = {
  id: string | number;
  name: string;
  age: number;
  location: string;
  pitchedBy: string;
  mainPhoto: string;
  photos: { url: string; caption: string; rotation: number }[];
  pitch: string;
  interests: string[];
  funFact: string;
  stickers: { emoji: string; rotation: number; top: string; left: string }[];
};

const fallbackProfiles: Profile[] = [
  {
    id: 1,
    name: 'Sarah',
    age: 28,
    location: 'Brooklyn, NY',
    pitchedBy: 'Emma (BFF since college)',
    mainPhoto: 'https://images.unsplash.com/photo-1614436201459-156d322d38c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDMyMDMxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1507138086030-616c3b6dd768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwbGlmZXN0eWxlfGVufDF8fHx8MTc3MDMwMzc5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Coffee enthusiast ☕',
        rotation: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1581153438971-3222a5814529?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjBvdXRkb29yJTIwYWR2ZW50dXJlfGVufDF8fHx8MTc3MDI4MzgzMXww&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Adventure seeker',
        rotation: -3
      }
    ],
    pitch: 'Sarah is literally the warmest person you\'ll ever meet. She bakes cookies for her neighbors, volunteers at the animal shelter every weekend, and her laugh is absolutely contagious. Plus, she makes the BEST playlists!',
    interests: ['Hiking', 'Baking', 'Indie Music', 'Book Clubs', 'Dogs'],
    funFact: 'She once backpacked through 12 countries with just a carry-on!',
    stickers: [
      { emoji: '🌟', rotation: -15, top: '15%', left: '85%' },
      { emoji: '💕', rotation: 20, top: '35%', left: '5%' },
      { emoji: '✨', rotation: -10, top: '50%', left: '90%' }
    ]
  },
  {
    id: 2,
    name: 'Alex',
    age: 30,
    location: 'Austin, TX',
    pitchedBy: 'Mike (roommate & wingman)',
    mainPhoto: 'https://images.unsplash.com/photo-1543132220-e7fef0b974e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGNhc3VhbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDI2Nzg5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1625631980634-397b9e9a73f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBjb29raW5nJTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzAzMzU5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Chef mode 👨‍🍳',
        rotation: -2
      },
      {
        url: 'https://images.unsplash.com/photo-1635367216109-aa3353c0c22e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwd2VsbmVzcyUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NzAzNDYyNzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Zen life',
        rotation: 3
      }
    ],
    pitch: 'This guy is the total package - he cooks like a pro chef, plays guitar, and has the best taste in movies. He\'s incredibly thoughtful and always remembers the little things. Trust me, you want to meet him!',
    interests: ['Cooking', 'Guitar', 'Film', 'Yoga', 'Travel'],
    funFact: 'He can solve a Rubik\'s cube in under 2 minutes blindfolded!',
    stickers: [
      { emoji: '🎸', rotation: 15, top: '20%', left: '10%' },
      { emoji: '🔥', rotation: -20, top: '40%', left: '80%' },
      { emoji: '⭐', rotation: 10, top: '55%', left: '8%' }
    ]
  }
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    pitchedBy: '',
    mainPhoto: '',
    extraPhotos: '',
    pitch: '',
    interests: '',
    funFact: ''
  });

  const visibleProfiles = useMemo(() => {
    if (profiles.length > 0) return profiles;
    return fallbackProfiles;
  }, [profiles]);

  useEffect(() => {
    let isActive = true;

    const loadProfiles = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await fetch(`${API_BASE}/api/profiles`);
        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`);
        }
        const data = await response.json();
        if (isActive) {
          setProfiles(Array.isArray(data.profiles) ? data.profiles : []);
        }
      } catch (error) {
        if (isActive) {
          setLoadError('Could not reach the backend. Showing fallback profiles.');
          setProfiles([]);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadProfiles();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (currentIndex >= visibleProfiles.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, visibleProfiles.length]);

  const currentProfile = visibleProfiles[currentIndex];

  const sendAction = async (profileId: string | number, action: 'like' | 'pass') => {
    try {
      await fetch(`${API_BASE}/api/profiles/${profileId}/${action}`, {
        method: 'POST'
      });
    } catch (error) {
      // Silent fail for now: UI still advances.
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        age: Number.parseInt(formData.age, 10),
        location: formData.location.trim(),
        pitchedBy: formData.pitchedBy.trim(),
        mainPhoto: formData.mainPhoto.trim(),
        pitch: formData.pitch.trim(),
        interests: formData.interests
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        funFact: formData.funFact.trim(),
        photos: formData.extraPhotos
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .map((url) => ({ url, caption: '', rotation: 0 })),
        stickers: []
      };

      const response = await fetch(`${API_BASE}/api/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const details = errorData?.details?.join(', ');
        throw new Error(details || `Backend error: ${response.status}`);
      }

      const data = await response.json();
      if (data?.profile) {
        setProfiles((prev) => [data.profile, ...prev]);
        setFormData({
          name: '',
          age: '',
          location: '',
          pitchedBy: '',
          mainPhoto: '',
          extraPhotos: '',
          pitch: '',
          interests: '',
          funFact: ''
        });
        setCurrentIndex(0);
      }
    } catch (error) {
      setSubmitError('Could not submit the profile. Please check the fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = () => {
    if (!currentProfile) return;
    setLikedProfiles([...likedProfiles, Number(currentProfile.id)]);
    sendAction(currentProfile.id, 'like');
    nextProfile();
  };

  const handlePass = () => {
    if (currentProfile) {
      sendAction(currentProfile.id, 'pass');
    }
    nextProfile();
  };

  const nextProfile = () => {
    if (currentIndex < visibleProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5D9] via-[#FFF5E4] to-[#F4A261] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-8 h-8 text-[#E76F51] fill-[#E76F51]" />
            <h1 className="text-5xl text-[#8B4513]" style={{ fontFamily: "'Righteous', cursive" }}>
              Wingmate
            </h1>
          </div>
          <p className="text-[#8B4513]" style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '18px' }}>
            Where friends play cupid 💘
          </p>
        </div>

        {/* Profile Card */}
        <div className="h-[calc(100vh-180px)] max-h-[700px]">
          {isLoading && (
            <div className="h-full flex items-center justify-center text-[#8B4513]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Loading profiles...
            </div>
          )}
          {!isLoading && !currentProfile && (
            <div className="h-full flex items-center justify-center text-[#8B4513]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              No profiles yet. Have a friend pitch someone!
            </div>
          )}
          {!isLoading && currentProfile && (
            <ProfileCard 
              profile={currentProfile}
              onLike={handleLike}
              onPass={handlePass}
            />
          )}
        </div>

        {/* Pitch a friend */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-5">
          <h2 className="text-2xl text-[#8B4513] mb-3" style={{ fontFamily: "'Righteous', cursive" }}>
            Pitch a Friend
          </h2>
          <p className="text-sm text-[#8B4513] mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Help your single friend shine. Fill out the essentials and we’ll add them to the deck.
          </p>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
            <input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Friend's name"
              className="rounded-2xl px-4 py-3 border border-[#F4A261]/40 text-[#8B4513]"
              required
            />
            <input
              name="age"
              value={formData.age}
              onChange={handleFormChange}
              placeholder="Age"
              type="number"
              min="18"
              className="rounded-2xl px-4 py-3 border border-[#F4A261]/40 text-[#8B4513]"
              required
            />
            <input
              name="location"
              value={formData.location}
              onChange={handleFormChange}
              placeholder="Location"
              className="rounded-2xl px-4 py-3 border border-[#F4A261]/40 text-[#8B4513]"
              required
            />
            <input
              name="pitchedBy"
              value={formData.pitchedBy}
              onChange={handleFormChange}
              placeholder="Pitched by (you)"
              className="rounded-2xl px-4 py-3 border border-[#F4A261]/40 text-[#8B4513]"
              required
            />
            <input
              name="mainPhoto"
              value={formData.mainPhoto}
              onChange={handleFormChange}
              placeholder="Main photo URL"
              className="rounded-2xl px-4 py-3 border border-[#F4A261]/40 text-[#8B4513]"
              required
            />
            <input
              name="extraPhotos"
              value={formData.extraPhotos}
              onChange={handleFormChange}
              placeholder="Extra photo URLs (comma separated)"
              className="rounded-2xl px-4 py-3 border border-[#F4A261]/40 text-[#8B4513]"
            />
            <textarea
              name="pitch"
              value={formData.pitch}
              onChange={handleFormChange}
              placeholder="Why should someone meet them?"
              rows={3}
              className="rounded-2xl px-4 py-3 border border-[#F4A261]/40 text-[#8B4513]"
            />
            <input
              name="interests"
              value={formData.interests}
              onChange={handleFormChange}
              placeholder="Interests (comma separated)"
              className="rounded-2xl px-4 py-3 border border-[#F4A261]/40 text-[#8B4513]"
            />
            <input
              name="funFact"
              value={formData.funFact}
              onChange={handleFormChange}
              placeholder="Fun fact"
              className="rounded-2xl px-4 py-3 border border-[#F4A261]/40 text-[#8B4513]"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl px-4 py-3 bg-[#E76F51] text-white font-semibold shadow-md disabled:opacity-70"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {isSubmitting ? 'Submitting...' : 'Add to Deck'}
            </button>
            {submitError && (
              <div className="text-sm text-[#8B4513]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                {submitError}
              </div>
            )}
          </form>
        </div>

        {loadError && (
          <div className="mt-4 text-center text-sm text-[#8B4513]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {loadError}
          </div>
        )}

        {/* Footer stats */}
        <div className="mt-4 flex justify-center gap-4 text-center">
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8B4513]" />
              <span className="text-sm text-[#8B4513]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                {visibleProfiles.length === 0 ? 0 : currentIndex + 1} of {visibleProfiles.length}
              </span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#E76F51] fill-[#E76F51]" />
              <span className="text-sm text-[#8B4513]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                {likedProfiles.length} liked
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
