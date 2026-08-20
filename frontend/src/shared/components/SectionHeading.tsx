type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div>
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">{eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
      {description ? <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">{description}</p> : null}
    </div>
  );
}
