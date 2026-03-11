import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronRight, Plus, Utensils, PieChart, Info } from 'lucide-react';
import { foodDatabase, type FoodItem } from '@/lib/fitness-data';
import { addFoodToLog } from '@/lib/user-store';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const MEAL_TYPES = [
  { id: 'breakfast', label: 'فطار', emoji: '🍳' },
  { id: 'lunch', label: 'غداء', emoji: '🥘' },
  { id: 'dinner', label: 'عشاء', emoji: '🥗' },
  { id: 'snack', label: 'سناك', emoji: '🍎' },
];

const CATEGORIES = ['الكل', 'بروتين', 'كربوهيدرات', 'فواكه', 'خضروات', 'ألبان', 'دهون صحية', 'مكسرات'];

export function AddFoodModal({ isOpen, onClose, defaultMealType = 'breakfast' }: AddFoodModalProps) {
  const [step, setStep] = useState<'list' | 'detail'>('list');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [mealType, setMealType] = useState(defaultMealType);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('الكل');
  const [quantity, setQuantity] = useState(1);

  const filteredFood = useMemo(() => {
    return foodDatabase.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'الكل' || f.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleAdd = () => {
    if (selectedFood) {
      addFoodToLog(selectedFood, quantity, mealType as any);
      toast.success(`تم إضافة ${selectedFood.name} إلى الـ ${MEAL_TYPES.find(m => m.id === mealType)?.label}`);
      onClose();
      // Reset state
      setStep('list');
      setSelectedFood(null);
      setQuantity(1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-secondary/80 backdrop-blur-2xl border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-display font-black">
                {step === 'list' ? 'إضافة أكلة' : 'تحديد الكمية'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-8">
              {step === 'list' ? (
                <div className="space-y-6">
                  {/* Meal Type Selection */}
                  <div className="flex gap-2 pb-2 overflow-x-auto hide-scrollbar">
                    {MEAL_TYPES.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setMealType(m.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border shrink-0 ${
                          mealType === m.id 
                            ? 'bg-primary border-primary text-primary-foreground scale-105' 
                            : 'bg-white/5 border-white/10 text-muted-foreground opacity-60'
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Search bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="ابحث عن أكلة..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>

                  {/* Categories */}
                  <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                          category === cat ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-muted-foreground border border-transparent'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Food List */}
                  <div className="space-y-3">
                    {filteredFood.map(food => (
                      <button
                        key={food.id}
                        onClick={() => {
                          setSelectedFood(food);
                          setStep('detail');
                        }}
                        className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-lg">
                            {food.category === 'بروتين' ? '🍗' : food.category === 'فواكه' ? '🍎' : '🥗'}
                          </div>
                          <div className="text-right">
                            <h4 className="font-bold text-sm text-foreground">{food.name}</h4>
                            <p className="text-[10px] text-muted-foreground">{food.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-display font-black text-primary text-sm">{food.calories}</p>
                            <p className="text-[8px] text-muted-foreground font-bold">سعرة</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-8 py-4">
                  {/* Detail View */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-primary/20 flex items-center justify-center text-3xl mb-4">
                      {selectedFood?.category === 'بروتين' ? '🍗' : selectedFood?.category === 'فواكه' ? '🍎' : '🥗'}
                    </div>
                    <h3 className="text-2xl font-display font-black">{selectedFood?.name}</h3>
                    <p className="text-muted-foreground text-sm">{selectedFood?.category}</p>
                  </div>

                  <GlassCard className="p-6">
                    <div className="flex justify-between items-end mb-6">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground font-bold mb-1">السعرات الكلية</p>
                        <p className="text-4xl font-display font-black text-primary">
                          {Math.round((selectedFood?.calories || 0) * quantity)}
                        </p>
                      </div>
                      <div className="text-left bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <p className="text-[10px] text-muted-foreground font-bold mb-1">الكمية</p>
                        <p className="text-xl font-display font-black text-foreground">{quantity.toFixed(1)}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <input 
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={quantity}
                        onChange={e => setQuantity(parseFloat(e.target.value))}
                        className="w-full accent-primary appearance-none h-1.5 bg-white/10 rounded-full cursor-pointer"
                      />
                      
                      <div className="grid grid-cols-4 gap-2">
                        <MacroMini label="بروتين" value={Math.round((selectedFood?.protein || 0) * quantity)} unit="g" />
                        <MacroMini label="كارب" value={Math.round((selectedFood?.carbs || 0) * quantity)} unit="g" />
                        <MacroMini label="دهون" value={Math.round((selectedFood?.fat || 0) * quantity)} unit="g" />
                        <MacroMini label="ألياف" value={Math.round((selectedFood?.fiber || 0) * quantity)} unit="g" />
                      </div>
                    </div>
                  </GlassCard>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep('list')}
                      className="flex-1 py-4 px-6 rounded-2xl bg-white/5 border border-white/10 font-bold text-sm hover:bg-white/10 transition-all"
                    >
                      تراجع
                    </button>
                    <button 
                      onClick={handleAdd}
                      className="flex-[2] py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-display font-black shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      أضف الوجبة
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function MacroMini({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
      <p className="text-[9px] text-muted-foreground font-bold mb-0.5">{label}</p>
      <p className="text-xs font-black">{value}{unit}</p>
    </div>
  );
}
