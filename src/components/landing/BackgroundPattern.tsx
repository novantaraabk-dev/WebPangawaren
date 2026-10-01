import React from 'react';

export function BackgroundPattern() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Ambient Glow Orbs */}
      {/* Orb 1: Near Services Section (Left) */}
      <div className="absolute top-[600px] -left-[250px] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      {/* Orb 2: Near Statistics Section (Right) */}
      <div className="absolute top-[1700px] -right-[200px] w-[700px] h-[700px] rounded-full bg-teal-400/8 blur-[140px] pointer-events-none" />
      {/* Orb 3: Near About Section (Left) */}
      <div className="absolute top-[3100px] -left-[200px] w-[600px] h-[600px] rounded-full bg-amber-300/8 blur-[130px] pointer-events-none" />
      {/* Orb 4: Near Announcement Section (Right/Center) */}
      <div className="absolute top-[4700px] left-[20%] w-[700px] h-[700px] rounded-full bg-emerald-400/8 blur-[150px] pointer-events-none" />

      {/* Pattern Block 1: Top (Hero / Services Area) */}
      <div className="absolute top-0 left-0 w-full h-[1800px] overflow-hidden">
        {/* Soft Wave Curves - Left */}
        <svg
          className="absolute left-0 top-0 w-[800px] h-[1200px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave-grad-1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="wave-grad-2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.4" />
            </linearGradient>
            <filter id="wave-blur-top" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="40" />
            </filter>
          </defs>
          <path
            d="M -150,-100 C 250,100 150,500 -150,700 Z"
            fill="url(#wave-grad-1)"
            filter="url(#wave-blur-top)"
          />
          <path
            d="M -150,150 C 350,300 250,800 -150,1000 Z"
            fill="url(#wave-grad-2)"
            filter="url(#wave-blur-top)"
          />
        </svg>
      </div>

      {/* Pattern Block 2: Middle (About / Statistics Area) */}
      <div className="absolute top-[2000px] left-0 w-full h-[1800px] overflow-hidden">
        {/* Soft Wave Curves - Left */}
        <svg
          className="absolute left-0 top-[100px] w-[700px] h-[1200px] opacity-70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave-grad-mid" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.3" />
            </linearGradient>
            <filter id="wave-blur-mid" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="45" />
            </filter>
          </defs>
          <path
            d="M -150,-50 C 300,150 200,650 -150,900 Z"
            fill="url(#wave-grad-mid)"
            filter="url(#wave-blur-mid)"
          />
          <path
            d="M -150,250 C 350,450 250,950 -150,1150 Z"
            fill="url(#wave-grad-mid)"
            filter="url(#wave-blur-mid)"
          />
        </svg>
      </div>

      {/* Pattern Block 3: Lower (Announcements Area) */}
      <div className="absolute top-[4000px] left-0 w-full h-[1600px] overflow-hidden">
        {/* Soft Wave Curves - Left */}
        <svg
          className="absolute left-0 top-[50px] w-[700px] h-[1200px] opacity-60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave-grad-low" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.25" />
            </linearGradient>
            <filter id="wave-blur-low" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="35" />
            </filter>
          </defs>
          <path
            d="M -150,-100 C 250,50 150,550 -150,750 Z"
            fill="url(#wave-grad-low)"
            filter="url(#wave-blur-low)"
          />
          <path
            d="M -150,150 C 300,300 200,800 -150,1000 Z"
            fill="url(#wave-grad-low)"
            filter="url(#wave-blur-low)"
          />
        </svg>
      </div>
    </div>
  );
}
