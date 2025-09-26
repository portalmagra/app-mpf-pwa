import Image from 'next/image'

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

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  }

  const subtextSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-sm'
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className={`${sizeClasses[size]} relative`}>
          <Image
            src="/logo-final-solo-m.svg"
            alt="MeuPortalFit"
            width={64}
            height={64}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <div>
          <h1 className={`${textSizes[size]} font-bold text-brand-text`}>MeuPortalFit</h1>
          <p className={`${subtextSizes[size]} text-brand-text2`}>Brasileiros nos EUA</p>
        </div>
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center space-y-2 ${className}`}>
        <div className={`${sizeClasses[size]} relative`}>
          <Image
            src="/logo-variante-5.svg"
            alt="MeuPortalFit"
            width={64}
            height={64}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <div className="text-center">
          <h1 className={`${textSizes[size]} font-bold text-brand-text`}>MeuPortalFit</h1>
          <p className={`${subtextSizes[size]} text-brand-text2`}>Brasileiros nos EUA</p>
        </div>
      </div>
    )
  }

  // Default icon variant
  return (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      <Image
        src="/logo-final-solo-m.svg"
        alt="MeuPortalFit"
        width={64}
        height={64}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  )
}
