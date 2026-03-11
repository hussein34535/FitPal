import { motion } from 'framer-motion';
import { Trophy, Zap, Star, Target } from 'lucide-react';
import { getUserStats } from '@/lib/user-store';
import { GlassCard } from './GlassCard';

export function AchievementsDisplay() {
  const stats = getUserStats();
  const nextLevelXP = stats.level * 100;
  const progress = (stats.xp / nextLevelXP) * 100;

  const badges = [
    { id: 1, name: 'مبتدئ طموح', icon: Star, color: 'text-yellow-400', achieved: true },
    { id: 2, name: 'صاحب استمرارية', icon: Zap, color: 'text-blue-400', achieved: stats.streak >= 3 },
    { id: 3, name: 'وحش التمرين', icon: Target, color: 'text-red-400', achieved: stats.level >= 5 },
    { id: 4, name: 'بطل FitPal', icon: Trophy, color: 'text-emerald-400', achieved: stats.level >= 10 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Level & XP Card */}
        <GlassCard className="p-4 flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-muted-foreground font-bold">المستوى</p>
              <span className="p-1 px-2 rounded-md bg-primary/20 text-primary text-[10px] font-black">LVL {stats.level}</span>
            </div>
            <h3 className="text-2xl font-display font-black text-foreground">التقدم</h3>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-bold mb-1">
                <span>{stats.xp} XP</span>
                <span className="text-muted-foreground">{nextLevelXP} XP</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </div>
          <Star className="absolute -bottom-2 -right-2 w-16 h-16 text-primary/5 group-hover:text-primary/10 transition-colors rotate-12" />
        </GlassCard>

        {/* Streak Card */}
        <GlassCard className="p-4 flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground font-bold mb-1">الاستمرارية</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-display font-black text-orange-500">{stats.streak}</h3>
              <span className="text-sm font-bold text-muted-foreground">يوم</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">عاش يا بطل! كمل استمرار 💪</p>
          </div>
          <Zap className="absolute -bottom-2 -right-2 w-16 h-16 text-orange-500/5 group-hover:text-orange-500/10 transition-colors -rotate-12" fill="currentColor" />
        </GlassCard>
      </div>

      {/* Badges Row */}
      <GlassCard className="p-4">
        <h4 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
          <Trophy className="w-3 h-3" />
          الأوسمة المفتوحة
        </h4>
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {badges.map(badge => (
            <div key={badge.id} className={`flex flex-col items-center gap-1 shrink-0 transition-opacity duration-300 ${badge.achieved ? 'opacity-100' : 'opacity-20 grayscale'}`}>
              <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${badge.achieved ? badge.color : 'text-muted-foreground'}`}>
                <badge.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-center w-16 leading-tight">{badge.name}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
