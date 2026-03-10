import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, strong, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        strong ? 'glass-panel-strong' : 'glass-panel',
        'p-6 transition-all duration-300',
        onClick && 'cursor-pointer hover:bg-[hsla(0,0%,100%,0.08)]',
        className
      )}
    >
      {children}
    </div>
  );
}
