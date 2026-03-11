import { useLocation, useNavigate } from 'react-router-dom';
import { Flame, UtensilsCrossed, Dumbbell, Droplet, Clock, BookOpen, BarChart, Bot, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { clearProfile } from '@/lib/user-store';

interface NavbarProps {
  onReset: () => void;
}

const navItems = [
  { path: '/', label: 'السعرات', icon: Flame },
  { path: '/food', label: 'الأكل', icon: UtensilsCrossed },
  { path: '/exercise', label: 'التمارين', icon: Dumbbell },
  { path: '/coach', label: 'الكابتن', icon: Bot },
  { path: '/meals', label: 'خطط', icon: BookOpen },
  { path: '/reports', label: 'تقارير', icon: BarChart },
  { path: '/water', label: 'المياه', icon: Droplet },
  { path: '/fasting', label: 'الصيام', icon: Clock },
];

export function Navbar({ onReset }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bg-background border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4">
        {/* Top brand row */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary fill-primary/20" />
            <h1 className="font-display text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              FitPal
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => { clearProfile(); onReset(); }}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-destructive"
              title="إعادة ضبط"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <User className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>

        {/* Main navigation row */}
        <div className="flex items-center gap-1 pb-3 overflow-x-auto whitespace-nowrap hide-scrollbar">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-bold transition-all duration-300',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

