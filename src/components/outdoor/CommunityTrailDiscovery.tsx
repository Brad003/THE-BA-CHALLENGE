import React, { useState, useMemo } from 'react';
import { CommunityTrail, TrailActivityType, TrailDifficulty, TrailSurfaceType } from '../../types/trails';
import { INITIAL_COMMUNITY_TRAILS } from '../../data/communityTrailsData';
import { CommunityGoogleMap } from './CommunityGoogleMap';
import {
  Search,
  Filter,
  Navigation,
  Mountain,
  Heart,
  Bookmark,
  Share2,
  Plus,
  Star,
  CheckCircle,
  MapPin,
  Clock,
  Zap,
  Flame,
  Shield,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
  X,
  Footprints,
  Compass,
  Award
} from 'lucide-react';

interface CommunityTrailDiscoveryProps {
  onLoadTrailToTracker: (trail: CommunityTrail) => void;
  userPos?: { lat: number; lng: number } | null;
}

export const CommunityTrailDiscovery: React.FC<CommunityTrailDiscoveryProps> = ({
  onLoadTrailToTracker,
  userPos
}) => {
  // Load community trails from storage or initial seed data
  const [trails, setTrails] = useState<CommunityTrail[]>(() => {
    const saved = localStorage.getItem('panther_community_trails');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved trails', e);
      }
    }
    return INITIAL_COMMUNITY_TRAILS;
  });

  const [selectedTrailId, setSelectedTrailId] = useState<string>(trails[0]?.id || '');
  const [activeSportFilter, setActiveSportFilter] = useState<'all' | TrailActivityType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | TrailDifficulty>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'elevation' | 'kudos'>('rating');

  // Modal for contributing a new route
  const [showContributeModal, setShowContributeModal] = useState<boolean>(false);
  const [newRouteForm, setNewRouteForm] = useState({
    name: '',
    activityType: 'running' as TrailActivityType,
    location: '',
    region: 'Nairobi & Greater Rift',
    distanceKm: 12.0,
    elevationGainMeters: 180,
    peakAltitudeMeters: 1850,
    difficulty: 'Moderate' as TrailDifficulty,
    surfaceType: 'mixed_terrain' as TrailSurfaceType,
    description: '',
    highlights: '',
    safetyNotes: ''
  });

  // Filter & Sort Logic
  const filteredTrails = useMemo(() => {
    return trails
      .filter((trail) => {
        // Sport filter
        if (activeSportFilter !== 'all' && trail.activityType !== activeSportFilter) {
          return false;
        }
        // Difficulty filter
        if (difficultyFilter !== 'all' && trail.difficulty !== difficultyFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = trail.name.toLowerCase().includes(q);
          const matchLoc = trail.location.toLowerCase().includes(q);
          const matchDesc = trail.description.toLowerCase().includes(q);
          const matchTags = trail.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchLoc && !matchDesc && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'distance') return b.distanceKm - a.distanceKm;
        if (sortBy === 'elevation') return b.elevationGainMeters - a.elevationGainMeters;
        if (sortBy === 'kudos') return b.kudosCount - a.kudosCount;
        return 0;
      });
  }, [trails, activeSportFilter, difficultyFilter, searchQuery, sortBy]);

  const selectedTrail = useMemo(() => {
    return trails.find((t) => t.id === selectedTrailId) || filteredTrails[0] || null;
  }, [trails, selectedTrailId, filteredTrails]);

  // Handle Kudos click
  const handleToggleKudos = (trailId: string) => {
    setTrails((prev) => {
      const updated = prev.map((t) => {
        if (t.id === trailId) {
          const liked = !t.userLiked;
          return {
            ...t,
            userLiked: liked,
            kudosCount: liked ? t.kudosCount + 1 : Math.max(0, t.kudosCount - 1)
          };
        }
        return t;
      });
      localStorage.setItem('panther_community_trails', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle Bookmark click
  const handleToggleBookmark = (trailId: string) => {
    setTrails((prev) => {
      const updated = prev.map((t) => {
        if (t.id === trailId) {
          return { ...t, userSaved: !t.userSaved };
        }
        return t;
      });
      localStorage.setItem('panther_community_trails', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle User Route Contribution Submission
  const handleSubmitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteForm.name.trim() || !newRouteForm.location.trim()) return;

    // Generate pseudo-waypoints near central hub or based on input
    const baseLat = -1.2921;
    const baseLng = 36.8219;
    const waypointsCount = 6;
    const generatedWaypoints = Array.from({ length: waypointsCount }).map((_, idx) => {
      const offsetLat = (idx - waypointsCount / 2) * 0.008;
      const offsetLng = Math.sin(idx) * 0.009;
      return {
        lat: baseLat + offsetLat,
        lng: baseLng + offsetLng,
        ele: 1680 + idx * 25,
        label: idx === 0 ? 'Trailhead' : idx === waypointsCount - 1 ? 'Finish Sector' : `Checkpoint ${idx}`
      };
    });

    const newTrail: CommunityTrail = {
      id: `user-contrib-${Date.now()}`,
      name: newRouteForm.name,
      activityType: newRouteForm.activityType,
      location: newRouteForm.location,
      region: newRouteForm.region,
      distanceKm: Number(newRouteForm.distanceKm),
      elevationGainMeters: Number(newRouteForm.elevationGainMeters),
      peakAltitudeMeters: Number(newRouteForm.peakAltitudeMeters),
      estimatedDurationMin: Math.round(
        newRouteForm.activityType === 'cycling'
          ? (Number(newRouteForm.distanceKm) / 22) * 60
          : (Number(newRouteForm.distanceKm) / 10.5) * 60
      ),
      difficulty: newRouteForm.difficulty,
      surfaceType: newRouteForm.surfaceType,
      trafficLevel: 'low_quiet_roads',
      contributedBy: {
        id: 'current-user',
        name: 'You (Athlete Member)',
        username: '@you_athlete',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Trail Contributor',
        verifiedAthlete: true
      },
      rating: 5.0,
      reviewCount: 1,
      kudosCount: 1,
      description: newRouteForm.description || 'Community contributed route for training and endurance.',
      highlights: newRouteForm.highlights
        ? newRouteForm.highlights.split(',').map((h) => h.trim())
        : ['Community verified segment', 'Scenic elevation profile'],
      safetyNotes: newRouteForm.safetyNotes || 'Carry sufficient hydration and follow local trail guidelines.',
      center: { lat: baseLat, lng: baseLng },
      waypoints: generatedWaypoints,
      tags: ['Community Added', newRouteForm.activityType, newRouteForm.difficulty],
      createdAt: new Date().toISOString().split('T')[0],
      userLiked: true,
      userSaved: true
    };

    const updated = [newTrail, ...trails];
    setTrails(updated);
    localStorage.setItem('panther_community_trails', JSON.stringify(updated));
    setSelectedTrailId(newTrail.id);
    setShowContributeModal(false);

    // Reset form
    setNewRouteForm({
      name: '',
      activityType: 'running',
      location: '',
      region: 'Nairobi & Greater Rift',
      distanceKm: 12.0,
      elevationGainMeters: 180,
      peakAltitudeMeters: 1850,
      difficulty: 'Moderate',
      surfaceType: 'mixed_terrain',
      description: '',
      highlights: '',
      safetyNotes: ''
    });
  };

  // Surface label formatter
  const formatSurface = (type: TrailSurfaceType) => {
    switch (type) {
      case 'paved_road':
        return 'Paved Asphalt';
      case 'gravel':
        return 'Gravel Grinder';
      case 'singletrack_dirt':
        return 'Singletrack Dirt';
      case 'forest_path':
        return 'Forest Trail';
      default:
        return 'Mixed Terrain';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Contribute Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#08170e]/95 border border-[#1a3a26] rounded-2xl p-4 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#143821] text-[var(--accent-main)] border border-[#235835]">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="font-['Cinzel'] text-sm font-black uppercase tracking-wider text-[#f5ebd7]">
              Community Trail Discovery Map
            </h3>
          </div>
          <p className="text-[11px] text-[#7d9385] max-w-md">
            Explore and track popular running and cycling routes contributed by local athletes across Nairobi, the Great Rift Valley, and highland tea estates.
          </p>
        </div>

        <button
          onClick={() => setShowContributeModal(true)}
          className="flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[var(--accent-main)] to-[#b5852b] text-black text-xs font-bold shadow-md hover:brightness-110 transition-all self-start sm:self-auto flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Contribute Route</span>
        </button>
      </div>

      {/* Sport Category Filter Tabs */}
      <div className="grid grid-cols-4 gap-1.5 bg-[#09170e] p-1.5 rounded-2xl border border-[#163622]">
        <button
          onClick={() => setActiveSportFilter('all')}
          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
            activeSportFilter === 'all'
              ? 'bg-[#1b432a] text-[#f5ebd7] shadow-md'
              : 'text-[#7d9385] hover:text-[#c4d6cb]'
          }`}
        >
          <span>All Routes</span>
          <span className="text-[10px] opacity-75">({trails.length})</span>
        </button>

        <button
          onClick={() => setActiveSportFilter('running')}
          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeSportFilter === 'running'
              ? 'bg-emerald-900/70 border border-emerald-500/50 text-[#e6f4ec] shadow-md'
              : 'text-[#7d9385] hover:text-[#c4d6cb]'
          }`}
        >
          <span>🏃</span>
          <span>Running</span>
        </button>

        <button
          onClick={() => setActiveSportFilter('cycling')}
          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeSportFilter === 'cycling'
              ? 'bg-amber-900/70 border border-amber-500/50 text-[#f5ebd7] shadow-md'
              : 'text-[#7d9385] hover:text-[#c4d6cb]'
          }`}
        >
          <span>🚴</span>
          <span>Cycling</span>
        </button>

        <button
          onClick={() => setActiveSportFilter('hiking')}
          className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeSportFilter === 'hiking'
              ? 'bg-orange-900/70 border border-orange-500/50 text-[#f5ebd7] shadow-md'
              : 'text-[#7d9385] hover:text-[#c4d6cb]'
          }`}
        >
          <span>🥾</span>
          <span>Hiking</span>
        </button>
      </div>

      {/* Search & Difficulty Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7d9385] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by route, region, gravel, elevation..."
            className="w-full bg-[#08170e] border border-[#163622] rounded-xl pl-9 pr-3 py-2 text-xs text-[#f5ebd7] placeholder-[#5c7564] focus:outline-none focus:border-[var(--accent-main)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7d9385] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Difficulty Dropdown */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="bg-[#08170e] border border-[#163622] rounded-xl px-2.5 py-2 text-xs text-[#8ea496] focus:outline-none focus:border-[var(--accent-main)]"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Moderate">Moderate</option>
            <option value="Challenging">Challenging</option>
            <option value="Extreme">Extreme</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#08170e] border border-[#163622] rounded-xl px-2.5 py-2 text-xs text-[#8ea496] focus:outline-none focus:border-[var(--accent-main)]"
          >
            <option value="rating">Top Rated ★</option>
            <option value="distance">Longest Distance</option>
            <option value="elevation">Highest Climb</option>
            <option value="kudos">Most Kudos</option>
          </select>
        </div>
      </div>

      {/* Interactive Google Maps Platform Trail Discovery Map */}
      <CommunityGoogleMap
        trails={filteredTrails}
        selectedTrail={selectedTrail}
        onSelectTrail={(trail) => setSelectedTrailId(trail.id)}
        userPos={userPos}
        onLoadTrailToTracker={onLoadTrailToTracker}
      />

      {/* Detailed Inspection Card for Currently Selected Community Route */}
      {selectedTrail && (
        <div className="bg-[#09190f]/95 border border-[#1d472c] rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
          {/* Title Header with Badges */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-y-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border flex items-center space-x-1 ${
                    selectedTrail.activityType === 'cycling'
                      ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                      : selectedTrail.activityType === 'running'
                      ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                      : 'bg-orange-950/80 border-orange-700 text-orange-300'
                  }`}
                >
                  <span>{selectedTrail.activityType === 'cycling' ? '🚴 Cycling Route' : selectedTrail.activityType === 'running' ? '🏃 Running Route' : '🥾 Trek'}</span>
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                    selectedTrail.difficulty === 'Beginner'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : selectedTrail.difficulty === 'Moderate'
                      ? 'bg-amber-950 text-amber-400 border-amber-800'
                      : 'bg-rose-950 text-rose-400 border-rose-800'
                  }`}
                >
                  {selectedTrail.difficulty}
                </span>

                <span className="text-[10px] bg-[#0c2416] text-[#8ea496] border border-[#1b442b] px-2 py-0.5 rounded-full font-medium">
                  {formatSurface(selectedTrail.surfaceType)}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-[#f5ebd7] tracking-tight">
                {selectedTrail.name}
              </h3>
              <p className="text-xs text-[#8ea496] flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--accent-main)] flex-shrink-0" />
                <span>{selectedTrail.location} • {selectedTrail.region}</span>
              </p>
            </div>

            {/* Rating and Kudos counter */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => handleToggleKudos(selectedTrail.id)}
                className={`p-2 rounded-xl border flex items-center space-x-1 transition-all ${
                  selectedTrail.userLiked
                    ? 'bg-rose-950/80 border-rose-600 text-rose-400'
                    : 'bg-[#0b2114] border-[#1a4429] text-[#7d9385] hover:text-white'
                }`}
                title="Give Kudos"
              >
                <Heart className={`w-4 h-4 ${selectedTrail.userLiked ? 'fill-current' : ''}`} />
                <span className="text-xs font-mono font-bold">{selectedTrail.kudosCount}</span>
              </button>

              <button
                onClick={() => handleToggleBookmark(selectedTrail.id)}
                className={`p-2 rounded-xl border transition-all ${
                  selectedTrail.userSaved
                    ? 'bg-amber-950/80 border-amber-600 text-amber-400'
                    : 'bg-[#0b2114] border-[#1a4429] text-[#7d9385] hover:text-white'
                }`}
                title="Save Route"
              >
                <Bookmark className={`w-4 h-4 ${selectedTrail.userSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Key Metric Telemetry Bar */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#06140b] rounded-2xl p-2.5 border border-[#153420]">
              <span className="text-[9px] text-[#7d9385] uppercase font-bold block mb-0.5">
                Distance
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-[#f5ebd7]">
                {selectedTrail.distanceKm}
                <span className="text-[10px] font-normal text-[#8ea496] ml-0.5">km</span>
              </span>
            </div>

            <div className="bg-[#06140b] rounded-2xl p-2.5 border border-[#153420]">
              <span className="text-[9px] text-[#7d9385] uppercase font-bold block mb-0.5">
                Ascent
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-[#34d399]">
                +{selectedTrail.elevationGainMeters}
                <span className="text-[10px] font-normal text-[#8ea496] ml-0.5">m</span>
              </span>
            </div>

            <div className="bg-[#06140b] rounded-2xl p-2.5 border border-[#153420]">
              <span className="text-[9px] text-[#7d9385] uppercase font-bold block mb-0.5">
                Est. Time
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-[#f0cb64]">
                {selectedTrail.estimatedDurationMin}
                <span className="text-[10px] font-normal text-[#8ea496] ml-0.5">m</span>
              </span>
            </div>

            <div className="bg-[#06140b] rounded-2xl p-2.5 border border-[#153420]">
              <span className="text-[9px] text-[#7d9385] uppercase font-bold block mb-0.5">
                Summit
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-sky-400">
                {selectedTrail.peakAltitudeMeters}
                <span className="text-[10px] font-normal text-[#8ea496] ml-0.5">m</span>
              </span>
            </div>
          </div>

          {/* Elevation Profile Visualizer */}
          <div className="bg-[#051109] rounded-2xl p-3 border border-[#142e1f] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7d9385] flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Elevation & Topography Profile</span>
              </span>
              <span className="text-[10px] font-mono text-[#8ea496]">
                Min: {Math.min(...selectedTrail.waypoints.map((w) => w.ele))}m • Max: {selectedTrail.peakAltitudeMeters}m
              </span>
            </div>

            {/* Render elevation profile bar segments */}
            <div className="h-12 flex items-end space-x-1 pt-2">
              {selectedTrail.waypoints.map((wp, i) => {
                const min = Math.min(...selectedTrail.waypoints.map((w) => w.ele));
                const max = selectedTrail.peakAltitudeMeters;
                const range = Math.max(50, max - min);
                const heightPercent = Math.max(15, Math.min(100, ((wp.ele - min) / range) * 100));

                return (
                  <div
                    key={`ele-bar-${i}`}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 hidden group-hover:flex bg-[#0b2114] text-[#f5ebd7] text-[9px] font-mono px-1.5 py-0.5 rounded border border-[#235835] whitespace-nowrap z-30 shadow-md">
                      {wp.ele}m {wp.label ? `• ${wp.label}` : ''}
                    </div>

                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all ${
                        selectedTrail.activityType === 'cycling'
                          ? 'bg-gradient-to-t from-amber-900/60 to-amber-400 group-hover:brightness-125'
                          : 'bg-gradient-to-t from-emerald-900/60 to-emerald-400 group-hover:brightness-125'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Route Description & Highlights */}
          <div className="space-y-2 text-xs text-[#a9bcae] leading-relaxed">
            <p>{selectedTrail.description}</p>

            {selectedTrail.highlights && selectedTrail.highlights.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--accent-main)] block mb-1">
                  Community Route Highlights:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#cbdad0]">
                  {selectedTrail.highlights.map((highlight, idx) => (
                    <li key={`hl-${idx}`} className="flex items-start space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTrail.safetyNotes && (
              <div className="bg-[#122318] border border-[#214c31] rounded-xl p-2.5 flex items-start space-x-2 text-[11px] text-[#9db2a3]">
                <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">Safety & Trail Advisory: </span>
                  <span>{selectedTrail.safetyNotes}</span>
                </div>
              </div>
            )}
          </div>

          {/* Contributor Profile strip */}
          <div className="pt-2 border-t border-[#163622] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <img
                src={selectedTrail.contributedBy.avatar}
                alt={selectedTrail.contributedBy.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full border border-[var(--accent-main)] object-cover"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-bold text-[#f5ebd7]">
                    {selectedTrail.contributedBy.name}
                  </span>
                  {selectedTrail.contributedBy.verifiedAthlete && (
                    <span className="w-3 h-3 rounded-full bg-[#34d399] flex items-center justify-center text-[7px] text-black font-black">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#7d9385]">
                  {selectedTrail.contributedBy.role} • Added {selectedTrail.createdAt}
                </p>
              </div>
            </div>

            {/* Load Trail & Launch GPS Tracker Button */}
            <button
              onClick={() => onLoadTrailToTracker(selectedTrail)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--accent-main)] via-[#c79a3c] to-[#a67a26] text-black font-black text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Load Route to Live GPS</span>
              <Navigation className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* Community Route Cards Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-main)]">
            Explore All Community Routes ({filteredTrails.length})
          </span>
          <span className="text-[10px] text-[#7d9385]">
            Click to preview on Google Map
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredTrails.map((trail) => {
            const isSelected = selectedTrail?.id === trail.id;

            return (
              <div
                key={trail.id}
                onClick={() => setSelectedTrailId(trail.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#153b24] border-[var(--accent-main)] shadow-[0_0_15px_rgba(201,151,56,0.25)]'
                    : 'bg-[#08170e]/95 border-[#173824] hover:bg-[#0d2215]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">
                      {trail.activityType === 'cycling' ? '🚴' : trail.activityType === 'running' ? '🏃' : '🥾'}
                    </span>
                    <h4 className="text-xs font-bold text-[#f5ebd7] line-clamp-1">
                      {trail.name}
                    </h4>
                  </div>

                  <span className="text-[10px] text-[var(--accent-main)] font-mono font-bold flex items-center flex-shrink-0">
                    <Star className="w-3 h-3 fill-current mr-0.5" />
                    {trail.rating}
                  </span>
                </div>

                <p className="text-[10px] text-[#8ea496] line-clamp-1 mb-2">
                  {trail.location}
                </p>

                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] bg-[#061209] rounded-xl p-1.5 border border-[#132c1d]">
                  <div>
                    <span className="text-[8px] text-[#7d9385] block">Distance</span>
                    <span className="font-bold text-[#f5ebd7]">{trail.distanceKm}k</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#7d9385] block">Ascent</span>
                    <span className="font-bold text-[#34d399]">+{trail.elevationGainMeters}m</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#7d9385] block">Difficulty</span>
                    <span className="font-bold text-[#f0cb64] truncate">{trail.difficulty}</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-[#7d9385]">
                    By {trail.contributedBy.username}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-0.5">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contribute a Route Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#091b11] border border-[#235837] rounded-3xl p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[var(--accent-main)]" />
                <h3 className="font-['Cinzel'] text-sm font-bold text-[#f5ebd7]">
                  Contribute Local Trail / Route
                </h3>
              </div>
              <button
                onClick={() => setShowContributeModal(false)}
                className="p-1 rounded-lg text-[#7d9385] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#8ea496]">
              Share your favorite running sprint corridor, gravel bike grind, or high-altitude mountain route with the community.
            </p>

            <form onSubmit={handleSubmitContribution} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#7d9385] block mb-1">
                  Route Title
                </label>
                <input
                  type="text"
                  required
                  value={newRouteForm.name}
                  onChange={(e) => setNewRouteForm({ ...newRouteForm, name: e.target.value })}
                  placeholder="e.g., Tigoni Tea Plantation Sunset Gravel Ride"
                  className="w-full bg-[#06120a] border border-[#1a3f28] rounded-xl px-3 py-2 text-xs text-[#f5ebd7] focus:outline-none focus:border-[var(--accent-main)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#7d9385] block mb-1">
                    Sport Discipline
                  </label>
                  <select
                    value={newRouteForm.activityType}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, activityType: e.target.value as any })}
                    className="w-full bg-[#06120a] border border-[#1a3f28] rounded-xl px-3 py-2 text-xs text-[#f5ebd7] focus:outline-none focus:border-[var(--accent-main)]"
                  >
                    <option value="running">🏃 Running Route</option>
                    <option value="cycling">🚴 Cycling Route</option>
                    <option value="hiking">🥾 Hiking / Trek</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#7d9385] block mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={newRouteForm.difficulty}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, difficulty: e.target.value as any })}
                    className="w-full bg-[#06120a] border border-[#1a3f28] rounded-xl px-3 py-2 text-xs text-[#f5ebd7] focus:outline-none focus:border-[var(--accent-main)]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#7d9385] block mb-1">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="300"
                    required
                    value={newRouteForm.distanceKm}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, distanceKm: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#06120a] border border-[#1a3f28] rounded-xl px-3 py-2 text-xs text-[#f5ebd7] focus:outline-none focus:border-[var(--accent-main)]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#7d9385] block mb-1">
                    Climb (+m)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    value={newRouteForm.elevationGainMeters}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, elevationGainMeters: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#06120a] border border-[#1a3f28] rounded-xl px-3 py-2 text-xs text-[#f5ebd7] focus:outline-none focus:border-[var(--accent-main)]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#7d9385] block mb-1">
                    Surface
                  </label>
                  <select
                    value={newRouteForm.surfaceType}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, surfaceType: e.target.value as any })}
                    className="w-full bg-[#06120a] border border-[#1a3f28] rounded-xl px-3 py-2 text-xs text-[#f5ebd7] focus:outline-none focus:border-[var(--accent-main)]"
                  >
                    <option value="gravel">Gravel Grinder</option>
                    <option value="paved_road">Paved Asphalt</option>
                    <option value="singletrack_dirt">Singletrack Dirt</option>
                    <option value="forest_path">Forest Path</option>
                    <option value="mixed_terrain">Mixed Terrain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#7d9385] block mb-1">
                  Location / Trailhead
                </label>
                <input
                  type="text"
                  required
                  value={newRouteForm.location}
                  onChange={(e) => setNewRouteForm({ ...newRouteForm, location: e.target.value })}
                  placeholder="e.g., Sigiria Gate, Karura Forest or Limuru Escarpment"
                  className="w-full bg-[#06120a] border border-[#1a3f28] rounded-xl px-3 py-2 text-xs text-[#f5ebd7] focus:outline-none focus:border-[var(--accent-main)]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#7d9385] block mb-1">
                  Description & Athlete Notes
                </label>
                <textarea
                  rows={2}
                  value={newRouteForm.description}
                  onChange={(e) => setNewRouteForm({ ...newRouteForm, description: e.target.value })}
                  placeholder="Describe the terrain, elevation gradients, shade, and sights..."
                  className="w-full bg-[#06120a] border border-[#1a3f28] rounded-xl px-3 py-2 text-xs text-[#f5ebd7] focus:outline-none focus:border-[var(--accent-main)] resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#7d9385] block mb-1">
                  Route Highlights (comma-separated)
                </label>
                <input
                  type="text"
                  value={newRouteForm.highlights}
                  onChange={(e) => setNewRouteForm({ ...newRouteForm, highlights: e.target.value })}
                  placeholder="e.g., Waterfall view at KM 3, Espresso cafe at finish, Water tap"
                  className="w-full bg-[#06120a] border border-[#1a3f28] rounded-xl px-3 py-2 text-xs text-[#f5ebd7] focus:outline-none focus:border-[var(--accent-main)]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowContributeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#7d9385] hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--accent-main)] to-[#b5852b] text-black font-bold text-xs shadow-lg hover:brightness-110 transition-all"
                >
                  Publish to Community Map
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
