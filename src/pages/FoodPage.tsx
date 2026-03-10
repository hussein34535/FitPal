import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { foodDatabase } from '@/lib/fitness-data';
import { addFoodToLog, getTodayFoodLog, removeFoodFromLog } from '@/lib/user-store';
import { Plus, Minus, Search, Trash2 } from 'lucide-react';

export default function FoodPage() {
  const [search, setSearch] = useState('');
  const [, setRefresh] = useState(0);

  const todayLog = getTodayFoodLog();
  const filteredFoods = useMemo(() =>
    foodDatabase.filter(f => f.name.includes(search) || f.category.includes(search)),
    [search]
  );

  const totalCalories = todayLog.reduce((s, i) => s + Math.round(i.food.calories * i.quantity), 0);

  const handleAdd = (food: typeof foodDatabase[0]) => {
    addFoodToLog(food, 1);
    setRefresh(r => r + 1);
  };

  const handleRemove = (timestamp: number) => {
    removeFoodFromLog(timestamp);
    setRefresh(r => r + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-4 pb-8 space-y-6"
    >
      {/* Today's log */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg">وجبات اليوم</h2>
          <span className="font-display font-extrabold text-primary text-lg">{totalCalories} سعرة</span>
        </div>
        {todayLog.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">لم تضف أي وجبة اليوم</p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {todayLog.map(item => (
                <motion.div
                  key={item.timestamp}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between glass-panel px-4 py-3 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{item.food.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(item.food.calories * item.quantity)} سعرة · {Math.round(item.food.protein * item.quantity)}g بروتين
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.timestamp)}
                    className="p-2 rounded-lg hover:bg-[hsla(345,100%,21%,0.2)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-primary" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </GlassCard>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن طعام..."
          className="w-full glass-panel h-12 pr-11 pl-4 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-1 focus:ring-primary font-body text-sm transition-all"
        />
      </div>

      {/* Food list */}
      <div className="space-y-2">
        {filteredFoods.map(food => (
          <GlassCard key={food.id} className="p-4 flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-sm">{food.name}</p>
              <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                <span>{food.calories} سعرة</span>
                <span>·</span>
                <span>ب {food.protein}g</span>
                <span>·</span>
                <span>ك {food.carbs}g</span>
                <span>·</span>
                <span>د {food.fat}g</span>
              </div>
            </div>
            <button
              onClick={() => handleAdd(food)}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center
                hover:brightness-125 active:scale-90 transition-all"
            >
              <Plus className="w-5 h-5 text-primary-foreground" />
            </button>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}
