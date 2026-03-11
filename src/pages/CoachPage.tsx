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
    <div className="max-w-2xl mx-auto flex flex-col h-[100dvh] pt-4 pb-20">
      <div className="px-4 flex items-center gap-3 mb-4 text-primary shrink-0">
        <div className="p-2 glass-panel rounded-xl">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">المساعد الذكي</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            جاهز للإجابة على أسئلتك
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-secondary text-foreground'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={`glass-panel p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary/10 border-primary/20 rounded-tl-none' 
                  : 'bg-secondary/20 rounded-tr-none'
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

      <div className="px-4 shrink-0 pb-2">
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar whitespace-nowrap mb-2">
            <button 
              onClick={() => handleQuickAction("إيه أحسن أكلة بعد التمرين؟")}
              className="bg-secondary/50 border border-white/5 px-3 py-1.5 rounded-full text-xs hover:bg-white/10"
            >
              أكل بعد التمرين؟
            </button>
            <button 
              onClick={() => handleQuickAction("فاضلي كام سعرة النهاردة وهاكل إيه بيهم؟")}
              className="bg-secondary/50 border border-white/5 px-3 py-1.5 rounded-full text-xs hover:bg-white/10"
            >
              اقتراح وجبة لسعراتي؟
            </button>
          </div>
        )}
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="اسأل الكابتن..."
            className="flex-1 bg-secondary/30 backdrop-blur-md border border-white/10 rounded-full px-5 py-3 pr-12 focus:outline-none focus:border-primary transition-colors text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute left-1 top-1 bottom-1 aspect-square bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 transition-all"
          >
            <Send className="w-4 h-4 -mr-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
