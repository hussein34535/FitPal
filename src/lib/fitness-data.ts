export interface UserProfile {
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  trainingDays: 3 | 4 | 5 | 6;
}

export function calculateBMI(weight: number, height: number) {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  let category = '';
  
  if (bmi < 18.5) category = 'نحافة';
  else if (bmi < 25) category = 'وزن مثالي';
  else if (bmi < 30) category = 'وزن زائد';
  else category = 'سمنة';
  
  return { value: bmi.toFixed(1), category };
}

export function calculateBMR(profile: UserProfile) {
  if (profile.gender === 'male') {
    return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }
}

export function calculateCalories(profile: UserProfile) {
  const bmr = calculateBMR(profile);
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = bmr * multipliers[profile.activityLevel];
  const maintenance = Math.round(tdee);

  const goalAdjustment = {
    lose: -500,
    maintain: 0,
    gain: 400,
  };

  const calories = Math.round(tdee + goalAdjustment[profile.goal]);
  const protein = Math.round(profile.weight * (profile.goal === 'gain' ? 2.2 : 1.8));
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  const fiber = Math.round((calories / 1000) * 14);

  return { calories, protein, fat, carbs, fiber, maintenance, bmr: Math.round(bmr) };
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  muscle: string;
  restSeconds: number;
  instructions: string[];
  commonMistakes: string[];
  images?: string[];
}

export interface WorkoutDay {
  day: string;
  name: string;
  exercises: Exercise[];
}

