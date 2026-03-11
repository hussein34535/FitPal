import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { getProfile, LoggedFood } from '@/lib/user-store';
import { calculateCalories } from '@/lib/fitness-data';
import { BarChart, Flame, TrendingUp, CalendarDays } from 'lucide-react';

export default function ReportsPage() {
  const profile = getProfile();

  // Process data for the last 7 days
  const weeklyData = useMemo(() => {
    const data = localStorage.getItem('fitpal_food_log');
    const allLogs: LoggedFood[] = data ? JSON.parse(data) : [];
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      
      const dayLogs = allLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === d.getTime();
      });

      const calories = dayLogs.reduce((sum, log) => sum + (log.food.calories * log.quantity), 0);
      const protein = dayLogs.reduce((sum, log) => sum + (log.food.protein * log.quantity), 0);

      days.push({
        date: d,
        dayName: d.toLocaleDateString('ar-EG', { weekday: 'short' }),
        calories: Math.round(calories),
        protein: Math.round(protein)
      });
    }
    return days;
  }, []);

  const needs = profile ? calculateCalories(profile) : null;
  const targetCalories = needs?.calories || 2000;

  const maxCalories = Math.max(...weeklyData.map(d => d.calories), targetCalories, 1);
  const avgCalories = Math.round(weeklyData.reduce((sum, d) => sum + d.calories, 0) / 7);
  const avgProtein = Math.round(weeklyData.reduce((sum, d) => sum + d.protein, 0) / 7);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4 pb-24 space-y-6"
    >
      <div className="flex items-center gap-3 mb-2 text-primary">
        <div className="p-2 glass-panel rounded-xl">
          <BarChart className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">التقارير</h1>
          <p className="text-sm text-muted-foreground">ملخص أدائك خلال آخر 7 أيام</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
          <Flame className="w-6 h-6 text-primary mb-2 opacity-80" />
          <p className="text-sm text-muted-foreground mb-1">متوسط السعرات</p>
          <p className="text-2xl font-display font-black">{avgCalories}</p>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
          <TrendingUp className="w-6 h-6 text-blue-400 mb-2 opacity-80" />
          <p className="text-sm text-muted-foreground mb-1">متوسط البروتين</p>
          <p className="text-2xl font-display font-black text-blue-400">{avgProtein}g</p>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-6">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h2 className="font-bold">السعرات اليومية</h2>
        </div>

        {/* Custom CSS Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-2 mt-4 pt-4 border-b border-white/10 relative">
          {/* Target Line */}
          {targetCalories && (
            <div 
              className="absolute w-full border-t flex items-center border-dashed border-emerald-500/50 z-0 text-emerald-500/80 text-[10px] pr-1"
              style={{ bottom: `${(targetCalories / maxCalories) * 100}%` }}
            >
              هدف ({targetCalories})
            </div>
          )}

          {weeklyData.map((day, i) => {
            const heightPct = (day.calories / maxCalories) * 100;
            const isToday = i === 6;
            
            return (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 relative z-10 group">
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded transition-opacity whitespace-nowrap pointer-events-none">
                  {day.calories} kcal
                </div>
                <div className="w-full bg-white/5 rounded-t-sm flex items-end justify-center" style={{ height: '100%' }}>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 50 }}
                    className={`w-full rounded-t-sm ${isToday ? 'bg-primary' : 'bg-primary/50 group-hover:bg-primary/80 transition-colors'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between gap-2 mt-2">
          {weeklyData.map((day, i) => (
            <div key={i} className="flex-1 text-center">
              <span className={`text-[10px] ${i === 6 ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                {day.dayName}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
