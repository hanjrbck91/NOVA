type StatusItem = {
  label: string;
  value: string;
};

export function StatusList({ items }: { items: StatusItem[] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-sm">
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="text-foreground/50">{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
