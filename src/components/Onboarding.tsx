import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '@/lib/fitness-data';
import { saveProfile } from '@/lib/user-store';
import { GlassCard } from './GlassCard';
import { User, UserCheck, ArrowLeft, Flame, Scale, Ruler, Activity, Target, Calendar } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

type Step = 'gender' | 'age' | 'weight' | 'height' | 'goal' | 'activity' | 'trainingDays';

const stepOrder: Step[] = ['gender', 'age', 'weight', 'height', 'goal', 'activity', 'trainingDays'];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});

  const step = stepOrder[currentStep];
  const progress = ((currentStep + 1) / stepOrder.length) * 100;

  const next = () => {
    if (currentStep < stepOrder.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      saveProfile(profile as UserProfile);
      onComplete();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'gender': return !!profile.gender;
      case 'age': return !!profile.age && profile.age > 10 && profile.age < 100;
      case 'weight': return !!profile.weight && profile.weight > 20 && profile.weight < 300;
      case 'height': return !!profile.height && profile.height > 100 && profile.height < 250;
      case 'goal': return !!profile.goal;
      case 'activity': return !!profile.activityLevel;
      case 'trainingDays': return !!profile.trainingDays;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            {currentStep + 1} / {stepOrder.length}
          </span>
          <h1 className="font-display text-xl font-bold text-foreground">FitPal</h1>
        </div>
        <div className="w-full h-1 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {step === 'gender' && (
            <StepContainer title="اختر النوع" subtitle="لحساب احتياجاتك اليومية بدقة" icon={<User className="w-6 h-6" />}>
              <div className="grid grid-cols-2 gap-4">
                <GlassCard
                  strong={profile.gender === 'male'}
                  onClick={() => setProfile(p => ({ ...p, gender: 'male' }))}
                  className={`text-center ${profile.gender === 'male' ? 'border-primary burgundy-glow' : ''}`}
                >
                  <UserCheck className="w-10 h-10 mx-auto mb-3 text-foreground" />
                  <span className="font-display font-bold text-lg">ذكر</span>
                </GlassCard>
                <GlassCard
                  strong={profile.gender === 'female'}
                  onClick={() => setProfile(p => ({ ...p, gender: 'female' }))}
                  className={`text-center ${profile.gender === 'female' ? 'border-primary burgundy-glow' : ''}`}
                >
                  <User className="w-10 h-10 mx-auto mb-3 text-foreground" />
                  <span className="font-display font-bold text-lg">أنثى</span>
                </GlassCard>
              </div>
            </StepContainer>
          )}

          {step === 'age' && (
            <StepContainer title="كم عمرك؟" subtitle="العمر يؤثر على معدل الحرق" icon={<Flame className="w-6 h-6" />}>
              <NumberInput
                value={profile.age || 0}
                onChange={v => setProfile(p => ({ ...p, age: v }))}
                unit="سنة"
                min={12}
                max={99}
              />
            </StepContainer>
          )}

          {step === 'weight' && (
            <StepContainer title="كم وزنك؟" subtitle="بالكيلوجرام" icon={<Scale className="w-6 h-6" />}>
              <NumberInput
                value={profile.weight || 0}
                onChange={v => setProfile(p => ({ ...p, weight: v }))}
                unit="كجم"
                min={30}
                max={250}
              />
            </StepContainer>
          )}

          {step === 'height' && (
            <StepContainer title="كم طولك؟" subtitle="بالسنتيمتر" icon={<Ruler className="w-6 h-6" />}>
              <NumberInput
                value={profile.height || 0}
                onChange={v => setProfile(p => ({ ...p, height: v }))}
                unit="سم"
                min={120}
                max={230}
              />
            </StepContainer>
          )}

          {step === 'goal' && (
            <StepContainer title="ما هدفك؟" subtitle="اختر الهدف الأساسي" icon={<Target className="w-6 h-6" />}>
              <div className="space-y-3">
                {([
                  { value: 'lose', label: 'خسارة وزن', desc: 'تقليل الدهون والحصول على جسم مشدود' },
                  { value: 'maintain', label: 'ثبات الوزن', desc: 'الحفاظ على وزنك الحالي' },
                  { value: 'gain', label: 'زيادة وزن', desc: 'بناء عضلات وزيادة الكتلة' },
                ] as const).map(g => (
                  <GlassCard
                    key={g.value}
                    strong={profile.goal === g.value}
                    onClick={() => setProfile(p => ({ ...p, goal: g.value }))}
                    className={`${profile.goal === g.value ? 'border-primary burgundy-glow' : ''}`}
                  >
                    <p className="font-display font-bold text-lg">{g.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">{g.desc}</p>
                  </GlassCard>
                ))}
              </div>
            </StepContainer>
          )}

          {step === 'activity' && (
            <StepContainer title="مستوى النشاط" subtitle="اختر أقرب وصف لنشاطك اليومي" icon={<Activity className="w-6 h-6" />}>
              <div className="space-y-3">
                {([
                  { value: 'sedentary', label: 'خامل', desc: 'عمل مكتبي بدون تمارين' },
                  { value: 'light', label: 'نشاط خفيف', desc: 'تمارين 1-2 مرة أسبوعياً' },
                  { value: 'moderate', label: 'نشاط متوسط', desc: 'تمارين 3-5 مرات أسبوعياً' },
                  { value: 'active', label: 'نشيط', desc: 'تمارين 6-7 مرات أسبوعياً' },
                  { value: 'very_active', label: 'نشيط جداً', desc: 'تمارين مكثفة يومياً' },
                ] as const).map(a => (
                  <GlassCard
                    key={a.value}
                    strong={profile.activityLevel === a.value}
                    onClick={() => setProfile(p => ({ ...p, activityLevel: a.value }))}
                    className={`py-4 ${profile.activityLevel === a.value ? 'border-primary burgundy-glow' : ''}`}
                  >
                    <p className="font-display font-bold">{a.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                  </GlassCard>
                ))}
              </div>
            </StepContainer>
          )}

          {step === 'trainingDays' && (
            <StepContainer title="كم يوم تمرين؟" subtitle="اختر عدد أيام التمرين في الأسبوع" icon={<Calendar className="w-6 h-6" />}>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 3 as const, label: '3 أيام', desc: 'مناسب للمبتدئين' },
                  { value: 4 as const, label: '4 أيام', desc: 'توازن ممتاز' },
                  { value: 5 as const, label: '5 أيام', desc: 'للمتوسطين' },
                  { value: 6 as const, label: '6 أيام', desc: 'للمتقدمين' },
                ]).map(d => (
                  <GlassCard
                    key={d.value}
                    strong={profile.trainingDays === d.value}
                    onClick={() => setProfile(p => ({ ...p, trainingDays: d.value }))}
                    className={`text-center py-5 ${profile.trainingDays === d.value ? 'border-primary burgundy-glow' : ''}`}
                  >
                    <p className="font-display font-bold text-2xl">{d.value}</p>
                    <p className="font-display font-semibold text-sm mt-1">{d.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{d.desc}</p>
                  </GlassCard>
                ))}
              </div>
            </StepContainer>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      <motion.button
        onClick={next}
        disabled={!canProceed()}
        className="mt-8 w-full max-w-md h-14 rounded-lg bg-primary text-primary-foreground font-display font-bold text-lg
          disabled:opacity-30 disabled:cursor-not-allowed
          hover:brightness-125 active:scale-[0.98] transition-all duration-200"
        whileTap={{ scale: 0.97 }}
      >
        <span className="flex items-center justify-center gap-2">
          {currentStep === stepOrder.length - 1 ? 'ابدأ رحلتك' : 'التالي'}
          <ArrowLeft className="w-5 h-5" />
        </span>
      </motion.button>
    </div>
  );
}

