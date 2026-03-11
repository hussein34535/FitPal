import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { getProfile, getTodayWaterLog, addWater } from '@/lib/user-store';
import { Droplet, Plus, Trash2 } from 'lucide-react';

export default function WaterPage() {
  const profile = getProfile();
  const [refresh, setRefresh] = useState(0);
  
  const todayWater = getTodayWaterLog();
  const totalMl = todayWater.reduce((sum, w) => sum + w.amountMl, 0);
  
  // Rule of thumb: 33ml per kg of body weight
  const dailyGoalMl = profile ? Math.round(profile.weight * 33) : 2500;
  const progress = Math.min((totalMl / dailyGoalMl) * 100, 100);

  const handleAddWater = (ml: number) => {
    addWater(ml);
    setRefresh(r => r + 1);
  };

  const handleRemoveWater = (timestamp: number) => {
    const data = localStorage.getItem('fitpal_water_log');
    if (data) {
      const all: any[] = JSON.parse(data);
      const filtered = all.filter(w => w.timestamp !== timestamp);
      localStorage.setItem('fitpal_water_log', JSON.stringify(filtered));
      setRefresh(r => r + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4 pb-24 space-y-6"
    >
      <div className="flex items-center gap-3 mb-2 text-primary">
        <div className="p-2 glass-panel rounded-xl">
          <Droplet className="w-6 h-6" fill="currentColor" />
        </div>
        <h1 className="text-2xl font-display font-bold">متتبع المياه</h1>
      </div>

      <GlassCard className="p-8 text-center relative overflow-hidden">
        {/* Animated Water Background */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-1000 ease-out z-0"
          style={{ height: `${progress}%` }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 bg-primary/40 transition-all duration-1000 ease-out z-0 delay-150"
          style={{ height: `${progress * 0.9}%` }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <Droplet className="w-16 h-16 text-primary mb-4" />
          <h2 className="text-5xl font-display font-black text-foreground mb-2">
            {totalMl} <span className="text-2xl text-muted-foreground font-medium">ml</span>
          </h2>
          <p className="text-muted-foreground">
            من أصل {dailyGoalMl} ml (الهدف اليومي)
          </p>
          
          <div className="w-full bg-secondary/50 h-3 rounded-full mt-6 overflow-hidden backdrop-blur-sm">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary"
            />
          </div>
          <p className="text-sm font-bold text-primary mt-2">{Math.round(progress)}%</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => handleAddWater(250)}
          className="glass-panel p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-primary/20 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm">250 ml</span>
          <span className="text-xs text-muted-foreground text-center">كوب ماء</span>
        </button>

        <button
          onClick={() => handleAddWater(500)}
          className="glass-panel p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-primary/20 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm">500 ml</span>
          <span className="text-xs text-muted-foreground text-center">زجاجة صغيرة</span>
        </button>

        <button
          onClick={() => handleAddWater(1000)}
          className="glass-panel p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-primary/20 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm">1 L</span>
          <span className="text-xs text-muted-foreground text-center">زجاجة كبيرة</span>
        </button>
      </div>

      {todayWater.length > 0 && (
        <GlassCard className="p-4">
          <h3 className="font-body font-bold mb-4">سجل اليوم</h3>
          <div className="space-y-2">
            {todayWater.sort((a, b) => b.timestamp - a.timestamp).map((w, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Droplet className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-bold text-sm">{w.amountMl} ml</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(w.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveWater(w.timestamp)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
}
