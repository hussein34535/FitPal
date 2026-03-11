import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { mealPlans, foodDatabase } from '@/lib/fitness-data';
import { addFoodToLog } from '@/lib/user-store';
import { BookOpen, Plus, Activity, Flame, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MealPlansPage() {

  const handleUsePlan = (plan: typeof mealPlans[0]) => {
    plan.meals.forEach(meal => {
      const foodItem = foodDatabase.find(f => f.id === meal.foodId);
      if (foodItem) {
        addFoodToLog(foodItem, meal.quantity);
      }
    });
    toast.success(`تم إضافة خطة "${plan.name}" ليومك بنجاح!`, {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      style: { background: 'black', border: '1px solid #10b981', color: 'white' }
    });
  };

  const getTargetColor = (target: string) => {
    switch(target) {
      case 'تنشيف': return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
      case 'ضخامة': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'ثبات': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
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
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">خطط الوجبات</h1>
          <p className="text-sm text-muted-foreground">أنظمة غذائية جاهزة محسوبة السعرات للتسهيل عليك.</p>
        </div>
      </div>

      <div className="space-y-6">
        {mealPlans.map((plan, idx) => (
          <GlassCard key={plan.id} className="overflow-hidden border-t-2 border-t-primary">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border mb-2 ${getTargetColor(plan.target)}`}>
                    {plan.target === 'تنشيف' && <Activity className="w-3 h-3 mr-1" />}
                    {plan.target === 'ضخامة' && <Flame className="w-3 h-3 mr-1" />}
                    {plan.target === 'ثبات' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {plan.target}
                  </div>
                  <h2 className="text-xl font-display font-bold">{plan.name}</h2>
                </div>
                <div className="text-left">
                  <p className="font-display font-black text-2xl text-primary">{plan.totalCalories}</p>
                  <p className="text-xs text-muted-foreground">سعرة / يوم</p>
                </div>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                  <p className="text-[10px] text-muted-foreground mb-1 font-bold">بروتين</p>
                  <p className="text-sm font-bold text-blue-400">{plan.protein}g</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                  <p className="text-[10px] text-muted-foreground mb-1 font-bold">كارب</p>
                  <p className="text-sm font-bold text-amber-500">{plan.carbs}g</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                  <p className="text-[10px] text-muted-foreground mb-1 font-bold">دهون</p>
                  <p className="text-sm font-bold text-emerald-500">{plan.fat}g</p>
                </div>
              </div>

              {/* Meals List */}
              <div className="space-y-3 mb-6">
                <h3 className="font-bold text-sm text-foreground/80 flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4" />
                  محتويات الخطة:
                </h3>
                {plan.meals.map((meal, i) => {
                  const foodInfo = foodDatabase.find(f => f.id === meal.foodId);
                  if (!foodInfo) return null;
                  
                  return (
                    <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-xs font-bold text-muted-foreground">{meal.name}</span>
                        <span className="font-medium">{foodInfo.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">
                        x{meal.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleUsePlan(plan)}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                أضف الخطة ليومك
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}

// Temporary import fix for the icon used inside the map
import { UtensilsCrossed } from 'lucide-react';
