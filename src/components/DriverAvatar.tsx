import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Driver } from '../types/motorsport';

interface DriverAvatarProps {
  driver: Driver;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showNumber?: boolean;
  zoom?: boolean;
  rounded?: 'full' | '2xl' | 'xl';
}

const SIZE_MAP = {
  xs: 'w-8 h-8 text-[10px]',
  sm: 'w-10 h-10 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-20 h-20 text-lg',
  xl: 'w-28 h-28 text-2xl'
};

export const DriverAvatar: React.FC<DriverAvatarProps> = ({
  driver,
  size = 'md',
  className = '',
  showNumber = false,
  zoom = true,
  rounded = 'full'
}) => {
  const [hasError, setHasError] = useState(false);
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

  const initials = driver.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const photoUrl = driver.cutoutUrl || driver.avatarUrl;
  const hasPhoto = Boolean(photoUrl && !hasError);

  const isCutout = Boolean(
    photoUrl && (
      (driver.cutoutUrl && photoUrl === driver.cutoutUrl) ||
      photoUrl.includes('.webp') ||
      photoUrl.includes('.png') ||
      photoUrl.includes('formula1.com') ||
      photoUrl.includes('photos.motogp.com/riders')
    )
  );

  const roundedClass =
    rounded === 'full' ? 'rounded-full' : rounded === 'xl' ? 'rounded-xl' : 'rounded-2xl';

  return (
    <div
      className={`relative shrink-0 overflow-hidden flex items-center justify-center font-bold font-mono transition-transform duration-300 ${roundedClass} ${sizeClasses} ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 30%, ${driver.teamColor}35 0%, #090d16 100%)`,
        border: `2px solid ${driver.teamColor || '#334155'}`
      }}
    >
      {hasPhoto ? (
        <img
          src={photoUrl}
          alt={driver.name}
          className="w-full h-full object-cover select-none transition-transform duration-300"
          style={{
            objectPosition: isCutout ? 'center 2%' : 'center 6%',
            transformOrigin: 'top center',
            transform: zoom ? (isCutout ? 'scale(1.2)' : 'scale(1.1)') : 'scale(1)'
          }}
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-black"
          style={{ color: driver.teamColor || '#cbd5e1' }}
        >
          {initials || `#${driver.number}`}
        </div>
      )}

      {/* Driver Number Badge Overlay if enabled */}
      {showNumber && (
        <span
          className="absolute bottom-0 right-0 text-[9px] font-mono font-black px-1 rounded-tl-md bg-black/80 text-white border-t border-l border-slate-700"
          style={{ color: driver.teamColor }}
        >
          #{driver.number}
        </span>
      )}
    </div>
  );
};
