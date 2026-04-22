import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

const regionsData = [
  { id: 'usa', name: 'USA', cx: 200, cy: 150, r: 25 },
  { id: 'canada', name: 'Canada', cx: 220, cy: 80, r: 30 },
  { id: 'mexico', name: 'Mexico', cx: 180, cy: 220, r: 20 },
  { id: 'netherlands', name: 'Netherlands', cx: 480, cy: 110, r: 15 },
  { id: 'australia', name: 'Australia', cx: 750, cy: 350, r: 35 },
];

const InteractiveMap = ({ onRegionSelect, selectedRegion, showLabels = true }) => {
  return (
    <div className="relative w-full aspect-[2/1] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
      
      {/* Stylized Map Base (simplified representation using paths/circles for reliable cross-browser rendering) */}
      <svg viewBox="0 0 1000 500" className="w-full h-full drop-shadow-lg">
        {/* Decorative Grid Lines */}
        <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
           {Array.from({ length: 10 }).map((_, i) => (
             <React.Fragment key={i}>
                <line x1="0" y1={i * 50} x2="1000" y2={i * 50} />
                <line x1={i * 100} y1="0" x2={i * 100} y2="500" />
             </React.Fragment>
           ))}
        </g>
        
        {/* Continents Abstract Representation */}
        <path d="M100 100 Q 300 50 400 200 T 200 400 Z" fill="rgba(255,255,255,0.02)" />
        <path d="M450 50 Q 600 100 550 300 T 400 150 Z" fill="rgba(255,255,255,0.02)" />
        <path d="M700 250 Q 900 200 850 400 T 650 350 Z" fill="rgba(255,255,255,0.02)" />

        {/* Interactive Regions */}
        {regionsData.map((region) => {
          const isSelected = selectedRegion === region.id;
          return (
            <motion.g 
              key={region.id}
              onClick={() => onRegionSelect && onRegionSelect(region.id)}
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <circle
                cx={region.cx}
                cy={region.cy}
                r={region.r}
                fill={isSelected ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)'}
                stroke="#D4AF37"
                strokeWidth={isSelected ? 3 : 1}
                className="transition-colors duration-300"
              />
              {/* Pulse effect for selected */}
              {isSelected && (
                <circle
                  cx={region.cx}
                  cy={region.cy}
                  r={region.r}
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2"
                >
                  <animate attributeName="r" from={region.r} to={region.r + 20} dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              {showLabels && (
                <text
                  x={region.cx}
                  y={region.cy + region.r + 15}
                  fill="white"
                  fontSize="12"
                  textAnchor="middle"
                  className={cn("font-medium transition-all duration-300", isSelected ? "font-bold fill-[#D4AF37]" : "opacity-70")}
                >
                  {region.name}
                </text>
              )}
            </motion.g>
          );
        })}
        
        {/* Connection Lines to Netherlands (Hub) */}
        {regionsData.filter(r => r.id !== 'netherlands').map(region => (
          <path
            key={`line-${region.id}`}
            d={`M ${region.cx} ${region.cy} Q ${(region.cx + 480)/2} ${Math.min(region.cy, 110) - 50} 480 110`}
            fill="none"
            stroke={selectedRegion === region.id || selectedRegion === 'netherlands' ? "rgba(212, 175, 55, 0.5)" : "rgba(255,255,255,0.1)"}
            strokeWidth={selectedRegion === region.id ? "2" : "1"}
            strokeDasharray="4 4"
            className="transition-all duration-500"
          >
             {(selectedRegion === region.id || selectedRegion === 'netherlands') && (
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
             )}
          </path>
        ))}
      </svg>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
        <span className="text-white text-xs font-medium uppercase tracking-wider">Titan Stables Global Network</span>
      </div>
    </div>
  );
};

export default InteractiveMap;