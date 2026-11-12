import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Workout, BAEvent } from '../../types';
import {
  X,
  Shield,
  Plus,
  Send,
  Award,
  Calendar,
  BarChart3,
  Users,
  Download,
  Trash2,
  TreePine,
  Check
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const {
    showAdminModal,
    setShowAdminModal,
    workouts,
    events,
    badges,
    addWorkoutAdmin,
    deleteWorkoutAdmin,
    addEventAdmin,
    awardBadgeAdmin,
    broadcastAnnouncementAdmin,
    exportDataJSON,
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'workouts' | 'events' | 'announcements' | 'badges'>('analytics');

  // Form states for creating a new workout
  const [newWorkoutTitle, setNewWorkoutTitle] = useState('');
  const [newWorkoutCategory, setNewWorkoutCategory] = useState<'Strength' | 'Bodyweight' | 'Cardio' | 'Mobility'>('Bodyweight');
  const [newWorkoutDuration, setNewWorkoutDuration] = useState(30);
  const [newWorkoutDesc, setNewWorkoutDesc] = useState('');

  // Form state for creating an event
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventCapacity, setNewEventCapacity] = useState(50);
  const [newEventDesc, setNewEventDesc] = useState('');

  // Announcement state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');

  if (!showAdminModal) return null;

  const handleCreateWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkoutTitle.trim()) return;

    const createdWorkout: Workout = {
      id: `w-${Date.now()}`,
      title: newWorkoutTitle.trim(),
      category: newWorkoutCategory,
      subcategory: 'Pride Special',
      difficulty: 'Intermediate',
      durationMinutes: newWorkoutDuration,
      estimatedCalories: newWorkoutDuration * 9,
      xpReward: 250,
      description: newWorkoutDesc.trim() || 'Custom regimen published by BA Coach.',
      equipmentRequired: 'Standard',
      exercises: [
        { exerciseId: 'ex-pushups', sets: 4, reps: '15 reps', restSec: 45 },
        { exerciseId: 'ex-squats', sets: 4, reps: '20 reps', restSec: 45 },
        { exerciseId: 'ex-planks', sets: 3, reps: '60 secs', restSec: 45 }
      ]
    };

    addWorkoutAdmin(createdWorkout);
    setNewWorkoutTitle('');
    setNewWorkoutDesc('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const createdEvent: BAEvent = {
      id: `event-${Date.now()}`,
      title: newEventTitle.trim(),
      type: 'Hike',
      date: newEventDate || 'Saturday, Next Month',
      time: '06:00 AM EAT',
      location: newEventLocation || 'Rift Valley Escarpment',
      description: newEventDesc || 'Brotherhood wilderness expedition.',
      capacity: newEventCapacity,
      registeredCount: 1,
      isRegistered: false,
      leadCoach: 'Coach Kwame Osei',
      xpReward: 350,
      gearRequired: ['Trail Boots', 'Ruck Pack', 'Hydration bladder']
    };

    addEventAdmin(createdEvent);
    setNewEventTitle('');
    setNewEventLocation('');
    setNewEventDesc('');
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;
    broadcastAnnouncementAdmin(announcementTitle, announcementMsg);
    setAnnouncementTitle('');
    setAnnouncementMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#070e0a] border border-[#1b3d28] rounded-3xl p-5 sm:p-7 shadow-2xl my-auto text-[#f4f1ea]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#14261b] pb-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#172d1f] text-[var(--accent-main)] border border-[#2b553a]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-wider">
                BA CHALLENGE PORTAL
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-['Cinzel'] text-[#f5ebd7]">
                Coach & Admin Command Center
              </h2>
            </div>
          </div>
          <button
            onClick={() => setShowAdminModal(false)}
            className="p-1.5 rounded-full bg-[#0e1811] text-[#869f8f] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center space-x-2 border-b border-[#14261a] pb-3 mb-4 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#183d28] text-[#86efac] border border-[#2b6441]'
                : 'text-[#7d9987] hover:text-[#b4c4b9]'
            }`}
          >
            Pride Analytics
          </button>
          <button
            onClick={() => setActiveTab('workouts')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'workouts'
                ? 'bg-[#183d28] text-[#86efac] border border-[#2b6441]'
                : 'text-[#7d9987] hover:text-[#b4c4b9]'
            }`}
          >
            Workouts Manager ({workouts.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'events'
                ? 'bg-[#183d28] text-[#86efac] border border-[#2b6441]'
                : 'text-[#7d9987] hover:text-[#b4c4b9]'
            }`}
          >
            BA Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'announcements'
                ? 'bg-[#183d28] text-[#86efac] border border-[#2b6441]'
                : 'text-[#7d9987] hover:text-[#b4c4b9]'
            }`}
          >
            Broadcast
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'badges'
                ? 'bg-[#183d28] text-[#86efac] border border-[#2b6441]'
                : 'text-[#7d9987] hover:text-[#b4c4b9]'
            }`}
          >
            Award Badges
          </button>
        </div>

        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#09150e] border border-[#193322]">
                <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">Active Members</span>
                <p className="text-xl font-black text-[#f5ebd7]">528</p>
                <span className="text-[10px] text-[#86efac]">+14 this week</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#09150e] border border-[#193322]">
                <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">DAU / WAU</span>
                <p className="text-xl font-black text-[#f5ebd7]">342 / 498</p>
                <span className="text-[10px] text-[#86efac]">84% engagement</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#09150e] border border-[#193322]">
                <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">Avg Panther Streak</span>
                <p className="text-xl font-black text-amber-400">12.4 Days</p>
                <span className="text-[10px] text-[#8da696]">No man left behind</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#09150e] border border-[#193322]">
                <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">Trees Planted</span>
                <p className="text-xl font-black text-[#86efac]">9,570 Trees</p>
                <span className="text-[10px] text-[#86efac]">Green Legacy</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#09150e] border border-[#1b3826] space-y-2">
              <h4 className="text-xs font-bold text-[#f5ebd7]">System Data Export & Backups</h4>
              <p className="text-xs text-[#8ea496]">
                Download all pride member records, challenge logs, and event registries as portable JSON.
              </p>
              <button
                onClick={exportDataJSON}
                className="px-4 py-2 rounded-xl bg-[#163823] hover:bg-[#204a30] text-xs font-bold text-[#86efac] border border-[#27643e] flex items-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Pride Records</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: WORKOUTS MANAGER */}
        {activeTab === 'workouts' && (
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
            {/* Create Workout Form */}
            <form onSubmit={handleCreateWorkout} className="p-4 rounded-2xl bg-[#09150e] border border-[#1b3826] space-y-3">
              <h4 className="text-xs font-bold text-[var(--accent-main)] uppercase tracking-wider">Publish New Regimen</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  value={newWorkoutTitle}
                  onChange={(e) => setNewWorkoutTitle(e.target.value)}
                  placeholder="Workout Title (e.g. Mara Ridge Ruck)"
                  className="px-3 py-2 rounded-xl bg-[#0e1c14] border border-[#1e3d29] text-[#f4f1ea] focus:outline-none"
                />
                <select
                  value={newWorkoutCategory}
                  onChange={(e) => setNewWorkoutCategory(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#0e1c14] border border-[#1e3d29] text-[#f4f1ea] focus:outline-none"
                >
                  <option value="Bodyweight">Bodyweight (No Equipment)</option>
                  <option value="Strength">Strength (Iron/Weights)</option>
                  <option value="Cardio">Cardio (Trails/Ruck)</option>
                  <option value="Mobility">Mobility & Stretches</option>
                </select>
              </div>
              <input
                type="text"
                value={newWorkoutDesc}
                onChange={(e) => setNewWorkoutDesc(e.target.value)}
                placeholder="Description & coaching objective..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0e1c14] border border-[#1e3d29] text-[#f4f1ea] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1b4b30] text-xs font-bold text-[#86efac] border border-[#2b7249] flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Workout</span>
              </button>
            </form>

            {/* List existing workouts */}
            <div className="space-y-2 text-xs">
              {workouts.map((w) => (
                <div
                  key={w.id}
                  className="p-3 rounded-xl bg-[#09130d] border border-[#172e20] flex items-center justify-between"
                >
                  <div>
                    <h5 className="font-bold text-[#f5ebd7]">{w.title}</h5>
                    <span className="text-[10px] text-[#7d9987]">
                      {w.category} • {w.durationMinutes}m • {w.exercises.length} exercises
                    </span>
                  </div>
                  {workouts.length > 1 && (
                    <button
                      onClick={() => deleteWorkoutAdmin(w.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EVENTS MANAGER */}
        {activeTab === 'events' && (
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
            <form onSubmit={handleCreateEvent} className="p-4 rounded-2xl bg-[#09150e] border border-[#1b3826] space-y-3">
              <h4 className="text-xs font-bold text-[var(--accent-main)] uppercase tracking-wider">Publish Upcoming BA Event</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Event Title"
                  className="px-3 py-2 rounded-xl bg-[#0e1c14] border border-[#1e3d29] text-[#f4f1ea] focus:outline-none"
                />
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  placeholder="Trail Location"
                  className="px-3 py-2 rounded-xl bg-[#0e1c14] border border-[#1e3d29] text-[#f4f1ea] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1b4b30] text-xs font-bold text-[#86efac] border border-[#2b7249] flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish BA Event</span>
              </button>
            </form>

            <div className="space-y-2 text-xs">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-[#09130d] border border-[#172e20] flex items-center justify-between"
                >
                  <div>
                    <h5 className="font-bold text-[#f5ebd7]">{ev.title}</h5>
                    <span className="text-[10px] text-[#7d9987]">
                      {ev.date} • {ev.location} • {ev.registeredCount}/{ev.capacity} RSVPs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BROADCAST ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <form onSubmit={handleSendAnnouncement} className="space-y-3">
            <h4 className="text-xs font-bold text-[var(--accent-main)] uppercase tracking-wider">
              Send Broadcast To All Panthers
            </h4>
            <input
              type="text"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              placeholder="Announcement Headline"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0e1c14] border border-[#1e3d29] text-[#f4f1ea] focus:outline-none"
            />
            <textarea
              value={announcementMsg}
              onChange={(e) => setAnnouncementMsg(e.target.value)}
              placeholder="Message to the pride..."
              rows={4}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0e1c14] border border-[#1e3d29] text-[#f4f1ea] focus:outline-none resize-none"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1b5336] text-xs font-bold text-[#86efac] border border-[#2b7249] flex items-center space-x-2 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Announcement</span>
            </button>
          </form>
        )}

        {/* TAB 5: AWARD BADGES */}
        {activeTab === 'badges' && (
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold text-[var(--accent-main)] uppercase tracking-wider">
              Honorary Badge Awarding
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-[#09130d] border border-[#172e20] flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{b.icon}</span>
                    <div>
                      <h5 className="font-bold text-[#f5ebd7]">{b.title}</h5>
                      <span className="text-[10px] text-[#7d9987]">{b.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => awardBadgeAdmin(b.id)}
                    className="px-2.5 py-1 rounded-lg bg-[#143220] hover:bg-[#1a422b] text-[#86efac] font-bold text-[10px] border border-[#205133]"
                  >
                    Award Badge
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
