// Utility functions for GPS, Distance, Elevation, and Step Calculations

export interface GeoPoint {
  lat: number;
  lng: number;
  altitude?: number; // meters above sea level
  timestamp?: number;
}

export interface ElevationPoint {
  distanceKm: number;
  elevationMeters: number;
  timeSec: number;
}

export interface PresetTrail {
  id: string;
  name: string;
  type: 'walk' | 'hike' | 'run' | 'cycle';
  location: string;
  distanceKm: number;
  elevationGainMeters: number;
  peakAltitudeMeters: number;
  difficulty: 'Beginner' | 'Moderate' | 'Challenging' | 'Extreme';
  description: string;
  center: { lat: number; lng: number };
  waypoints: { lat: number; lng: number; ele: number }[];
}

// Haversine formula to compute great-circle distance between two points in km
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Convert seconds and distance into formatted pace string (e.g. 5:24 /km)
export function formatPace(totalSeconds: number, distanceKm: number): string {
  if (distanceKm <= 0.05 || totalSeconds <= 0) return "--:--";
  const secondsPerKm = totalSeconds / distanceKm;
  if (!isFinite(secondsPerKm) || secondsPerKm > 3600) return "--:--";
  const mins = Math.floor(secondsPerKm / 60);
  const secs = Math.floor(secondsPerKm % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format seconds into HH:MM:SS
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Estimate steps from distance and mode if accelerometer is not firing
export function estimateSteps(distanceKm: number, mode: 'walk' | 'hike' | 'run' | 'cycle'): number {
  if (mode === 'cycle') {
    // For cycling, calculate pedal revolutions (cadence equivalent) ~700-800 revolutions/km
    return Math.round(distanceKm * 750);
  }
  // Stride lengths in meters:
  // Walking: ~0.74m/step -> ~1,351 steps/km
  // Hiking: ~0.65m/step (shorter strides for steep terrain) -> ~1,538 steps/km
  // Running: ~1.05m/step -> ~952 steps/km
  const stepsPerKm = mode === 'hike' ? 1538 : mode === 'walk' ? 1351 : 952;
  return Math.round(distanceKm * stepsPerKm);
}

// Estimate calorie burn using MET (Metabolic Equivalent of Task) formula
export function calculateCaloriesBurned(
  mode: 'walk' | 'hike' | 'run' | 'cycle',
  durationMinutes: number,
  distanceKm: number,
  elevationGainMeters: number,
  bodyWeightKg = 75
): number {
  if (durationMinutes <= 0) return 0;
  
  // Base MET:
  // Walking briskly: 4.2
  // Hiking with incline: 7.5
  // Running (moderate 9-10 km/h): 9.8
  // Cycling (moderate 20-25 km/h): 8.5
  let baseMet = 4.2;
  if (mode === 'hike') baseMet = 7.5;
  if (mode === 'run') baseMet = 9.8;
  if (mode === 'cycle') baseMet = 8.5;

  // Add MET adjustment for speed
  const speedKmh = (distanceKm / (durationMinutes / 60)) || 0;
  if (mode === 'run' && speedKmh > 10) baseMet += (speedKmh - 10) * 0.8;
  if (mode === 'walk' && speedKmh > 5.5) baseMet += 1.2;
  if (mode === 'cycle' && speedKmh > 20) baseMet += (speedKmh - 20) * 0.4;

  // Elevation penalty: climbing burns extra calories
  const elevationCalBonus = (elevationGainMeters / 100) * 15;

  // Calorie formula = (MET * 3.5 * weightKg / 200) * minutes
  const baseCals = (baseMet * 3.5 * bodyWeightKg / 200) * durationMinutes;
  return Math.round(baseCals + elevationCalBonus);
}

// Curated Preset Trails with iconic East African & Wilderness paths
export const PRESET_TRAILS: PresetTrail[] = [
  {
    id: 'trail-ngong-hills',
    name: 'Ngong Hills 7-Peaks Ridge',
    type: 'hike',
    location: 'Great Rift Valley Escarpment, Kenya',
    distanceKm: 12.4,
    elevationGainMeters: 650,
    peakAltitudeMeters: 2460,
    difficulty: 'Challenging',
    description: 'The legendary panoramic ridge line above the Great Rift Valley. Demanding climbs, steep saddle valleys, and sweeping windy summits.',
    center: { lat: -1.3962, lng: 36.6573 },
    waypoints: [
      { lat: -1.3780, lng: 36.6530, ele: 1960 },
      { lat: -1.3850, lng: 36.6545, ele: 2110 },
      { lat: -1.3920, lng: 36.6560, ele: 2280 },
      { lat: -1.3980, lng: 36.6580, ele: 2460 },
      { lat: -1.4050, lng: 36.6595, ele: 2320 },
      { lat: -1.4120, lng: 36.6610, ele: 2390 },
      { lat: -1.4200, lng: 36.6625, ele: 2150 }
    ]
  },
  {
    id: 'trail-karura-forest',
    name: 'Karura Forest Canopy Trail',
    type: 'run',
    location: 'Karura Forest Reserve, Nairobi',
    distanceKm: 8.5,
    elevationGainMeters: 110,
    peakAltitudeMeters: 1680,
    difficulty: 'Moderate',
    description: 'Fast indigenous forest single-track weaving past sacred bamboo groves, roaring waterfalls, and serene eucalyptus canopies.',
    center: { lat: -1.2396, lng: 36.8286 },
    waypoints: [
      { lat: -1.2450, lng: 36.8210, ele: 1640 },
      { lat: -1.2420, lng: 36.8250, ele: 1660 },
      { lat: -1.2390, lng: 36.8290, ele: 1680 },
      { lat: -1.2360, lng: 36.8330, ele: 1675 },
      { lat: -1.2330, lng: 36.8360, ele: 1650 },
      { lat: -1.2370, lng: 36.8310, ele: 1665 },
      { lat: -1.2450, lng: 36.8210, ele: 1640 }
    ]
  },
  {
    id: 'trail-longonot',
    name: 'Mount Longonot Crater Rim Trek',
    type: 'hike',
    location: 'Mount Longonot National Park, Naivasha',
    distanceKm: 13.8,
    elevationGainMeters: 820,
    peakAltitudeMeters: 2776,
    difficulty: 'Extreme',
    description: 'Volcanic cinder cone ascending from Great Rift floor to an awe-inspiring 7.2km crater rim with geothermal steam vents and sheer drops.',
    center: { lat: -0.9167, lng: 36.4500 },
    waypoints: [
      { lat: -0.9280, lng: 36.4420, ele: 2150 },
      { lat: -0.9230, lng: 36.4460, ele: 2380 },
      { lat: -0.9190, lng: 36.4490, ele: 2560 },
      { lat: -0.9150, lng: 36.4520, ele: 2776 },
      { lat: -0.9120, lng: 36.4560, ele: 2690 },
      { lat: -0.9170, lng: 36.4580, ele: 2610 },
      { lat: -0.9280, lng: 36.4420, ele: 2150 }
    ]
  },
  {
    id: 'trail-arboretum-walk',
    name: 'Nairobi Arboretum Discipline Walk',
    type: 'walk',
    location: 'Arboretum Botanical Gardens, Nairobi',
    distanceKm: 4.5,
    elevationGainMeters: 45,
    peakAltitudeMeters: 1720,
    difficulty: 'Beginner',
    description: 'Tranquil paved and hard-packed earthen paths through 350+ exotic tree species. Ideal for deliberate breathwork, brisk morning walking, and mindfulness.',
    center: { lat: -1.2750, lng: 36.8040 },
    waypoints: [
      { lat: -1.2780, lng: 36.8010, ele: 1700 },
      { lat: -1.2750, lng: 36.8030, ele: 1715 },
      { lat: -1.2730, lng: 36.8060, ele: 1720 },
      { lat: -1.2760, lng: 36.8070, ele: 1710 },
      { lat: -1.2790, lng: 36.8040, ele: 1702 },
      { lat: -1.2780, lng: 36.8010, ele: 1700 }
    ]
  }
];
