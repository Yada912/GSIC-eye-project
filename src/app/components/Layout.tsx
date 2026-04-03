import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, Camera, MessageCircle, Bot, BookOpen, Book, User } from "lucide-react";
import { useEffect } from "react";
import { OfflineIndicator } from "./OfflineIndicator";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/scanner", icon: Camera, label: "Scanner" },
    { path: "/guide", icon: BookOpen, label: "Guide" },
    { path: "/glossary", icon: Book, label: "Glossary" },
    { path: "/account", icon: User, label: "Account" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Prevent body scroll on mobile
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100vh";
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <OfflineIndicator />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* iOS-style Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 h-20 border-t border-white/50 backdrop-blur-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          boxShadow: "0 -4px 24px rgba(77, 166, 255, 0.08)",
        }}
      >
        <div className="h-full max-w-screen-sm mx-auto flex items-center justify-around px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95"
              >
                <div
                  className={`p-2 rounded-2xl transition-all duration-300 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span
                  className={`text-[10px] transition-all duration-300 ${
                    active ? "text-primary opacity-100" : "text-muted-foreground opacity-70"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}