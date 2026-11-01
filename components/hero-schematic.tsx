import { ArrowDownRight } from "lucide-react";

const groups = ["Pumps", "Faculty", "Hostels", "Guest", "Lighting", "Services", "Academic"];

export function HeroSchematic() {
  return (
    <div className="hero-schematic relative overflow-hidden rounded-[24px] border border-[#dfe4dc] bg-[#edf1ea] p-5 sm:p-6">
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-[#527066]">
            Campus supply map
          </p>
          <p className="mt-2 text-sm font-medium text-ink">Two incoming transformers</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[#ced8ce] bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#426258]">
          Thesis p. 22
        </span>
      </div>

      <svg
        aria-label="Diagram of 200 and 450 kilovolt-ampere transformers supplying seven campus audit groups"
        className="relative z-10 mt-4 h-auto w-full"
        role="img"
        viewBox="0 0 470 245"
      >
        <path className="schematic-line" d="M87 54H235V108" />
        <path className="schematic-line schematic-line-delay" d="M383 54H235V108" />
        <path className="schematic-line" d="M235 108V146" />
        <path className="schematic-line" d="M46 181H424" />
        {[46, 109, 172, 235, 298, 361, 424].map((x) => (
          <path className="schematic-branch" d={`M${x} 146V181`} key={x} />
        ))}

        <g>
          <rect fill="#FFFFFF" height="54" rx="13" stroke="#CAD5CB" width="104" x="35" y="27" />
          <circle cx="56" cy="54" fill="#DDF0B9" r="10" />
          <path d="M52 55h3l2-6 4 11 2-6h3" fill="none" stroke="#244F43" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
          <text fill="#62716B" fontSize="9" fontWeight="600" letterSpacing="1" x="76" y="48">INCOMER 1</text>
          <text fill="#17201D" fontSize="15" fontWeight="650" x="76" y="66">200 kVA</text>
        </g>
        <g>
          <rect fill="#FFFFFF" height="54" rx="13" stroke="#CAD5CB" width="104" x="331" y="27" />
          <circle cx="352" cy="54" fill="#F6DF9D" r="10" />
          <path d="M348 55h3l2-6 4 11 2-6h3" fill="none" stroke="#6B5117" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
          <text fill="#62716B" fontSize="9" fontWeight="600" letterSpacing="1" x="372" y="48">INCOMER 2</text>
          <text fill="#17201D" fontSize="15" fontWeight="650" x="372" y="66">450 kVA</text>
        </g>

        <g>
          <circle cx="235" cy="111" fill="#173F36" r="20" />
          <circle className="schematic-pulse" cx="235" cy="111" fill="none" r="27" stroke="#327B6A" />
          <path d="m229 112 4-9v7h8l-6 10v-8h-6Z" fill="#DDF0B9" />
          <text fill="#49645B" fontSize="9" fontWeight="600" letterSpacing="1.4" textAnchor="middle" x="235" y="143">DISTRIBUTION</text>
        </g>

        {groups.map((group, index) => {
          const x = 46 + index * 63;
          return (
            <g key={group}>
              <circle cx={x} cy="181" fill="#FFFFFF" r="11" stroke="#BFCBC0" />
              <circle className="schematic-node" cx={x} cy="181" fill="#327B6A" r="3.5" style={{ animationDelay: `${index * 150}ms` }} />
              <text fill="#52635D" fontSize="8.5" fontWeight="550" textAnchor="middle" x={x} y="207">
                {group}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="relative z-10 mt-2 flex items-center justify-between border-t border-[#d8dfd7] pt-4 text-xs text-[#597068]">
        <span>7 audited load groups</span>
        <span className="inline-flex items-center gap-1 font-semibold text-[#254f43]">
          650 kVA combined <ArrowDownRight aria-hidden="true" size={13} />
        </span>
      </div>
    </div>
  );
}