export const allExercises: Record<string, Exercise> = {
  benchPress: {
    id: '1', name: 'بنش بريس', sets: 4, reps: '8-10', muscle: 'صدر', restSeconds: 90,
    instructions: ['استلقِ على البنش مع ثبات القدمين على الأرض', 'امسك البار بعرض أوسع قليلاً من الكتفين', 'أنزل البار ببطء حتى يلمس منتصف الصدر', 'ادفع البار للأعلى بقوة مع الزفير'],
    commonMistakes: ['رفع المؤخرة عن البنش أثناء الدفع', 'ارتداد البار عن الصدر بدل التحكم', 'قفل المرفقين بالكامل في الأعلى'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0025.gif']
  },
  inclineDumbbell: {
    id: '2', name: 'بنش مائل بالدمبل', sets: 3, reps: '10-12', muscle: 'صدر علوي', restSeconds: 75,
    instructions: ['اضبط البنش على زاوية 30-45 درجة', 'امسك الدمبلز بجانب الصدر', 'ادفع للأعلى مع التقريب في القمة'],
    commonMistakes: ['زاوية البنش عالية جداً', 'استخدام أوزان ثقيلة بدون تحكم'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0504.gif']
  },
  cableFlyes: {
    id: '3', name: 'كروس أوفر', sets: 3, reps: '12-15', muscle: 'صدر', restSeconds: 60,
    instructions: ['اضبط البكرات على مستوى أعلى من الكتف', 'اسحب الكابلات للأمام بحركة عناق'],
    commonMistakes: ['ثني المرفقين كثيراً', 'استخدام الجسم كله في السحب'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0161.gif']
  },
  overheadPress: {
    id: '4', name: 'أوفرهيد بريس', sets: 4, reps: '8-10', muscle: 'كتف أمامي', restSeconds: 90,
    instructions: ['قف بثبات مع البار عند مستوى الكتف', 'ادفع البار للأعلى فوق الرأس'],
    commonMistakes: ['تقويس الظهر بشكل مفرط', 'دفع البار للأمام بدل فوق الرأس'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0765.gif']
  },
  lateralRaise: {
    id: '5', name: 'رفرفة جانبية', sets: 3, reps: '12-15', muscle: 'كتف جانبي', restSeconds: 60,
    instructions: ['ارفع الذراعين جانبياً حتى مستوى الكتف', 'حافظ على ثني خفيف في المرفقين'],
    commonMistakes: ['رفع الأوزان بالزخم', 'الرفع فوق مستوى الكتف'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0212.gif']
  },
  tricepPushdown: {
    id: '6', name: 'تراي بوش داون', sets: 3, reps: '10-12', muscle: 'تراي', restSeconds: 60,
    instructions: ['ثبت المرفقين بجانب الجسم', 'ادفع للأسفل حتى استقامة الذراع'],
    commonMistakes: ['تحريك المرفقين للأمام والخلف', 'الميل بالجسم على الوزن'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1210.gif']
  },
  deadlift: {
    id: '7', name: 'ديد ليفت', sets: 4, reps: '6-8', muscle: 'ظهر', restSeconds: 120,
    instructions: ['قف مع البار فوق منتصف القدم', 'ارفع البار بمحاذاة الجسم'],
    commonMistakes: ['تقويس الظهر', 'إبعاد البار عن الجسم'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0032.gif']
  },
  pullUp: {
    id: '8', name: 'بول أب', sets: 4, reps: '8-10', muscle: 'ظهر', restSeconds: 90,
    instructions: ['تعلق بالكامل واسحب جسمك للأعلى', 'أنزل ببطء مع التحكم'],
    commonMistakes: ['التأرجح واستخدام الزخم', 'عدم النزول بالكامل'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0652.gif']
  },
  barbellRow: {
    id: '9', name: 'تجديف بالبار', sets: 3, reps: '10-12', muscle: 'ظهر وسط', restSeconds: 75,
    instructions: ['انحنِ للأمام بزاوية 45 درجة', 'اسحب البار نحو البطن'],
    commonMistakes: ['تقويس الظهر', 'سحب البار للصدر بدل البطن'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0027.gif']
  },
  facePull: {
    id: '10', name: 'فيس بول', sets: 3, reps: '12-15', muscle: 'كتف خلفي', restSeconds: 60,
    instructions: ['اسحب نحو الوجه مع فتح المرفقين للخارج', 'اضغط على الكتف الخلفي'],
    commonMistakes: ['استخدم وزن ثقيل جداً', 'عدم فتح المرفقين للخارج'],
    images: ['https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/0.jpg', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/1.jpg']
  },
  barbellCurl: {
    id: '11', name: 'باي بالبار', sets: 3, reps: '10-12', muscle: 'باي', restSeconds: 60,
    instructions: ['ثبت المرفقين وارفع البار بانقباض الباي', 'أنزل ببطء مع المقاومة'],
    commonMistakes: ['تأرجح الجسم', 'تحريك المرفقين للأمام'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0285.gif']
  },
  hammerCurl: {
    id: '12', name: 'هامر كيرل', sets: 3, reps: '10-12', muscle: 'باي', restSeconds: 60,
    instructions: ['امسك الدمبلز بقبضة محايدة', 'ارفع الدمبل بانقباض الباي'],
    commonMistakes: ['تدوير المعصم', 'استخدام الزخم'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0313.gif']
  },
  squat: {
    id: '13', name: 'سكوات', sets: 4, reps: '8-10', muscle: 'أرجل', restSeconds: 120,
    instructions: ['انزل حتى يصبح الفخذ موازياً للأرض', 'ادفع الأرض بكعبك للوقوف'],
    commonMistakes: ['رفع الكعب عن الأرض', 'تقويس الظهر في الأسفل'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0047.gif']
  },
  legPress: {
    id: '14', name: 'ليج بريس', sets: 4, reps: '10-12', muscle: 'أرجل', restSeconds: 90,
    instructions: ['أنزل المنصة ببطء حتى زاوية 90 درجة', 'ادفع للأعلى بدون قفل الركبة'],
    commonMistakes: ['قفل الركبة في الأعلى', 'رفع المؤخرة عن المقعد'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0593.gif']
  },
  lunges: {
    id: '15', name: 'لانجز', sets: 3, reps: '10 لكل رجل', muscle: 'أرجل', restSeconds: 75,
    instructions: ['خذ خطوة واسعة للأمام', 'انزل حتى تلامس الركبة الخلفية الأرض'],
    commonMistakes: ['خطوة قصيرة جداً', 'عدم التوزان'],
  },
  legCurl: {
    id: '16', name: 'ليج كيرل', sets: 3, reps: '10-12', muscle: 'خلفية', restSeconds: 60,
    instructions: ['اثنِ الركبة واسحب الوسادة نحو المؤخرة', 'ارجع ببطء مع المقاومة'],
    commonMistakes: ['رفع الوركين عن المقعد', 'سرعة الحركة'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0582.gif']
  },
  legExtension: {
    id: '17', name: 'ليج اكستنشن', sets: 3, reps: '12-15', muscle: 'أمامية', restSeconds: 60,
    instructions: ['افرد الركبة للأعلى بالكامل', 'أنزل ببطء مع التحكم'],
    commonMistakes: ['الحركة السريعة', 'استخدام وزن ثقيل مع حركة جزئية'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0585.gif']
  },
  calfRaise: {
    id: '18', name: 'كاف ريز', sets: 4, reps: '15-20', muscle: 'سمانة', restSeconds: 45,
    instructions: ['ارفع جسمك على أطراف أصابعك', 'أنزل ببطء حتى تشعر بالتمدد'],
    commonMistakes: ['حركة سريعة بدون ضغط', 'عدم النزول بالكامل'],
    images: ['https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0542.gif']
  },
};

export function generateWorkoutPlan(profile: UserProfile): WorkoutDay[] {
  const push = [allExercises.benchPress, allExercises.inclineDumbbell, allExercises.cableFlyes, allExercises.overheadPress, allExercises.lateralRaise, allExercises.tricepPushdown];
  const pull = [allExercises.deadlift, allExercises.pullUp, allExercises.barbellRow, allExercises.facePull, allExercises.barbellCurl, allExercises.hammerCurl];
  const legs = [allExercises.squat, allExercises.legPress, allExercises.lunges, allExercises.legCurl, allExercises.legExtension, allExercises.calfRaise];

  const days = profile.trainingDays || 6;
  if (days === 3) {
    return [{ day: 'السبت', name: 'دفع', exercises: push }, { day: 'الاثنين', name: 'سحب', exercises: pull }, { day: 'الأربعاء', name: 'أرجل', exercises: legs }];
  }
  if (days === 4) {
    return [{ day: 'السبت', name: 'دفع', exercises: push }, { day: 'الأحد', name: 'سحب', exercises: pull }, { day: 'الثلاثاء', name: 'أرجل', exercises: legs }, { day: 'الخميس', name: 'دفع', exercises: push }];
  }
  if (days === 5) {
    return [{ day: 'السبت', name: 'دفع', exercises: push }, { day: 'الأحد', name: 'سحب', exercises: pull }, { day: 'الاثنين', name: 'أرجل', exercises: legs }, { day: 'الأربعاء', name: 'دفع', exercises: push }, { day: 'الخميس', name: 'سحب', exercises: pull }];
  }
  return [
    { day: 'السبت', name: 'دفع', exercises: push }, { day: 'الأحد', name: 'سحب', exercises: pull }, { day: 'الاثنين', name: 'أرجل', exercises: legs },
    { day: 'الأربعاء', name: 'دفع', exercises: push }, { day: 'الخميس', name: 'سحب', exercises: pull }, { day: 'الجمعة', name: 'أرجل', exercises: legs }
  ];
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category: string;
}

export const foodDatabase: FoodItem[] = [
  { id: 'f1', name: 'صدر دجاج مشوي (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: 'بروتين' },
  { id: 'f7', name: 'سلمون مشوي (100g)', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, category: 'بروتين' },
  { id: 'f3', name: 'بيض مسلوق (حبة)', calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, category: 'بروتين' },
  { id: 'f11', name: 'تونة معلبة (100g)', calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0, category: 'بروتين' },
  { id: 'f5', name: 'زبادي يوناني (100g)', calories: 59, protein: 10, carbs: 3.6, fat: 0.7, fiber: 0, category: 'ألبان' },
  { id: 'f13', name: 'فول مدمس (100g)', calories: 110, protein: 8, carbs: 20, fat: 0.5, fiber: 7, category: 'بروتين نباتي' },
  { id: 'f14', name: 'طعمية (حبة متوسطة)', calories: 80, protein: 3, carbs: 8, fat: 4, fiber: 2, category: 'بروتين نباتي' },
  { id: 'f2', name: 'أرز أبيض مطبوخ (100g)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, category: 'كربوهيدرات' },
  { id: 'f6', name: 'شوفان (100g)', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6, category: 'كربوهيدرات' },
  { id: 'f9', name: 'بطاطا حلوة مشوية (100g)', calories: 90, protein: 2, carbs: 21, fat: 0.1, fiber: 3, category: 'كربوهيدرات' },
  { id: 'f12', name: 'خبز أسمر (شريحة)', calories: 69, protein: 3.6, carbs: 12, fat: 1, fiber: 1.9, category: 'كربوهيدرات' },
  { id: 'f15', name: 'مكرونة مسلوقة (100g)', calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.2, category: 'كربوهيدرات' },
  { id: 'f16', name: 'رغيف عيش بلدي', calories: 250, protein: 8, carbs: 50, fat: 1.5, fiber: 4, category: 'كربوهيدرات' },
  { id: 'f4', name: 'موزة متوسطة', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1, category: 'فواكه' },
  { id: 'f17', name: 'تفاحة متوسطة', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, category: 'فواكه' },
  { id: 'f18', name: 'خيار (100g)', calories: 15, protein: 0.6, carbs: 3.6, fat: 0.1, fiber: 0.5, category: 'خضروات' },
  { id: 'f19', name: 'طماطم (100g)', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, category: 'خضروات' },
  { id: 'f20', name: 'سبانخ مطبوخة (100g)', calories: 23, protein: 3, carbs: 4, fat: 0.4, fiber: 2.4, category: 'خضروات' },
  { id: 'f8', name: 'أفوكادو (100g)', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 6.7, category: 'دهون صحية' },
  { id: 'f10', name: 'لوز (30g)', calories: 170, protein: 6, carbs: 6, fat: 15, fiber: 3.5, category: 'مكسرات' },
  { id: 'f21', name: 'زيت زيتون (ملعقة كبيرة)', calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0, category: 'دهون صحية' },
];

export interface MealPlan {
  id: string;
  name: string;
  target: 'تنشيف' | 'ضخامة' | 'ثبات';
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: { name: string; foodId: string; quantity: number; }[];
}

export const mealPlans: MealPlan[] = [
  { id: 'mp1', name: 'تنشيف متقدم', target: 'تنشيف', totalCalories: 1500, protein: 150, carbs: 100, fat: 55, meals: [{ name: 'فطار', foodId: 'f6', quantity: 0.5 }, { name: 'غداء', foodId: 'f1', quantity: 2 }] },
  { id: 'mp2', name: 'ضخامة نظيفة', target: 'ضخامة', totalCalories: 3000, protein: 180, carbs: 350, fat: 90, meals: [{ name: 'فطار', foodId: 'f6', quantity: 1.5 }, { name: 'غداء', foodId: 'f1', quantity: 2.5 }] },
];
