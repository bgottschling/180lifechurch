import Image from "next/image";
import { FadeIn } from "./FadeIn";

interface StaffCardProps {
  name: string;
  role: string;
  image: string;
  bio?: string;
  delay?: number;
}

export function StaffCard({ name, role, image, bio, delay = 0 }: StaffCardProps) {
  return (
    <FadeIn delay={delay}>
      <div className="bg-white rounded-2xl border border-charcoal/8 overflow-hidden group">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-charcoal">{name}</h3>
          <p className="text-amber text-sm font-medium mt-1">{role}</p>
          {bio && (
            <p className="text-charcoal/60 text-sm mt-3 leading-relaxed">{bio}</p>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
