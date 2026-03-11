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

  const systemPrompt = `أنت مدرب رياضي وخبير تغذية ذكي في تطبيق اسمه FitPal.
الرد لازم يكون مختصر، عملي، ومحفز، وباللغة العربية (يفضل مصري خفيف).
تجنب الردود الطويلة والمقدمات الخشبية. ادخل في الموضوع على طول.

معلومات عن المستخدم:
- الهدف: ${profile?.goal === 'lose' ? 'خسارة وزن وتنشيف' : profile?.goal === 'gain' ? 'زيادة وزن وضخامة' : 'ثبات وزن'}
- الوزن: ${profile?.weight} كجم
- السعرات المستهدفة: ${needs?.calories}
- السعرات المستهلكة اليوم: ${Math.round(consumed)}
- السعرات المتبقية: ${needs ? needs.calories - Math.round(consumed) : 0}

لا تذكر الأرقام إلا لو المستخدم سأل أو مفيدة لاقتراح وجبة.`;

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
