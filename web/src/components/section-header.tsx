// A section's title with an optional action on the right (Figma "section …"): the title is the heading
// the section is labelled by, the action a short link such as "Xem tất cả".
export function SectionHeader({
  id,
  title,
  action,
}: {
  id: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4">
      <h2 id={id} className="scroll-mt-4 font-display text-h3-20 text-foreground">
        {title}
      </h2>
      {action}
    </div>
  );
}
