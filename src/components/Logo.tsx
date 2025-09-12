interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'icon' | 'horizontal' | 'full'
  className?: string
}

export default function Logo({ size = 'md', variant = 'icon', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 32,
    xl: 40
  }

  const iconSize = iconSizes[size]

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-brand-green via-brand-green to-brand-blue rounded-lg flex items-center justify-center`}>
          <svg width={iconSize} height={iconSize} viewBox="0 0 20 20" className="text-white">
            <path d="M10,3 C10,3 6,7 6,10 C6,12 8,14 10,14 C12,14 14,12 14,10 C14,7 10,3 10,3 Z" fill="currentColor"/>
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-brand-text">MeuPortalFit</h1>
          <p className="text-xs text-gray-500">Wellness para Brasileiros</p>
        </div>
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center space-y-2 ${className}`}>
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-brand-green via-brand-green to-brand-blue rounded-lg flex items-center justify-center`}>
          <svg width={iconSize} height={iconSize} viewBox="0 0 20 20" className="text-white">
            <path d="M10,3 C10,3 6,7 6,10 C6,12 8,14 10,14 C12,14 14,12 14,10 C14,7 10,3 10,3 Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-lg font-bold text-brand-text">MeuPortalFit</h1>
          <p className="text-xs text-gray-500">Wellness para Brasileiros</p>
        </div>
      </div>
    )
  }

  // Default icon variant
  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-brand-green via-brand-green to-brand-blue rounded-lg flex items-center justify-center ${className}`}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 20 20" className="text-white">
        <path d="M10,3 C10,3 6,7 6,10 C6,12 8,14 10,14 C12,14 14,12 14,10 C14,7 10,3 10,3 Z" fill="currentColor"/>
      </svg>
    </div>
  )
}
