import { getProfile, getTodayFoodLog } from "./user-store";
import { calculateCalories } from "./fitness-data";

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;
const MODEL = "stepfun/step-3.5-flash:free";

export async function* getCoachStream(message: string, history: ChatMessage[]) {
  const profile = getProfile();
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
