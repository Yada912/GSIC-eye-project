import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Send, User, Clock } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: "user" | "professional";
  timestamp: Date;
}

export function ProfessionalChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [professional] = useState({
    name: "Dr. Sarah Chen",
    specialty: "Optometrist",
    available: true,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check auth
    const user = localStorage.getItem("eyecare_user");
    if (!user) {
      navigate("/login", { state: { returnTo: "/professional" } });
      return;
    }

    // Load messages from localStorage
    const savedMessages = localStorage.getItem("professional_chat_messages");
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    } else {
      // Welcome message
      setMessages([
        {
          id: "1",
          text: "Hello! I'm Dr. Sarah Chen, an optometrist. How can I help you with your eye health today?",
          sender: "professional",
          timestamp: new Date(),
        },
      ]);
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("professional_chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Mock professional response
    setTimeout(() => {
      const responses = [
        "Thank you for sharing that. Can you tell me more about when this started?",
        "I understand your concern. Have you experienced any other symptoms?",
        "That's helpful information. I recommend scheduling an in-person examination to properly assess this.",
        "Based on what you've described, this could be related to eye strain. Do you spend a lot of time on screens?",
        "I'd like to better understand your symptoms. How long have you been experiencing this?",
      ];

      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "professional",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, response]);
    }, 1000 + Math.random() * 2000);
  };

  return (
    <div className="h-full flex flex-col max-w-screen-sm mx-auto">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 backdrop-blur-xl border-b border-white/50" style={{ background: "rgba(255, 255, 255, 0.5)" }}>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl hover:bg-white/50 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl">Professional Chat</h1>
          </div>
        </div>

        <GlassCard className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm">{professional.name}</h3>
              <p className="text-xs text-muted-foreground">{professional.specialty}</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-700">Online</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === "user"
                  ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                  : "backdrop-blur-xl border border-white/50"
              }`}
              style={
                message.sender === "professional"
                  ? { background: "rgba(255, 255, 255, 0.7)" }
                  : undefined
              }
            >
              <p className="text-sm">{message.text}</p>
              <div
                className={`flex items-center gap-1 mt-1 text-xs ${
                  message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                }`}
              >
                <Clock className="w-3 h-3" />
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-5 pb-6 pt-3 backdrop-blur-xl border-t border-white/50" style={{ background: "rgba(255, 255, 255, 0.5)" }}>
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 backdrop-blur-xl border-white/50 rounded-2xl"
            style={{ background: "rgba(255, 255, 255, 0.7)" }}
          />
          <Button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-5"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Response times may vary. For emergencies, call your local eye care provider.
        </p>
      </div>
    </div>
  );
}
