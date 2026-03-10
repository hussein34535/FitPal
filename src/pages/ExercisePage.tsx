import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { AnimatedExercise } from '@/components/AnimatedExercise';
import { getProfile } from '@/lib/user-store';
import { generateWorkoutPlan, type WorkoutDay, type Exercise } from '@/lib/fitness-data';
import { ChevronDown, Timer, Dumbbell, AlertTriangle, ListChecks } from 'lucide-react';

export default function ExercisePage() {
  const profile = getProfile()!;
  const plan = useMemo(() => generateWorkoutPlan(profile), [profile]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [restTimer, setRestTimer] = useState<{ seconds: number; total: number } | null>(null);

  const currentDay = plan[selectedDay];

  const startRest = useCallback((seconds: number) => {
    setRestTimer({ seconds, total: seconds });
  }, []);

  useEffect(() => {
    if (!restTimer || restTimer.seconds <= 0) return;
    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (!prev || prev.seconds <= 1) return null;
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [restTimer]);

  return (
    <div className="relative">
      {/* Rest Timer Overlay */}
      <AnimatePresence>
        {restTimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center"
            onClick={() => setRestTimer(null)}
          >
            <p className="text-muted-foreground text-sm mb-4">وقت الراحة</p>
            <div className="relative">
              <svg width={200} height={200} className="transform -rotate-90">
                <circle cx={100} cy={100} r={90} fill="none" stroke="hsla(0,0%,100%,0.05)" strokeWidth={6} />
                <circle
                  cx={100} cy={100} r={90}
                  fill="none"
                  stroke="hsl(345, 100%, 21.4%)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={2 * Math.PI * 90 * (1 - restTimer.seconds / restTimer.total)}
                  className="transition-all duration-1000 linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-7xl font-extrabold">{restTimer.seconds}</span>
              </div>
            </div>
            <p className="text-muted-foreground text-xs mt-6">اضغط للتخطي</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto p-4 pb-8 space-y-6"
      >
        {/* Day selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {plan.map((day, i) => (
            <button
              key={i}
              onClick={() => { setSelectedDay(i); setExpandedExercise(null); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-display font-medium transition-all
                ${i === selectedDay
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-panel text-muted-foreground hover:text-foreground'
                }`}
            >
              {day.day}
            </button>
          ))}
        </div>

        {/* Day header */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-xl">{currentDay.name}</h2>
              <p className="text-xs text-muted-foreground">
                {currentDay.exercises.length > 0
                  ? `${currentDay.exercises.length} تمارين · ${currentDay.exercises.reduce((s, e) => s + e.sets, 0)} مجموعات`
                  : 'يوم راحة 🧘'}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Exercises */}
        {currentDay.exercises.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <p className="font-display text-xl font-bold mb-2">يوم راحة</p>
            <p className="text-sm text-muted-foreground">استرح جسمك، اشرب ماء كثير، ونم كويس 💪</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {currentDay.exercises.map((exercise, idx) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedExercise(
                    expandedExercise === exercise.id ? null : exercise.id
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-display font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-display font-bold">{exercise.name}</p>
                        <p className="text-xs text-muted-foreground">{exercise.muscle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {exercise.sets}×{exercise.reps}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300
                        ${expandedExercise === exercise.id ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedExercise === exercise.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-border space-y-4">
                          {/* Animation */}
                          {exercise.images && exercise.images.length > 0 && (
                            <AnimatedExercise images={exercise.images} className="h-56 mt-2 mb-4 w-full" />
                          )}

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="glass-panel p-3 rounded-lg">
                              <p className="text-xs text-muted-foreground">مجموعات</p>
                              <p className="font-display font-extrabold text-lg">{exercise.sets}</p>
                            </div>
                            <div className="glass-panel p-3 rounded-lg">
                              <p className="text-xs text-muted-foreground">تكرارات</p>
                              <p className="font-display font-extrabold text-lg">{exercise.reps}</p>
                            </div>
                            <div className="glass-panel p-3 rounded-lg">
                              <p className="text-xs text-muted-foreground">راحة</p>
                              <p className="font-display font-extrabold text-lg">{exercise.restSeconds}s</p>
                            </div>
                          </div>

                          {/* Instructions */}
                          <div className="glass-panel rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <ListChecks className="w-4 h-4 text-primary" />
                              <p className="font-display font-bold text-sm">طريقة الأداء</p>
                            </div>
                            <ol className="space-y-2">
                              {exercise.instructions.map((inst, i) => (
                                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
                                    {i + 1}
                                  </span>
                                  <span>{inst}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Common Mistakes */}
                          <div className="glass-panel rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertTriangle className="w-4 h-4 text-destructive" />
                              <p className="font-display font-bold text-sm">أخطاء شائعة تجنبها</p>
                            </div>
                            <ul className="space-y-2">
                              {exercise.commonMistakes.map((mistake, i) => (
                                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                                  <span className="flex-shrink-0 text-destructive text-xs mt-0.5">✕</span>
                                  <span>{mistake}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Rest Timer Button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); startRest(exercise.restSeconds); }}
                            className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm
                              flex items-center justify-center gap-2 hover:brightness-125 transition-all"
                          >
                            <Timer className="w-4 h-4" />
                            ابدأ مؤقت الراحة
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
