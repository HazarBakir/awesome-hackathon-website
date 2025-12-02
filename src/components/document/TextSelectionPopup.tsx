import { useState, useEffect, useRef } from "react";
import { Sparkles, AlertCircle, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextSelectionPopupProps {
  onHighlight: (color: string) => void;
}

const HIGHLIGHT_COLORS = [
  {
    name: "Low",
    value: "#22c55e",
    class: "bg-[#22c55e]",
    hoverClass: "hover:bg-[#16a34a]",
    icon: Sparkles,
    iconColor: "text-slate-900",
    textClass: "text-[#4ade80]",
  },
  {
    name: "Medium",
    value: "#ea580c",
    class: "bg-[#ea580c]",
    hoverClass: "hover:bg-[#c2410c]",
    icon: AlertCircle,
    iconColor: "text-white",
    textClass: "text-[#fdba74]",
  },
  {
    name: "High",
    value: "#dc2626",
    class: "bg-[#dc2626]",
    hoverClass: "hover:bg-[#b91c1c]",
    icon: Flame,
    iconColor: "text-slate-900",
    textClass: "text-[#fca5a5]",
  },
];

export function TextSelectionPopup({ onHighlight }: TextSelectionPopupProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleSelectionChange() {
      const selection = window.getSelection();

      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setPosition(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const selectedText = selection.toString().trim();
      if (selectedText.length === 0) {
        setPosition(null);
        return;
      }

      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8,
      });
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("mouseup", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mouseup", handleSelectionChange);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
        }
        setPosition(null);
      }
    }

    if (position) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [position]);

  if (!position) return null;

  const handleColorClick = (color: string) => {
    onHighlight(color);
    setPosition(null);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  };

  return (
    <div
      ref={popupRef}
      className="fixed z-50 animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translateX(-50%)",
      }}
    >
      <div className="bg-background border border-border rounded-xl shadow-lg p-3 flex flex-row items-center gap-3">
        {HIGHLIGHT_COLORS.map((color) => {
          const Icon = color.icon;
          return (
            <button
              key={color.value}
              onClick={() => handleColorClick(color.value)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 border-transparent transition-all",
                "hover:border-foreground/20 hover:scale-105",
                "focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
              )}
              title={`${color.name} Priority`}
              aria-label={`Highlight with ${color.name} priority`}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                  color.class,
                  color.hoverClass
                )}
              >
                <Icon className={cn("w-5 h-5", color.iconColor)} />
              </div>
              <span className={cn("text-xs font-medium", color.textClass)}>
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
