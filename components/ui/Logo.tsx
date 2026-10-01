import Image from "next/image";
import { asset, cn } from "@/lib/utils";

// The logo PNG is cropped to a circle, so a square image with any background works.
export default function Logo({
  src,
  alt,
  size = 40,
  className,
  priority,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn("relative inline-block shrink-0 overflow-hidden rounded-full", className)}
      style={{ width: size, height: size }}
    >
      <Image src={asset(src)} alt={alt} fill sizes={`${size}px`} priority={priority} className="object-cover" />
    </span>
  );
}
