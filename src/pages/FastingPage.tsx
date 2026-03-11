import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { getFastingState, saveFastingState, FastingLog } from '@/lib/user-store';
import { Clock, Play, Square, Settings2 } from 'lucide-react';

export default function FastingPage() {
  const [fasting, setFasting] = useState<FastingLog>(getFastingState());
  const [now, setNow] = useState(Date.now());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    const newState: FastingLog = { ...fasting, status: 'fasting', startTime: Date.now() };
    setFasting(newState);
    saveFastingState(newState);
    setShowSettings(false);
  };

  const handleStop = () => {
    const newState: FastingLog = { ...fasting, status: 'stopped', startTime: null };
    setFasting(newState);
    saveFastingState(newState);
  };

  const handleTargetChange = (hours: number) => {
    const newState: FastingLog = { ...fasting, targetHours: hours };
    setFasting(newState);
    saveFastingState(newState);
  };

  // Calculate progress
  let progress = 0;
  let timeRemaining = '00:00:00';
  let isGoalReached = false;

  if (fasting.status === 'fasting' && fasting.startTime) {
    const elapsedMs = now - fasting.startTime;
    const targetMs = fasting.targetHours * 60 * 60 * 1000;
    
    progress = Math.min((elapsedMs / targetMs) * 100, 100);
    isGoalReached = elapsedMs >= targetMs;

    if (!isGoalReached) {
      const remainingMs = targetMs - elapsedMs;
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
      timeRemaining = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      timeRemaining = 'تم الوصول للهدف!';
    }
  }

  const radius = 120;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4 pb-24 space-y-6"
    >
      <div className="flex items-center justify-between mb-2 text-primary">
        <div className="flex items-center gap-3">
          <div className="p-2 glass-panel rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-display font-bold">الصيام المتقطع</h1>
        </div>
        
        {fasting.status === 'stopped' && (
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 glass-panel rounded-xl hover:bg-white/5 transition-colors"
          >
            <Settings2 className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSettings && fasting.status === 'stopped' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassCard className="p-4 mb-4">
              <h3 className="font-bold text-sm mb-3">اختر نمط الصيام:</h3>
              <div className="grid grid-cols-3 gap-2">
                {[12, 14, 16, 18, 20, 24].map(hours => (
                  <button
                    key={hours}
                    onClick={() => handleTargetChange(hours)}
                    className={`p-2 rounded-lg text-sm font-bold border transition-colors ${
                      fasting.targetHours === hours 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'border-white/10 hover:bg-white/5'
                    }`}
                  >
                    {hours}:{24 - hours}
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard className="p-8 flex flex-col items-center justify-center relative">
        <div className="relative w-[240px] h-[240px] flex items-center justify-center">
          {/* Background Circle */}
          <svg height="240" width="240" className="absolute inset-0 -rotate-90">
            <circle
              stroke="rgba(255,255,255,0.05)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress Circle */}
            <circle
              stroke={isGoalReached ? "#10b981" : "hsl(var(--primary))"}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>

          {/* Inner Content */}
          <div className="absolute flex flex-col items-center text-center">
            {fasting.status === 'fasting' ? (
              <>
                <p className="text-sm text-muted-foreground mb-1">
                  {isGoalReached ? 'انتهت مدة الصيام' : 'متبقي'}
                </p>
                <h2 className={`font-display font-black tracking-wider ${isGoalReached ? 'text-emerald-500 text-3xl' : 'text-5xl'}`}>
                  {timeRemaining}
                </h2>
                <p className="text-xs text-muted-foreground mt-2">
                  الهدف: {fasting.targetHours} ساعة
                </p>
              </>
            ) : (
              <>
                <Clock className="w-10 h-10 text-muted-foreground/30 mb-2" />
                <h2 className="text-3xl font-display font-black text-muted-foreground">
                  جاهز للصيام؟
                </h2>
                <p className="text-sm text-primary font-bold mt-1">
                  الهدف المختار: {fasting.targetHours} ساعة
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 mx-auto">
          {fasting.status === 'stopped' ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <Play className="w-5 h-5 fill-current" />
              ابدأ الصيام
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-destructive/20 text-destructive border border-destructive/50 font-bold hover:bg-destructive hover:text-destructive-foreground active:scale-95 transition-all"
            >
              <Square className="w-5 h-5 fill-current" />
              إنهاء الصيام
            </button>
          )}
        </div>
      </GlassCard>
      
      {fasting.status === 'fasting' && fasting.startTime && (
        <GlassCard className="p-4 flex justify-between items-center text-sm">
          <div>
            <p className="text-muted-foreground mb-1">وقت البدء</p>
            <p className="font-bold">{new Date(fasting.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="text-left">
            <p className="text-muted-foreground mb-1">وقت الانتهاء (الهدف)</p>
            <p className="font-bold">{new Date(fasting.startTime + fasting.targetHours * 60 * 60 * 1000).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </GlassCard>
      )}

    </motion.div>
  );
}
