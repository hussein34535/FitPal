import { getProfile, getTodayFoodLog } from "./user-store";
import { calculateCalories, type UserProfile } from "./fitness-data";

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;
const MODEL = "stepfun/step-3.5-flash:free";

export async function* getCoachStream(message: string, history: ChatMessage[], customProfile?: UserProfile) {
  const profile = customProfile || getProfile();
  const needs = profile ? calculateCalories(profile) : null;
  const foodLog = getTodayFoodLog();
  const consumed = foodLog.reduce((s, l) => s + (l.food.calories * l.quantity), 0);

  const systemPrompt = `أنت "كابتن FitPal"، مدرب رياضي مصري خبير ومحفز جداً.
المهمة: ساعد المستخدم في التغذية والتمارين بناءً على بياناته.

قواعد صارمة:
1. الرد بالعامية المصرية الخفيفة والشابة (يا بطل، يا وحش، عاش..).
2. الرد مختصر جداً ومباشر (Bullet points لو في وجبات).
3. ممنوع نهائياً تأليف كلمات غير مفهومة أو رموز غريبة.
4. لو سأل عن السعرات، استخدم الأرقام المذكورة بدقة.
5. لا تقترح وجبات خيالية، اقترح أكل واقعي (بيض، فول، دجاج، أرز، سلطة).

بيانات المستخدم الحالية (استخدمها فقط لو مفيدة):
- الهدف: ${profile?.goal === 'lose' ? 'خسارة وزن' : profile?.goal === 'gain' ? 'زيادة وزن' : 'ثبات'}
- السعرات المستهدفة: ${needs?.calories} سعرة
- المستهلك اليوم: ${Math.round(consumed)} سعرة
- المتبقي: ${needs ? needs.calories - Math.round(consumed) : 0} سعرة

ابدأ الرد فوراً بدون "أهلاً" لو الكلام في نص الدردشة.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10), // keep last 10 messages for context
    { role: 'user', content: message }
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`OpenRouter error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter(line => line.startsWith("data: "));

    for (const line of lines) {
      const data = line.slice(6);
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // skip malformed chunks
      }
    }
  }
}

export async function getCoachAssessment(profile: UserProfile): Promise<string> {
  const prompt = `أنت الكابتن، مدرب رياضي مصري/لبناني متحمس جداً. 
المستخدم لسه مخلص بياناته وعايزك تقيمه وتديله "مباركته" أو "Assessment" بدقائق قبل ما يبدأ.

بيانات المستخدم:
- الهدف: ${profile.goal}
- الوزن: ${profile.weight} كجم
- الطول: ${profile.height} سم
- العمر: ${profile.age} سنة
- مستوى النشاط: ${profile.activityLevel}
- أيام التمرين: ${profile.trainingDays} أيام في الأسبوع

المطلوب:
1. حلل البيانات بسرعة (BMI، احتياجه التقريبي).
2. اديله نصيحة ذهبية بخصوص هدفه (مثلاً لو عايز يخس، قوله ركز على البروتين والشبع، لو ضخامة قوله كبر عضلاتك بالأكل الصح).
3. خليك "كول" ومحفز جداً. اذكر أرقام محسوبة (السعرات التقريبية) وقوله إنك هتعدلها معاه لو احتاجنا.
4. الرد لازم يكون باللهجة المصرية/اللبنانية الدارجه، قصير (بحد أقصى 4 جمل)، ومليان تشجيع.
5. لا تستخدم لغة خشبية ولا تذكر أنك ذكاء اصطناعي.`;

  try {
    const stream = getCoachStream(prompt, [], profile);
    let fullText = "";
    for await (const chunk of stream) {
      fullText += chunk;
    }
    return fullText || "يا بطل، خطتك جاهزة ويلا بينا نكسر الدنيا! 💪";
  } catch (error) {
    console.error("Error getting coach assessment:", error);
    return "يا بطل، حصل مشكلة بسيطة بس مفيش حاجة توقفنا! خطتك جاهزة ويلا بينا نكسر الدنيا! 💪";
  }
}
