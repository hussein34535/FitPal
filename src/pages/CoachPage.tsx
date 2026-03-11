import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { getCoachStream, type ChatMessage } from '@/lib/ai-service';

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: 'أهلاً بيك يا بطل! أنا كابتنك الذكي في FitPal. أقدر أساعدك إزاي النهاردة؟ 💪'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Add a placeholder for the assistant's streaming response
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      const stream = getCoachStream(userMessage.content, messages.filter(m => m.role !== 'system'));
      let fullContent = '';

      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullContent;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'معلش حصلت مشكلة في الاتصال، جرب تسأل تاني بعد شوية. 😅' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (text: string) => {
    setInput(text);
  };

  return (
    <div className="fixed inset-0 top-16 bg-background flex flex-col z-[40]">
      {/* Header */}
      <div className="px-4 flex items-center gap-3 py-4 text-primary shrink-0 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="p-2 glass-panel rounded-xl">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold">المساعد الذكي</h1>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            جاهز للإجابة على أسئلتك اليوم
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 py-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                msg.role === 'user' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary text-foreground border border-white/10'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-xl ${
                msg.role === 'user' 
                  ? 'bg-primary/10 border border-primary/20 text-foreground ml-auto' 
                  : 'bg-secondary/30 border border-white/10 text-foreground mr-auto'
              }`}>
                {msg.content}
                {msg.content === '' && msg.role === 'assistant' && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-primary/70 animate-pulse" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Footer / Input */}
      <div className="px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] shrink-0 bg-gradient-to-t from-background via-background to-transparent">
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar whitespace-nowrap">
            <button 
              onClick={() => handleQuickAction("إيه أحسن أكلة بعد التمرين؟")}
              className="bg-secondary/50 border border-white/5 px-4 py-2 rounded-full text-xs hover:bg-white/10 transition-colors"
            >
              أكل بعد التمرين؟
            </button>
            <button 
              onClick={() => handleQuickAction("فاضلي كام سعرة النهاردة؟")}
              className="bg-secondary/50 border border-white/5 px-4 py-2 rounded-full text-xs hover:bg-white/10 transition-colors"
            >
              سعراتي المتبقية؟
            </button>
          </div>
        )}
        <div className="flex gap-2 relative group mb-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="اسأل الكابتن..."
            className="flex-1 bg-secondary/40 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:border-primary focus:bg-secondary/60 transition-all text-sm shadow-2xl"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute left-2 top-2 bottom-2 aspect-square bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all z-10"
          >
            <Send className="w-4 h-4 -mr-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
