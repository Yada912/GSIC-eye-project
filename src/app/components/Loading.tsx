import { Eye } from "lucide-react";

export function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 blur-xl opacity-50 animate-pulse" />
          <div className="relative p-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400">
            <Eye className="w-12 h-12 text-white animate-pulse" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Loading EyeCare...</p>
      </div>
    </div>
  );
}
