import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Send, Bot, Clock, Sparkles, AlertCircle } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Load knowledge base files from /chatbot-memory/
async function loadKnowledgeBase(): Promise<string> {
  const files = ["eye_conditions.txt", "general_tips.txt", "faq.txt"];
  const contents = await Promise.all(
    files.map((file) =>
      fetch(`/chatbot-memory/${file}`)
        .then((r) => (r.ok ? r.text() : ""))
        .catch(() => "")
    )
  );
  return contents.filter(Boolean).join("\n\n---\n\n");
}

// Call Gemini API with context
async function callGemini(
  userMessage: string,
  history: Message[],
  knowledgeBase: string,
  apiKey: string
): Promise<string> {
  const systemPrompt = `You are EyeCare AI, a friendly and knowledgeable eye health assistant for the EyeCare Companion app. 
Your role is to provide helpful, accurate information about eye health, conditions, prevention, and care tips.

IMPORTANT RULES:
- Always be warm, empathetic, and easy to understand
- Provide practical, actionable advice
- For serious symptoms (sudden vision loss, severe eye pain, floaters + flashes), always urge immediate professional care
- Never diagnose — instead, help users understand symptoms and when to seek care
- Keep responses concise but thorough (2-5 sentences or bullet points)
- This app is for awareness and education only — remind users to see professionals for diagnosis
- Use the knowledge base below as your primary source of information

KNOWLEDGE BASE:
${knowledgeBase}`;

  // Build conversation history for Gemini
  const conversationHistory = history.slice(-10).map((msg) => ({
    role: msg.sender === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [
          ...conversationHistory,
          { role: "user", parts: [{ text: userMessage }] },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
          topP: 0.9,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm sorry, I couldn't generate a response. Please try again.";
}

// Fallback local response when no API key is configured
function localResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("dry") && msg.includes("eye"))
    return "Dry eyes are caused by insufficient tear production or rapid evaporation. Try lubricating eye drops, blink frequently during screen use, use a humidifier, and stay hydrated. If symptoms persist, see an eye care professional.";
  if (msg.includes("screen") || msg.includes("computer"))
    return "For digital eye strain: Follow the 20-20-20 rule (every 20 minutes, look 20 feet away for 20 seconds), reduce screen glare, position your screen slightly below eye level, and blink frequently.";
  if (msg.includes("cataract"))
    return "Cataracts cause cloudy, blurry vision due to lens clouding — most commonly age-related. Early signs include glare sensitivity and faded colors. They're treatable with highly effective surgery. Schedule an eye exam if you notice these symptoms.";
  if (msg.includes("glaucoma"))
    return "Glaucoma damages the optic nerve, often from high eye pressure. It's the 'silent thief of sight' — usually no symptoms until advanced. Regular eye exams are crucial for early detection. It's treatable but not curable, so early detection matters greatly.";
  if (msg.includes("food") || msg.includes("diet") || msg.includes("vitamin"))
    return "Foods great for eye health: leafy greens (lutein), fatty fish like salmon (omega-3s), carrots and sweet potatoes (beta-carotene/vitamin A), citrus fruits (vitamin C), and nuts/seeds (vitamin E).";
  if (msg.includes("floater") || msg.includes("flash"))
    return "⚠️ If you suddenly experience many new floaters, flashes of light, or a shadow/curtain over your vision — this could be a retinal detachment. Please seek EMERGENCY eye care immediately. This is time-sensitive.";
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey"))
    return "Hi there! 👋 I'm your EyeCare AI assistant. I can help answer questions about eye conditions, prevention tips, when to see a doctor, and much more. What would you like to know?";

  return "That's a great question about eye health! For the most accurate and personalized guidance, I recommend consulting with an eye care professional. In the meantime, would you like to know about preventive care practices or specific symptoms? You can also check our Eye Conditions Glossary for more information.";
}

export function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<string>("");
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  useEffect(() => {
    // Check auth
    const user = localStorage.getItem("eyecare_user");
    if (!user) {
      navigate("/login", { state: { returnTo: "/chatbot" } });
      return;
    }

    if (!GEMINI_API_KEY) {
      setApiKeyMissing(true);
    }

    // Load knowledge base
    loadKnowledgeBase().then(setKnowledgeBase);

    // Load saved messages
    const saved = localStorage.getItem("chatbot_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch {
        setMessages([welcomeMessage()]);
      }
    } else {
      setMessages([welcomeMessage()]);
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

  function welcomeMessage(): Message {
    return {
      id: "welcome",
      text: GEMINI_API_KEY
        ? "Hi! I'm EyeCare AI, powered by Google Gemini. Ask me anything about eye health — conditions, prevention, symptoms, nutrition, and more! 👁️"
        : "Hi! I'm EyeCare AI. I can answer common questions about eye health. Note: For full AI capabilities, an API key needs to be configured. 👁️",
      sender: "bot",
      timestamp: new Date(),
    };
  }

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const userInput = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      let responseText: string;

      if (GEMINI_API_KEY && knowledgeBase) {
        responseText = await callGemini(userInput, messages, knowledgeBase, GEMINI_API_KEY);
      } else {
        // Simulate typing delay for local responses
        await new Promise((r) => setTimeout(r, 800 + Math.random() * 800));
        responseText = localResponse(userInput);
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `I encountered an issue connecting to the AI service. Please check your internet connection and try again. (${err?.message || "Unknown error"})`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    "How to prevent dry eyes?",
    "Tips for reducing screen strain",
    "What foods are good for eyes?",
    "Signs I need to see a doctor",
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
              <p className="text-xs text-muted-foreground">
                {GEMINI_API_KEY ? "Powered by Google Gemini" : "Knowledge-based responses"}
              </p>
            </div>
            <Sparkles className="w-5 h-5 text-cyan-500" />
          </div>
        </GlassCard>

        {/* API key warning */}
        {apiKeyMissing && (
          <div className="mt-2 flex items-center gap-2 text-xs text-amber-700 bg-amber-50/80 rounded-xl px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Gemini API key not configured — using built-in responses.</span>
          </div>
        )}
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
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]" />
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
                  onClick={() => setInputText(question)}
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
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
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
          AI responses are for informational purposes only. Consult a professional for medical advice.
        </p>
      </div>
    </div>
  );
}
