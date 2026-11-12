import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GeoPoint,
  ElevationPoint,
  PresetTrail,
  PRESET_TRAILS,
  calculateDistanceKm,
  formatPace,
  formatDuration,
  estimateSteps,
  calculateCaloriesBurned
} from '../../utils/geoUtils';
import { AtmosphericConditions } from '../../types';
import { fetchRealtimeWeather } from '../../utils/weatherService';
import { OutdoorMap } from './OutdoorMap';
import { OutdoorElevationChart } from './OutdoorElevationChart';
import { RealisticEmblem } from '../common/RealisticEmblem';
import { CommunityTrailDiscovery } from './CommunityTrailDiscovery';
import { CommunityTrail } from '../../types/trails';
import {
  X,
  Play,
  Pause,
  Square,
  Compass,
  Footprints,
  Mountain,
  Flame,
  Timer,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Share2,
  Navigation,
  RefreshCw,
  Sparkles,
  Award,
  ChevronRight,
  Crown,
  Activity,
  Wind,
  Thermometer,
  Droplets,
  Sun,
  CloudSun,
  CloudRain,
  Gauge,
  ShieldCheck
} from 'lucide-react';

export const OutdoorTrackerModal: React.FC = () => {
  const {
    showOutdoorTracker,
    setShowOutdoorTracker,
    outdoorTrackerInitialMode,
    logOutdoorSession,
    activityLogs,
    setShowDeepAnalysisModal,
    setSelectedWorkoutForAnalysis,
    isPremium,
    openPremiumUpgrade,
    user
  } = useApp();

  // Mode: walk, hike, run, or cycle
  const [mode, setMode] = useState<'walk' | 'hike' | 'run' | 'cycle'>(outdoorTrackerInitialMode || 'walk');
  const [activeTab, setActiveTab] = useState<'track' | 'discovery' | 'trails' | 'history'>('track');
  const [selectedTrail, setSelectedTrail] = useState<PresetTrail | null>(null);

  // Tracking state
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Telemetry metrics
  const [currentPos, setCurrentPos] = useState<GeoPoint | null>(null);
  const [path, setPath] = useState<GeoPoint[]>([]);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [steps, setSteps] = useState<number>(0);
  const [cadenceSpm, setCadenceSpm] = useState<number>(0);
  const [currentElevation, setCurrentElevation] = useState<number>(1680); // Default altitude (Nairobi baseline)
  const [elevationGain, setElevationGain] = useState<number>(0);
  const [elevationLoss, setElevationLoss] = useState<number>(0);
  const [maxElevation, setMaxElevation] = useState<number>(1680);
  const [minElevation, setMinElevation] = useState<number>(1680);
  const [elevationProfile, setElevationProfile] = useState<ElevationPoint[]>([]);
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(6);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Finish review state
  const [showFinishSummary, setShowFinishSummary] = useState<boolean>(false);
  const [sessionRpe, setSessionRpe] = useState<number>(mode === 'hike' ? 8 : mode === 'run' ? 7.5 : 6);
  const [sessionNotes, setSessionNotes] = useState<string>('');

  // Atmospheric conditions & real-time weather integration
  const [weatherConditions, setWeatherConditions] = useState<AtmosphericConditions | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const simIndexRef = useRef<number>(0);
  const watchIdRef = useRef<number | null>(null);

  // Load a community-contributed trail into active GPS tracking
  const handleLoadCommunityTrail = (trail: CommunityTrail) => {
    const newMode: 'walk' | 'hike' | 'run' | 'cycle' =
      trail.activityType === 'cycling'
        ? 'cycle'
        : trail.activityType === 'hiking'
        ? 'hike'
        : 'run';

    setMode(newMode);
    setSelectedTrail({
      id: trail.id,
      name: trail.name,
      type: newMode,
      location: `${trail.location} (${trail.region})`,
      distanceKm: trail.distanceKm,
      elevationGainMeters: trail.elevationGainMeters,
      peakAltitudeMeters: trail.peakAltitudeMeters,
      difficulty: trail.difficulty,
      description: trail.description,
      center: trail.center,
      waypoints: trail.waypoints
    });

    if (!isTracking && trail.waypoints.length > 0) {
      setCurrentPos({
        lat: trail.waypoints[0].lat,
        lng: trail.waypoints[0].lng,
        altitude: trail.waypoints[0].ele
      });
    }

    setActiveTab('track');
  };

  // Calculate current athlete heading/bearing from recent movement trajectory
  const athleteBearingDeg = useMemo(() => {
    if (path.length >= 2) {
      const p1 = path[path.length - 2];
      const p2 = path[path.length - 1];
      const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
      const lat1 = (p1.lat * Math.PI) / 180;
      const lat2 = (p2.lat * Math.PI) / 180;
      const y = Math.sin(dLng) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
      const brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
      return Math.round(brng);
    }
    return 0;
  }, [path]);

  // Real-time atmospheric weather fetcher
  const handleRefreshWeather = async () => {
    const lat = currentPos?.lat ?? (selectedTrail ? selectedTrail.waypoints[0]?.lat : -1.2921);
    const lng = currentPos?.lng ?? (selectedTrail ? selectedTrail.waypoints[0]?.lng : 36.8219);
    const alt = currentPos?.altitude ?? (selectedTrail?.elevationGainMeters ? selectedTrail.elevationGainMeters + 1600 : 1680);

    setIsWeatherLoading(true);
    try {
      const data = await fetchRealtimeWeather(lat, lng, alt, athleteBearingDeg);
      setWeatherConditions(data);
    } catch (err) {
      console.warn('Real-time weather query fallback triggered', err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  // Fetch atmospheric conditions on initial load or trail selection
  useEffect(() => {
    if (showOutdoorTracker) {
      handleRefreshWeather();
    }
  }, [showOutdoorTracker, selectedTrail]);

  // Periodic weather refresh during active tracking (every 3 minutes)
  useEffect(() => {
    if (!isTracking || isPaused) return;
    const interval = setInterval(() => {
      handleRefreshWeather();
    }, 180000);
    return () => clearInterval(interval);
  }, [isTracking, isPaused, currentPos?.lat, currentPos?.lng, athleteBearingDeg]);

  // Reset or initialize on open
  useEffect(() => {
    if (outdoorTrackerInitialMode) {
      setMode(outdoorTrackerInitialMode);
    }
  }, [outdoorTrackerInitialMode]);

  // Timer tick
  useEffect(() => {
    if (isTracking && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTracking, isPaused]);

  // Real GPS Geolocation Watcher
  useEffect(() => {
    if (!isTracking || isPaused || isSimulating) {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      return;
    }

    const onPosSuccess = (pos: GeolocationPosition) => {
      const { latitude, longitude, altitude, accuracy } = pos.coords;
      setGpsAccuracy(accuracy || 5);

      const alt = altitude != null ? Math.round(altitude) : 1680;
      const newPoint: GeoPoint = {
        lat: latitude,
        lng: longitude,
        altitude: alt,
        timestamp: pos.timestamp
      };

      setCurrentPos(newPoint);

      setPath(prevPath => {
        if (prevPath.length === 0) {
          setCurrentElevation(alt);
          setMaxElevation(alt);
          setMinElevation(alt);
          setElevationProfile([{ distanceKm: 0, elevationMeters: alt, timeSec: elapsedSeconds }]);
          return [newPoint];
        }

        const lastPoint = prevPath[prevPath.length - 1];
        const addedKm = calculateDistanceKm(lastPoint.lat, lastPoint.lng, latitude, longitude);

        // Only register if movement exceeds 3 meters to filter GPS jitter
        if (addedKm > 0.003) {
          const updatedDist = distanceKm + addedKm;
          setDistanceKm(updatedDist);

          // Update elevation metrics
          if (newPoint.altitude !== undefined && lastPoint.altitude !== undefined) {
            const diff = newPoint.altitude - lastPoint.altitude;
            if (diff > 0.5) setElevationGain(g => g + diff);
            if (diff < -0.5) setElevationLoss(l => l + Math.abs(diff));
            setCurrentElevation(newPoint.altitude);
            setMaxElevation(m => Math.max(m, newPoint.altitude!));
            setMinElevation(m => Math.min(m, newPoint.altitude!));
          }

          // Step count estimate from distance & mode
          const estimated = estimateSteps(updatedDist, mode);
          setSteps(estimated);
          setCadenceSpm(mode === 'cycle' ? 88 : mode === 'run' ? 162 : mode === 'hike' ? 115 : 124);

          setElevationProfile(prev => [
            ...prev,
            { distanceKm: updatedDist, elevationMeters: alt, timeSec: elapsedSeconds }
          ]);

          return [...prevPath, newPoint];
        }

        return prevPath;
      });
    };

    const onPosError = (err: GeolocationPositionError) => {
      console.warn('Geolocation watch error:', err.message);
    };

    watchIdRef.current = navigator.geolocation.watchPosition(onPosSuccess, onPosError, {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000
    });

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isTracking, isPaused, isSimulating, distanceKm, mode, elapsedSeconds]);

  // Simulation loop for testing on desktop / indoor environments
  useEffect(() => {
    if (!isTracking || isPaused || !isSimulating) return;

    const interval = setInterval(() => {
      // Pick trail waypoints or generate loop
      const waypoints = selectedTrail ? selectedTrail.waypoints : [
        { lat: -1.2921, lng: 36.8219, ele: 1680 },
        { lat: -1.2940, lng: 36.8240, ele: 1705 },
        { lat: -1.2965, lng: 36.8265, ele: 1735 },
        { lat: -1.2990, lng: 36.8290, ele: 1770 },
        { lat: -1.2960, lng: 36.8320, ele: 1750 },
        { lat: -1.2930, lng: 36.8290, ele: 1715 },
        { lat: -1.2921, lng: 36.8219, ele: 1680 }
      ];

      const idx = simIndexRef.current % waypoints.length;
      const nextIdx = (simIndexRef.current + 1) % waypoints.length;
      simIndexRef.current += 1;

      const currWp = waypoints[idx];
      const nextWp = waypoints[nextIdx];

      // Step along interpolated vector
      const stepKm = mode === 'cycle' ? 0.08 : mode === 'run' ? 0.05 : mode === 'hike' ? 0.025 : 0.035;
      const newLat = currWp.lat + (nextWp.lat - currWp.lat) * 0.2;
      const newLng = currWp.lng + (nextWp.lng - currWp.lng) * 0.2;
      const eleDiff = nextWp.ele - currWp.ele;
      const newEle = Math.round(currWp.ele + eleDiff * 0.2);

      const pt: GeoPoint = { lat: newLat, lng: newLng, altitude: newEle, timestamp: Date.now() };
      setCurrentPos(pt);
      setPath(prev => [...prev, pt]);

      setDistanceKm(prev => {
        const nextDist = prev + stepKm;
        const newSteps = estimateSteps(nextDist, mode);
        setSteps(newSteps);
        return Number(nextDist.toFixed(2));
      });

      if (eleDiff > 0) setElevationGain(g => g + Math.round(eleDiff * 0.2));
      if (eleDiff < 0) setElevationLoss(l => l + Math.abs(Math.round(eleDiff * 0.2)));

      setCurrentElevation(newEle);
      setMaxElevation(m => Math.max(m, newEle));
      setMinElevation(m => Math.min(m, newEle));
      setCadenceSpm(mode === 'cycle' ? 88 : mode === 'run' ? 164 : mode === 'hike' ? 112 : 122);

      setElevationProfile(prev => [
        ...prev,
        { distanceKm: distanceKm + stepKm, elevationMeters: newEle, timeSec: elapsedSeconds }
      ]);
    }, 1500);

    return () => clearInterval(interval);
  }, [isTracking, isPaused, isSimulating, selectedTrail, mode, distanceKm, elapsedSeconds]);

  // Start activity
  const handleStart = () => {
    setIsTracking(true);
    setIsPaused(false);
    setShowFinishSummary(false);

    // Initial GPS poll
    if (navigator.geolocation && !isSimulating) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const pt = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            altitude: pos.coords.altitude != null ? Math.round(pos.coords.altitude) : 1680,
            timestamp: pos.timestamp
          };
          setCurrentPos(pt);
          setPath([pt]);
          setCurrentElevation(pt.altitude);
          setElevationProfile([{ distanceKm: 0, elevationMeters: pt.altitude, timeSec: 0 }]);
        },
        () => {
          // If denied, fallback to preset or default
          const defaultPt = selectedTrail
            ? { lat: selectedTrail.waypoints[0].lat, lng: selectedTrail.waypoints[0].lng, altitude: selectedTrail.waypoints[0].ele }
            : { lat: -1.2921, lng: 36.8219, altitude: 1680 };
          setCurrentPos(defaultPt);
          setPath([defaultPt]);
        },
        { enableHighAccuracy: true }
      );
    } else {
      const startPt = selectedTrail
        ? { lat: selectedTrail.waypoints[0].lat, lng: selectedTrail.waypoints[0].lng, altitude: selectedTrail.waypoints[0].ele }
        : { lat: -1.2921, lng: 36.8219, altitude: 1680 };
      setCurrentPos(startPt);
      setPath([startPt]);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleFinishPrompt = () => {
    setIsPaused(true);
    setShowFinishSummary(true);
  };

  const handleCancel = () => {
    if (confirm('Discard this outdoor session?')) {
      resetTracker();
    }
  };

  const resetTracker = () => {
    setIsTracking(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setDistanceKm(0);
    setSteps(0);
    setElevationGain(0);
    setElevationLoss(0);
    setPath([]);
    setElevationProfile([]);
    setShowFinishSummary(false);
    setIsSimulating(false);
    simIndexRef.current = 0;
  };

  const handleSaveSession = () => {
    const mins = Math.max(1, Math.round(elapsedSeconds / 60));
    const cals = calculateCaloriesBurned(mode, mins, distanceKm, elevationGain);
    const paceStr = formatPace(elapsedSeconds, distanceKm);
    const title = selectedTrail
      ? `${selectedTrail.name} (${mode.toUpperCase()})`
      : `Outdoor GPS ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;

    logOutdoorSession({
      mode,
      title,
      durationMinutes: mins,
      distanceKm: Number(distanceKm.toFixed(2)),
      elevationGainMeters: Math.round(elevationGain),
      steps,
      caloriesBurned: cals,
      avgPace: paceStr,
      rpe: sessionRpe,
      notes: sessionNotes,
      routePoints: path.map(p => ({ lat: p.lat, lng: p.lng, ele: p.altitude })),
      weatherConditions: weatherConditions || undefined
    });

    resetTracker();
    setShowOutdoorTracker(false);
  };

  const currentPace = formatPace(elapsedSeconds, distanceKm);
  const caloriesBurned = calculateCaloriesBurned(
    mode,
    Math.max(1, Math.round(elapsedSeconds / 60)),
    distanceKm,
    elevationGain
  );

  // Filter history of outdoor activities
  const outdoorLogs = useMemo(() => {
    return activityLogs.filter(
      l =>
        l.activityType === 'walk' ||
        l.activityType === 'hike' ||
        l.activityType === 'run' ||
        (l.title && /walk|hike|run|trail/i.test(l.title))
    );
  }, [activityLogs]);

  if (!showOutdoorTracker) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#050c07]/95 backdrop-blur-xl flex flex-col justify-between overflow-y-auto animate-fadeIn">
      {/* Top Bar */}
      <header className="px-4 py-3 border-b border-[#14291c] flex items-center justify-between bg-[#07130a]/80 sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-[#122e1d] border border-[#1f4a30]">
            <Compass className="w-5 h-5 text-[var(--accent-main)]" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-[#f5ebd7]">
              Outdoor Trail & GPS Tracker
            </h2>
            <p className="text-[10px] text-[#7d9385] flex items-center space-x-1">
              <span>Nairobi & East African Wilderness Engine</span>
              <span>•</span>
              <span className="text-[#34d399]">Live Maps & Altimeter</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isTracking && !confirm('Leave tracker? Active recording will pause.')) {
              return;
            }
            setShowOutdoorTracker(false);
          }}
          className="p-2 rounded-xl bg-[#112417] text-[#8ea496] hover:text-[#f4f1ea] hover:bg-[#1a3824] transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-xl w-full mx-auto p-4 space-y-4 pb-24">
        {/* Navigation Tabs */}
        {!isTracking && (
          <div className="flex bg-[#0b1b11] p-1 rounded-2xl border border-[#163622]">
            <button
              onClick={() => setActiveTab('track')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'track'
                  ? 'bg-[#1b432a] text-[#f5ebd7] shadow-md'
                  : 'text-[#7d9385] hover:text-[#c4d6cb]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Live Track</span>
            </button>
            <button
              onClick={() => setActiveTab('discovery')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'discovery'
                  ? 'bg-gradient-to-r from-[#174828] to-[#143d23] border border-[var(--accent-main)]/60 text-[#f5ebd7] shadow-md'
                  : 'text-[#7d9385] hover:text-[#c4d6cb]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[var(--accent-main)]" />
              <span>Discovery Map</span>
            </button>
            <button
              onClick={() => setActiveTab('trails')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'trails'
                  ? 'bg-[#1b432a] text-[#f5ebd7] shadow-md'
                  : 'text-[#7d9385] hover:text-[#c4d6cb]'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>Presets</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'history'
                  ? 'bg-[#1b432a] text-[#f5ebd7] shadow-md'
                  : 'text-[#7d9385] hover:text-[#c4d6cb]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Treks</span>
            </button>
          </div>
        )}

        {/* TAB 1: LIVE TRACKER */}
        {activeTab === 'track' && (
          <div className="space-y-4">
            {/* Activity Mode Selector */}
            {!isTracking && (
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => setMode('walk')}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    mode === 'walk'
                      ? 'bg-[#153a23] border-[#34d399] shadow-[0_0_15px_rgba(52,211,153,0.2)] text-[#f5ebd7]'
                      : 'bg-[#09150d] border-[#183623] text-[#7d9385] hover:bg-[#0f2417]'
                  }`}
                >
                  <Footprints className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Walk</span>
                  <span className="text-[8px] text-[#8ea496] mt-0.5">Steps & Stride</span>
                </button>

                <button
                  onClick={() => setMode('hike')}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    mode === 'hike'
                      ? 'bg-[#153a23] border-[var(--accent-main)] shadow-[0_0_15px_rgba(201,151,56,0.25)] text-[#f5ebd7]'
                      : 'bg-[#09150d] border-[#183623] text-[#7d9385] hover:bg-[#0f2417]'
                  }`}
                >
                  <Mountain className="w-5 h-5 text-amber-400 mb-1" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Hike</span>
                  <span className="text-[8px] text-[#8ea496] mt-0.5">Grade & Climb</span>
                </button>

                <button
                  onClick={() => setMode('run')}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    mode === 'run'
                      ? 'bg-[#153a23] border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.2)] text-[#f5ebd7]'
                      : 'bg-[#09150d] border-[#183623] text-[#7d9385] hover:bg-[#0f2417]'
                  }`}
                >
                  <Navigation className="w-5 h-5 text-sky-400 mb-1" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Run</span>
                  <span className="text-[8px] text-[#8ea496] mt-0.5">Pace & Splits</span>
                </button>

                <button
                  onClick={() => setMode('cycle')}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    mode === 'cycle'
                      ? 'bg-[#153a23] border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.25)] text-[#f5ebd7]'
                      : 'bg-[#09150d] border-[#183623] text-[#7d9385] hover:bg-[#0f2417]'
                  }`}
                >
                  <span className="text-xl mb-0.5 leading-none">🚴</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">Cycle</span>
                  <span className="text-[8px] text-[#8ea496] mt-0.5">Speed & Cadence</span>
                </button>
              </div>
            )}

            {/* Selected Trail Banner if loaded */}
            {selectedTrail && !isTracking && (
              <div className="bg-[#0f2919] border border-[#235837] rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-[#1b432a] text-[#34d399]">
                    <Mountain className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[var(--accent-main)] font-bold">
                      Loaded Trail Preset
                    </span>
                    <h4 className="text-xs font-bold text-[#f5ebd7]">{selectedTrail.name}</h4>
                    <p className="text-[10px] text-[#8ea496]">
                      {selectedTrail.distanceKm} km • +{selectedTrail.elevationGainMeters}m climb
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTrail(null)}
                  className="text-xs text-[#8ea496] hover:text-red-400 px-2 py-1"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Live GPS Interactive Map */}
            <OutdoorMap
              currentPos={currentPos}
              path={path}
              presetWaypoints={selectedTrail?.waypoints}
              gpsAccuracyMeters={gpsAccuracy}
              activityMode={mode}
              weather={weatherConditions}
              isWeatherLoading={isWeatherLoading}
              onRefreshWeather={handleRefreshWeather}
            />

            {/* Atmospheric Telemetry Strip (Temperature, Humidity, Wind & Aerodynamics) */}
            {weatherConditions && (
              <div className="bg-[#08160e]/95 border border-[#1a3827] rounded-2xl p-3 shadow-lg">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded bg-[#133020] border border-[#1f4a30]">
                      <Wind className="w-3.5 h-3.5 text-teal-400" />
                    </div>
                    <span className="font-bold text-[#e6f4ec] text-[11px] uppercase tracking-wider">
                      Atmospheric Dynamics
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-[#7d9385] flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono">
                        {weatherConditions.source === 'live' ? 'Open-Meteo' : 'Physics Radar'}
                      </span>
                    </span>
                    <button
                      onClick={handleRefreshWeather}
                      className={`p-1 rounded text-[#7d9385] hover:text-emerald-300 transition-all ${
                        isWeatherLoading ? 'animate-spin text-emerald-400' : ''
                      }`}
                      title="Refresh Atmospheric Conditions"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  {/* Temperature */}
                  <div className="bg-[#051108] rounded-xl p-2 border border-[#142e1e]">
                    <div className="flex items-center justify-center space-x-1 text-[#7d9385] text-[9px] uppercase font-bold mb-0.5">
                      <Thermometer className="w-3 h-3 text-amber-400" />
                      <span>Temp</span>
                    </div>
                    <div className="font-mono font-black text-xs text-[#f5ebd7]">
                      {weatherConditions.temperatureC}°C
                    </div>
                    <div className="text-[8px] text-[#8ea496]">
                      Feels {weatherConditions.apparentTemperatureC}°
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="bg-[#051108] rounded-xl p-2 border border-[#142e1e]">
                    <div className="flex items-center justify-center space-x-1 text-[#7d9385] text-[9px] uppercase font-bold mb-0.5">
                      <Droplets className="w-3 h-3 text-sky-400" />
                      <span>Humidity</span>
                    </div>
                    <div className="font-mono font-black text-xs text-[#f5ebd7]">
                      {weatherConditions.relativeHumidity}%
                    </div>
                    <div className="text-[8px] text-[#8ea496]">
                      {weatherConditions.airDensityKgM3} kg/m³
                    </div>
                  </div>

                  {/* Wind */}
                  <div className="bg-[#051108] rounded-xl p-2 border border-[#142e1e]">
                    <div className="flex items-center justify-center space-x-1 text-[#7d9385] text-[9px] uppercase font-bold mb-0.5">
                      <Wind className="w-3 h-3 text-teal-400" />
                      <span>Wind</span>
                    </div>
                    <div className="font-mono font-black text-xs text-[#f5ebd7]">
                      {Math.round(weatherConditions.windSpeedKmh)}kph
                    </div>
                    <div className="text-[8px] text-teal-300 font-medium truncate">
                      {weatherConditions.windDirectionCompass} {weatherConditions.windDirectionDeg}°
                    </div>
                  </div>

                  {/* Pressure */}
                  <div className="bg-[#051108] rounded-xl p-2 border border-[#142e1e]">
                    <div className="flex items-center justify-center space-x-1 text-[#7d9385] text-[9px] uppercase font-bold mb-0.5">
                      <Gauge className="w-3 h-3 text-purple-400" />
                      <span>Barometer</span>
                    </div>
                    <div className="font-mono font-black text-xs text-[#f5ebd7]">
                      {weatherConditions.surfacePressureHpa}hPa
                    </div>
                    <div className="text-[8px] text-[#8ea496]">
                      UV {weatherConditions.uvIndex}
                    </div>
                  </div>
                </div>

                {/* Aerodynamic Drag Vector Info */}
                {weatherConditions.windEffect && (
                  <div className="mt-2 text-[10px] text-[#a1b8ab] bg-[#0c2416]/70 rounded-lg px-2.5 py-1.5 flex items-center justify-between border border-[#1c452b]">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-emerald-300">Aero Vector:</span>
                      <span className="text-[#e6f4ec]">
                        {weatherConditions.windEffect === 'headwind'
                          ? `Headwind Resistance (+${weatherConditions.headwindKmh} km/h drag)`
                          : weatherConditions.windEffect === 'tailwind'
                          ? `Tailwind Assist (${weatherConditions.headwindKmh} km/h boost)`
                          : `Crosswind Vector (${weatherConditions.crosswindKmh} km/h drift)`}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-[#8ea496]">
                      {weatherConditions.windSpeedMps} m/s
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Primary Telemetry HUD: Big Digital Readouts */}
            <div className="grid grid-cols-2 gap-3">
              {/* Distance */}
              <div className="bg-[#09170e]/95 border border-[#1b3d27] rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between text-[#7d9385] mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Distance</span>
                  <Navigation className="w-4 h-4 text-[#34d399]" />
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black font-mono tracking-tight text-[#f5ebd7]">
                    {distanceKm.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-[#7d9385]">KM</span>
                </div>
                <div className="mt-1 flex items-center space-x-1 text-[10px] text-[#8ea496]">
                  <span>Pace:</span>
                  <span className="font-mono font-bold text-[#34d399]">{currentPace} /km</span>
                </div>
              </div>

              {/* Duration Timer */}
              <div className="bg-[#09170e]/95 border border-[#1b3d27] rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between text-[#7d9385] mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Elapsed Time</span>
                  <Timer className="w-4 h-4 text-[var(--accent-main)]" />
                </div>
                <div className="text-3xl font-black font-mono tracking-tight text-[#f5ebd7]">
                  {formatDuration(elapsedSeconds)}
                </div>
                <div className="mt-1 flex items-center space-x-1 text-[10px] text-[#8ea496]">
                  <span>Burn:</span>
                  <span className="font-mono font-bold text-[var(--accent-main)]">
                    {caloriesBurned} kcal
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary Telemetry: Step Counter & Elevation Altimeter */}
            <div className="grid grid-cols-3 gap-2">
              {/* Step Counter */}
              <div className="bg-[#09170e]/95 border border-[#183623] rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center space-x-1 text-[#7d9385] mb-1">
                  <Footprints className="w-3.5 h-3.5 text-[#34d399]" />
                  <span className="text-[9px] uppercase font-bold">Steps</span>
                </div>
                <div className="text-lg font-black font-mono text-[#f5ebd7]">
                  {steps.toLocaleString()}
                </div>
                <span className="text-[9px] text-[#8ea496]">{cadenceSpm} spm</span>
              </div>

              {/* Elevation Gain */}
              <div className="bg-[#09170e]/95 border border-[#183623] rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center space-x-1 text-[#7d9385] mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#f0cb64]" />
                  <span className="text-[9px] uppercase font-bold">Elev Gain</span>
                </div>
                <div className="text-lg font-black font-mono text-[#f0cb64]">
                  +{Math.round(elevationGain)}m
                </div>
                <span className="text-[9px] text-[#8ea496]">Climb</span>
              </div>

              {/* Current Altitude */}
              <div className="bg-[#09170e]/95 border border-[#183623] rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center space-x-1 text-[#7d9385] mb-1">
                  <Mountain className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span className="text-[9px] uppercase font-bold">Altitude</span>
                </div>
                <div className="text-lg font-black font-mono text-[#f5ebd7]">
                  {Math.round(currentElevation)}m
                </div>
                <span className="text-[9px] text-[#8ea496]">ASL</span>
              </div>
            </div>

            {/* Real-time Elevation Profile Chart */}
            <OutdoorElevationChart
              elevationProfile={elevationProfile}
              currentElevation={currentElevation}
              elevationGain={elevationGain}
              elevationLoss={elevationLoss}
              maxElevation={maxElevation}
              minElevation={minElevation}
            />

            {/* Simulation mode toggle for easy testing */}
            {!isTracking && (
              <div className="flex items-center justify-between bg-[#08150e] p-3 rounded-2xl border border-[#153220]">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[var(--accent-main)]" />
                  <div>
                    <span className="text-xs font-bold text-[#e6f4ec] block">Indoor / Simulation Mode</span>
                    <span className="text-[10px] text-[#7d9385]">
                      Simulates GPS traversal & elevation climb along trail
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSimulating
                      ? 'bg-[#10b981] text-[#051108]'
                      : 'bg-[#122b1c] text-[#8ea496] hover:text-[#f4f1ea]'
                  }`}
                >
                  {isSimulating ? 'Active' : 'Enable'}
                </button>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="pt-2">
              {!isTracking ? (
                <button
                  onClick={handleStart}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] text-[#051108] font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start {mode.toUpperCase()} Tracking</span>
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  {!isPaused ? (
                    <button
                      onClick={handlePause}
                      className="flex-1 py-4 rounded-2xl bg-[#ca8a04] hover:bg-[#d97706] text-[#07130a] font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all"
                    >
                      <Pause className="w-5 h-5 fill-current" />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleResume}
                      className="flex-1 py-4 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-[#07130a] font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>Resume</span>
                    </button>
                  )}

                  <button
                    onClick={handleFinishPrompt}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:from-red-500 hover:to-rose-600 transition-all"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Finish</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: COMMUNITY TRAIL DISCOVERY MAP (GOOGLE MAPS) */}
        {activeTab === 'discovery' && (
          <CommunityTrailDiscovery
            onLoadTrailToTracker={handleLoadCommunityTrail}
            userPos={currentPos}
          />
        )}

        {/* TAB 3: PRESET TRAILS EXPLORER */}
        {activeTab === 'trails' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-main)]">
                Curated African & Wilderness Trails
              </h3>
              <p className="text-[11px] text-[#7d9385]">
                Select an iconic route to trace with real-world waypoints and elevation profiles.
              </p>
            </div>

            <div className="space-y-3">
              {PRESET_TRAILS.map(trail => {
                const isSelected = selectedTrail?.id === trail.id;
                return (
                  <div
                    key={trail.id}
                    onClick={() => {
                      setSelectedTrail(trail);
                      setMode(trail.type);
                      setActiveTab('track');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#153b24] border-[var(--accent-main)] shadow-[0_0_15px_rgba(201,151,56,0.25)]'
                        : 'bg-[#09170e]/95 border-[#183824] hover:bg-[#0d2215]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-5 h-5 rounded-md bg-[#0f2818] border border-[#204a2f] flex items-center justify-center">
                            {trail.type === 'hike' ? (
                              <Mountain className="w-3 h-3 text-amber-400" />
                            ) : trail.type === 'run' ? (
                              <Navigation className="w-3 h-3 text-sky-400" />
                            ) : (
                              <Footprints className="w-3 h-3 text-emerald-400" />
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-[#f5ebd7]">{trail.name}</h4>
                        </div>
                        <p className="text-[11px] text-[#8ea496] mb-2">{trail.location}</p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                          trail.difficulty === 'Beginner'
                            ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800'
                            : trail.difficulty === 'Moderate'
                            ? 'bg-amber-950/70 text-amber-400 border-amber-800'
                            : 'bg-rose-950/70 text-rose-400 border-rose-800'
                        }`}
                      >
                        {trail.difficulty}
                      </span>
                    </div>

                    <p className="text-xs text-[#a9bcae] leading-relaxed mb-3">
                      {trail.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#142e1f] text-center">
                      <div className="bg-[#0b1f13] rounded-lg p-1.5">
                        <span className="text-[9px] text-[#7d9385] uppercase block">Distance</span>
                        <span className="text-xs font-bold text-[#f5ebd7]">{trail.distanceKm} km</span>
                      </div>
                      <div className="bg-[#0b1f13] rounded-lg p-1.5">
                        <span className="text-[9px] text-[#7d9385] uppercase block">Ascent</span>
                        <span className="text-xs font-bold text-[#34d399]">+{trail.elevationGainMeters}m</span>
                      </div>
                      <div className="bg-[#0b1f13] rounded-lg p-1.5">
                        <span className="text-[9px] text-[#7d9385] uppercase block">Peak</span>
                        <span className="text-xs font-bold text-[#f0cb64]">{trail.peakAltitudeMeters}m</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-end text-xs font-bold text-[#34d399] space-x-1">
                      <span>Load Trail & Track</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: LOGGED TREKS HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-main)]">
                Logged Outdoor Expeditions
              </h3>
              <p className="text-[11px] text-[#7d9385]">
                Past walks, mountain hikes, and trail runs saved to your Panther Vault.
              </p>
            </div>

            {outdoorLogs.length === 0 ? (
              <div className="text-center py-10 bg-[#09150d] rounded-2xl border border-[#163622] p-6">
                <Footprints className="w-10 h-10 text-[#34d399] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#8ea496]">No outdoor activities logged yet.</p>
                <p className="text-[10px] text-[#55866a] mt-1">
                  Start a walk, hike, or run to build your trail record!
                </p>
              </div>
            ) : (
              outdoorLogs.map(log => (
                <div
                  key={log.id}
                  className="bg-[#09170e]/95 border border-[#1b3d27] rounded-2xl p-4 space-y-2 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-md bg-[#0f2818] border border-[#204a2f] flex items-center justify-center">
                          {log.activityType === 'hike' ? (
                            <Mountain className="w-3 h-3 text-amber-400" />
                          ) : log.activityType === 'run' ? (
                            <Navigation className="w-3 h-3 text-sky-400" />
                          ) : (
                            <Footprints className="w-3 h-3 text-emerald-400" />
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-[#f5ebd7]">{log.title}</h4>
                      </div>
                      <span className="text-[10px] text-[#7d9385]">{log.date}</span>
                    </div>

                    <span className="text-xs font-bold text-[var(--accent-main)] font-mono">
                      +{log.xpEarned} XP
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#132c1e] text-center">
                    <div className="bg-[#0b1f13] rounded-lg p-1.5">
                      <span className="text-[8px] text-[#7d9385] uppercase block">Dist</span>
                      <span className="text-xs font-bold text-[#f5ebd7]">
                        {log.distanceKm ? `${log.distanceKm} km` : `${(log.durationMinutes * 0.12).toFixed(1)} km`}
                      </span>
                    </div>
                    <div className="bg-[#0b1f13] rounded-lg p-1.5">
                      <span className="text-[8px] text-[#7d9385] uppercase block">Time</span>
                      <span className="text-xs font-bold text-[#f5ebd7]">{log.durationMinutes}m</span>
                    </div>
                    <div className="bg-[#0b1f13] rounded-lg p-1.5">
                      <span className="text-[8px] text-[#7d9385] uppercase block">Climb</span>
                      <span className="text-xs font-bold text-[#34d399]">
                        +{log.elevationGainMeters || 65}m
                      </span>
                    </div>
                    <div className="bg-[#0b1f13] rounded-lg p-1.5">
                      <span className="text-[8px] text-[#7d9385] uppercase block">Steps</span>
                      <span className="text-xs font-bold text-[#f0cb64]">
                        {log.stepsRecorded?.toLocaleString() || (log.durationMinutes * 125).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Atmospheric Weather Badge if Logged */}
                  {log.weatherConditions && (
                    <div className="flex items-center space-x-2 text-[10px] bg-[#07170c] px-2.5 py-1 rounded-lg border border-[#163622] text-[#8ea496]">
                      <span className="flex items-center space-x-1 text-[#f5ebd7] font-mono">
                        <Thermometer className="w-3 h-3 text-amber-400" />
                        <span>{log.weatherConditions.temperatureC}°C</span>
                      </span>
                      <span className="text-[#1f422b]">•</span>
                      <span className="flex items-center space-x-1 text-sky-300 font-mono">
                        <Droplets className="w-3 h-3 text-sky-400" />
                        <span>{log.weatherConditions.relativeHumidity}% RH</span>
                      </span>
                      <span className="text-[#1f422b]">•</span>
                      <span className="flex items-center space-x-1 text-teal-300 font-mono">
                        <Wind className="w-3 h-3 text-teal-400" />
                        <span>{Math.round(log.weatherConditions.windSpeedKmh)} km/h {log.weatherConditions.windDirectionCompass}</span>
                      </span>
                    </div>
                  )}

                  {log.notes && (
                    <p className="text-[11px] text-[#8ea496] italic bg-[#061209] p-2 rounded-xl border border-[#142e1e]">
                      "{log.notes}"
                    </p>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedWorkoutForAnalysis(log);
                        setShowDeepAnalysisModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#11291b] border border-[#214c33] text-[10px] font-bold text-amber-300 hover:bg-[#1a4029] hover:border-amber-400 flex items-center space-x-1.5 transition-all"
                    >
                      <Activity className="w-3 h-3 text-amber-400" />
                      <span>Deep Workout Analysis (Apex)</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* FINISH SUMMARY & CONFIRMATION MODAL OVERLAY */}
      {showFinishSummary && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a1b11] border border-[#235837] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="text-center space-y-1">
              <div className="flex justify-center pb-1">
                <RealisticEmblem icon="panther" size="md" variant="emerald" showHalo />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider text-[#f5ebd7]">
                Trek Conquered!
              </h3>
              <p className="text-xs text-[#8ea496]">
                Save your {mode.toUpperCase()} session to the Brotherhood records.
              </p>
            </div>

            {/* Quick Metrics Recap */}
            <div className="grid grid-cols-3 gap-2 bg-[#061209] p-3 rounded-2xl border border-[#142e1e] text-center">
              <div>
                <span className="text-[9px] text-[#7d9385] uppercase block">Distance</span>
                <span className="text-sm font-black text-[#f5ebd7] font-mono">{distanceKm.toFixed(2)} km</span>
              </div>
              <div>
                <span className="text-[9px] text-[#7d9385] uppercase block">Climb</span>
                <span className="text-sm font-black text-[#34d399] font-mono">+{Math.round(elevationGain)}m</span>
              </div>
              <div>
                <span className="text-[9px] text-[#7d9385] uppercase block">Steps</span>
                <span className="text-sm font-black text-[#f0cb64] font-mono">{steps.toLocaleString()}</span>
              </div>
            </div>

            {/* Atmospheric Conditions Endured During Session */}
            {weatherConditions && (
              <div className="bg-[#061209] p-3 rounded-2xl border border-[#142e1e] space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-[#7d9385]">
                  <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                    <Wind className="w-3 h-3 text-teal-400" />
                    <span>Atmospheric Conditions Endured</span>
                  </span>
                  <span className="font-mono text-[9px] text-[#8ea496]">
                    {weatherConditions.weatherDescription}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[#0f2416]">
                  <div>
                    <span className="text-[8px] text-[#7d9385] uppercase block">Temp</span>
                    <span className="text-xs font-bold text-[#f5ebd7] font-mono">
                      {weatherConditions.temperatureC}°C
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#7d9385] uppercase block">Humidity</span>
                    <span className="text-xs font-bold text-sky-400 font-mono">
                      {weatherConditions.relativeHumidity}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#7d9385] uppercase block">Wind</span>
                    <span className="text-xs font-bold text-teal-300 font-mono">
                      {Math.round(weatherConditions.windSpeedKmh)} kph {weatherConditions.windDirectionCompass}
                    </span>
                  </div>
                </div>
                {weatherConditions.trailConditionNote && (
                  <div className="text-[10px] text-[#8ea496] bg-[#091a10] px-2 py-1 rounded-lg border border-[#173822] flex items-center space-x-1.5 mt-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{weatherConditions.trailConditionNote}</span>
                  </div>
                )}
              </div>
            )}

            {/* Rate of Perceived Exertion (RPE) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#e6f4ec]">Perceived Intensity (RPE)</label>
                <span className="text-xs font-mono font-bold text-[var(--accent-main)]">{sessionRpe}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={sessionRpe}
                onChange={e => setSessionRpe(parseFloat(e.target.value))}
                className="w-full accent-[var(--accent-main)] h-2 bg-[#122e1d] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#7d9385] mt-1">
                <span>1 - Recovery</span>
                <span>5 - Moderate</span>
                <span>10 - Maximum Peak</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-[#e6f4ec] block mb-1">Session Notes (Optional)</label>
              <textarea
                value={sessionNotes}
                onChange={e => setSessionNotes(e.target.value)}
                placeholder="Trail conditions, weather, pack weight, or mindset..."
                rows={2}
                className="w-full bg-[#08150d] border border-[#163622] rounded-xl p-2.5 text-xs text-[#f5ebd7] focus:outline-none focus:border-[#34d399] resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setShowFinishSummary(false)}
                className="flex-1 py-3 rounded-xl bg-[#122b1c] text-[#8ea496] hover:text-[#f5ebd7] text-xs font-bold transition-all"
              >
                Back to Map
              </button>
              <button
                onClick={handleSaveSession}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] text-[#051108] text-xs font-black uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-all"
              >
                Save & Log Session
              </button>
            </div>

            <button
              onClick={() => {
                handleSaveSession();
                setShowDeepAnalysisModal(true);
              }}
              className="w-full py-2.5 rounded-xl bg-[#0e2718] border border-amber-500/40 text-amber-300 hover:bg-[#153f25] text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-md"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Save & Open Deep Biomechanical Analysis (Apex)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
