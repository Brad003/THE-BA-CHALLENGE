import { AtmosphericConditions } from '../types';

// In-memory cache to prevent redundant network calls during active tracking
interface CachedWeather {
  data: AtmosphericConditions;
  fetchedAt: number;
  lat: number;
  lng: number;
}

let lastWeatherCache: CachedWeather | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Maps WMO weather codes to human-readable descriptions
 */
export function getWmoWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return 'Clear Sky';
    case 1:
      return 'Mainly Clear';
    case 2:
      return 'Partly Cloudy';
    case 3:
      return 'Overcast';
    case 45:
    case 48:
      return 'Mountain Fog / Mist';
    case 51:
    case 53:
    case 55:
      return 'Light Drizzle';
    case 56:
    case 57:
      return 'Freezing Drizzle';
    case 61:
      return 'Light Rain';
    case 63:
      return 'Moderate Rain';
    case 65:
      return 'Heavy Rain';
    case 66:
    case 67:
      return 'Freezing Rain';
    case 71:
    case 73:
    case 75:
      return 'Snow Flurries';
    case 80:
    case 81:
    case 82:
      return 'Rain Showers';
    case 85:
    case 86:
      return 'Snow Showers';
    case 95:
      return 'Thunderstorm';
    case 96:
    case 99:
      return 'Thunderstorm with Hail';
    default:
      return 'Fair Conditions';
  }
}

/**
 * Converts wind bearing in degrees (0-360) to 16-point cardinal compass text
 */
export function degreesToCompass(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  const sectors = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(normalized / 22.5) % 16;
  return sectors[index];
}

/**
 * Calculates aerodynamic headwind / tailwind and crosswind components
 * @param windSpeedKmh Speed of wind in km/h
 * @param windDirectionDeg Direction the wind is blowing FROM (0-360)
 * @param athleteBearingDeg Direction the athlete is traveling (0-360)
 */
export function calculateAeroWindComponents(
  windSpeedKmh: number,
  windDirectionDeg: number,
  athleteBearingDeg: number
): {
  headwindKmh: number;
  crosswindKmh: number;
  windEffect: 'headwind' | 'tailwind' | 'crosswind' | 'calm';
} {
  if (windSpeedKmh < 3) {
    return { headwindKmh: 0, crosswindKmh: 0, windEffect: 'calm' };
  }

  // Angle difference between movement and wind origin
  const diffDeg = ((windDirectionDeg - athleteBearingDeg + 540) % 360) - 180;
  const diffRad = (diffDeg * Math.PI) / 180;

  // cos(diffRad):
  // diff = 0 means wind is coming directly at athlete -> positive headwind
  // diff = 180 means wind is coming directly from behind -> negative headwind (tailwind)
  const headwindComponent = Math.round(windSpeedKmh * Math.cos(diffRad) * 10) / 10;
  const crosswindComponent = Math.round(windSpeedKmh * Math.abs(Math.sin(diffRad)) * 10) / 10;

  let windEffect: 'headwind' | 'tailwind' | 'crosswind' | 'calm' = 'calm';
  if (headwindComponent > 4) {
    windEffect = 'headwind';
  } else if (headwindComponent < -4) {
    windEffect = 'tailwind';
  } else if (crosswindComponent > 4) {
    windEffect = 'crosswind';
  }

  return {
    headwindKmh: headwindComponent,
    crosswindKmh: crosswindComponent,
    windEffect
  };
}

/**
 * Calculates physical air density using ideal gas equation:
 * rho = (pressure_Pa) / (R_specific * T_kelvin)
 * In high elevation environments like Kenya / Rockies, air density is lower
 */
export function calculateAirDensity(pressureHpa: number, tempC: number): number {
  const pressurePa = pressureHpa * 100;
  const tempKelvin = tempC + 273.15;
  const R_specific = 287.058; // J/(kg·K) for dry air
  const density = pressurePa / (R_specific * tempKelvin);
  return Math.round(density * 100) / 100; // e.g. 1.05 - 1.22 kg/m³
}

/**
 * Generates an athlete-centric trail grip & thermal advisory note
 */
