'use client'

interface TornPaperEdgeProps {
  position?: 'top' | 'bottom'
  color?: string
  className?: string
}

export function TornPaperEdge({
  position = 'bottom',
  color = '#FDFAF7',
  className = '',
}: TornPaperEdgeProps) {
  return (
    <div
      className={`absolute left-0 w-full pointer-events-none ${
        position === 'bottom' ? 'bottom-0' : 'top-0 rotate-180'
      } drop-shadow-[0_-4px_6px_rgba(0,0,0,0.15)] ${className}`}
    >
      <svg
        viewBox="0 0 1440 140"
        className="w-full h-[90px] md:h-[110px]"
        preserveAspectRatio="none"
      >
        <path
          d="
            M0,60
            L40,70
            L80,55
            L120,75
            L160,50
            L200,80
            L240,60
            L280,85
            L320,55
            L360,75
            L400,50
            L440,80
            L480,65
            L520,90
            L560,55
            L600,70
            L640,50
            L680,85
            L720,60
            L760,78
            L800,55
            L840,88
            L880,60
            L920,75
            L960,50
            L1000,85
            L1040,60
            L1080,78
            L1120,55
            L1160,90
            L1200,60
            L1240,75
            L1280,50
            L1320,85
            L1360,60
            L1400,70
            L1440,60
            L1440,140
            L0,140
            Z
          "
          fill={color}
        />
      </svg>
    </div>
  )
}
