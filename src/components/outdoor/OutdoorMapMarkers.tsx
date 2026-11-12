import React from 'react';
import {
  Navigation,
  Flag,
  Mountain,
  Trophy,
  Compass,
  MapPin,
  Footprints,
  Activity,
  Award
} from 'lucide-react';

/**
 * Google Maps Platform High-Contrast 'Vivid Graffiti' Map Styling.
 * Engineered specifically for direct outdoor sunlight readability.
 * Features high-contrast anti-glare asphalt slate, electric spray neon lime,
 * vivid street pink/magenta, electric cyan water boundaries, blaze orange freeways,
 * and bold 4px black halos on all text labels to eliminate glare washout.
 */
export const VIVID_GRAFFITI_MAP_STYLE: google.maps.MapTypeStyle[] = [
  // Anti-glare deep asphalt slate background geometry
  {
    elementType: 'geometry',
    stylers: [{ color: '#13141f' }]
  },
  // All text strokes: thick black halo for extreme legibility in direct sunlight
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#000000' }, { weight: 4.5 }, { visibility: 'on' }]
  },
  // All text fills: high-contrast pure white
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffffff' }, { visibility: 'on' }]
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }]
  },
  // Administrative boundaries: vivid graffiti magenta accent
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#ff007f' }, { weight: 1.5 }]
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffe600' }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffe600' }, { weight: 1 }]
  },
  // POIs and Public Spaces: electric cyan
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#00f0ff' }]
  },
  // Parks & Wilderness reserves: deep forest with neon spray border
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#082517' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#00ff73' }, { weight: 2 }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#00ff73' }]
  },
  // Road networks: High-contrast graffiti spray pigments
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#222538' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#050508' }, { weight: 2 }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffffff' }]
  },
  // Highways: Vivid graffiti blaze orange with bold black border
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ff5500' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#000000' }, { weight: 3.5 }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffe600' }]
  },
  // Arterial streets: Electric spray magenta / street pink
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ff007f' }]
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#000000' }, { weight: 2.5 }]
  },
  // Local roads: Electric cyan
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [{ color: '#00e5ff' }]
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#000000' }, { weight: 1.5 }]
  },
  // Transit: Ultraviolet
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2d194f' }]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#00f0ff' }]
  },
  // Water: Midnight marine with electric cyan coastline
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#05192d' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#00f0ff' }, { weight: 2.5 }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#00f0ff' }]
  }
];

// ==========================================
// REALISTIC MARKER ICON ASSETS (REACT HTML)
// ==========================================

/**
 * Realistic Athlete Location Marker.
 * Built with realistic brushed metallic titanium bezel, dual-layer sunlight contrast rings
 * (3px solid white + 2px drop-shadow), directional compass arrow oriented to bearing,
 * and high-contrast altitude readout tag.
 */
