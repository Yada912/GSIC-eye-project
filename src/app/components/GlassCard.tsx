export function GlassCard({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl backdrop-blur-xl border border-white/50 shadow-lg ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.5)",
        boxShadow: "0 8px 32px rgba(77, 166, 255, 0.1)",
      }}
    >
      {children}
    </div>
  );
}
