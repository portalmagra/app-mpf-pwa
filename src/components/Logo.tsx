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

  // const iconSizes = {
  //   sm: 16,
  //   md: 20,
  //   lg: 32,
  //   xl: 40
  // }

  // const iconSize = iconSizes[size] // Not used in current implementation

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-brand-green via-brand-green to-brand-greenDark rounded-lg flex items-center justify-center`}>
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-brand-text">MeuPortalFit</h1>
          <p className="text-xs text-brand-text2">Brasileiros nos EUA</p>
        </div>
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center space-y-2 ${className}`}>
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-brand-green via-brand-green to-brand-greenDark rounded-lg flex items-center justify-center`}>
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <div className="text-center">
          <h1 className="text-lg font-bold text-brand-text">MeuPortalFit</h1>
          <p className="text-xs text-brand-text2">Brasileiros nos EUA</p>
        </div>
      </div>
    )
  }

  // Default icon variant
  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-brand-green via-brand-green to-brand-greenDark rounded-lg flex items-center justify-center ${className}`}>
      <span className="text-white font-bold text-sm">M</span>
    </div>
  )
}
