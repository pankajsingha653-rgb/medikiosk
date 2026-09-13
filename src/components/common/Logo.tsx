interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showTagline = false, className = '' }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Medical Cross + AI Node Emblem in Purple #6C3FC5 and White */}
      <div
        className={`${iconSizes[size]} bg-[#6C3FC5] rounded-lg flex items-center justify-center p-1.5 shadow-xs relative overflow-hidden flex-shrink-0`}
      >
        {/* Geometric cross in crisp white */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Vertical bar */}
          <div className="absolute w-[28%] h-full bg-white rounded-[1.5px]" />
          {/* Horizontal bar */}
          <div className="absolute h-[28%] w-full bg-white rounded-[1.5px]" />
          {/* Center subtle AI neural core in dark purple */}
          <div className="absolute w-2 h-2 rounded-full bg-[#4B238C] ring-1 ring-white" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-bold tracking-tight text-[#171717] ${textSizes[size]}`}>
            Medi<span className="text-[#6C3FC5]">Kiosk</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F3EEFC] text-[#6C3FC5] border border-[#6C3FC5]/20">
            Intake AI
          </span>
        </div>
        {showTagline && (
          <span className="text-xs text-[#666666] font-medium tracking-normal mt-0.5">
            Complete your history. Help your doctor help you.
          </span>
        )}
      </div>
    </div>
  );
}
