import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full backdrop-blur-xl border border-orange-200 flex items-center gap-2 shadow-lg"
      style={{ background: "rgba(255, 237, 213, 0.9)" }}
    >
      <WifiOff className="w-4 h-4 text-orange-600" />
      <span className="text-sm text-orange-700">You're offline</span>
    </div>
  );
}