export function generateTrailAdvisory(
  tempC: number,
  humidity: number,
  windKmh: number,
  weatherCode: number
): string {
  if (weatherCode >= 51 && weatherCode <= 67) {
    return 'Wet Trail Conditions • Watch traction on granite & root steps';
  }
  if (weatherCode >= 80 && weatherCode <= 99) {
    return 'Severe Precipitation / Lightning Risk • Seek lower ridge shelter';
  }
  if (tempC >= 28 && humidity >= 65) {
    return 'High Thermal Stress • High dehydration risk; sip electrolytes every 15 min';
  }
  if (tempC <= 5) {
    return 'Cold Ambient Air • Thermal base layer recommended; protect extremities';
  }
  if (windKmh >= 35) {
    return 'Gale Force Ridge Winds • Maintain wide athletic stance on cliff lines';
  }
  if (tempC >= 15 && tempC <= 23 && humidity <= 60 && windKmh <= 20) {
    return 'Optimal Aerobic Window • Prime atmospheric density for PB attempts';
  }
  return 'Stable Atmospheric Conditions • Clear visibility across the terrain';
}

/**
 * Generates an altitude-adjusted barometric pressure estimate if live reading isn't present
 */
export function estimatePressureFromAltitude(altitudeMeters: number = 1680): number {
  // Barometric formula: P = P0 * (1 - L*h/T0)^(g*M / (R0*L))
  // Approximately: drops ~11.3 hPa per 100m in troposphere
  const seaLevelHpa = 1013.25;
  const estimated = seaLevelHpa * Math.pow(1 - 0.0065 * altitudeMeters / 288.15, 5.255);
  return Math.round(estimated * 10) / 10;
}

/**
 * Generates a realistic atmospheric physics fallback model when offline
 */
export function getSimulatedAtmosphericConditions(
  lat: number = -1.2921,
  lng: number = 36.8219,
  altitudeMeters: number = 1680,
  athleteBearingDeg?: number
): AtmosphericConditions {
  // Use solar time approximation for diurnal oscillation
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  
  // Diurnal temperature curve: low at 06:00, peak at 14:30
  const diurnalFactor = Math.sin(((hour - 9) / 24) * 2 * Math.PI);
  
  // Altitude lapse rate: -6.5°C per 1000m
  const baseSeaLevelTemp = 26;
  const altitudeDrop = (altitudeMeters / 1000) * 6.5;
  const tempC = Math.round((baseSeaLevelTemp - altitudeDrop + diurnalFactor * 5) * 10) / 10;
  const tempF = Math.round((tempC * 9 / 5 + 32) * 10) / 10;

  const humidity = Math.min(88, Math.max(35, Math.round(62 - diurnalFactor * 20)));
  const dewPointC = Math.round((tempC - ((100 - humidity) / 5)) * 10) / 10;
  
  // Wind modeling
  const windDirectionDeg = 65; // East-North-East prevailing trade wind
  const windSpeedKmh = Math.round(14 + Math.sin(hour) * 4);
  const windSpeedMps = Math.round((windSpeedKmh / 3.6) * 10) / 10;
  const windGustsKmh = Math.round(windSpeedKmh * 1.35);
  const pressureHpa = estimatePressureFromAltitude(altitudeMeters);
  const airDensity = calculateAirDensity(pressureHpa, tempC);

  const aero = calculateAeroWindComponents(
    windSpeedKmh,
    windDirectionDeg,
    athleteBearingDeg ?? 0
  );

  return {
    temperatureC: tempC,
    temperatureF: tempF,
    apparentTemperatureC: Math.round((tempC - (windSpeedKmh > 15 ? 1.5 : 0)) * 10) / 10,
    apparentTemperatureF: Math.round((tempF - (windSpeedKmh > 15 ? 2.7 : 0)) * 10) / 10,
    relativeHumidity: humidity,
    dewPointC,
    windSpeedKmh,
    windSpeedMps,
    windDirectionDeg,
    windDirectionCompass: degreesToCompass(windDirectionDeg),
    windGustsKmh,
    weatherCode: 1, // Mainly clear
    weatherDescription: 'Mainly Clear',
    surfacePressureHpa: pressureHpa,
    uvIndex: Math.max(0, Math.min(11, Math.round(Math.sin((hour / 24) * Math.PI) * 9))),
    airDensityKgM3: airDensity,
    trailConditionNote: generateTrailAdvisory(tempC, humidity, windSpeedKmh, 1),
    headwindKmh: aero.headwindKmh,
    crosswindKmh: aero.crosswindKmh,
    windEffect: aero.windEffect,
    timestamp: new Date().toISOString(),
    source: 'fallback'
  };
}