export const RealisticAthleteMarker: React.FC<{
  bearing?: number;
  altitude?: number;
  mode?: 'walk' | 'hike' | 'run';
}> = ({ bearing = 0, altitude, mode = 'run' }) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none group">
      {/* Outer sunlight-readable pulsing radar wave */}
      <div className="absolute w-12 h-12 rounded-full bg-[#00ff73]/25 animate-ping pointer-events-none" />

      {/* Realistic 3D Metallic Navigation Puck */}
      <div
        className="relative w-9 h-9 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.85)] border-2 border-white ring-2 ring-black"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #34d399 0%, #059669 60%, #022c22 100%)'
        }}
      >
        {/* Directional Navigation Indicator Pointer */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${bearing}deg)` }}
        >
          <Navigation className="w-5 h-5 text-white fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" />
        </div>

        {/* Center Mode Icon Asset Badge */}
        <div className="absolute w-3.5 h-3.5 rounded-full bg-black/70 border border-white/60 flex items-center justify-center pointer-events-none">
          {mode === 'hike' ? (
            <Mountain className="w-2 h-2 text-amber-300" />
          ) : mode === 'walk' ? (
            <Footprints className="w-2 h-2 text-emerald-300" />
          ) : (
            <Activity className="w-2 h-2 text-lime-300" />
          )}
        </div>
      </div>

      {/* High-Contrast Altitude / Direct Sunlight Tag */}
      {altitude !== undefined && (
        <div className="mt-1 px-1.5 py-0.5 rounded-md bg-black/95 border border-white/80 shadow-md flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff73] animate-pulse" />
          <span className="font-mono text-[9px] font-black text-white tracking-wider">
            {Math.round(altitude)}m
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Realistic Start Monument Marker.
 * Features a 3D drop-pin with polished gold/brass rim, deep obsidian enamel face,
 * realistic checkered/flag icon asset, and high-contrast "START" sunlight tag.
 */
export const RealisticStartMarker: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none -translate-y-4">
      {/* 3D Drop Pin Enamel Body */}
      <div
        className="relative w-8 h-9 rounded-t-full rounded-b-[60%] flex items-center justify-center shadow-[0_6px_14px_rgba(0,0,0,0.9)] border-2 border-amber-300 ring-2 ring-black"
        style={{
          background: 'linear-gradient(145deg, #f59e0b 0%, #b45309 60%, #78350f 100%)'
        }}
      >
        <div className="w-5 h-5 rounded-full bg-[#0c1017] border border-amber-400 flex items-center justify-center">
          <Flag className="w-3 h-3 text-amber-300 fill-amber-400" />
        </div>
      </div>

      {/* Pin Point Tip & Ground Shadow */}
      <div className="w-1.5 h-2 bg-amber-400 -mt-0.5 clip-path-polygon shadow-md" />
      <div className="w-4 h-1.5 rounded-full bg-black/70 blur-[1px] mt-0.5" />

      {/* High-Contrast Direct-Sunlight START Badge */}
      <div className="absolute -bottom-5 px-1.5 py-0.5 rounded bg-black border border-amber-400 shadow-lg">
        <span className="font-mono text-[8px] font-black text-[#ffe600] uppercase tracking-widest">
          START
        </span>
      </div>
    </div>
  );
};

/**
 * Realistic Waypoint Medallion Marker.
 * Heavy stamped metallic rim with vivid graffiti street pink enamel and bold index numeral.
 */
export const RealisticWaypointMarker: React.FC<{
  index: number;
  isPeak?: boolean;
}> = ({ index, isPeak = false }) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none -translate-y-2">
      <div
        className={`relative w-7 h-7 rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.85)] border-2 ${
          isPeak ? 'border-amber-300 ring-2 ring-black' : 'border-white ring-2 ring-black'
        }`}
        style={{
          background: isPeak
            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 70%, #92400e 100%)'
            : 'linear-gradient(135deg, #ff007f 0%, #d90468 70%, #88003f 100%)'
        }}
      >
        <div className="w-4 h-4 rounded-full bg-black/60 flex items-center justify-center">
          {isPeak ? (
            <Mountain className="w-2.5 h-2.5 text-amber-200 fill-amber-300" />
          ) : (
            <span className="font-mono font-black text-[10px] text-white">
              {index}
            </span>
          )}
        </div>
      </div>

      {/* Ground Pin Shadow */}
      <div className="w-3 h-1 rounded-full bg-black/60 blur-[1px] mt-0.5" />
    </div>
  );
};

/**
 * Realistic Summit / Peak Monument Marker.
 * Rendered at the peak elevation of the trail.
 */
export const RealisticSummitMarker: React.FC<{
  elevationMeters: number;
}> = ({ elevationMeters }) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none -translate-y-5">
      {/* 3D Mountain Summit Crest */}
      <div
        className="relative px-2 py-1 rounded-xl flex items-center space-x-1 shadow-[0_6px_16px_rgba(0,0,0,0.9)] border-2 border-[#ffe600] ring-2 ring-black"
        style={{
          background: 'linear-gradient(135deg, #181924 0%, #0d0e15 100%)'
        }}
      >
        <Mountain className="w-3.5 h-3.5 text-[#ffe600] fill-[#ffe600]" />
        <span className="font-mono text-[9px] font-black text-white tracking-tight">
          PEAK +{Math.round(elevationMeters)}m
        </span>
      </div>

      {/* Summit Pylon Anchor */}
      <div className="w-0.5 h-3 bg-[#ffe600] border-x border-black" />
      <div className="w-4 h-1.5 rounded-full bg-black/70 blur-[1px]" />
    </div>
  );
};

/**
 * Realistic Finish Monument Marker.
 */
export const RealisticFinishMarker: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none -translate-y-4">
      <div
        className="relative w-8 h-9 rounded-t-full rounded-b-[60%] flex items-center justify-center shadow-[0_6px_14px_rgba(0,0,0,0.9)] border-2 border-emerald-400 ring-2 ring-black"
        style={{
          background: 'linear-gradient(145deg, #10b981 0%, #059669 60%, #064e3b 100%)'
        }}
      >
        <div className="w-5 h-5 rounded-full bg-[#0c1017] border border-emerald-400 flex items-center justify-center">
          <Trophy className="w-3 h-3 text-emerald-300 fill-emerald-400" />
        </div>
      </div>
      <div className="w-1.5 h-2 bg-emerald-400 -mt-0.5 clip-path-polygon shadow-md" />
      <div className="w-4 h-1.5 rounded-full bg-black/70 blur-[1px] mt-0.5" />
      <div className="absolute -bottom-5 px-1.5 py-0.5 rounded bg-black border border-emerald-400 shadow-lg">
        <span className="font-mono text-[8px] font-black text-emerald-300 uppercase tracking-widest">
          FINISH
        </span>
      </div>
    </div>
  );
};

// ==========================================
// CANVAS VECTOR RENDERING HELPERS (2D & 3D)
// ==========================================

/**
 * Draw a realistic athlete navigation puck on HTML5 Canvas.
 * No emojis; uses geometric metallic bevel, concentric radar waves,
 * directional heading arrow, and sunlight-resistant double border.
 */
export function drawCanvasAthleteMarker(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  bearingDeg = 0,
  altitudeM?: number
) {
  ctx.save();

  // 1. Outer Sunlight-Readable Radar Pulse
  ctx.strokeStyle = 'rgba(0, 255, 115, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.stroke();

  // 2. Heavy Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.arc(cx, cy + 2, 11, 0, Math.PI * 2);
  ctx.fill();

  // 3. High-Contrast Outer Sunlight Border (2px Black)
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(cx, cy, 11, 0, Math.PI * 2);
  ctx.fill();

  // 4. Inner Sunlight Rim (2px White)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 9.5, 0, Math.PI * 2);
  ctx.fill();

  // 5. Vivid Graffiti Neon Lime Core
  const grad = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, 8);
  grad.addColorStop(0, '#00ff73');
  grad.addColorStop(0.7, '#059669');
  grad.addColorStop(1, '#022c22');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // 6. Directional Heading Arrow (Oriented to bearing)
  const rad = ((bearingDeg - 90) * Math.PI) / 180;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rad);

  // Sharp metallic pointer
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(-4, -4);
  ctx.lineTo(-1, 0);
  ctx.lineTo(-4, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 7. Altitude Tag (Sunlight Readable Pill)
  if (altitudeM !== undefined) {
    const text = `${Math.round(altitudeM)}m`;
    ctx.font = 'bold 8px monospace';
    const textW = ctx.measureText(text).width;
    const boxW = textW + 8;
    const boxH = 12;
    const boxX = cx - boxW / 2;
    const boxY = cy - 22;

    ctx.fillStyle = '#000000';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#00ff73';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cx, boxY + boxH / 2);
  }

  ctx.restore();
}

/**
 * Draw a realistic start monument pin on HTML5 Canvas.
 */
export function drawCanvasStartMarker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) {
  ctx.save();

  // Pin Head (Gold enamel teardrop)
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(x, y - 12, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(x, y - 12, 6.5, 0, Math.PI * 2);
  ctx.fill();

  // Pin Core
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(x, y - 12, 4, 0, Math.PI * 2);
  ctx.fill();

  // Flag Graphic
  ctx.fillStyle = '#ffe600';
  ctx.beginPath();
  ctx.moveTo(x - 2, y - 15);
  ctx.lineTo(x + 3, y - 13);
  ctx.lineTo(x - 2, y - 11);
  ctx.closePath();
  ctx.fill();

  // Pin Needle
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 6);
  ctx.lineTo(x, y);
  ctx.stroke();

  // START Tag
  ctx.fillStyle = '#000000';
  ctx.fillRect(x - 14, y + 2, 28, 10);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 14, y + 2, 28, 10);

  ctx.fillStyle = '#ffe600';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('START', x, y + 7);

  ctx.restore();
}

/**
 * Draw a realistic waypoint medallion on HTML5 Canvas.
 */
export function drawCanvasWaypointMarker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  index: number
) {
  ctx.save();

  // Outer Black Contrast Ring
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI * 2);
  ctx.fill();

  // White Sunlight Border
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // Vivid Graffiti Pink / Magenta Enamel Disc
  ctx.fillStyle = '#ff007f';
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();

  // Waypoint Index Numeral
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${index}`, x, y + 0.5);

  ctx.restore();
}

/**
 * Draw a realistic summit peak monument on HTML5 Canvas.
 */
export function drawCanvasSummitMarker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  eleM: number
) {
  ctx.save();

  // Mountain Crest Geometric Facets
  ctx.fillStyle = '#ffe600';
  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x + 9, y + 2);
  ctx.lineTo(x - 9, y + 2);
  ctx.closePath();
  ctx.fill();

  // Shadow Facet
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x + 9, y + 2);
  ctx.lineTo(x, y + 2);
  ctx.closePath();
  ctx.fill();

  // Snow Cap
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x + 3.5, y - 5);
  ctx.lineTo(x - 3.5, y - 5);
  ctx.closePath();
  ctx.fill();

  // Elevation ASL Banner
  const tag = `PEAK +${Math.round(eleM)}m`;
  ctx.font = 'bold 7px monospace';
  const tw = ctx.measureText(tag).width;
  const bw = tw + 6;

  ctx.fillStyle = '#000000';
  ctx.fillRect(x - bw / 2, y + 4, bw, 10);
  ctx.strokeStyle = '#ffe600';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - bw / 2, y + 4, bw, 10);

  ctx.fillStyle = '#ffe600';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tag, x, y + 9);

  ctx.restore();
}
