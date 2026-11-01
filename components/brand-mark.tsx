import type { SVGProps } from "react";

type BrandMarkProps = SVGProps<SVGSVGElement> & {
  compact?: boolean;
};

export function BrandMark({ compact = false, className, ...props }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 42 42"
      {...props}
    >
      <rect height="41" rx="12" width="41" x="0.5" y="0.5" fill="#173F36" />
      <path
        d={compact ? "M8 23h7l3-9 7 18 4-13 3 4h3" : "M7.5 23h7.2l3.3-9.5 7.2 19 4.1-13.8 3.3 4.3h2.4"}
        stroke="#DDF0B9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
      <circle cx="34.8" cy="23" fill="#F6C960" r="1.6" />
    </svg>
  );
}
