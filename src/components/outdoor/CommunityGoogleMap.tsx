/// <reference types="vite/client" />
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  Polyline,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { CommunityTrail } from '../../types/trails';
import {
  MapPin,
  Layers,
  Navigation,
  Compass,
  Mountain,
  Footprints,
  Star,
  ExternalLink,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Info,
  Maximize2
} from 'lucide-react';

// Controller to smoothly fit map bounds when trail selection changes
const MapBoundsController: React.FC<{
  selectedTrail: CommunityTrail | null;
  allTrails: CommunityTrail[];
}> = ({ selectedTrail, allTrails }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof window === 'undefined' || !window.google?.maps) return;

    if (selectedTrail && selectedTrail.waypoints && selectedTrail.waypoints.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      selectedTrail.waypoints.forEach((wp) => {
        bounds.extend({ lat: wp.lat, lng: wp.lng });
      });
      map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
    } else if (allTrails.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      allTrails.forEach((t) => bounds.extend(t.center));
      map.fitBounds(bounds, { top: 40, bottom: 40, left: 40, right: 40 });
    }
  }, [map, selectedTrail, allTrails]);

  return null;
};

interface CommunityGoogleMapProps {
  trails: CommunityTrail[];
  selectedTrail: CommunityTrail | null;
  onSelectTrail: (trail: CommunityTrail) => void;
  userPos?: { lat: number; lng: number } | null;
  onLoadTrailToTracker: (trail: CommunityTrail) => void;
}

