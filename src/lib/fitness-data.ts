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
  videoId: string; // YouTube video ID
}

export interface WorkoutDay {
  day: string;
  name: string;
  exercises: Exercise[];
}

const allExercises: Record<string, Exercise> = {
  benchPress: {
    id: '1', name: 'بنش بريس', sets: 4, reps: '8-10', muscle: 'صدر', restSeconds: 90,
    instructions: [
      'استلقِ على البنش مع ثبات القدمين على الأرض',
      'امسك البار بعرض أوسع قليلاً من الكتفين',
      'أنزل البار ببطء حتى يلمس منتصف الصدر',
      'ادفع البار للأعلى بقوة مع الزفير',
    ],
    commonMistakes: [
      'رفع المؤخرة عن البنش أثناء الدفع',
      'ارتداد البار عن الصدر بدل التحكم',
      'قفل المرفقين بالكامل في الأعلى',
      'عدم ثبات لوح الكتف على البنش',
    ],
    videoId: 'rT7DgCr-3pg',
  },
  inclineDumbbell: {
    id: '2', name: 'بنش مائل بالدمبل', sets: 3, reps: '10-12', muscle: 'صدر علوي', restSeconds: 75,
    instructions: [
      'اضبط البنش على زاوية 30-45 درجة',
      'امسك الدمبلز بجانب الصدر مع ثني المرفقين',
      'ادفع للأعلى مع تقريب الدمبلز من بعض في القمة',
      'أنزل ببطء مع التحكم الكامل',
    ],
    commonMistakes: [
      'زاوية البنش عالية جداً (تصبح كتف مش صدر)',
      'استخدام أوزان ثقيلة بدون تحكم',
      'عدم إنزال الدمبلز بشكل كافي',
    ],
    videoId: '8iPEnn-ltC8',
  },
  cableFlyes: {
    id: '3', name: 'كروس أوفر', sets: 3, reps: '12-15', muscle: 'صدر', restSeconds: 60,
    instructions: [
      'اضبط البكرات على مستوى أعلى من الكتف',
      'خذ خطوة للأمام مع ميل الجسم قليلاً',
      'اسحب الكابلات للأمام بحركة عناق',
      'ارجع ببطء مع الشعور بالتمدد في الصدر',
    ],
    commonMistakes: [
      'ثني المرفقين كثيراً (تصبح بريس)',
      'استخدام الجسم كله في السحب',
      'عدم الضغط في نهاية الحركة',
    ],
    videoId: 'taI4XduLpTk',
  },
  overheadPress: {
    id: '4', name: 'أوفرهيد بريس', sets: 4, reps: '8-10', muscle: 'كتف أمامي', restSeconds: 90,
    instructions: [
      'قف بثبات مع القدمين بعرض الكتفين',
      'امسك البار عند مستوى الكتف',
      'ادفع البار للأعلى فوق الرأس بخط مستقيم',
      'أنزل ببطء إلى مستوى الكتف',
    ],
    commonMistakes: [
      'تقويس الظهر بشكل مفرط',
      'دفع البار للأمام بدل فوق الرأس مباشرة',
      'عدم تثبيت الجذع (Core)',
    ],
    videoId: '_RlRDWO2jfg',
  },
  lateralRaise: {
    id: '5', name: 'رفرفة جانبية', sets: 3, reps: '12-15', muscle: 'كتف جانبي', restSeconds: 60,
    instructions: [
      'قف مع إمساك الدمبلز بجانب الجسم',
      'ارفع الذراعين جانبياً حتى مستوى الكتف',
      'حافظ على ثني خفيف في المرفقين',
      'أنزل ببطء مع التحكم',
    ],
    commonMistakes: [
      'رفع الأوزان بالزخم بدل العضلة',
      'رفع الكتفين (الترابس) أثناء الحركة',
      'الرفع فوق مستوى الكتف',
    ],
    videoId: '3VcKaXpzqRo',
  },
  tricepPushdown: {
    id: '6', name: 'تراي بوش داون', sets: 3, reps: '10-12', muscle: 'تراي', restSeconds: 60,
    instructions: [
      'قف أمام الكابل مع إمساك البار أو الحبل',
      'ثبت المرفقين بجانب الجسم',
      'ادفع للأسفل حتى استقامة الذراع',
      'ارجع ببطء دون تحريك المرفقين',
    ],
    commonMistakes: [
      'تحريك المرفقين للأمام والخلف',
      'الميل بالجسم على الوزن',
      'عدم الاستقامة الكاملة في الأسفل',
    ],
    videoId: '2-LAMcpzODU',
  },
  deadlift: {
    id: '7', name: 'ديد ليفت', sets: 4, reps: '6-8', muscle: 'ظهر', restSeconds: 120,
    instructions: [
      'قف مع القدمين بعرض الوركين والبار فوق منتصف القدم',
      'انحنِ مع إبقاء الظهر مستقيماً وامسك البار',
      'ادفع الأرض بقدميك وارفع البار بمحاذاة الجسم',
      'قف باستقامة تامة ثم أنزل بنفس المسار',
    ],
    commonMistakes: [
      'تقويس الظهر (أخطر خطأ)',
      'إبعاد البار عن الجسم',
      'رفع الوركين أسرع من الكتفين',
      'عدم تفعيل الـ Core',
    ],
    videoId: 'op9kVnSso6Q',
  },
  pullUp: {
    id: '8', name: 'بول أب', sets: 4, reps: '8-10', muscle: 'ظهر', restSeconds: 90,
    instructions: [
      'امسك البار بقبضة أوسع من الكتفين',
      'تعلق بالكامل مع فرد الذراعين',
      'اسحب جسمك للأعلى حتى يتجاوز الذقن البار',
      'أنزل ببطء مع التحكم الكامل',
    ],
    commonMistakes: [
      'التأرجح واستخدام الزخم',
      'عدم النزول بالكامل (نص حركة)',
      'إهمال تفعيل عضلات الظهر والاعتماد على الذراعين',
    ],
    videoId: 'eGo4IYlbE5g',
  },
  barbellRow: {
    id: '9', name: 'تجديف بالبار', sets: 3, reps: '10-12', muscle: 'ظهر وسط', restSeconds: 75,
    instructions: [
      'انحنِ للأمام بزاوية 45 درجة مع استقامة الظهر',
      'امسك البار بعرض الكتفين',
      'اسحب البار نحو البطن مع ضغط لوحي الكتف',
      'أنزل ببطء مع الشعور بالتمدد',
    ],
    commonMistakes: [
      'تقويس الظهر',
      'الوقوف بشكل عمودي تقريباً',
      'سحب البار للصدر بدل البطن',
    ],
    videoId: 'FWJR5Ve8bnQ',
  },
  facePull: {
    id: '10', name: 'فيس بول', sets: 3, reps: '12-15', muscle: 'كتف خلفي', restSeconds: 60,
    instructions: [
      'اضبط الكابل على مستوى الوجه',
      'امسك الحبل بقبضة محايدة',
      'اسحب نحو الوجه مع فتح المرفقين للخارج',
      'اضغط على الكتف الخلفي في نهاية الحركة',
    ],
    commonMistakes: [
      'استخدام وزن ثقيل جداً',
      'سحب الحبل للأسفل بدل مستوى الوجه',
      'عدم فتح المرفقين للخارج',
    ],
    videoId: 'rep-qVOkqgk',
  },
  barbellCurl: {
    id: '11', name: 'باي بالبار', sets: 3, reps: '10-12', muscle: 'باي', restSeconds: 60,
    instructions: [
      'قف باستقامة مع إمساك البار بعرض الكتفين',
      'ثبت المرفقين بجانب الجسم',
      'ارفع البار بانقباض الباي فقط',
      'أنزل ببطء مع مقاومة الجاذبية',
    ],
    commonMistakes: [
      'تأرجح الجسم للمساعدة في الرفع',
      'تحريك المرفقين للأمام',
      'إنزال الوزن بسرعة بدون تحكم',
    ],
    videoId: 'kwG2ipFRgFo',
  },
  hammerCurl: {
    id: '12', name: 'هامر كيرل', sets: 3, reps: '10-12', muscle: 'باي', restSeconds: 60,
    instructions: [
      'امسك الدمبلز بقبضة محايدة (الإبهام للأعلى)',
      'ارفع الدمبل بانقباض الباي مع ثبات المرفق',
      'يمكنك التبديل أو رفع الاثنين معاً',
      'أنزل ببطء مع التحكم',
    ],
    commonMistakes: [
      'تدوير المعصم أثناء الرفع',
      'استخدام الكتف في الرفع',
      'سرعة الحركة الزائدة',
    ],
    videoId: 'zC3nLlEvin4',
  },
  squat: {
    id: '13', name: 'سكوات', sets: 4, reps: '8-10', muscle: 'أرجل', restSeconds: 120,
    instructions: [
      'ضع البار على الترابس الخلفي (ليس الرقبة)',
      'القدمين بعرض أوسع قليلاً من الكتفين',
      'انزل حتى يصبح الفخذ موازياً للأرض أو أقل',
      'ادفع الأرض بكعبك للوقوف',
    ],
    commonMistakes: [
      'الركبة تتجاوز أصابع القدم بشكل مفرط',
      'رفع الكعب عن الأرض',
      'تقويس الظهر في الأسفل (Butt Wink)',
      'عدم النزول بالعمق الكافي',
    ],
    videoId: 'bEv6CCg2BC8',
  },
  legPress: {
    id: '14', name: 'ليج بريس', sets: 4, reps: '10-12', muscle: 'أرجل', restSeconds: 90,
    instructions: [
      'اجلس في الجهاز مع ثبات الظهر على المسند',
      'ضع القدمين بعرض الكتفين على المنصة',
      'أنزل المنصة ببطء حتى زاوية 90 درجة في الركبة',
      'ادفع للأعلى بدون قفل الركبتين',
    ],
    commonMistakes: [
      'قفل الركبتين بالكامل (خطير جداً)',
      'رفع المؤخرة عن المقعد',
      'وضع القدمين ضيق جداً',
    ],
    videoId: 'IZxyjW7MPJQ',
  },
  lunges: {
    id: '15', name: 'لانجز', sets: 3, reps: '10 لكل رجل', muscle: 'أرجل', restSeconds: 75,
    instructions: [
      'قف باستقامة مع دمبلز في كل يد',
      'خذ خطوة واسعة للأمام',
      'انزل حتى تلامس الركبة الخلفية الأرض تقريباً',
      'ادفع بالقدم الأمامية للرجوع',
    ],
    commonMistakes: [
      'خطوة قصيرة جداً (ضغط على الركبة)',
      'ميل الجسم للأمام',
      'عدم التوازن الجانبي',
    ],
    videoId: 'QOVaHwm-Q6U',
  },
  legCurl: {
    id: '16', name: 'ليج كيرل', sets: 3, reps: '10-12', muscle: 'خلفية', restSeconds: 60,
    instructions: [
      'استلقِ على جهاز الليج كيرل',
      'ثبت الوسادة فوق الكعب',
      'اثنِ الركبة واسحب الوسادة نحو المؤخرة',
      'ارجع ببطء مع المقاومة',
    ],
    commonMistakes: [
      'رفع الوركين عن المقعد',
      'استخدام الزخم بدل العضلة',
      'حركة جزئية (نص الحركة)',
    ],
    videoId: '1Tq3QdYUuHs',
  },
  legExtension: {
    id: '17', name: 'ليج اكستنشن', sets: 3, reps: '12-15', muscle: 'أمامية', restSeconds: 60,
    instructions: [
      'اجلس في الجهاز مع ثبات الظهر',
      'ضع الوسادة فوق مقدمة القدم',
      'افرد الركبة للأعلى بالكامل',
      'أنزل ببطء مع التحكم',
    ],
    commonMistakes: [
      'الحركة السريعة بدون تحكم',
      'عدم الفرد الكامل للركبة في الأعلى',
      'استخدام وزن ثقيل مع حركة جزئية',
    ],
    videoId: 'YyvSfVjQeL0',
  },
  calfRaise: {
    id: '18', name: 'كاف ريز', sets: 4, reps: '15-20', muscle: 'سمانة', restSeconds: 45,
    instructions: [
      'قف على حافة درجة أو جهاز السمانة',
      'ارفع جسمك على أطراف أصابعك',
      'اضغط في القمة لثانية',
      'أنزل ببطء حتى تشعر بالتمدد',
    ],
    commonMistakes: [
      'حركة سريعة بدون ضغط',
      'عدم النزول بالكامل للتمدد',
      'ثني الركبتين أثناء الحركة',
    ],
    videoId: 'gwLzBJYoWlI',
  },
};

