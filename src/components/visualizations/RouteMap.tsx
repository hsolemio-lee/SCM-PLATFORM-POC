import { motion } from 'framer-motion';
import { TransportRoute } from '../../types';

interface RouteMapProps {
  data: TransportRoute[];
}

const routeColors = ['#00FFFF', '#0088AA', '#4FFFFF', '#1e3a5f'];

export default function RouteMap({ data }: RouteMapProps) {
  // Simplified SVG map - positions are normalized to 0-100 for SVG viewBox
  const normalizeCoords = (routes: TransportRoute[]) => {
    const allCoords = routes.flatMap(r => r.coordinates);
    const minLat = Math.min(...allCoords.map(c => c.lat));
    const maxLat = Math.max(...allCoords.map(c => c.lat));
    const minLng = Math.min(...allCoords.map(c => c.lng));
    const maxLng = Math.max(...allCoords.map(c => c.lng));

    return routes.map(route => ({
      ...route,
      normalizedCoords: route.coordinates.map(coord => ({
        x: ((coord.lng - minLng) / (maxLng - minLng || 1)) * 80 + 10,
        y: ((maxLat - coord.lat) / (maxLat - minLat || 1)) * 80 + 10,
      })),
    }));
  };

  const normalizedRoutes = normalizeCoords(data);

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-4">
      <h3 className="text-white/80 font-medium mb-4">Delivery Routes</h3>

      <div className="flex gap-6">
        {/* Map */}
        <div className="flex-1">
          <svg viewBox="0 0 100 100" className="w-full h-64 bg-nexprime-darker rounded-lg">
            {/* Grid */}
            {[20, 40, 60, 80].map(pos => (
              <g key={pos}>
                <line x1={pos} y1="0" x2={pos} y2="100" stroke="#1e3a5f" strokeWidth="0.5" />
                <line x1="0" y1={pos} x2="100" y2={pos} stroke="#1e3a5f" strokeWidth="0.5" />
              </g>
            ))}

            {/* Routes */}
            {normalizedRoutes.map((route, routeIdx) => {
              const pathData = route.normalizedCoords
                .map((coord, i) => `${i === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`)
                .join(' ');

              return (
                <g key={route.vehicle}>
                  {/* Route line */}
                  <motion.path
                    d={pathData}
                    fill="none"
                    stroke={routeColors[routeIdx % routeColors.length]}
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: routeIdx * 0.3 }}
                  />

                  {/* Stops */}
                  {route.normalizedCoords.map((coord, stopIdx) => (
                    <motion.g
                      key={stopIdx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: routeIdx * 0.3 + stopIdx * 0.1 }}
                    >
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={stopIdx === 0 ? 4 : 3}
                        fill={stopIdx === 0 ? '#00FFFF' : routeColors[routeIdx % routeColors.length]}
                        stroke="#0a0a0f"
                        strokeWidth="1"
                      />
                    </motion.g>
                  ))}
                </g>
              );
            })}

            {/* Warehouse marker */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <rect
                x={normalizedRoutes[0]?.normalizedCoords[0]?.x - 4 || 46}
                y={normalizedRoutes[0]?.normalizedCoords[0]?.y - 4 || 46}
                width="8"
                height="8"
                fill="#00FFFF"
                stroke="#0a0a0f"
                strokeWidth="1"
              />
            </motion.g>
          </svg>
        </div>

        {/* Legend */}
        <div className="w-48 space-y-3">
          <div className="text-sm text-white/60 mb-2">Routes</div>
          {data.map((route, idx) => (
            <div
              key={route.vehicle}
              className="flex items-center gap-2 p-2 bg-nexprime-darker rounded text-sm"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: routeColors[idx % routeColors.length] }}
              />
              <div className="flex-1">
                <div className="text-white">{route.vehicle}</div>
                <div className="text-white/40 text-xs">
                  {route.stops.length} stops · {route.distance}km
                </div>
              </div>
              <div className="text-nexprime-cyan text-xs">
                {Math.round(route.load * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
