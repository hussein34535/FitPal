import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/GlassCard';
import { CircularProgress } from '@/components/CircularProgress';
import { getProfile, getTodayFoodLog } from '@/lib/user-store';
import { calculateCalories, calculateBMI } from '@/lib/fitness-data';
import { cn } from '@/lib/utils';
import { Activity, Target, Scale, Zap, Info, Plus, ChevronRight, Calculator, PieChart, Utensils } from 'lucide-react';

export default function CaloriesPage() {
  const profile = getProfile()!;
  const navigate = useNavigate();
  const macros = useMemo(() => calculateCalories(profile), [profile]);
  const bmiData = useMemo(() => calculateBMI(profile.weight, profile.height), [profile]);
  const todayLog = getTodayFoodLog();

  const consumed = useMemo(() => {
    return todayLog.reduce(
      (acc, item) => ({
        calories: acc.calories + Math.round(item.food.calories * item.quantity),
        protein: acc.protein + Math.round(item.food.protein * item.quantity),
        carbs: acc.carbs + Math.round(item.food.carbs * item.quantity),
        fat: acc.fat + Math.round(item.food.fat * item.quantity),
        fiber: acc.fiber + Math.round((item.food.fiber || 0) * item.quantity),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [todayLog]);

  const remaining = macros.calories - consumed.calories;

  const goalText = {
    lose: 'خسارة وزن (0.5 كجم/أسبوع)',
    maintain: 'ثبات الوزن والحفاظ على اللياقة',
    gain: 'زيادة وزن (0.5 كجم/أسبوع)',
  }[profile.goal];

  const todayDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4 pt-8 pb-24 space-y-6"
    >
      {/* Header Info Section */}
      <section className="space-y-3">
        <h2 className="font-display font-extrabold text-lg flex items-center gap-2 px-1">
          <Info className="w-4 h-4 text-primary" />
          ملخص بياناتك
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <DataPointCard 
            icon={<Calculator className="w-4 h-4 text-blue-400" />}
            label="مؤشر كتلة الجسم (BMI)" 
            value={bmiData.value} 
            subtitle={bmiData.category} 
          />
          <DataPointCard 
            icon={<Zap className="w-4 h-4 text-orange-400" />}
            label="BMR" 
            value={macros.bmr} 
            subtitle="سعرة" 
          />
          <DataPointCard 
            icon={<Activity className="w-4 h-4 text-green-400" />}
            label="سعرات الثبات" 
            value={macros.maintenance} 
            subtitle="سعرة" 
          />
          <DataPointCard 
            icon={<Target className="w-4 h-4 text-primary" />}
            label="الهدف اليومي" 
            value={macros.calories} 
            subtitle="سعرة" 
          />
        </div>
        <GlassCard className="p-4 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xl">💪</span>
            </div>
            <div>
              <p className="font-display font-bold text-foreground">{goalText}</p>
              <p className="text-xs text-muted-foreground mt-0.5">بناءً على نشاطك الحالي وهدفك</p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Main Consumption Section */}
      <section className="space-y-3">
        <h2 className="font-display font-extrabold text-lg flex items-center gap-2 px-1">
          <PieChart className="w-4 h-4 text-primary" />
          توزيع الماكروز اليومي
        </h2>
        <GlassCard className="p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <CircularProgress
                value={consumed.calories}
                max={macros.calories}
                size={160}
                strokeWidth={12}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <span className="font-display text-3xl font-black">{remaining > 0 ? remaining : 0}</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">سعرة متبقية</span>
              </div>
            </div>
            
            <div className="flex-1 w-full grid grid-cols-2 gap-4">
              <MacroProgress label="بروتين" current={consumed.protein} target={macros.protein} color="bg-primary" />
              <MacroProgress label="كارب" current={consumed.carbs} target={macros.carbs} color="bg-blue-500" />
              <MacroProgress label="دهون" current={consumed.fat} target={macros.fat} color="bg-orange-500" />
              <MacroProgress label="ألياف" current={consumed.fiber} target={macros.fiber} color="bg-green-500" />
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Meals Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-display font-extrabold text-lg flex items-center gap-2">
              <Utensils className="w-4 h-4 text-primary" />
              سجل اليوم
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">{todayDate}</p>
          </div>
          <button 
            onClick={() => navigate('/food')}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline group"
          >
            إضافة أكلة
            <Plus className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
          </button>
        </div>

        <h3 className="font-display font-bold text-muted-foreground text-sm uppercase tracking-widest flex items-center gap-2 px-1">
          <span>الوجبات</span>
          <span className="h-[1px] flex-1 bg-white/5" />
          <span className="text-primary">{consumed.calories} سعرة</span>
        </h3>

        {todayLog.length === 0 ? (
          <GlassCard className="p-12 text-center border-dashed border-white/10 opacity-60">
            <Utensils className="w-10 h-10 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="font-display font-bold text-lg mb-1 text-muted-foreground">لسه ما ضفت أكل</p>
            <p className="text-sm text-muted-foreground mb-6">اضغط "إضافة أكلة" لتبدأ</p>
            <button 
              onClick={() => navigate('/food')}
              className="px-6 py-2 rounded-full border border-primary text-primary text-sm font-bold hover:bg-primary hover:text-white transition-all"
            >
              إضافة أول وجبة
            </button>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {todayLog.map((item, idx) => (
              <GlassCard key={idx} className="p-4 flex items-center justify-between group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-lg">
                    {item.food.category === 'بروتين' ? '🍗' : item.food.category === 'فواكه' ? '🍎' : '🥗'}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm">{item.food.name}</h4>
                    <p className="text-[10px] text-muted-foreground">كمية: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-black text-primary">{Math.round(item.food.calories * item.quantity)}</p>
                  <p className="text-[9px] text-muted-foreground font-bold">سعرة</p>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}

function DataPointCard({ icon, label, value, subtitle }: { icon: React.ReactNode; label: string; value: string | number; subtitle: string }) {
  return (
    <GlassCard className="p-3 flex items-start gap-3 hover:bg-white/5 transition-colors group">
      <div className="mt-1 p-1.5 rounded-lg glass-panel group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground font-bold tracking-tight mb-0.5">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="font-display font-black text-lg">{value}</span>
          <span className="text-[10px] font-bold text-muted-foreground">{subtitle}</span>
        </div>
      </div>
    </GlassCard>
  );
}

function MacroProgress({ label, current, target, color }: { label: string; current: number; target: number; color: string }) {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-wider">
        <span className="text-muted-foreground">{label}</span>
        <span>{current}<span className="text-muted-foreground opacity-50">/{target}g</span></span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={cn('h-full rounded-full', color)}
        />
      </div>
    </div>
  );
}

