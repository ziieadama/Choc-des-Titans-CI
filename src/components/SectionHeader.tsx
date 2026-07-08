import Reveal from "./Reveal";

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeader({
  kicker,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <Reveal className={centered ? "text-center" : ""}>
      {kicker && (
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-light mb-3">
          {kicker}
        </p>
      )}
      <h2
        className={`section-title text-3xl sm:text-4xl lg:text-5xl ${
          light ? "text-carbon" : "text-white"
        }`}
      >
        {title}
      </h2>
      <div className={`accent-bar mt-4 ${centered ? "mx-auto" : ""}`} />
      {description && (
        <p
          className={`mt-4 max-w-2xl text-sm sm:text-base leading-relaxed ${
            light ? "text-carbon/70" : "text-muted"
          } ${centered ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
