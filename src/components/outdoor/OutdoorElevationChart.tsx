import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ElevationPoint } from '../../utils/geoUtils';
import { Mountain, TrendingUp } from 'lucide-react';

interface OutdoorElevationChartProps {
  elevationProfile: ElevationPoint[];
  currentElevation: number;
  elevationGain: number;
  elevationLoss: number;
  maxElevation: number;
  minElevation: number;
}

export const OutdoorElevationChart: React.FC<OutdoorElevationChartProps> = ({
  elevationProfile,
  currentElevation,
  elevationGain,
  elevationLoss,
  maxElevation,
  minElevation
}) => {
  if (elevationProfile.length < 2) {
    return (
      <div className="bg-[#09150e]/80 border border-[#162e20] rounded-2xl p-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-[#7d9385] text-xs">
          <Mountain className="w-4 h-4 text-[var(--accent-main)]" />
          <span>Elevation profile will render as you traverse terrain...</span>
        </div>
      </div>
    );
  }

  // Format data for chart
  const chartData = elevationProfile.map(p => ({
    dist: Number(p.distanceKm.toFixed(2)),
    ele: Math.round(p.elevationMeters)
  }));

  const yDomainMin = Math.max(0, Math.floor((minElevation - 20) / 10) * 10);
  const yDomainMax = Math.ceil((maxElevation + 20) / 10) * 10;

  return (
    <div className="bg-[#09150e]/95 border border-[#1a3827] rounded-2xl p-4 shadow-xl">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-[#142e1f] border border-[#224e33]">
            <Mountain className="w-4 h-4 text-[#34d399]" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#e6f4ec]">
              Elevation Profile
            </h4>
            <p className="text-[10px] text-[#7d9385]">
              Real-time Altimeter & Incline Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-right">
          <div>
            <span className="text-[10px] text-[#7d9385] block uppercase font-mono">Gain</span>
            <span className="text-xs font-bold text-[#34d399]">+{Math.round(elevationGain)}m</span>
          </div>
          <div>
            <span className="text-[10px] text-[#7d9385] block uppercase font-mono">Altitude</span>
            <span className="text-xs font-bold text-[#f5ebd7]">{Math.round(currentElevation)}m</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-28 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="dist"
              tickLine={false}
              axisLine={{ stroke: '#1c3d28' }}
              tick={{ fill: '#7d9385', fontSize: 9 }}
              unit=" km"
            />
            <YAxis
              domain={[yDomainMin, yDomainMax]}
              tickLine={false}
              axisLine={{ stroke: '#1c3d28' }}
              tick={{ fill: '#7d9385', fontSize: 9 }}
              unit="m"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#0c1c13] border border-[#1b3f29] rounded-xl px-2.5 py-1.5 text-xs shadow-lg">
                      <div className="text-[10px] text-[#8ea496]">Distance: {data.dist} km</div>
                      <div className="text-xs font-bold text-[#34d399] flex items-center space-x-1">
                        <span>Altitude: {data.ele} m</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={currentElevation} stroke="rgba(255, 215, 0, 0.5)" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="ele"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#elevationGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick elevation stats badge */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-[#132c1e] text-center">
        <div className="bg-[#0d1f15] rounded-lg py-1 px-2 border border-[#183624]">
          <span className="text-[9px] text-[#7d9385] block uppercase">Min Elev</span>
          <span className="text-[11px] font-bold text-[#b7c9be]">{Math.round(minElevation)}m</span>
        </div>
        <div className="bg-[#0d1f15] rounded-lg py-1 px-2 border border-[#183624]">
          <span className="text-[9px] text-[#7d9385] block uppercase">Max Peak</span>
          <span className="text-[11px] font-bold text-[#f0cb64]">{Math.round(maxElevation)}m</span>
        </div>
        <div className="bg-[#0d1f15] rounded-lg py-1 px-2 border border-[#183624]">
          <span className="text-[9px] text-[#7d9385] block uppercase">Total Descent</span>
          <span className="text-[11px] font-bold text-[#94a3b8]">-{Math.round(elevationLoss)}m</span>
        </div>
      </div>
    </div>
  );
};
