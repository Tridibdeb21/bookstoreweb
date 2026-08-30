import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  User,
  Camera,
  Flame,
  Trophy,
  Award,
  BookOpen,
  PackageCheck,
  ShieldCheck,
  Heart,
  Edit2,
  Check
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateUserProfile, setActiveView, shelf } = useStore();
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(user.yearlyGoal.toString());

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        updateUserProfile({ profileImageBase64: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGoal = () => {
    const parsed = parseInt(newGoal, 10);
    if (!isNaN(parsed) && parsed > 0) {
      updateUserProfile({ yearlyGoal: parsed });
    }
    setIsEditingGoal(false);
  };

  const toggleRole = () => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    updateUserProfile({ role: newRole });
  };

  const BADGES = [
    {
      id: 'First Step',
      title: 'First Step',
      desc: 'Completed your first book',
      unlocked: user.unlockedBadges.includes('First Step')
    },
    {
      id: 'Halfway There',
      title: 'Halfway There',
      desc: 'Reached 50% of annual reading goal',
      unlocked: user.unlockedBadges.includes('Halfway There')
    },
    {
      id: 'Goal Achiever',
      title: 'Goal Achiever',
      desc: 'Finished all books in your annual goal',
      unlocked: user.unlockedBadges.includes('Goal Achiever')
    },
    {
      id: 'Bibliophile',
      title: 'Bibliophile',
      desc: 'Added 10+ books to your personal shelf',
      unlocked: shelf.length >= 10
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar with upload trigger */}
        <div className="relative group">
          {user.profileImageBase64 ? (
            <img
              src={`data:image/jpeg;base64,${user.profileImageBase64}`}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-amber-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-3xl font-black shadow-lg">
              {user.email[0].toUpperCase()}
            </div>
          )}

          <label
            htmlFor="profile-image-input"
            className="absolute bottom-0 right-0 p-2 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md cursor-pointer transition-transform group-hover:scale-110"
            title="Change Avatar"
          >
            <Camera className="w-4 h-4" />
            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* User Details */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              {user.email.split('@')[0]}
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                user.role === 'admin'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-stone-100 text-stone-700 border border-stone-300'
              }`}
            >
              {user.role}
            </span>
          </div>

          <p className="text-xs text-stone-500 font-medium">{user.email}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <button
              onClick={toggleRole}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-300 transition cursor-pointer"
            >
              Switch Role to: {user.role === 'admin' ? 'Regular User' : 'Administrator'}
            </button>
          </div>
        </div>
      </div>

      {/* Reading Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Streak */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-bold uppercase">Reading Streak</div>
            <div className="text-2xl font-black text-stone-900">{user.readingStreak} Days</div>
          </div>
        </div>

        {/* Finished Books */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-bold uppercase">Books Finished</div>
            <div className="text-2xl font-black text-stone-900">
              {user.booksFinishedThisYear} Books
            </div>
          </div>
        </div>

        {/* Annual Goal */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-stone-500 font-bold uppercase">Yearly Goal</div>
              {isEditingGoal ? (
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    className="w-16 p-1 text-xs border border-stone-300 rounded font-bold"
                  />
                  <button
                    onClick={handleSaveGoal}
                    className="p-1 bg-stone-900 text-white rounded hover:bg-stone-800"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-2xl font-black text-stone-900">{user.yearlyGoal} Target</div>
              )}
            </div>
          </div>

          {!isEditingGoal && (
            <button
              onClick={() => setIsEditingGoal(true)}
              className="p-2 text-stone-400 hover:text-stone-700"
              title="Edit Goal"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Badges / Achievements */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Reading Badges & Milestones
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition text-center flex flex-col items-center justify-between ${
                badge.unlocked
                  ? 'bg-amber-50/60 border-amber-300 text-stone-900 shadow-sm'
                  : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  badge.unlocked
                    ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                    : 'bg-stone-200 text-stone-400'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-stone-900">{badge.title}</h4>
              <p className="text-xs text-stone-500 mt-1">{badge.desc}</p>
              <span
                className={`text-[10px] font-black uppercase mt-3 px-2 py-0.5 rounded-full ${
                  badge.unlocked
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {badge.unlocked ? 'Unlocked' : 'In Progress'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveView('orders')}
          className="p-5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 shadow-sm flex items-center justify-between transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <PackageCheck className="w-5 h-5 text-amber-600" />
            <div>
              <h4 className="font-bold text-sm text-stone-900">Order History</h4>
              <p className="text-xs text-stone-500">Track shipments & returns</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveView('shelf')}
          className="p-5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 shadow-sm flex items-center justify-between transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <div>
              <h4 className="font-bold text-sm text-stone-900">Personal Shelf</h4>
              <p className="text-xs text-stone-500">View Time Capsules</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveView('wishlist')}
          className="p-5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 shadow-sm flex items-center justify-between transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-rose-600" />
            <div>
              <h4 className="font-bold text-sm text-stone-900">Wishlist</h4>
              <p className="text-xs text-stone-500">Saved favorites</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