export function generateWorkoutPlan(profile: UserProfile): WorkoutDay[] {
  const push = Object.values(allExercises).filter(e => ['1','2','3','4','5','6'].includes(e.id));
  const pull = Object.values(allExercises).filter(e => ['7','8','9','10','11','12'].includes(e.id));
  const legs = Object.values(allExercises).filter(e => ['13','14','15','16','17','18'].includes(e.id));

  const days = profile.trainingDays || 6;

  if (days === 3) {
    return [
      { day: 'السبت', name: 'دفع (صدر + كتف + تراي)', exercises: push },
      { day: 'الاثنين', name: 'سحب (ظهر + باي)', exercises: pull },
      { day: 'الأربعاء', name: 'أرجل', exercises: legs },
    ];
  }

  if (days === 4) {
    return [
      { day: 'السبت', name: 'دفع (صدر + كتف + تراي)', exercises: push },
      { day: 'الأحد', name: 'سحب (ظهر + باي)', exercises: pull },
      { day: 'الثلاثاء', name: 'أرجل', exercises: legs },
      { day: 'الخميس', name: 'دفع (صدر + كتف + تراي)', exercises: push },
    ];
  }

  if (days === 5) {
    return [
      { day: 'السبت', name: 'دفع (صدر + كتف + تراي)', exercises: push },
      { day: 'الأحد', name: 'سحب (ظهر + باي)', exercises: pull },
      { day: 'الاثنين', name: 'أرجل', exercises: legs },
      { day: 'الأربعاء', name: 'دفع (صدر + كتف + تراي)', exercises: push },
      { day: 'الخميس', name: 'سحب (ظهر + باي)', exercises: pull },
    ];
  }

  // 6 days (default)
  return [
    { day: 'السبت', name: 'دفع (صدر + كتف + تراي)', exercises: push },
    { day: 'الأحد', name: 'سحب (ظهر + باي)', exercises: pull },
    { day: 'الاثنين', name: 'أرجل', exercises: legs },
    { day: 'الأربعاء', name: 'دفع (صدر + كتف + تراي)', exercises: push },
    { day: 'الخميس', name: 'سحب (ظهر + باي)', exercises: pull },
    { day: 'الجمعة', name: 'أرجل', exercises: legs },
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
  { id: 'f2', name: 'أرز أبيض مطبوخ (100g)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, category: 'كربوهيدرات' },
  { id: 'f3', name: 'بيض مسلوق (حبة)', calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, category: 'بروتين' },
  { id: 'f4', name: 'موزة متوسطة', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1, category: 'فواكه' },
  { id: 'f5', name: 'زبادي يوناني (100g)', calories: 59, protein: 10, carbs: 3.6, fat: 0.7, fiber: 0, category: 'ألبان' },
  { id: 'f6', name: 'شوفان (100g)', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6, category: 'كربوهيدرات' },
  { id: 'f7', name: 'سلمون مشوي (100g)', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, category: 'بروتين' },
  { id: 'f8', name: 'أفوكادو (100g)', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 6.7, category: 'دهون صحية' },
  { id: 'f9', name: 'بطاطا حلوة مشوية (100g)', calories: 90, protein: 2, carbs: 21, fat: 0.1, fiber: 3, category: 'كربوهيدرات' },
  { id: 'f10', name: 'لوز (30g)', calories: 170, protein: 6, carbs: 6, fat: 15, fiber: 3.5, category: 'مكسرات' },
  { id: 'f11', name: 'تونة معلبة (100g)', calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0, category: 'بروتين' },
  { id: 'f12', name: 'خبز أسمر (شريحة)', calories: 69, protein: 3.6, carbs: 12, fat: 1, fiber: 1.9, category: 'كربوهيدرات' },
];
