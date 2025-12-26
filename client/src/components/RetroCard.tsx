import { cn } from "@/lib/utils";
import React from "react";

interface RetroCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "cyan" | "amber";
  title?: string;
}

export function RetroCard({ 
  children, 
  className, 
  variant = "default",
  title,
  ...props 
}: RetroCardProps) {
  const borderColor = {
    default: "border-white/10 hover:border-white/30",
    cyan: "border-sys-cyan/30 hover:border-sys-cyan/60 hover:shadow-[0_0_15px_rgba(111,232,255,0.15)]",
    amber: "border-sys-amber/30 hover:border-sys-amber/60 hover:shadow-[0_0_15px_rgba(255,201,94,0.15)]",
  };

  return (
    <div 
      className={cn(
        "glass-card relative overflow-hidden p-6 transition-all duration-300 group",
        borderColor[variant],
        className
      )}
      {...props}
    >
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Optional Title Bar */}
      {title && (
        <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
          <div className={cn("w-2 h-2 rounded-full", 
            variant === "cyan" ? "bg-sys-cyan shadow-[0_0_5px_#6FE8FF]" : 
            variant === "amber" ? "bg-sys-amber shadow-[0_0_5px_#FFC95E]" : "bg-white/50"
          )} />
          <h3 className="font-mono text-sm uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
            {title}
          </h3>
        </div>
      )}

      {children}
    </div>
  );
}
