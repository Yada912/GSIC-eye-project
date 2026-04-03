import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Send, Bot, Clock, Sparkles } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check auth
    const user = localStorage.getItem("eyecare_user");
    if (!user) {
      navigate("/login", { state: { returnTo: "/chatbot" } });
      return;
    }

    // Load messages from localStorage
    const savedMessages = localStorage.getItem("chatbot_messages");
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    } else {
      // Welcome message
      setMessages([
        {
          id: "1",
          text: "Hi! I'm your AI eye health assistant. I can answer questions about eye care, common conditions, prevention tips, and more. What would you like to know?",
          sender: "bot",
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
      localStorage.setItem("chatbot_messages", JSON.stringify(messages));
    }
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Knowledge base responses
    if (lowerMessage.includes("dry") && lowerMessage.includes("eye")) {
      return "Dry eyes can be caused by reduced tear production or increased tear evaporation. Common remedies include:\n\n• Use artificial tears or lubricating eye drops\n• Take regular breaks from screens (20-20-20 rule)\n• Stay hydrated\n• Use a humidifier\n• Avoid direct air from fans or AC\n\nIf symptoms persist, consult an eye care professional.";
    }

    if (lowerMessage.includes("screen") || lowerMessage.includes("computer")) {
      return "To reduce digital eye strain:\n\n• Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds\n• Adjust screen brightness to match surroundings\n• Position screen 20-26 inches from eyes\n• Reduce glare with proper lighting\n• Blink frequently\n• Consider blue light filtering glasses\n\nThese habits can significantly reduce eye fatigue!";
    }

    if (lowerMessage.includes("vitamin") || lowerMessage.includes("food") || lowerMessage.includes("diet")) {
      return "Foods beneficial for eye health include:\n\n• Leafy greens (spinach, kale) - rich in lutein\n• Carrots and sweet potatoes - high in beta-carotene\n• Fish (salmon, tuna) - omega-3 fatty acids\n• Citrus fruits - vitamin C\n• Nuts and seeds - vitamin E\n• Eggs - lutein and zeaxanthin\n\nA balanced diet supports overall eye health!";
    }

    if (lowerMessage.includes("cataract")) {
      return "Cataracts are a clouding of the eye's natural lens. Key facts:\n\n• Very common with aging\n• Symptoms: blurry vision, light sensitivity, faded colors\n• Treatment: Surgery is highly effective and safe\n• Prevention: UV protection, healthy diet, no smoking\n\nRegular eye exams help detect cataracts early.";
    }

    if (lowerMessage.includes("glaucoma")) {
      return "Glaucoma is increased eye pressure that can damage the optic nerve:\n\n• Often no early symptoms (\"silent thief of sight\")\n• Risk increases with age, family history\n• Regular eye exams are crucial for detection\n• Treatable with drops, laser, or surgery\n• Early detection prevents vision loss\n\nIf you're over 40 or have risk factors, get screened regularly.";
    }

    if (lowerMessage.includes("red") && lowerMessage.includes("eye")) {
      return "Red eyes can result from:\n\n• Dry eyes or irritation\n• Lack of sleep\n• Allergies\n• Eye strain\n• Conjunctivitis (pink eye)\n• More serious conditions (if severe)\n\nUse lubricating drops, get rest, and avoid rubbing. See a doctor if accompanied by pain, vision changes, or discharge.";
    }

    if (lowerMessage.includes("blur")) {
      return "Blurry vision can have many causes:\n\n• Need for glasses/prescription change\n• Digital eye strain\n• Dry eyes\n• Eye fatigue\n• Medical conditions (diabetes, etc.)\n\nIf blurriness persists or worsens, schedule an eye exam to determine the cause.";
    }

    // Default responses
    const defaultResponses = [
      "That's a great question! While I can provide general information, I recommend consulting with an eye care professional for personalized advice. Is there a specific aspect you'd like to know more about?",
      "I can help with that! For the most accurate and personalized guidance, please consider scheduling an appointment with an optometrist. In the meantime, would you like to know about preventive care or common symptoms?",
      "Thanks for asking! Eye health varies by individual. I recommend discussing this with your eye doctor for advice tailored to your needs. Would you like general information on eye care practices?",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    const userInput = inputText;
    setInputText("");
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(userInput),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const quickQuestions = [
    "How to prevent dry eyes?",
    "Tips for reducing screen strain",
    "What foods are good for eyes?",
    "Signs of cataracts",
  ];

  return (
    <div className="h-full flex flex-col max-w-screen-sm mx-auto">
      {/* Header */}
      <div
        className="px-5 pt-6 pb-4 backdrop-blur-xl border-b border-white/50"
        style={{ background: "rgba(255, 255, 255, 0.5)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl hover:bg-white/50 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl">AI Assistant</h1>
          </div>
        </div>

        <GlassCard className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm">EyeCare AI</h3>
              <p className="text-xs text-muted-foreground">Instant answers to your questions</p>
            </div>
            <Sparkles className="w-5 h-5 text-cyan-500" />
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
                message.sender === "bot"
                  ? { background: "rgba(255, 255, 255, 0.7)" }
                  : undefined
              }
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
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

        {isTyping && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-4 py-3 backdrop-blur-xl border border-white/50"
              style={{ background: "rgba(255, 255, 255, 0.7)" }}
            >
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-2 px-1">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText(question);
                  }}
                  className="text-xs px-3 py-2 rounded-full backdrop-blur-xl border border-white/50 hover:bg-white/50 active:scale-95 transition-all"
                  style={{ background: "rgba(255, 255, 255, 0.5)" }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="px-5 pb-6 pt-3 backdrop-blur-xl border-t border-white/50"
        style={{ background: "rgba(255, 255, 255, 0.5)" }}
      >
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything about eye health..."
            className="flex-1 backdrop-blur-xl border-white/50 rounded-2xl"
            style={{ background: "rgba(255, 255, 255, 0.7)" }}
          />
          <Button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-white px-5"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          AI responses are for informational purposes only. Consult a professional for medical
          advice.
        </p>
      </div>
    </div>
  );
}
