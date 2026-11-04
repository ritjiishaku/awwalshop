import Link from 'next/link'

interface LogoProps {
  variant?: 'dark' | 'light' | 'monogram' | 'stacked'
  className?: string
  compact?: boolean
  showTagline?: boolean
  href?: string
  ariaLabel?: string
}

export default function Logo({
  variant = 'dark',
  className = '',
  compact = false,
  showTagline = false,
  href = '/',
  ariaLabel = 'AWWALSHOP Home',
}: LogoProps) {
  const isLight = variant === 'light'
  const textColor = isLight ? '#F8F5EF' : '#241C19'
  const accentColor = '#C5A46D'

  if (variant === 'monogram') {
    return (
      <Link
        href={href}
        className={`inline-flex items-center justify-center ${className}`}
        aria-label={ariaLabel}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
          className="h-8 w-8"
        >
          <path
            d="M24 10L36 38M24 10L12 38"
            stroke={textColor}
            strokeWidth="2"
            strokeLinecap="square"
          />
          <path
            d="M16 28H32"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
      </Link>
    )
  }

  if (variant === 'stacked') {
    return (
      <Link
        href={href}
        className={`inline-flex flex-col items-center text-center ${className}`}
        aria-label={ariaLabel}
      >
        <span
          className="font-heading text-xl font-semibold tracking-[0.14em] leading-none"
          style={{ color: textColor }}
        >
          AWWALSHOP
        </span>
        {showTagline && (
          <span
            className="text-[10px] uppercase tracking-[0.2em] mt-1 font-body font-medium"
            style={{ color: accentColor }}
          >
            Elegance in Every Detail
          </span>
        )}
      </Link>
    )
  }

  // Default horizontal
  return (
    <Link
      href={href}
      className={`inline-flex items-center ${className}`}
      aria-label={ariaLabel}
    >
      <div className="flex flex-col">
        <span
          className={`whitespace-nowrap font-heading font-semibold leading-tight ${
            compact
              ? 'text-base tracking-[0.12em] sm:text-lg'
              : 'text-xl tracking-[0.14em] sm:text-[1.35rem]'
          }`}
          style={{ color: textColor }}
        >
          AWWALSHOP
        </span>
        {showTagline && (
          <span
            className="text-[9px] uppercase tracking-[0.22em] font-body font-medium -mt-0.5"
            style={{ color: accentColor }}
          >
            Elegance in Every Detail
          </span>
        )}
      </div>
    </Link>
  )
}
