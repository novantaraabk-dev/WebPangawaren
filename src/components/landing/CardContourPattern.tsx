import React from 'react';
import { cn } from '@/lib/utils';

interface CardContourPatternProps {
  className?: string;
  opacity?: number;
}

export function CardContourPattern({ className, opacity = 0.025 }: CardContourPatternProps) {
  return (
    <div 
      className={cn("absolute inset-0 pointer-events-none overflow-hidden select-none z-0", className)}
      style={{ opacity }}
    >
      <svg
        className="w-full h-full"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="geometric-interlocking-contour"
            x="0"
            y="0"
            width="140"
            height="140"
            patternUnits="userSpaceOnUse"
          >
            <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round">
              {/* Concentric Circles at (0,0) */}
              <circle cx="0" cy="0" r="14" />
              <circle cx="0" cy="0" r="28" />
              <circle cx="0" cy="0" r="42" />
              <circle cx="0" cy="0" r="56" />

              {/* Concentric Circles at (140,0) */}
              <circle cx="140" cy="0" r="14" />
              <circle cx="140" cy="0" r="28" />
              <circle cx="140" cy="0" r="42" />
              <circle cx="140" cy="0" r="56" />

              {/* Concentric Circles at Center Offset (70,70) */}
              <circle cx="70" cy="70" r="14" />
              <circle cx="70" cy="70" r="28" />
              <circle cx="70" cy="70" r="42" />
              <circle cx="70" cy="70" r="56" />

              {/* Concentric Circles at (0,140) */}
              <circle cx="0" cy="140" r="14" />
              <circle cx="0" cy="140" r="28" />
              <circle cx="0" cy="140" r="42" />
              <circle cx="0" cy="140" r="56" />

              {/* Concentric Circles at (140,140) */}
              <circle cx="140" cy="140" r="14" />
              <circle cx="140" cy="140" r="28" />
              <circle cx="140" cy="140" r="42" />
              <circle cx="140" cy="140" r="56" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geometric-interlocking-contour)" />
      </svg>
    </div>
  );
}
