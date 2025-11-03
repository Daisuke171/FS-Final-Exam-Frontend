import Image from "next/image";

export default function Avatar({ src, alt, size = 36, className = "" }: {
  src: string; alt: string; size?: number; className?: string;
}) {
  return (
    <figure className={`overflow-hidden rounded-full ring-2 ring-cyan-300/50 ${className} w-${size} h-${size}`}>
      <Image
        src={src}
        alt={alt}
        width={100}
        height={90}
        className={`object-cover`}
      />
    </figure>
  );
}
