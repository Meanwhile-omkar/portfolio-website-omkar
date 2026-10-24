import Annotate from "@/components/sketch/Annotate";

type Props = {
  children: React.ReactNode;
  /** A short handwritten aside next to the heading. */
  aside?: React.ReactNode;
  color?: string;
  className?: string;
  id?: string;
};

export default function SectionTitle({ children, aside, color = "#ffc700", className = "", id }: Props) {
  return (
    <div className={`relative flex flex-wrap items-end gap-x-8 gap-y-3 ${className}`}>
      <h2 id={id} className="font-marker text-[clamp(64px,9vw,120px)] leading-[0.8] tracking-[0.01em] text-ink">
        <Annotate type="highlight" color={color} multiline padding={[2, 8]} duration={600} iterations={1}>
          {children}
        </Annotate>
      </h2>
      {aside && <p className="max-w-[30ch] pb-2 font-note text-[17px] leading-snug text-ink-soft">{aside}</p>}
    </div>
  );
}
