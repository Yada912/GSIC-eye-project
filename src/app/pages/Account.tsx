import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Mail, Calendar, Trash2, LogOut, MessageCircle } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/ui/button";

export function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [chatHistory, setChatHistory] = useState({ professional: 0, chatbot: 0 });

  useEffect(() => {
    const userData = localStorage.getItem("eyecare_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Count chat messages
    const professionalChats = localStorage.getItem("professional_chat_messages");
    const chatbotChats = localStorage.getItem("chatbot_messages");

    setChatHistory({
      professional: professionalChats ? JSON.parse(professionalChats).length : 0,
      chatbot: chatbotChats ? JSON.parse(chatbotChats).length : 0,
    });
  }, []);

  const handleClearChatHistory = (type: "professional" | "chatbot" | "all") => {
    if (
      !confirm(
        `Are you sure you want to clear ${
          type === "all" ? "all" : type
        } chat history? This cannot be undone.`
      )
    ) {
      return;
    }

    if (type === "professional" || type === "all") {
      localStorage.removeItem("professional_chat_messages");
    }
    if (type === "chatbot" || type === "all") {
      localStorage.removeItem("chatbot_messages");
    }

    setChatHistory({
      professional: type === "chatbot" ? chatHistory.professional : 0,
      chatbot: type === "professional" ? chatHistory.chatbot : 0,
    });
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("eyecare_user");
      navigate("/");
    }
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? All data will be permanently removed. This cannot be undone."
      )
    ) {
      localStorage.removeItem("eyecare_user");
      localStorage.removeItem("professional_chat_messages");
      localStorage.removeItem("chatbot_messages");
      navigate("/");
    }
  };

  return (
    <div className="min-h-full px-5 pt-6 pb-6 max-w-screen-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-xl hover:bg-white/50 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl">Account</h1>
          <p className="text-sm text-muted-foreground">Manage your profile</p>
        </div>
      </div>

      {!user ? (
        <div className="space-y-4">
          <GlassCard className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="mb-2">Not Signed In</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in to access chat features and save your conversations.
                </p>
              </div>
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                Sign In / Sign Up
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <p className="text-xs text-center text-muted-foreground">
              You can still use the Eye Scanner, Health Guide, and Glossary without an account.
              Only chat features require sign-in.
            </p>
          </GlassCard>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Profile Info */}
          <GlassCard className="p-5">
            <h3 className="mb-4">Profile Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50">
                <User className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50">
                <Mail className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50">
                <Calendar className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="text-sm">{new Date(parseInt(user.id)).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Chat History */}
          <GlassCard className="p-5">
            <h3 className="mb-4">Chat History</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/50">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm">Professional Chat</p>
                    <p className="text-xs text-muted-foreground">
                      {chatHistory.professional} messages
                    </p>
                  </div>
                </div>
                {chatHistory.professional > 0 && (
                  <button
                    onClick={() => handleClearChatHistory("professional")}
                    className="text-xs text-red-600 hover:text-red-700 active:scale-95 transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/50">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-cyan-500" />
                  <div>
                    <p className="text-sm">AI Assistant</p>
                    <p className="text-xs text-muted-foreground">{chatHistory.chatbot} messages</p>
                  </div>
                </div>
                {chatHistory.chatbot > 0 && (
                  <button
                    onClick={() => handleClearChatHistory("chatbot")}
                    className="text-xs text-red-600 hover:text-red-700 active:scale-95 transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>

              {(chatHistory.professional > 0 || chatHistory.chatbot > 0) && (
                <Button
                  onClick={() => handleClearChatHistory("all")}
                  variant="outline"
                  className="w-full backdrop-blur-xl border-red-200 text-red-600 hover:bg-red-50"
                >
                  Clear All Chat History
                </Button>
              )}
            </div>
          </GlassCard>

          {/* Actions */}
          <GlassCard className="p-5">
            <h3 className="mb-4">Account Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full backdrop-blur-xl justify-start gap-3"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>

              <Button
                onClick={handleDeleteAccount}
                variant="outline"
                className="w-full backdrop-blur-xl border-red-200 text-red-600 hover:bg-red-50 justify-start gap-3"
              >
                <Trash2 className="w-5 h-5" />
                Delete Account
              </Button>
            </div>
          </GlassCard>

          {/* Info */}
          <GlassCard className="p-4">
            <p className="text-xs text-center text-muted-foreground">
              Your data is stored locally on your device. We don't collect any personal health
              information. All features are free with no payment required.
            </p>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
