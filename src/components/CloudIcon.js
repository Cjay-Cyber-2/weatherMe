import Image from "next/image";

export default function CloudIcon({
  size = 48,
  alt = "Animated cloud",
  className = "",
  priority = false,
}) {
  return (
    <Image
      src="/cloud-loop.webp"
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      unoptimized
      className={`cloud-icon ${className}`.trim()}
    />
  );
}