/**
 * Main API function: Fetches real-time weather from Open-Meteo API
 * Includes error handling and automatic caching
 */
export async function fetchRealtimeWeather(
  lat: number,
  lng: number,
  altitudeMeters?: number,
  athleteBearingDeg?: number
): Promise<AtmosphericConditions> {
  const now = Date.now();

  // Return cached result if location hasn't drifted more than ~1km and within TTL
  if (
    lastWeatherCache &&
    now - lastWeatherCache.fetchedAt < CACHE_TTL_MS &&
    Math.abs(lastWeatherCache.lat - lat) < 0.02 &&
    Math.abs(lastWeatherCache.lng - lng) < 0.02
  ) {
    // Re-evaluate dynamic aero wind components relative to current bearing
    const cached = { ...lastWeatherCache.data };
    if (athleteBearingDeg !== undefined) {
      const aero = calculateAeroWindComponents(
        cached.windSpeedKmh,
        cached.windDirectionDeg,
        athleteBearingDeg
      );
      cached.headwindKmh = aero.headwindKmh;
      cached.crosswindKmh = aero.crosswindKmh;
      cached.windEffect = aero.windEffect;
    }
    return cached;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,dew_point_2m,uv_index&timezone=auto`;
    
    // 5-second fetch timeout to prevent blocking UI
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP error: ${response.status}`);
    }

    const json = await response.json();
    const current = json.current;

    if (!current) {
      throw new Error('Malformed Open-Meteo response structure');
    }

    const tempC = Math.round(Number(current.temperature_2m) * 10) / 10;
    const tempF = Math.round((tempC * 9 / 5 + 32) * 10) / 10;
    const apparentTempC = Math.round(Number(current.apparent_temperature ?? tempC) * 10) / 10;
    const apparentTempF = Math.round((apparentTempC * 9 / 5 + 32) * 10) / 10;
    const humidity = Math.round(Number(current.relative_humidity_2m ?? 50));
    const dewPointC = Math.round(Number(current.dew_point_2m ?? (tempC - ((100 - humidity) / 5))) * 10) / 10;
    
    const windSpeedKmh = Math.round(Number(current.wind_speed_10m ?? 10) * 10) / 10;
    const windSpeedMps = Math.round((windSpeedKmh / 3.6) * 10) / 10;
    const windDirectionDeg = Math.round(Number(current.wind_direction_10m ?? 0));
    const windGustsKmh = Math.round(Number(current.wind_gusts_10m ?? windSpeedKmh * 1.3));
    const weatherCode = Number(current.weather_code ?? 0);
    const pressureHpa = Math.round(Number(current.surface_pressure ?? estimatePressureFromAltitude(altitudeMeters)) * 10) / 10;
    const uvIndex = Math.round(Number(current.uv_index ?? 0) * 10) / 10;

    const airDensity = calculateAirDensity(pressureHpa, tempC);
    const aero = calculateAeroWindComponents(
      windSpeedKmh,
      windDirectionDeg,
      athleteBearingDeg ?? 0
    );

    const conditions: AtmosphericConditions = {
      temperatureC: tempC,
      temperatureF: tempF,
      apparentTemperatureC: apparentTempC,
      apparentTemperatureF: apparentTempF,
      relativeHumidity: humidity,
      dewPointC,
      windSpeedKmh,
      windSpeedMps,
      windDirectionDeg,
      windDirectionCompass: degreesToCompass(windDirectionDeg),
      windGustsKmh,
      weatherCode,
      weatherDescription: getWmoWeatherDescription(weatherCode),
      surfacePressureHpa: pressureHpa,
      uvIndex,
      airDensityKgM3: airDensity,
      trailConditionNote: generateTrailAdvisory(tempC, humidity, windSpeedKmh, weatherCode),
      headwindKmh: aero.headwindKmh,
      crosswindKmh: aero.crosswindKmh,
      windEffect: aero.windEffect,
      timestamp: current.time || new Date().toISOString(),
      source: 'live'
    };

    lastWeatherCache = {
      data: conditions,
      fetchedAt: now,
      lat,
      lng
    };

    return conditions;
  } catch (err) {
    console.warn('Real-time weather fetch issue, applying local atmospheric physics model:', err);
    return getSimulatedAtmosphericConditions(lat, lng, altitudeMeters, athleteBearingDeg);
  }
}
