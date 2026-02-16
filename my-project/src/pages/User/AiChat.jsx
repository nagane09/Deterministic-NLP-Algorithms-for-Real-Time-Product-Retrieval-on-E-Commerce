import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { sendAiMessage } from "../../api/ai";
import ProductCard from "../../components/shop/ProductCard";
import { Send, Bot, User, Sparkles, Loader2, Maximize2, Minimize2, X, MessageSquare } from "lucide-react";

const AiChat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false); 
  const [isFullPage, setIsFullPage] = useState(false); 
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi! I'm your GreenCart Assistant. Need help finding fresh items?" },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setIsOpen(true);
      handleSendMessage(null, query);
      setSearchParams({}); 
    }
  }, [searchParams]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (e, queryOverride = null) => {
    if (e) e.preventDefault();
    const text = queryOverride || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendAiMessage(text);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: response.data.reply,
          products: response.data.products || [],
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I'm having trouble connecting right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition-all hover:scale-110 z-[999]"
      >
        <MessageSquare size={28} />
      </button>
    );
  }

  const containerStyle = isFullPage
    ? "fixed inset-0 z-[1000] bg-white flex flex-col"
    : "fixed bottom-6 right-6 z-[1000] w-[380px] h-[550px] bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200 flex flex-col animate-in slide-in-from-bottom-5";

  return (
    <div className={containerStyle}>
      <div className="bg-green-600 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-green-200" />
          <h2 className="font-bold text-sm">GreenCart AI Assistant</h2>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsFullPage(!isFullPage)} className="p-2 hover:bg-green-700 rounded-lg">
            {isFullPage ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button onClick={() => { setIsOpen(false); setIsFullPage(false); }} className="p-2 hover:bg-green-700 rounded-lg">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[90%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "ai" ? "bg-green-100 text-green-600" : "bg-blue-600 text-white"}`}>
                {msg.role === "ai" ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className="space-y-3">
                <div className={`p-3 rounded-2xl shadow-sm text-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"}`}>
                  {msg.content}
                </div>
                {msg.products && msg.products.length > 0 && (
                  <div className={`grid gap-3 mt-2 ${isFullPage ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
                    {msg.products.map((p) => (
                      <ProductCard key={p.id} product={{ _id: p.id, name: p.name, price: p.price, images: [p.image], description: p.description }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start gap-3 items-center text-gray-400 italic text-xs">
            <Loader2 className="animate-spin text-green-600" size={16} /> AI searching...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI..."
          className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm"
        />
        <button type="submit" disabled={loading || !input.trim()} className="bg-green-600 text-white p-2 rounded-xl hover:bg-green-700">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default AiChat;