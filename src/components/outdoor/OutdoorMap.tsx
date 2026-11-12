/// <reference types="vite/client" />
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { GeoPoint } from '../../utils/geoUtils';
import { AtmosphericConditions } from '../../types';
import {
  fetchRealtimeWeather,
  getSimulatedAtmosphericConditions
} from '../../utils/weatherService';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Navigation,
  Layers,
  Crosshair,
  MapPin,
  AlertCircle,
  ExternalLink,
  Crown,
  Lock,
  Eye,
  RotateCw,
  Play,
  Pause,
  Maximize2,
  Wind,
  Thermometer,
  Droplets,
  Sun,
  CloudSun,
  CloudRain,
  Zap,
  Gauge,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  Info,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface OutdoorMapProps {
  currentPos: GeoPoint | null;
  path: GeoPoint[];
  presetWaypoints?: { lat: number; lng: number; ele?: number }[];
  gpsAccuracyMeters?: number;
  activityMode: 'walk' | 'hike' | 'run' | 'cycle';
  onRecenter?: () => void;
  weather?: AtmosphericConditions | null;
  isWeatherLoading?: boolean;
  onRefreshWeather?: () => void;
}

export const OutdoorMap: React.FC<OutdoorMapProps> = ({
  currentPos,
  path,
  presetWaypoints,
  gpsAccuracyMeters = 5,
  activityMode,
  weather,
  isWeatherLoading = false,
  onRefreshWeather
}) => {
  const { isPremium, openPremiumUpgrade } = useApp();
  const apiKey = ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || '';

  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('terrain');
  const [useTacticalView, setUseTacticalView] = useState<boolean>(!apiKey);
  const [zoomLevel, setZoomLevel] = useState<number>(16);

  // 3D Mode State (Premium Feature)
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [cameraHeading, setCameraHeading] = useState<number>(35); // degrees
  const [cameraTilt, setCameraTilt] = useState<number>(60); // 30-75 degrees
  const [isOrbiting, setIsOrbiting] = useState<boolean>(false);
  const [isFlyingAlongRoute, setIsFlyingAlongRoute] = useState<boolean>(false);
  const [flyIndex, setFlyIndex] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas3DRef = useRef<HTMLCanvasElement | null>(null);

  // Atmospheric conditions & HUD panel state
  const [showWeatherPanel, setShowWeatherPanel] = useState<boolean>(false);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [internalWeather, setInternalWeather] = useState<AtmosphericConditions | null>(null);

  // Fetch real-time weather if not provided via props
  useEffect(() => {
    if (weather) return;
    const lat = currentPos?.lat ?? (presetWaypoints && presetWaypoints[0]?.lat) ?? -1.2921;
    const lng = currentPos?.lng ?? (presetWaypoints && presetWaypoints[0]?.lng) ?? 36.8219;
    const alt = currentPos?.altitude ?? 1680;

    let isSubscribed = true;
    fetchRealtimeWeather(lat, lng, alt).then(data => {
      if (isSubscribed) setInternalWeather(data);
    });

    return () => {
      isSubscribed = false;
    };
  }, [weather, currentPos?.lat, currentPos?.lng, presetWaypoints]);

  const activeWeather = weather || internalWeather;

  // Weather icon rendering helper
  const renderWeatherIcon = (code?: number, className = 'w-4 h-4') => {
    if (code === undefined || code === null) return <CloudSun className={`${className} text-amber-300`} />;
    if (code === 0) return <Sun className={`${className} text-amber-400`} />;
    if (code <= 3) return <CloudSun className={`${className} text-amber-300`} />;
    if (code >= 51 && code <= 82) return <CloudRain className={`${className} text-sky-400`} />;
    if (code >= 95) return <Zap className={`${className} text-yellow-400`} />;
    return <CloudSun className={`${className} text-emerald-300`} />;
  };

  // Fallback center if currentPos is not yet established
  const defaultCenter = useMemo(() => {
    if (currentPos) return { lat: currentPos.lat, lng: currentPos.lng };
    if (presetWaypoints && presetWaypoints.length > 0) {
      return { lat: presetWaypoints[0].lat, lng: presetWaypoints[0].lng };
    }
    // Nairobi / Great Rift Valley default
    return { lat: -1.2921, lng: 36.8219 };
  }, [currentPos, presetWaypoints]);

  // Handle 3D mode activation request
  const handleToggle3D = () => {
    if (!isPremium) {
      openPremiumUpgrade('Photorealistic 3D Mountain & Trail Maps');
      return;
    }
    setIs3DMode(prev => !prev);
  };

  // Continuous Orbit Animation loop if active
  useEffect(() => {
    if (!is3DMode || !isOrbiting) return;
    const interval = setInterval(() => {
      setCameraHeading(prev => (prev + 1.2) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [is3DMode, isOrbiting]);

  // Fly along route animation loop
  useEffect(() => {
    if (!is3DMode || !isFlyingAlongRoute) return;
    const allPts = path.length > 1 ? path : presetWaypoints || [];
    if (allPts.length < 2) return;

    const interval = setInterval(() => {
      setFlyIndex(prev => {
        const next = prev + 1;
        if (next >= allPts.length) {
          setIsFlyingAlongRoute(false);
          return 0;
        }
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [is3DMode, isFlyingAlongRoute, path, presetWaypoints]);

  // Render 3D Perspective Isometric Topographic Flyover
  useEffect(() => {
    if (!is3DMode) return;
    const canvas = canvas3DRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Deep wilderness sky to terrain gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#040b07');
    skyGrad.addColorStop(0.4, '#07150d');
    skyGrad.addColorStop(1, '#091b11');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Coordinate space calculations
    const allPoints = [...(presetWaypoints || []), ...path];
    if (currentPos && allPoints.length === 0) {
      allPoints.push({ lat: currentPos.lat, lng: currentPos.lng, ele: currentPos.altitude || 1680 });
    }

    let minLat = -1.30, maxLat = -1.28, minLng = 36.80, maxLng = 36.84;
    let minEle = 1600, maxEle = 2100;

    if (allPoints.length > 0) {
      minLat = Math.min(...allPoints.map(p => p.lat));
      maxLat = Math.max(...allPoints.map(p => p.lat));
      minLng = Math.min(...allPoints.map(p => p.lng));
      maxLng = Math.max(...allPoints.map(p => p.lng));
      minEle = Math.min(...allPoints.map(p => (p as any).ele || 1680));
      maxEle = Math.max(...allPoints.map(p => (p as any).ele || 1680));
      if (maxEle === minEle) maxEle = minEle + 150;
    }

    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
    const latSpan = Math.max(0.005, (maxLat - minLat) * 1.5);
    const lngSpan = Math.max(0.005, (maxLng - minLng) * 1.5);

    // 3D Projection math: rotation angle & pitch
    const radHeading = (cameraHeading * Math.PI) / 180;
    const cosH = Math.cos(radHeading);
    const sinH = Math.sin(radHeading);
    const pitch = (cameraTilt / 90) * 0.65; // vertical foreshortening

    const project3D = (lat: number, lng: number, ele: number = 1680) => {
      // Normalize to [-1, 1] relative to center
      const nx = ((lng - midLng) / lngSpan) * 160;
      const ny = ((lat - midLat) / latSpan) * 160;

      // Rotate by heading
      const rx = nx * cosH - ny * sinH;
      const ry = nx * sinH + ny * cosH;

      // Vertical altitude extrusion
      const eleNorm = ((ele - minEle) / (maxEle - minEle || 1)) * 50;

      // Screen X and Y
      const sx = width / 2 + rx * 1.6;
      const sy = height * 0.58 + (ry * pitch * 1.4) - eleNorm;

      return { x: sx, y: sy, eleNorm };
    };

    // Draw 3D Topographic Terrain Grid Base
    ctx.strokeStyle = 'rgba(20, 75, 42, 0.4)';
    ctx.lineWidth = 1;
    const gridRes = 8;
    for (let i = -gridRes; i <= gridRes; i++) {
      ctx.beginPath();
      for (let j = -gridRes; j <= gridRes; j++) {
        const fakeLat = midLat + (i / gridRes) * (latSpan / 2);
        const fakeLng = midLng + (j / gridRes) * (lngSpan / 2);
        // Add pseudo-elevation contour bulge
        const distCenter = Math.sqrt(i * i + j * j);
        const fakeEle = minEle + Math.max(0, (gridRes - distCenter) * 12);
        const pt = project3D(fakeLat, fakeLng, fakeEle);
        if (j === -gridRes) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }

    // Draw Mountain Peak 3D Pillars & Contours
    const peakPt = project3D(maxLat, maxLng, maxEle + 60);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(peakPt.x, peakPt.y);
    ctx.lineTo(peakPt.x, peakPt.y + 40);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#f5ebd7';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`▲ PEAK +${Math.round(maxEle)}m`, peakPt.x + 5, peakPt.y - 4);

    // Draw Preset Waypoint Path in 3D
    if (presetWaypoints && presetWaypoints.length > 1) {
      ctx.beginPath();
      presetWaypoints.forEach((wp, idx) => {
        const pt = project3D(wp.lat, wp.lng, wp.ele || 1680);
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Draw Active Traveled Route with 3D Glowing Elevation Ribbon
    if (path.length > 1) {
      // Ground Shadow
      ctx.beginPath();
      path.forEach((p, idx) => {
        const pt = project3D(p.lat, p.lng, minEle);
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Extruded vertical curtain
      for (let k = 0; k < path.length - 1; k++) {
        const p1 = path[k];
        const p2 = path[k + 1];
        const top1 = project3D(p1.lat, p1.lng, p1.altitude || 1680);
        const top2 = project3D(p2.lat, p2.lng, p2.altitude || 1680);
        const bot1 = project3D(p1.lat, p1.lng, minEle);
        const bot2 = project3D(p2.lat, p2.lng, minEle);

        ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
        ctx.beginPath();
        ctx.moveTo(top1.x, top1.y);
        ctx.lineTo(top2.x, top2.y);
        ctx.lineTo(bot2.x, bot2.y);
        ctx.lineTo(bot1.x, bot1.y);
        ctx.closePath();
        ctx.fill();
      }

      // Upper glowing elevation path ribbon
      ctx.beginPath();
      path.forEach((p, idx) => {
        const pt = project3D(p.lat, p.lng, p.altitude || 1680);
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3.5;
      ctx.stroke();
    }

    // Current 3D Position Pin / Avatar
    const focalPoint = currentPos || (path.length > 0 ? path[path.length - 1] : null);
    if (focalPoint) {
      const cur3D = project3D(focalPoint.lat, focalPoint.lng, focalPoint.altitude || 1680);

      // Radar Pulse
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cur3D.x, cur3D.y, 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cur3D.x, cur3D.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Altitude flag
      ctx.fillStyle = '#102719';
      ctx.fillRect(cur3D.x - 30, cur3D.y - 24, 60, 16);
      ctx.strokeStyle = '#22c55e';
      ctx.strokeRect(cur3D.x - 30, cur3D.y - 24, 60, 16);
      ctx.fillStyle = '#f5ebd7';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(focalPoint.altitude || 1680)}m ALT`, cur3D.x, cur3D.y - 13);
      ctx.textAlign = 'left';
    }

    // Atmospheric Real-Time Wind Vector on 3D Viewport
    if (activeWeather && activeWeather.windSpeedKmh > 0) {
      const dialX = width - 42;
      const dialY = 46;
      const windAngleRad = ((activeWeather.windDirectionDeg - cameraHeading + 180) * Math.PI) / 180;

      ctx.save();
      ctx.fillStyle = 'rgba(6, 17, 10, 0.88)';
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(dialX, dialY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#658872';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N', dialX, dialY - 14);

      // Rotating wind arrow
      ctx.save();
      ctx.translate(dialX, dialY);
      ctx.rotate(windAngleRad);
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(3.5, 7);
      ctx.lineTo(0, 4);
      ctx.lineTo(-3.5, 7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#e8f5ed';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(activeWeather.windSpeedKmh)}kph`, dialX, dialY + 14);
      ctx.restore();
    }
  }, [is3DMode, cameraHeading, cameraTilt, path, presetWaypoints, currentPos, activeWeather]);

  // Standard 2D Tactical Canvas
  useEffect(() => {
    if (is3DMode || (!useTacticalView && apiKey)) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background dark emerald topographic canvas
    ctx.fillStyle = '#06110a';
    ctx.fillRect(0, 0, width, height);

    // Topographic grid
    ctx.strokeStyle = '#0f2b1b';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const allPoints = [...(presetWaypoints || []), ...path];
    if (currentPos && allPoints.length === 0) {
      allPoints.push({ lat: currentPos.lat, lng: currentPos.lng, ele: currentPos.altitude });
    }

    if (allPoints.length > 0) {
      let minLat = allPoints[0].lat;
      let maxLat = allPoints[0].lat;
      let minLng = allPoints[0].lng;
      let maxLng = allPoints[0].lng;

      allPoints.forEach((p) => {
        if (p.lat < minLat) minLat = p.lat;
        if (p.lat > maxLat) maxLat = p.lat;
        if (p.lng < minLng) minLng = p.lng;
        if (p.lng > maxLng) maxLng = p.lng;
      });

      const latSpan = Math.max(0.001, (maxLat - minLat) * 1.35);
      const lngSpan = Math.max(0.001, (maxLng - minLng) * 1.35);
      const midLat = (minLat + maxLat) / 2;
      const midLng = (minLng + maxLng) / 2;

      const toScreenX = (lng: number) => {
        return width / 2 + ((lng - midLng) / lngSpan) * (width * 0.75);
      };
      const toScreenY = (lat: number) => {
        return height / 2 - ((lat - midLat) / latSpan) * (height * 0.75);
      };

      // Draw preset waypoints line
      if (presetWaypoints && presetWaypoints.length > 1) {
        ctx.strokeStyle = '#22553b';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        presetWaypoints.forEach((pt, i) => {
          const sx = toScreenX(pt.lng);
          const sy = toScreenY(pt.lat);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw traveled path
      if (path.length > 1) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        path.forEach((pt, i) => {
          const sx = toScreenX(pt.lng);
          const sy = toScreenY(pt.lat);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.stroke();
      }

      // Draw current location blip
      if (currentPos) {
        const cx = toScreenX(currentPos.lng);
        const cy = toScreenY(currentPos.lat);

        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw Atmospheric Wind Streamlines & Tactical Wind Rose on 2D Topo Canvas
      if (activeWeather && activeWeather.windSpeedKmh > 0) {
        const windAngleRad = ((activeWeather.windDirectionDeg + 180) * Math.PI) / 180;
        const cosW = Math.cos(windAngleRad);
        const sinW = Math.sin(windAngleRad);

        // Subtle ambient atmospheric streamlines
        ctx.save();
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 12]);
        for (let x = 20; x < width; x += 55) {
          for (let y = 20; y < height; y += 55) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cosW * 22, y + sinW * 22);
            ctx.stroke();
          }
        }
        ctx.setLineDash([]);

        // Tactical Wind Rose Dial (Bottom-Left)
        const dialX = 40;
        const dialY = height - 40;

        ctx.fillStyle = 'rgba(6, 17, 10, 0.88)';
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(dialX, dialY, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#658872';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('N', dialX, dialY - 14);

        // Rotating wind vector needle
        ctx.save();
        ctx.translate(dialX, dialY);
        ctx.rotate(windAngleRad);
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(3.5, 7);
        ctx.lineTo(0, 4);
        ctx.lineTo(-3.5, 7);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = '#e8f5ed';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(activeWeather.windSpeedKmh)}kph`, dialX, dialY + 14);
        ctx.restore();
      }
    }
  }, [useTacticalView, apiKey, is3DMode, path, presetWaypoints, currentPos, activeWeather]);

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#1b3d27] bg-[#07130b] shadow-2xl">
      {/* MAP VIEW RENDERER */}
      {is3DMode ? (
        /* 3D PERSPECTIVE TOPOGRAPHIC FLYOVER CANVAS */
        <div className="relative w-full h-full">
          <canvas
            ref={canvas3DRef}
            width={600}
            height={384}
            className="w-full h-full object-cover select-none"
          />

          {/* 3D Flight Controls HUD */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="bg-[#08170e]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 text-[10px] text-amber-300 font-bold flex items-center space-x-1.5 pointer-events-auto">
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>3D Orbital Topography • {Math.round(cameraHeading)}° HDG</span>
            </div>

            <div className="flex items-center space-x-2 pointer-events-auto">
              {/* Rotate Orbit Button */}
              <button
                onClick={() => setIsOrbiting(!isOrbiting)}
                className={`p-2 rounded-xl backdrop-blur-md border text-xs font-bold transition-all ${
                  isOrbiting
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-[#08170e]/90 text-[#8ea496] border-[#1b3d27] hover:text-white'
                }`}
                title="Orbit 360° Camera"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isOrbiting ? 'animate-spin' : ''}`} />
              </button>

              {/* Pitch Tilt Toggle */}
              <button
                onClick={() => setCameraTilt(cameraTilt >= 65 ? 40 : 67.5)}
                className="px-2.5 py-1.5 rounded-xl bg-[#08170e]/90 backdrop-blur-md border border-[#1b3d27] text-[10px] font-mono text-[#f5ebd7] hover:border-amber-400 transition-all"
                title="Adjust 3D Pitch Angle"
              >
                {cameraTilt}° TILT
              </button>
            </div>
          </div>
        </div>
      ) : !useTacticalView && apiKey ? (
        /* Standard 2D Google Maps API */
        <APIProvider apiKey={apiKey}>
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={defaultCenter}
            center={currentPos ? { lat: currentPos.lat, lng: currentPos.lng } : defaultCenter}
            defaultZoom={zoomLevel}
            zoom={zoomLevel}
            mapTypeId={mapType}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            {path.length > 0 && (
              <AdvancedMarker position={{ lat: path[0].lat, lng: path[0].lng }} title="Start Point">
                <Pin background="#f59e0b" glyphColor="#ffffff" borderColor="#78350f" />
              </AdvancedMarker>
            )}

            {currentPos && (
              <AdvancedMarker position={{ lat: currentPos.lat, lng: currentPos.lng }} title="Current Location">
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#10b981]/30 animate-ping absolute" />
                  <div className="w-5 h-5 rounded-full bg-[#10b981] border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold">
                    ▲
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {presetWaypoints?.map((wp, i) => (
              <AdvancedMarker key={`wp-${i}`} position={{ lat: wp.lat, lng: wp.lng }} title={`Waypoint ${i + 1}`}>
                <Pin background="#059669" glyphColor="#ffffff" scale={0.7} />
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      ) : (
        /* Standard 2D Tactical Canvas */
        <canvas
          ref={canvasRef}
          width={600}
          height={384}
          className="w-full h-full object-cover select-none"
        />
      )}

      {/* Top Floating Overlay Badge: GPS Status & 3D Toggle */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="bg-[#07130b]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#1b3d27] shadow-lg flex items-center space-x-2 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
          <div className="text-[11px] font-mono text-[#f5ebd7] font-semibold">
            {currentPos ? (
              <span>
                {currentPos.lat.toFixed(4)}°, {currentPos.lng.toFixed(4)}°
              </span>
            ) : (
              <span className="text-[#8ea496]">Acquiring Fix...</span>
            )}
          </div>
          <span className="text-[9px] text-[#55866a] px-1.5 py-0.5 rounded bg-[#0b2416] border border-[#164429]">
            ±{Math.round(gpsAccuracyMeters)}m
          </span>
        </div>

        {/* Action Buttons: 3D Flyover & Layer Switcher */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          {/* 3D MODE BUTTON (GATED TO APEX) */}
          <button
            onClick={handleToggle3D}
            className={`px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-black flex items-center space-x-1.5 shadow-lg transition-all ${
              is3DMode
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-amber-300'
                : isPremium
                ? 'bg-[#0e2718]/90 text-amber-300 border-amber-500/40 hover:bg-[#163f27]'
                : 'bg-[#08170e]/90 text-[#8ea496] border-[#224430] hover:text-amber-300'
            }`}
            title="Switch to 3D Photorealistic & Orbital Mountain Flyover"
          >
            {isPremium ? (
              <Crown className="w-3.5 h-3.5 fill-current text-amber-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>3D MAPS</span>
          </button>

          {/* 2D Layer Switcher if not in 3D */}
          {!is3DMode && apiKey && (
            <button
              onClick={() => setUseTacticalView(!useTacticalView)}
              className="p-2 rounded-xl bg-[#07130b]/90 backdrop-blur-md border border-[#1b3d27] text-[#8ea496] hover:text-[#f5ebd7] hover:bg-[#122e1e] transition-all shadow-lg"
              title={useTacticalView ? 'Switch to Google Satellite/Terrain' : 'Switch to Tactical Topo'}
            >
              <Layers className="w-4 h-4 text-[#10b981]" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Atmospheric Condition Badge on Map */}
      <div className="absolute top-12 left-3 z-20 pointer-events-auto">
        <button
          onClick={() => setShowWeatherPanel(prev => !prev)}
          className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-[#06140b]/92 backdrop-blur-md border border-[#1b3d27] hover:border-emerald-400/60 shadow-xl text-xs transition-all group"
          title="Atmospheric Conditions: Click for Real-Time Aerodynamics & Barometric Details"
        >
          <div className="flex items-center space-x-1.5">
            {renderWeatherIcon(activeWeather?.weatherCode, 'w-3.5 h-3.5')}
            <span className="font-mono font-bold text-[#f5ebd7]">
              {tempUnit === 'F'
                ? `${activeWeather?.temperatureF ?? 70}°F`
                : `${activeWeather?.temperatureC ?? 21}°C`}
            </span>
          </div>

          <span className="text-[#1c3f28]">|</span>

          <div className="flex items-center space-x-1 text-[#8ea496] text-[10px]">
            <Droplets className="w-3 h-3 text-sky-400" />
            <span className="font-mono">{activeWeather?.relativeHumidity ?? 58}%</span>
          </div>

          <span className="text-[#1c3f28]">|</span>

          <div className="flex items-center space-x-1 text-[#8ea496] text-[10px]">
            <Wind className="w-3 h-3 text-teal-400" />
            <span className="font-mono font-semibold text-[#c8ded0]">
              {Math.round(activeWeather?.windSpeedKmh ?? 14)} km/h {activeWeather?.windDirectionCompass ?? 'NW'}
            </span>
            <span
              className="inline-block transform transition-transform"
              style={{ transform: `rotate(${activeWeather?.windDirectionDeg ?? 315}deg)` }}
            >
              <Navigation className="w-2.5 h-2.5 text-teal-400 fill-current" />
            </span>
          </div>

          {isWeatherLoading ? (
            <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
          ) : (
            <ChevronDown
              className={`w-3 h-3 text-[#55866a] transition-transform group-hover:text-emerald-400 ${
                showWeatherPanel ? 'rotate-180 text-emerald-400' : ''
              }`}
            />
          )}
        </button>
      </div>

      {/* Expandable Atmospheric Telemetry Drawer */}
      {showWeatherPanel && activeWeather && (
        <div className="absolute inset-0 bg-[#051108]/96 backdrop-blur-xl z-30 p-3.5 sm:p-4 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          {/* Drawer Header */}
          <div>
            <div className="flex items-start justify-between pb-2 border-b border-[#163622]">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-[#112d1c] border border-[#205133]">
                  {renderWeatherIcon(activeWeather.weatherCode, 'w-4 h-4')}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#e6f4ec]">
                      Atmospheric Telemetry & Realism
                    </h3>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30 font-mono flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse inline-block" />
                      <span>{activeWeather.source === 'live' ? 'Open-Meteo Radar' : 'Physics Altimeter'}</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8ea496]">
                    {activeWeather.weatherDescription} • {activeWeather.windDirectionCompass} Wind Sector
                  </p>
                </div>
              </div>

              {/* Controls: Unit toggle, Refresh, Close */}
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setTempUnit(u => (u === 'C' ? 'F' : 'C'))}
                  className="px-2 py-1 rounded-lg bg-[#0d2215] border border-[#1c452b] text-[10px] font-mono font-bold text-[#f5ebd7] hover:border-emerald-400 transition-all"
                  title="Toggle °C / °F"
                >
                  °{tempUnit}
                </button>
                {onRefreshWeather && (
                  <button
                    onClick={onRefreshWeather}
                    className={`p-1.5 rounded-lg bg-[#0d2215] border border-[#1c452b] text-[#8ea496] hover:text-emerald-300 transition-all ${
                      isWeatherLoading ? 'animate-spin text-emerald-400' : ''
                    }`}
                    title="Refresh Atmospheric Radar"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setShowWeatherPanel(false)}
                  className="p-1.5 rounded-lg bg-[#0d2215] border border-[#1c452b] text-[#8ea496] hover:text-white transition-all"
                  title="Close Atmospheric Panel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4-Grid Atmospheric Matrices */}
            <div className="grid grid-cols-2 gap-2 mt-2.5">
              {/* Thermal Matrix */}
              <div className="bg-[#091a10] border border-[#163622] rounded-xl p-2.5">
                <div className="flex items-center justify-between text-[10px] text-[#7d9385] mb-1">
                  <span className="flex items-center space-x-1 font-semibold uppercase tracking-wider">
                    <Thermometer className="w-3 h-3 text-amber-400" />
                    <span>Thermal Profile</span>
                  </span>
                  <span className="font-mono text-emerald-400 text-[9px]">Ambient</span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-lg font-black font-mono text-[#f5ebd7]">
                    {tempUnit === 'F' ? `${activeWeather.temperatureF}°F` : `${activeWeather.temperatureC}°C`}
                  </span>
                  <span className="text-[10px] text-[#8ea496] font-mono">
                    Feels {tempUnit === 'F' ? `${activeWeather.apparentTemperatureF}°F` : `${activeWeather.apparentTemperatureC}°C`}
                  </span>
                </div>
                <div className="text-[9px] text-[#658872] mt-0.5">
                  Dew point: {tempUnit === 'F' ? `${Math.round(activeWeather.dewPointC * 9/5 + 32)}°F` : `${activeWeather.dewPointC}°C`}
                </div>
              </div>

              {/* Moisture & Air Density */}
              <div className="bg-[#091a10] border border-[#163622] rounded-xl p-2.5">
                <div className="flex items-center justify-between text-[10px] text-[#7d9385] mb-1">
                  <span className="flex items-center space-x-1 font-semibold uppercase tracking-wider">
                    <Droplets className="w-3 h-3 text-sky-400" />
                    <span>Moisture & Air</span>
                  </span>
                  <span className="font-mono text-sky-400 text-[9px]">RH Matrix</span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-lg font-black font-mono text-[#f5ebd7]">
                    {activeWeather.relativeHumidity}%
                  </span>
                  <span className="text-[10px] text-[#8ea496] font-mono">
                    {activeWeather.airDensityKgM3} kg/m³
                  </span>
                </div>
                <div className="text-[9px] text-[#658872] mt-0.5">
                  Oxygen density for VO2 max performance
                </div>
              </div>

              {/* Wind & Aerodynamic Resistance */}
              <div className="bg-[#091a10] border border-[#163622] rounded-xl p-2.5">
                <div className="flex items-center justify-between text-[10px] text-[#7d9385] mb-1">
                  <span className="flex items-center space-x-1 font-semibold uppercase tracking-wider">
                    <Wind className="w-3 h-3 text-teal-400" />
                    <span>Wind & Aero Drag</span>
                  </span>
                  <span className="font-mono text-teal-300 text-[9px]">
                    {activeWeather.windDirectionCompass} {activeWeather.windDirectionDeg}°
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-lg font-black font-mono text-[#f5ebd7]">
                    {activeWeather.windSpeedKmh} <span className="text-xs font-normal">km/h</span>
                  </span>
                  <span className="text-[10px] text-[#8ea496] font-mono">
                    Gusts {activeWeather.windGustsKmh ?? activeWeather.windSpeedKmh}kph
                  </span>
                </div>
                <div className="text-[9px] text-teal-300 font-medium mt-0.5 truncate">
                  {activeWeather.windEffect
                    ? activeWeather.windEffect === 'headwind'
                      ? `Headwind Resistance (+${activeWeather.headwindKmh} km/h drag)`
                      : activeWeather.windEffect === 'tailwind'
                      ? `Tailwind Assist (${activeWeather.headwindKmh} km/h boost)`
                      : `Crosswind Vector (${activeWeather.crosswindKmh} km/h drift)`
                    : 'Aerodynamic resistance vector active'}
                </div>
              </div>

              {/* Barometric & UV Exposure */}
              <div className="bg-[#091a10] border border-[#163622] rounded-xl p-2.5">
                <div className="flex items-center justify-between text-[10px] text-[#7d9385] mb-1">
                  <span className="flex items-center space-x-1 font-semibold uppercase tracking-wider">
                    <Gauge className="w-3 h-3 text-purple-400" />
                    <span>Barometer & UV</span>
                  </span>
                  <span className="font-mono text-purple-300 text-[9px]">UV {activeWeather.uvIndex}</span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-lg font-black font-mono text-[#f5ebd7]">
                    {activeWeather.surfacePressureHpa} <span className="text-xs font-normal">hPa</span>
                  </span>
                  <span className="text-[10px] text-[#8ea496] font-mono">
                    {Math.round(currentPos?.altitude || 1680)}m ALT
                  </span>
                </div>
                <div className="text-[9px] text-[#658872] mt-0.5">
                  Surface barometric trail pressure
                </div>
              </div>
            </div>

            {/* Trail Advisory Banner */}
            <div className="mt-2.5 px-3 py-2 rounded-xl bg-[#0a1e12] border border-[#1d462c] flex items-center space-x-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-[11px] text-[#c4d6cb] leading-tight">
                <span className="font-bold text-emerald-300">Trail Advisory: </span>
                {activeWeather.trailConditionNote}
              </div>
            </div>
          </div>

          {/* Close Panel Button */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setShowWeatherPanel(false)}
              className="w-full py-1.5 rounded-xl bg-[#133220] hover:bg-[#1a442b] border border-[#235836] text-xs font-bold text-[#f5ebd7] transition-all"
            >
              Return to Live Topographic Map
            </button>
          </div>
        </div>
      )}

      {/* Mandatory Attribution Footnote */}
      <div className="absolute bottom-1 right-2 pointer-events-none text-[8px] text-[#4d6a58]">
        Google Maps
      </div>
    </div>
  );
};
