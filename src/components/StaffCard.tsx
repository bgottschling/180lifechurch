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
      <div className="bg-white rounded-2xl border border-charcoal/8 overflow-hidden group h-full">
        {/* Photo with hover bio overlay */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Bio overlay — slides up on hover (desktop only) */}
          {bio && (
            <div className="absolute inset-0 hidden sm:flex items-end bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
              <p className="text-white/85 text-sm leading-relaxed p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {bio}
              </p>
            </div>
          )}
        </div>

        {/* Name + role */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-charcoal">{name}</h3>
          <p className="text-amber text-sm font-medium mt-1">{role}</p>
          {/* Bio visible on mobile only */}
          {bio && (
            <p className="text-charcoal/60 text-sm mt-3 leading-relaxed sm:hidden">{bio}</p>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