function StepContainer({ title, subtitle, icon, children }: {
  title: string; subtitle: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <GlassCard className="p-8">
      <div className="flex items-center gap-3 mb-2 justify-center text-primary">
        {icon}
      </div>
      <h2 className="font-display font-extrabold text-2xl text-center mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">{subtitle}</p>
      {children}
    </GlassCard>
  );
}

function NumberInput({ value, onChange, unit, min, max }: {
  value: number; onChange: (v: number) => void; unit: string; min: number; max: number;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, (value || min) - 1))}
          className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-2xl font-display font-bold hover:bg-[hsla(0,0%,100%,0.1)] transition-colors"
        >
          −
        </button>
        <input
          type="number"
          value={value || ''}
          onChange={e => {
            const v = e.target.value === '' ? 0 : parseInt(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          className="w-28 h-16 text-center bg-transparent border-b-2 border-muted font-display text-4xl font-extrabold
            focus:border-primary focus:outline-none transition-colors text-foreground"
          placeholder="—"
        />
        <button
          onClick={() => onChange(Math.min(max, (value || min) + 1))}
          className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-2xl font-display font-bold hover:bg-[hsla(0,0%,100%,0.1)] transition-colors"
        >
          +
        </button>
      </div>
      <span className="text-muted-foreground text-sm">{unit}</span>
    </div>
  );
}
