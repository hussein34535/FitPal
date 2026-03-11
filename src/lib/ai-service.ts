import { OpenRouter } from "@openrouter/sdk";
import { getProfile, getTodayFoodLog } from "./user-store";
import { calculateCalories } from "./fitness-data";

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const openrouter = new OpenRouter({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

export async function* getCoachStream(message: string, history: ChatMessage[]) {
  const profile = getProfile();
  const needs = profile ? calculateCalories(profile) : null;
  const foodLog = getTodayFoodLog();
  const consumed = foodLog.reduce((s, l) => s + (l.food.calories * l.quantity), 0);
  
  const systemPrompt = `أنت مدرب رياضي و خبير تغذية ذكي في تطبيق اسمه FitPal.
الرد لازم يكون مختصر، عملي، ومحفز، وباللغة العربية (يفضل مصري خفيف).
تجنب الردود الطويلة جداً والمقدمات الخشبية. ادخل في الموضوع على طول.

معلومات عن المستخدم حالياً:
الهدف: ${profile?.goal === 'lose' ? 'خسارة وزن وتنشيف' : profile?.goal === 'gain' ? 'زيادة وزن وضخامة' : 'ثبات وزن'}
الوزن: ${profile?.weight} كجم
السعرات المستهدفة اليومية: ${needs?.calories}
السعرات المستهلكة اليوم: ${Math.round(consumed)}
السعرات المتبقية اليوم: ${needs ? needs.calories - Math.round(consumed) : 0}

لا تذكر هذه الأرقام إلا إذا سألك المستخدم عنها أو كانت مفيدة لاقتراح وجبة مناسبة لسعراته المتبقية.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message }
  ];

  const stream = await openrouter.chat.send({
    model: "stepfun/step-3.5-flash:free",
    messages: messages as any,
    stream: true
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
