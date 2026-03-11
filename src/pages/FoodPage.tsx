import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/GlassCard';
import { foodDatabase, type FoodItem } from '@/lib/fitness-data';
import { getTodayFoodLog, removeFoodFromLog } from '@/lib/user-store';
import { Search, Plus, Utensils, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AddFoodModal } from '@/components/AddFoodModal';
import { toast } from 'sonner';

const CATEGORIES = ['الكل', 'بروتين', 'كربوهيدرات', 'خضروات', 'فواكه', 'ألبان', 'دهون صحية', 'سناك'];

export default function FoodPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const todayLog = useMemo(() => getTodayFoodLog(), [lastUpdate]);

  const stats = useMemo(() => {
    return todayLog.reduce((acc, item) => ({
      calories: acc.calories + Math.round(item.food.calories * item.quantity),
      protein: acc.protein + Math.round(item.food.protein * item.quantity),
      carbs: acc.carbs + Math.round(item.food.carbs * item.quantity),
      fat: acc.fat + Math.round(item.food.fat * item.quantity),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [todayLog]);

  const filteredDatabase = useMemo(() => {
    return foodDatabase.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'الكل' || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const handleRemove = (timestamp: number) => {
    removeFoodFromLog(timestamp);
    setLastUpdate(Date.now());
    toast.success('تم حذف الوجبة');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 pb-24 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-secondary/50 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-display font-black">سجل الطعام</h1>
          <p className="text-xs text-muted-foreground">تابع وجباتك وسعراتك بدقة</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Daily Nutrients Overview */}
      <GlassCard className="p-6 overflow-hidden relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          <NutrientSmall label="السعرات" value={stats.calories} unit="سعرة" color="text-primary" />
          <NutrientSmall label="بروتين" value={stats.protein} unit="g" color="text-emerald-400" />
          <NutrientSmall label="كارب" value={stats.carbs} unit="g" color="text-blue-400" />
          <NutrientSmall label="دهون" value={stats.fat} unit="g" color="text-orange-400" />
        </div>
        <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-primary/5 rotate-12" />
      </GlassCard>

      {/* Food Database & Controls */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن أكلة..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-secondary/30 border border-white/10 rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar md:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  selectedCategory === cat ? 'bg-primary border-primary text-primary-foreground' : 'bg-secondary/30 border-white/10 text-muted-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredDatabase.slice(0, 10).map(food => (
            <GlassCard key={food.id} className="p-4 flex items-center justify-between group hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">
                  {food.category === 'بروتين' ? '🍗' : food.category === 'فواكه' ? '🍎' : '🥗'}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{food.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{food.calories} سعرة | {food.protein}g بروتين</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Today's Log Section */}
      <section className="space-y-4 pt-4 border-t border-white/5">
        <h2 className="text-xl font-display font-black flex items-center gap-2">
          <Utensils className="w-5 h-5 text-primary" />
          سجل اليوم ({todayLog.length})
        </h2>
        
        {todayLog.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
            <p className="text-muted-foreground text-sm">لم يتم تسجيل أي طعام اليوم</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {todayLog.map((log) => (
                <motion.div
                  key={log.timestamp}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <GlassCard className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-primary text-xs font-black">
                        {log.quantity}x
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{log.food.name}</h4>
                        <p className="text-[10px] text-muted-foreground capitalize">{log.mealType} • {Math.round(log.food.calories * log.quantity)} سعرة</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemove(log.timestamp)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Global Add Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-24 left-6 w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
      >
        <Plus className="w-8 h-8" />
      </button>

      <AddFoodModal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setLastUpdate(Date.now());
        }} 
      />
    </motion.div>
  );
}

function NutrientSmall({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] text-muted-foreground font-bold mb-1 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline justify-center gap-0.5">
        <span className={cn('text-2xl font-display font-black', color)}>{value}</span>
        <span className="text-[9px] text-muted-foreground font-bold">{unit}</span>
      </div>
    </div>
  );
}
