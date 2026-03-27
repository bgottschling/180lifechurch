import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: { label: string; href: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm mb-4">
      <a href="/" className="text-white/40 hover:text-amber transition-colors">
        Home
      </a>
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-2">
          <ChevronRight className="text-white/20" size={14} />
          {i === items.length - 1 ? (
            <span className="text-amber">{item.label}</span>
          ) : (
            <a href={item.href} className="text-white/40 hover:text-amber transition-colors">
              {item.label}
            </a>
          )}
        </span>
      ))}
    </nav>
  );
}
