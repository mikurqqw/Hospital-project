import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, User, Bot, Trash2, Volume2, Square } from "lucide-react";
import { getChatHistory, clearChatHistory } from "../api/chat";
import { useAuthStore } from "../store/authStore";
import api from "../api/index";

const ChatbotPage = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getChatHistory();
        if (history.length === 0) {
          setMessages([
            {
              role: "assistant",
              content:
                "Здравствуйте! Я ваш ИИ-консультант. Расскажите о ваших симптомах, задайте вопрос о здоровье или травме, и я постараюсь помочь.",
            },
          ]);
        } else {
          setMessages(history);
        }
      } catch (error) {
        console.error("Ошибка загрузки истории", error);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // === СИСТЕМА ОЗВУЧКИ ===
  const speakText = (text) => {
    if (!("speechSynthesis" in window))
      return alert("Ваш браузер не поддерживает озвучку.");

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ru-RU";
    utterance.rate = 1.1; // Чуть быстрее обычного
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Остановка озвучки при уходе со страницы
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    window.speechSynthesis.cancel(); // Останавливаем речь при новом запросе
    setIsSpeaking(false);

    const userMsg = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMsg },
      { role: "assistant", content: "" },
    ]);
    setIsLoading(true);

    try {
      let token = "";
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) token = JSON.parse(authStorage)?.state?.token;

      const baseUrl = (
        api.defaults.baseURL || "http://127.0.0.1:8000/api"
      ).replace(/\/$/, "");
      const fetchUrl = `${baseUrl}/chat/message`;

      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!response.ok) throw new Error("Сетевая ошибка сервера");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunkText = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].content += chunkText;
          return newMsgs;
        });
      }
    } catch (error) {
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].content =
          "⚠️ Ошибка подключения к бэкенду.";
        return newMsgs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    if (window.confirm("Удалить историю?")) {
      await clearChatHistory();
      setMessages([{ role: "assistant", content: "История очищена." }]);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] py-8 px-4 overflow-hidden flex items-center justify-center">
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative z-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl flex flex-col h-[80vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/40">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-indigo-500 to-primary rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-textMain dark:text-textMainDark">
                AI Консультант
              </h2>
              <p className="flex items-center gap-2 text-sm text-textMuted">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
                Онлайн
              </p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="p-2 text-gray-400 transition-colors hover:text-red-500 hover:bg-red-50 rounded-xl"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-primary text-white" : "bg-white text-primary border border-gray-100"}`}
              >
                {msg.role === "user" ? (
                  user?.full_name?.charAt(0)?.toUpperCase() || (
                    <User size={20} />
                  )
                ) : (
                  <Bot size={20} />
                )}
              </div>

              <div className="flex flex-col items-start gap-1 max-w-[75%]">
                <div
                  className={`p-4 rounded-2xl ${msg.role === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-white text-textMain border border-gray-100 rounded-tl-sm shadow-sm"}`}
                >
                  {msg.content === "" && msg.role === "assistant" ? (
                    <div className="flex space-x-1.5 items-center h-5 px-2">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary/60"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary/60"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary/60"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                      />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
                      {msg.content}
                    </p>
                  )}
                </div>

                {/* Кнопка Озвучки для сообщений ИИ */}
                {msg.role === "assistant" && msg.content && (
                  <button
                    onClick={() => speakText(msg.content)}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-colors mt-1 ml-1"
                  >
                    {isSpeaking ? (
                      <>
                        <Square size={12} fill="currentColor" /> Остановить
                      </>
                    ) : (
                      <>
                        <Volume2 size={14} /> Озвучить
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t bg-white/40 border-gray-200/50">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Опишите вашу проблему..."
              disabled={isLoading}
              className="w-full py-4 pl-6 pr-16 transition-all bg-white border border-gray-200 shadow-sm outline-none rounded-2xl focus:ring-2 focus:ring-primary disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute p-3 text-white transition-colors right-2 bg-primary rounded-xl hover:bg-primaryHover disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatbotPage;
