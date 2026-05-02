import {useState, useRef, useEffect} from 'react';
import {useLocation} from 'react-router';
import {MessageSquare, Send, X, Bot, Sparkles, HelpCircle, Lightbulb} from 'lucide-react';

export default function AIAssistant() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<{role: 'user' | 'bot'; text: string}[]>([
    {role: 'bot', text: 'Ciao! Sono Seedy, il tuo assistente Proseed personalizzato. Come posso aiutarti oggi?'},
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [chat]);

  const handleSend = async (customMsg?: string) => {
    const msgToSend = customMsg || query;
    if (!msgToSend.trim()) return;

    setChat((prev) => [...prev, {role: 'user', text: msgToSend}]);
    setQuery('');
    setIsLoading(true);

    const botResponse = await getGardeningAdvice(msgToSend);
    setChat((prev) => [
      ...prev,
      {role: 'bot', text: botResponse || 'Mi dispiace, non sono riuscito a generare una risposta.'},
    ]);
    setIsLoading(false);
  };

  const options = [
    {label: 'Voglio assistenza', icon: <HelpCircle size={14} />, prompt: 'Vorrei ricevere assistenza tecnica riguardo i miei ordini o il sito.'},
    {label: 'Chiedi un consiglio', icon: <Lightbulb size={14} />, prompt: 'Mi daresti un consiglio esperto su quali semi piantare in questo periodo?'},
  ];

  const isOnPdp = location.pathname.startsWith('/products/');

  return (
    <div
      className={`fixed right-8 z-[100] transition-all duration-300 ${isOnPdp ? 'bottom-24' : 'bottom-8'} ${
        location.pathname === '/checkout' ? 'opacity-0 pointer-events-none' : ''
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#78c13b] text-white rounded-2xl shadow-2xl shadow-[#78c13b66] flex items-center justify-center hover:scale-110 transition-transform group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
        {isOpen ? (
          <X size={32} />
        ) : (
          <div className="relative">
            <MessageSquare size={32} />
            <Sparkles size={12} className="absolute -top-1 -right-1 animate-pulse" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[550px] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col animate-float">
          <div className="p-6 bg-[#2d4a13] text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Bot size={80} />
            </div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-12 h-12 bg-[#78c13b] rounded-2xl flex items-center justify-center shadow-lg">
                <Bot size={28} />
              </div>
              <div>
                <h4 className="font-black text-lg tracking-tight">Seedy</h4>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-[#78c13b] rounded-full animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black opacity-70">Esperto Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[#fcfdfa]">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#78c13b] text-white rounded-tr-none'
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-4 rounded-3xl rounded-tl-none flex space-x-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-[#78c13b] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#78c13b] rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-[#78c13b] rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-white border-t border-gray-50 space-y-4">
            {!isLoading && chat.length === 1 && (
              <div className="flex flex-col space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Scegli un&apos;opzione:
                </p>
                <div className="flex flex-wrap gap-2">
                  {options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(opt.prompt)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-[#78c13b1a] text-[#2d4a13] hover:text-[#78c13b] border border-gray-100 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-[#78c13b33] transition-all">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Scrivi qui il tuo messaggio..."
                className="flex-1 bg-transparent border-none outline-none px-3 text-sm font-medium text-gray-700 placeholder:text-gray-400"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !query.trim()}
                className={`p-3 rounded-xl transition-all ${
                  !query.trim() || isLoading
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#78c13b] text-white hover:bg-[#2d4a13] shadow-lg shadow-[#78c13b33]'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

async function getGardeningAdvice(query: string): Promise<string> {
  const responses: Record<string, string> = {
    default: `Grazie per la tua domanda su "${query}". Per consigli personalizzati sulla semina, visita la sezione Smart Garden dove trovi il calcolatore di semina personalizzato. Per assistenza ordini, contatta info@proseed.it.`,
  };
  const lower = query.toLowerCase();
  if (lower.includes('semi') || lower.includes('pianta') || lower.includes('coltiv')) {
    return 'Per scegliere i semi migliori, considera la stagione, il tuo clima e lo spazio disponibile. I nostri semi sono testati per alta germinabilità e sono disponibili in diverse varietà biologiche. Visita la sezione Collezioni per esplorare le categorie.';
  }
  if (lower.includes('ordine') || lower.includes('spediz') || lower.includes('reso')) {
    return 'Per informazioni sul tuo ordine, stato della spedizione o resi, consulta la sezione Assistenza in fondo alla pagina o contattaci via email a info@proseed.it.';
  }
  if (lower.includes('consigli') || lower.includes('aiut')) {
    return 'Ecco alcuni consigli pratici: 1) Inizia con varietà facili come basilico o pomodori ciliegino. 2) Usa terriccio di qualità. 3) Annaffia regolarmente ma senza eccessi. 4) Posiziona in un luogo con luce adeguata. 5) Segui le istruzioni sulla confezione per profondità e distanza di semina.';
  }
  return responses.default;
}
