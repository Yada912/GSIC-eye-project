import { useNavigate } from "react-router";
import { Home, AlertCircle } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/ui/button";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full px-5 pt-12 pb-6 max-w-screen-sm mx-auto flex flex-col items-center justify-center">
      <GlassCard className="p-8 text-center w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-gradient-to-br from-orange-400 to-red-400">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-3xl mb-2">404</h1>
            <h2 className="text-xl mb-2">Page Not Found</h2>
            <p className="text-sm text-muted-foreground mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
