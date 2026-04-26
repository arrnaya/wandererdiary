'use client'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function LogoBadge({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 32 : size === 'md' ? 40 : 56
  
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circle background */}
      <circle cx="50" cy="50" r="48" fill="#1E3D34" stroke="#1E3D34" strokeWidth="2"/>
      
      {/* Mountains */}
      <path
        d="M10 75 L30 45 L45 60 L60 35 L80 55 L90 75 Z"
        fill="#3F6B63"
      />
      <path
        d="M5 80 L25 50 L40 65 L55 40 L75 60 L85 75 L95 80 Z"
        fill="#1E3D34"
      />
      
      {/* Sun */}
      <circle cx="72" cy="28" r="10" fill="#E09A43"/>
      
      {/* Trees */}
      <path d="M15 80 L18 60 L21 80 Z" fill="#3F6B63"/>
      <path d="M22 80 L25 65 L28 80 Z" fill="#3F6B63"/>
      <path d="M78 80 L81 62 L84 80 Z" fill="#3F6B63"/>
      
      {/* Hiker silhouette */}
      <circle cx="38" cy="52" r="4" fill="#F4E9DB"/>
      <path
        d="M38 58 L34 70 L36 70 L38 62 L40 70 L42 70 Z"
        fill="#F4E9DB"
      />
      <path d="M36 60 L32 66" stroke="#F4E9DB" strokeWidth="2" strokeLinecap="round"/>
      <path d="M40 60 L44 64" stroke="#F4E9DB" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Birds */}
      <path d="M55 18 Q58 15 61 18" stroke="#F4E9DB" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M62 15 Q65 12 68 15" stroke="#F4E9DB" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M50 22 Q52 20 54 22" stroke="#F4E9DB" strokeWidth="1" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoBadge size={size} />
      {showText && (
        <span className="font-display text-xl md:text-2xl font-bold tracking-tight">
          <span className="text-brand-darkGreen">Wanderer</span>
          <span className="text-brand-amber">Diary</span>
        </span>
      )}
    </div>
  )
}
