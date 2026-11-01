type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title mt-4 text-balance">{title}</h2>
      {copy ? <p className="section-copy mt-5 text-balance">{copy}</p> : null}
    </div>
  );
}
