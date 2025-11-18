export function DotsBackground() {
    const dotColors = [
      "rgba(255,255,255,0.11)", 
      "rgba(220,220,220,0.06)",
      "rgba(255,255,255,0.13)",
    ];
  
    const circles = [];
    for (let y = 0; y < 3; ++y) {
      for (let x = 0; x < 3; ++x) {
        const colorIdx = (x + y) % dotColors.length;
        circles.push(
          <circle
            key={`${x}-${y}`}
            cx={5 + x * 24}
            cy={5 + y * 24}
            r="1.6"
            fill={dotColors[colorIdx]}
          />
        );
      }
    }
    return (
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        width="100%"
        height="100%"
        style={{
          minWidth: "100vw",
          minHeight: "100vh",
          opacity: 0.5,
          userSelect: "none",
        }}
      >
        <pattern
          id="hero-dots"
          x="0"
          y="0"
          width="72"
          height="72"
          patternUnits="userSpaceOnUse"
        >
          {circles}
        </pattern>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>
    );
  }