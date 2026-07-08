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
            <filter id="curve-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="-4" dy="8" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.04" />
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
          {/* Subtle line curves with shadows */}
          <path
            d="M -100,50 C 200,180 300,550 -100,850"
            stroke="#ffffff"
            strokeWidth="8"
            fill="none"
            filter="url(#curve-shadow)"
          />
          <path
            d="M -100,200 C 250,350 350,750 -100,1050"
            stroke="#ffffff"
            strokeWidth="8"
            fill="none"
            filter="url(#curve-shadow)"
          />
        </svg>

        {/* Wavy Dotted Mesh - Right */}
        <svg
          className="absolute right-0 top-[100px] w-[600px] h-[1400px] opacity-60 md:opacity-100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="dots-grad-top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {Array.from({ length: 9 }).map((_, i) => {
            const offset = i * 45;
            return (
              <path
                key={i}
                d={`M ${400 + offset},-100 C ${200 + offset},300 ${500 + offset},700 ${250 + offset},1100 C ${100 + offset},1300 ${300 + offset},1500 ${200 + offset},1700`}
                stroke="url(#dots-grad-top)"
                strokeWidth="3"
                strokeDasharray="1 14"
                strokeLinecap="round"
              />
            );
          })}
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

        {/* Wavy Dotted Mesh - Right */}
        <svg
          className="absolute right-0 top-[50px] w-[650px] h-[1500px] opacity-40 md:opacity-85"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="dots-grad-mid" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#94a3b8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {Array.from({ length: 8 }).map((_, i) => {
            const offset = i * 40;
            return (
              <path
                key={i}
                d={`M ${450 + offset},-100 C ${300 + offset},350 ${150 + offset},750 ${350 + offset},1100 C ${450 + offset},1250 ${250 + offset},1400 ${300 + offset},1600`}
                stroke="url(#dots-grad-mid)"
                strokeWidth="3.2"
                strokeDasharray="1 15"
                strokeLinecap="round"
              />
            );
          })}
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

        {/* Wavy Dotted Mesh - Right */}
        <svg
          className="absolute right-0 top-[100px] w-[600px] h-[1300px] opacity-45 md:opacity-90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="dots-grad-low" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {Array.from({ length: 8 }).map((_, i) => {
            const offset = i * 45;
            return (
              <path
                key={i}
                d={`M ${350 + offset},-100 C ${150 + offset},250 ${450 + offset},650 ${200 + offset},1050 C ${100 + offset},1200 ${250 + offset},1350 ${150 + offset},1500`}
                stroke="url(#dots-grad-low)"
                strokeWidth="2.8"
                strokeDasharray="1 13"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
