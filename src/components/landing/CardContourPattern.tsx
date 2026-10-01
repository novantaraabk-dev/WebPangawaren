'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CardContourPatternProps {
  className?: string;
  opacity?: number;
}

export function CardContourPattern({ className, opacity }: CardContourPatternProps) {
  // If opacity was explicitly specified and not the deprecated 0.03, use it;
  // otherwise default to a balanced, clearly visible but subtle opacity (0.18).
  const effectiveOpacity = typeof opacity === 'number' && opacity > 0.05 ? opacity : 0.18;

  return (
    <div 
      className={cn("absolute inset-0 pointer-events-none overflow-hidden select-none z-0", className)}
      style={{ opacity: effectiveOpacity }}
      aria-hidden="true"
    >
      <Image
        src="/images/card-wave-bg.png"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 600px"
        className="object-cover object-center pointer-events-none select-none mix-blend-multiply"
        priority
      />
    </div>
  );
}