export const CommunityGoogleMap: React.FC<CommunityGoogleMapProps> = ({
  trails,
  selectedTrail,
  onSelectTrail,
  userPos,
  onLoadTrailToTracker
}) => {
  const envKey = ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || '';
  const [userCustomKey, setUserCustomKey] = useState<string>(() => {
    return localStorage.getItem('panther_custom_gmp_key') || '';
  });
  const [showKeyPrompt, setShowKeyPrompt] = useState<boolean>(false);
  const [demoKeyInput, setDemoKeyInput] = useState<string>('');

  const activeApiKey = userCustomKey || envKey;

  const [mapType, setMapType] = useState<'terrain' | 'roadmap' | 'satellite'>('terrain');
  const [hoveredTrail, setHoveredTrail] = useState<CommunityTrail | null>(null);
  const [useTacticalCanvasFallback, setUseTacticalCanvasFallback] = useState<boolean>(!activeApiKey);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Default coordinate center (Nairobi & Great Rift Valley central hub)
  const defaultCenter = useMemo(() => {
    if (selectedTrail) return selectedTrail.center;
    if (trails.length > 0) return trails[0].center;
    return { lat: -1.2921, lng: 36.8219 };
  }, [selectedTrail, trails]);

  const handleSaveUserKey = (key: string) => {
    const trimmed = key.trim();
    setUserCustomKey(trimmed);
    localStorage.setItem('panther_custom_gmp_key', trimmed);
    if (trimmed) {
      setUseTacticalCanvasFallback(false);
      setShowKeyPrompt(false);
    }
  };

  // Polyline color based on activity type
  const getPolylineColor = (trail: CommunityTrail) => {
    if (trail.activityType === 'cycling') return '#f59e0b'; // Amber Gold
    if (trail.activityType === 'running') return '#10b981'; // Vivid Emerald / Cyan
    return '#f97316'; // Orange / Terracotta for Hiking
  };

  // Draw high-fidelity topographic vector map on HTML5 Canvas when in Tactical / Fallback mode
  useEffect(() => {
    if (!useTacticalCanvasFallback) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Rich dark wilderness canvas
    ctx.fillStyle = '#06130b';
    ctx.fillRect(0, 0, width, height);

    // Dynamic topographic elevation contour lines
    ctx.strokeStyle = '#0e2618';
    ctx.lineWidth = 1;
    for (let r = 50; r < Math.max(width, height); r += 45) {
      ctx.beginPath();
      ctx.arc(width / 2 + 30, height / 2 - 20, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Grid coordinates
    ctx.strokeStyle = '#0b2014';
    ctx.lineWidth = 0.8;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Determine geographic bounds for trails to project coordinates
    const allPoints: { lat: number; lng: number }[] = [];
    trails.forEach((t) => {
      allPoints.push(t.center);
      t.waypoints.forEach((w) => allPoints.push(w));
    });

    if (allPoints.length > 0) {
      let minLat = Math.min(...allPoints.map((p) => p.lat));
      let maxLat = Math.max(...allPoints.map((p) => p.lat));
      let minLng = Math.min(...allPoints.map((p) => p.lng));
      let maxLng = Math.max(...allPoints.map((p) => p.lng));

      const latSpan = Math.max(0.005, (maxLat - minLat) * 1.35);
      const lngSpan = Math.max(0.005, (maxLng - minLng) * 1.35);
      const midLat = (minLat + maxLat) / 2;
      const midLng = (minLng + maxLng) / 2;

      const toX = (lng: number) => width / 2 + ((lng - midLng) / lngSpan) * (width * 0.8);
      const toY = (lat: number) => height / 2 - ((lat - midLat) / latSpan) * (height * 0.8);

      // Draw all trails path traces
      trails.forEach((trail) => {
        const isSelected = selectedTrail?.id === trail.id;
        const color = getPolylineColor(trail);

        if (trail.waypoints && trail.waypoints.length > 1) {
          ctx.beginPath();
          trail.waypoints.forEach((wp, idx) => {
            const x = toX(wp.lng);
            const y = toY(wp.lat);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });

          if (isSelected) {
            // Radiant glow for selected trail
            ctx.strokeStyle = color;
            ctx.lineWidth = 5;
            ctx.shadowColor = color;
            ctx.shadowBlur = 12;
            ctx.stroke();
            ctx.shadowBlur = 0;
          } else {
            ctx.strokeStyle = `${color}66`;
            ctx.lineWidth = 2.5;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }

        // Draw start icon pin
        const sx = toX(trail.center.lng);
        const sy = toY(trail.center.lat);

        ctx.fillStyle = isSelected ? color : '#133522';
        ctx.strokeStyle = '#e6f4ec';
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(sx, sy, isSelected ? 9 : 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Trail name label on canvas
        if (isSelected || trail.rating >= 4.9) {
          ctx.fillStyle = isSelected ? '#f5ebd7' : '#9bb5a3';
          ctx.font = isSelected ? 'bold 10px sans-serif' : '9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${trail.activityType === 'cycling' ? '🚴' : '🏃'} ${trail.name.split(' ')[0]}`, sx, sy - 12);
        }
      });

      // User location marker
      if (userPos) {
        const ux = toX(userPos.lng);
        const uy = toY(userPos.lat);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.3)';
        ctx.beginPath();
        ctx.arc(ux, uy, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#34d399';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ux, uy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
  }, [useTacticalCanvasFallback, trails, selectedTrail, userPos]);

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] rounded-3xl overflow-hidden border border-[#1b3d27] bg-[#07130b] shadow-2xl">
      {/* Fallback Tactical Topographic Canvas when API Key is missing or user requests tactical mode */}
      {useTacticalCanvasFallback ? (
        <div className="relative w-full h-full">
          <canvas
            ref={canvasRef}
            width={720}
            height={440}
            className="w-full h-full object-cover select-none"
          />

          {/* Tactical Mode Status Badge */}
          <div className="absolute top-3 left-3 bg-[#08170e]/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#235334] text-[11px] text-[#34d399] font-bold flex items-center space-x-2">
            <Compass className="w-4 h-4 text-[var(--accent-main)]" />
            <span>Community Vector Radar ({trails.length} local routes)</span>
          </div>

          {/* Quick API Key Connection Prompt Badge */}
          <button
            onClick={() => setShowKeyPrompt(!showKeyPrompt)}
            className="absolute top-3 right-3 bg-[#122e1d]/90 hover:bg-[#194029] backdrop-blur-md px-3 py-1.5 rounded-xl border border-[var(--accent-main)]/50 text-[11px] text-[var(--accent-main)] font-bold flex items-center space-x-1.5 transition-all shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeApiKey ? 'Google Maps Enabled' : 'Connect Google Maps'}</span>
          </button>
        </div>
      ) : (
        /* Modern Google Maps Platform Web View using @vis.gl/react-google-maps */
        <APIProvider apiKey={activeApiKey}>
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={defaultCenter}
            defaultZoom={11}
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Auto camera bounds fitter */}
            <MapBoundsController selectedTrail={selectedTrail} allTrails={trails} />

            {/* Render all community trail start pins using AdvancedMarker */}
            {trails.map((trail) => {
              const isSelected = selectedTrail?.id === trail.id;
              const color = getPolylineColor(trail);

              return (
                <AdvancedMarker
                  key={`trail-marker-${trail.id}`}
                  position={trail.center}
                  title={`${trail.name} (${trail.distanceKm} km)`}
                  onClick={() => onSelectTrail(trail)}
                >
                  <div
                    className={`cursor-pointer transition-transform transform ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-10'
                    }`}
                  >
                    <div
                      className={`relative flex items-center justify-center px-2 py-1 rounded-full text-[10px] font-black shadow-xl border ${
                        isSelected
                          ? 'bg-black text-[#f5ebd7] border-[var(--accent-main)] ring-2 ring-[var(--accent-main)]/50'
                          : 'bg-[#0b1f13] text-[#e6f4ec] border-[#22553b]'
                      }`}
                    >
                      <span className="mr-1">{trail.activityType === 'cycling' ? '🚴' : '🏃'}</span>
                      <span>{trail.distanceKm}k</span>
                    </div>

                    <div
                      className="w-2 h-2 mx-auto rotate-45 -mt-1"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* If a trail is selected, draw its high-resolution polyline */}
            {selectedTrail && selectedTrail.waypoints && selectedTrail.waypoints.length > 1 && (
              <>
                <Polyline
                  path={selectedTrail.waypoints.map((wp) => ({ lat: wp.lat, lng: wp.lng }))}
                  strokeColor={getPolylineColor(selectedTrail)}
                  strokeOpacity={0.9}
                  strokeWeight={5}
                />

                {/* Trail Summit Marker if high altitude climb */}
                {selectedTrail.elevationGainMeters >= 400 && (
                  <AdvancedMarker
                    position={{
                      lat: selectedTrail.waypoints[Math.floor(selectedTrail.waypoints.length / 2)].lat,
                      lng: selectedTrail.waypoints[Math.floor(selectedTrail.waypoints.length / 2)].lng
                    }}
                    title={`Peak Altitude: ${selectedTrail.peakAltitudeMeters}m`}
                  >
                    <div className="bg-amber-950/90 border border-amber-400 text-amber-300 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold shadow-md flex items-center space-x-1">
                      <Mountain className="w-3 h-3 text-amber-400" />
                      <span>{selectedTrail.peakAltitudeMeters}m</span>
                    </div>
                  </AdvancedMarker>
                )}
              </>
            )}

            {/* Current athlete GPS location if available */}
            {userPos && (
              <AdvancedMarker position={userPos} title="Your Current Location">
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#10b981]/30 animate-ping absolute" />
                  <div className="w-5 h-5 rounded-full bg-[#10b981] border-2 border-white shadow-lg flex items-center justify-center text-[9px] text-white font-bold">
                    ▲
                  </div>
                </div>
              </AdvancedMarker>
            )}
          </Map>
        </APIProvider>
      )}

      {/* Interactive Map Overlay Controls */}
      <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-20">
        {/* Toggle between Terrain / Satellite / Roadmap */}
        {!useTacticalCanvasFallback && activeApiKey && (
          <div className="flex bg-[#08170e]/90 backdrop-blur-md rounded-xl border border-[#1b3d27] p-0.5">
            <button
              onClick={() => setMapType('terrain')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                mapType === 'terrain'
                  ? 'bg-[#1b432a] text-[#f5ebd7]'
                  : 'text-[#7d9385] hover:text-[#e6f4ec]'
              }`}
            >
              Terrain
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                mapType === 'satellite'
                  ? 'bg-[#1b432a] text-[#f5ebd7]'
                  : 'text-[#7d9385] hover:text-[#e6f4ec]'
              }`}
            >
              Satellite
            </button>
          </div>
        )}

        {/* Tactical Canvas vs Google Maps Toggle */}
        <button
          onClick={() => {
            if (!activeApiKey && useTacticalCanvasFallback) {
              setShowKeyPrompt(true);
            } else {
              setUseTacticalCanvasFallback(!useTacticalCanvasFallback);
            }
          }}
          className={`p-2 rounded-xl backdrop-blur-md border text-xs font-bold transition-all ${
            !useTacticalCanvasFallback
              ? 'bg-[#1b432a] text-[#f5ebd7] border-[#34d399]'
              : 'bg-[#08170e]/90 text-[#7d9385] border-[#1b3d27] hover:text-white'
          }`}
          title={useTacticalCanvasFallback ? 'Switch to Google Maps Platform' : 'Switch to Tactical Vector View'}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* API Key / Demo Key Configuration Dropdown Modal */}
      {showKeyPrompt && (
        <div className="absolute inset-0 bg-[#050e08]/90 backdrop-blur-md z-40 p-5 flex flex-col justify-center items-center text-center">
          <div className="max-w-md w-full bg-[#0a1c11] border border-[#22553b] rounded-3xl p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[var(--accent-main)]" />
                <h3 className="font-['Cinzel'] text-sm font-bold text-[#f5ebd7]">
                  Google Maps Platform Discovery
                </h3>
              </div>
              <button
                onClick={() => setShowKeyPrompt(false)}
                className="text-[#7d9385] hover:text-white text-xs px-2 py-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#9bb5a3] leading-relaxed">
              Use Google Maps to render interactive 3D terrain, contour hillshades, and street-level satellite layers for community running and cycling routes.
            </p>

            <div className="p-3 rounded-2xl bg-[#06120a] border border-[#173823] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#e6f4ec]">Free Maps Demo Key</span>
                <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Zero Billing Required
                </span>
              </div>
              <p className="text-[10px] text-[#7d9385]">
                Mint a free demo key from Google to test the live interactive map without creating a billing account.
              </p>
              <a
                href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[var(--accent-main)] hover:underline"
              >
                <span>Get your free Google Maps Demo Key</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#7d9385] block">
                Paste Google Maps API Key or Demo Key:
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={demoKeyInput}
                  onChange={(e) => setDemoKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 bg-[#06120a] border border-[#1a3f28] rounded-xl px-3 py-2 text-xs text-[#f5ebd7] placeholder-[#4f6b57] focus:outline-none focus:border-[var(--accent-main)]"
                />
                <button
                  onClick={() => handleSaveUserKey(demoKeyInput)}
                  disabled={!demoKeyInput.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--accent-main)] to-[#b0812e] text-black font-bold text-xs hover:brightness-110 disabled:opacity-40 transition-all"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 text-[10px] text-[#7d9385]">
              <span>Or keep using the High-Fidelity Tactical Vector Map</span>
              <button
                onClick={() => {
                  setUseTacticalCanvasFallback(true);
                  setShowKeyPrompt(false);
                }}
                className="text-[#34d399] font-bold hover:underline"
              >
                Use Tactical View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Trail Quick Banner at Map Bottom */}
      {selectedTrail && (
        <div className="absolute bottom-3 left-3 right-3 bg-[#08180f]/95 backdrop-blur-md border border-[#215334] rounded-2xl p-3 flex items-center justify-between shadow-2xl z-20">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                selectedTrail.activityType === 'cycling'
                  ? 'bg-amber-950/80 border border-amber-700 text-amber-400'
                  : 'bg-emerald-950/80 border border-emerald-700 text-emerald-400'
              }`}
            >
              {selectedTrail.activityType === 'cycling' ? (
                <span className="text-base">🚴</span>
              ) : selectedTrail.activityType === 'running' ? (
                <span className="text-base">🏃</span>
              ) : (
                <Mountain className="w-4 h-4 text-orange-400" />
              )}
            </div>

            <div className="truncate">
              <div className="flex items-center space-x-1.5">
                <h4 className="text-xs font-bold text-[#f5ebd7] truncate">{selectedTrail.name}</h4>
                <span className="text-[10px] text-[var(--accent-main)] font-mono flex items-center">
                  <Star className="w-3 h-3 fill-current inline mr-0.5" />
                  {selectedTrail.rating}
                </span>
              </div>
              <p className="text-[10px] text-[#8ea496] truncate">
                {selectedTrail.distanceKm} km • +{selectedTrail.elevationGainMeters}m climb • {selectedTrail.difficulty}
              </p>
            </div>
          </div>

          <button
            onClick={() => onLoadTrailToTracker(selectedTrail)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#194b2a] to-[#25663b] hover:from-[#215f36] hover:to-[#2e7a48] border border-[#388e57] text-[#e6f4ec] text-[11px] font-bold shadow-lg transition-all flex-shrink-0 ml-2"
          >
            <span>Load to GPS</span>
            <Navigation className="w-3 h-3 text-[var(--accent-main)]" />
          </button>
        </div>
      )}
    </div>
  );
};
