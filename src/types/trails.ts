export type TrailActivityType = 'running' | 'cycling' | 'hiking';

export type TrailDifficulty = 'Beginner' | 'Moderate' | 'Challenging' | 'Extreme';

export type TrailSurfaceType =
  | 'paved_road'
  | 'gravel'
  | 'singletrack_dirt'
  | 'mixed_terrain'
  | 'forest_path';

export type TrailTrafficLevel =
  | 'none_wildlife_only'
  | 'low_quiet_roads'
  | 'moderate'
  | 'dedicated_bike_path';

export interface TrailContributor {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: string;
  verifiedAthlete: boolean;
}

export interface CommunityTrailWaypoint {
  lat: number;
  lng: number;
  ele: number;
  label?: string;
}

export interface CommunityTrail {
  id: string;
  name: string;
  activityType: TrailActivityType;
  location: string;
  region: string;
  distanceKm: number;
  elevationGainMeters: number;
  peakAltitudeMeters: number;
  estimatedDurationMin: number;
  difficulty: TrailDifficulty;
  surfaceType: TrailSurfaceType;
  trafficLevel: TrailTrafficLevel;
  contributedBy: TrailContributor;
  rating: number;
  reviewCount: number;
  kudosCount: number;
  description: string;
  highlights: string[];
  safetyNotes?: string;
  center: { lat: number; lng: number };
  waypoints: CommunityTrailWaypoint[];
  tags: string[];
  createdAt: string;
  userLiked?: boolean;
  userSaved?: boolean;
}
