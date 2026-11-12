import React from 'react';

export const PantherLogoIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Subtle gold shield background */}
      <path
        d="M24 4L40 10V22C40 33 24 43 24 43C24 43 8 33 8 22V10L24 4Z"
        fill="#071710"
        stroke="var(--accent-main)"
        strokeWidth="1.5"
      />
      {/* Stylized geometric Panther head profile / crest */}
      <path
        d="M16 17L22 13L24 16L26 13L32 17L30 23L27 21L24 24L21 21L18 23L16 17Z"
        fill="var(--accent-main)"
        opacity="0.9"
      />
      {/* Piercing panther eye */}
      <circle cx="21" cy="19" r="1.5" fill="#f8e3a1" />
      <circle cx="27" cy="19" r="1.5" fill="#f8e3a1" />
      {/* Lower jaw line and muzzle */}
      <path
        d="M20 25L24 28L28 25L26 31L24 33L22 31L20 25Z"
        fill="var(--accent-main)"
        opacity="0.95"
      />
      {/* Subtle whiskers / trail cuts */}
      <line x1="17" y1="26" x2="13" y2="28" stroke="var(--accent-grad)" strokeWidth="1" strokeLinecap="round" />
      <line x1="31" y1="26" x2="35" y2="28" stroke="var(--accent-grad)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
};

export const SubtlePantherBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#040906] via-[#0b1d14] to-[#07130c] border border-[#1b3d2b]/60 ${className}`}>
      {/* Background topography / jungle leaves lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="trail-contour" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M0 40 Q20 20 40 40 T80 40" stroke="var(--accent-main)" strokeWidth="0.75" fill="none" opacity="0.3" />
              <path d="M0 60 Q20 40 40 60 T80 60" stroke="#26794f" strokeWidth="0.75" fill="none" opacity="0.4" />
              <circle cx="40" cy="40" r="1.5" fill="var(--accent-main)" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#trail-contour)" />
        </svg>
      </div>

      {/* Subtle silhouette of a stealth panther emerging from the forest */}
      <div className="absolute right-2 bottom-0 top-0 w-44 md:w-64 opacity-25 pointer-events-none flex items-center justify-end overflow-hidden">
        <svg viewBox="0 0 200 120" className="h-full w-auto" fill="none">
          {/* Panther muscular stalk silhouette */}
          <path
            d="M10 95C25 88 40 85 60 88C75 75 90 68 115 65C135 62 155 70 170 82C182 72 192 60 198 45C192 48 184 49 175 48C172 40 162 35 150 35C140 35 130 38 120 44C105 38 90 38 75 42C62 45 52 52 45 62C35 70 25 80 10 95Z"
            fill="var(--accent-main)"
          />
          {/* Glowing predator eye */}
          <ellipse cx="165" cy="46" rx="2.5" ry="1.5" fill="#f8e3a1" />
        </svg>
      </div>
    </div>
  );
};
