import type { FruitId } from "@/lib/fruits";

const INK = "#1D1B18";

interface Props {
  id: FruitId | "harvest";
  tone: string;
  className?: string;
  strokeWidth?: number;
}

function Leaf({ tone, sw }: { tone: string; sw: number }) {
  return (
    <path
      d="M53 27 C62 12 78 10 86 14 C82 28 68 33 55 31 Z"
      fill={tone}
      stroke={INK}
      strokeWidth={sw}
      strokeLinejoin="round"
    />
  );
}

export function FruitIcon({ id, tone, className, strokeWidth = 3.4 }: Props) {
  const sw = strokeWidth;
  const common = {
    stroke: INK,
    strokeWidth: sw,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 100 104"
      className={className}
      role="img"
      aria-hidden="true"
      fill="none"
    >
      {id === "love" && (
        <g {...common}>
          <path d="M41 30 L38 12 L47 21 L50 8 L54 21 L63 12 L60 30 Z" fill={tone} />
          <path d="M50 28 C70 28 84 44 84 62 C84 82 69 94 50 94 C31 94 16 82 16 62 C16 44 30 28 50 28 Z" fill={tone} />
          <path d="M30 55 C34 48 42 44 50 44" stroke="#ffffff" strokeOpacity="0.55" strokeWidth={sw + 1} fill="none" />
          <circle cx="38" cy="68" r="4.2" fill={INK} strokeWidth="0" />
          <circle cx="52" cy="76" r="4.2" fill={INK} strokeWidth="0" />
          <circle cx="64" cy="63" r="4.2" fill={INK} strokeWidth="0" />
          <circle cx="50" cy="58" r="3.4" fill={INK} strokeWidth="0" />
        </g>
      )}

      {id === "joy" && (
        <g {...common}>
          <path d="M50 30 L50 20" />
          <Leaf tone={tone} sw={sw} />
          <circle cx="50" cy="63" r="33" fill={tone} />
          <circle cx="50" cy="63" r="25" fill="#FFF6E9" fillOpacity="0.9" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="63"
              x2={50 + 25 * Math.cos((deg * Math.PI) / 180)}
              y2={63 + 25 * Math.sin((deg * Math.PI) / 180)}
              strokeWidth={sw - 0.8}
            />
          ))}
          <circle cx="50" cy="63" r="4" fill={tone} strokeWidth={sw - 1} />
        </g>
      )}

      {id === "peace" && (
        <g {...common}>
          <path d="M14 94 C28 70 46 46 88 22" strokeWidth={sw + 1} fill="none" />
          <ellipse cx="36" cy="66" rx="13" ry="6.4" fill={tone} transform="rotate(-38 36 66)" />
          <ellipse cx="55" cy="48" rx="13" ry="6.4" fill={tone} transform="rotate(-38 55 48)" />
          <ellipse cx="74" cy="33" rx="13" ry="6.4" fill={tone} transform="rotate(-38 74 33)" />
          <ellipse cx="52" cy="70" rx="13" ry="6.4" fill={tone} transform="rotate(22 52 70)" />
          <ellipse cx="70" cy="52" rx="13" ry="6.4" fill={tone} transform="rotate(22 70 52)" />
          <circle cx="34" cy="48" r="9" fill={tone} />
          <circle cx="60" cy="80" r="9" fill={tone} />
        </g>
      )}

      {id === "patience" && (
        <g {...common}>
          <path d="M50 22 L50 12" />
          <path d="M50 18 C40 8 26 10 22 16 C28 26 42 28 50 24 Z" fill={tone} />
          <path d="M50 22 C57 36 80 48 80 66 C80 83 66 95 50 95 C34 95 20 83 20 66 C20 48 43 36 50 22 Z" fill={tone} />
          <path d="M50 40 C55 50 68 58 68 70 C68 80 60 86 50 86 C40 86 32 80 32 70 C32 58 45 50 50 40 Z" fill="#FFF6E9" fillOpacity="0.55" strokeWidth={sw - 1.2} />
          <circle cx="44" cy="70" r="3" fill={INK} strokeWidth="0" />
          <circle cx="56" cy="70" r="3" fill={INK} strokeWidth="0" />
          <circle cx="50" cy="60" r="3" fill={INK} strokeWidth="0" />
        </g>
      )}

      {id === "kindness" && (
        <g {...common}>
          <path d="M50 30 L52 20" />
          <Leaf tone={tone} sw={sw} />
          <path d="M50 30 C71 30 86 46 86 64 C86 82 70 95 50 95 C30 95 14 82 14 64 C14 46 29 30 50 30 Z" fill={tone} />
          <path d="M50 31 C42 46 42 78 50 94" strokeWidth={sw - 0.6} fill="none" />
          <path d="M28 54 C31 46 38 41 45 40" stroke="#ffffff" strokeOpacity="0.6" strokeWidth={sw + 1} fill="none" />
        </g>
      )}

      {id === "goodness" && (
        <g {...common}>
          <path d="M50 34 C50 24 50 17 53 10" strokeWidth={sw + 0.4} fill="none" />
          <path d="M53 24 C62 11 78 10 86 14 C82 28 66 32 54 29 Z" fill={tone} />
          <path d="M50 36 C40 26 20 30 18 50 C16 70 30 95 50 95 C70 95 84 70 82 50 C80 30 60 26 50 36 Z" fill={tone} />
          <path d="M30 56 C32 47 38 42 44 41" stroke="#ffffff" strokeOpacity="0.6" strokeWidth={sw + 1.4} fill="none" />
        </g>
      )}

      {id === "faithfulness" && (
        <g {...common}>
          <path d="M50 34 L50 22" />
          <path d="M50 26 C60 12 76 12 84 16 C79 29 63 33 51 29 Z" fill={tone} />
          <circle cx="50" cy="44" r="11" fill={tone} />
          <circle cx="37" cy="58" r="11" fill={tone} />
          <circle cx="63" cy="58" r="11" fill={tone} />
          <circle cx="26" cy="72" r="11" fill={tone} />
          <circle cx="50" cy="72" r="11" fill={tone} />
          <circle cx="74" cy="72" r="11" fill={tone} />
          <circle cx="38" cy="87" r="11" fill={tone} />
          <circle cx="62" cy="87" r="11" fill={tone} />
        </g>
      )}

      {id === "gentleness" && (
        <g {...common}>
          <path d="M50 28 L51 18" />
          <Leaf tone={tone} sw={sw} />
          <path d="M50 26 C57 26 59 34 56 42 C72 50 80 64 80 76 C80 88 67 96 50 96 C33 96 20 88 20 76 C20 64 28 50 44 42 C41 34 43 26 50 26 Z" fill={tone} />
          <path d="M32 74 C33 65 38 58 45 55" stroke="#ffffff" strokeOpacity="0.55" strokeWidth={sw + 1} fill="none" />
        </g>
      )}

      {id === "selfcontrol" && (
        <g {...common}>
          <path d="M16 22 C36 30 64 30 84 20" strokeWidth={sw + 0.6} fill="none" />
          <path d="M50 27 L50 44" />
          <path d="M34 34 L38 50" />
          <path d="M66 34 L62 50" />
          <ellipse cx="38" cy="60" rx="10" ry="14" fill={tone} />
          <ellipse cx="62" cy="60" rx="10" ry="14" fill={tone} />
          <ellipse cx="50" cy="76" rx="10" ry="14" fill={tone} />
          <ellipse cx="27" cy="80" rx="9" ry="12.5" fill={tone} transform="rotate(-16 27 80)" />
          <ellipse cx="73" cy="80" rx="9" ry="12.5" fill={tone} transform="rotate(16 73 80)" />
          <ellipse cx="50" cy="50" rx="9" ry="12" fill={tone} />
        </g>
      )}

      {id === "harvest" && (
        <g {...common}>
          <circle cx="33" cy="40" r="15" fill="#E23744" />
          <circle cx="66" cy="42" r="13" fill="#F2900C" />
          <circle cx="50" cy="30" r="12" fill="#7154C4" />
          <ellipse cx="50" cy="58" rx="40" ry="8" fill="#F6EDDC" />
          <path d="M12 58 L20 94 C22 99 26 100 32 100 L68 100 C74 100 78 99 80 94 L88 58 Z" fill={tone} />
          <path d="M18 72 L83 72" strokeWidth={sw - 0.8} />
          <path d="M22 86 L79 86" strokeWidth={sw - 0.8} />
          <path d="M38 58 L42 100" strokeWidth={sw - 0.8} />
          <path d="M62 58 L59 100" strokeWidth={sw - 0.8} />
        </g>
      )}
    </svg>
  );
}

export default FruitIcon;
