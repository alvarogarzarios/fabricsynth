// components/controls/BlendDial.tsx

const BLENDS = [
  { label: "Add",        code: "ADD" },
  { label: "Multiply",   code: "MUL" },
  { label: "Difference", code: "DIF" },
  { label: "Exclusion",  code: "EXC" },
  { label: "Blend",      code: "BLD" },
  { label: "Burn",       code: "BRN" },
  { label: "Hard Light", code: "HRD" },
  { label: "Soft Light", code: "SFT" },
  { label: "Overlay",    code: "OVL" },
  { label: "Screen",     code: "SCR" },
] as const;

type BlendValue = (typeof BLENDS)[number]["label"];

type Props = {
  value: string;
  onChange: (v: BlendValue) => void;
  className?: string;
};

export default function BlendDial({ value, onChange, className = "" }: Props) {
  return (
    <div className={className}>
      {/* Current selection label */}
      <div className="flex justify-end mb-1.5 ml-2 mr-0.5">
        <span className="text-[10px] text-neutral-500 font-victor tracking-widest uppercase">
          {value}
        </span>
      </div>

      {/* 5 × 2 compact grid */}
      <div className="grid grid-cols-5 gap-1">
        {BLENDS.map((blend) => {
          const isSelected = blend.label === value;
          return (
            <button
              key={blend.label}
              type="button"
              title={blend.label}
              onClick={() => onChange(blend.label)}
              className={`
                h-7 rounded-md text-[9px] font-black font-victor tracking-wider
                transition-all duration-100
                ${isSelected
                  ? "bg-gradient-to-br from-purple-500/50 to-red-500/35 text-white shadow-[0_0_8px_rgba(168,85,247,0.35)] scale-[1.04]"
                  : "bg-neutral-800 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-700"
                }
              `}
            >
              {blend.code}
            </button>
          );
        })}
      </div>
    </div>
  );
}
