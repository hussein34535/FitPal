interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  unit?: string;
  color?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  value,
  max,
  size = 160,
  strokeWidth = 8,
  label,
  unit,
  color = 'hsl(345, 100%, 21.4%)',
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(value / max, 1);
  const offset = circumference - percent * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsla(0, 0%, 100%, 0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center p-2 text-center" style={{ width: size, height: size }}>
        {children ? children : (
          <>
            <span className="font-display text-3xl font-extrabold text-foreground">{value}</span>
            {unit && <span className="text-xs text-muted-foreground font-body">/ {max} {unit}</span>}
          </>
        )}
      </div>
      {label && <p className="mt-2 text-sm text-muted-foreground font-body">{label}</p>}
    </div>
  );
}
