import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
  /** Invert to white for dark backgrounds */
  invert?: boolean;
}

export function Logo({ size = 48, className = "", invert = true }: LogoProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="180 Life Church"
      width={size}
      height={size}
      className={`${invert ? "brightness-0 invert" : ""} ${className}`}
      priority
    />
  );
}
