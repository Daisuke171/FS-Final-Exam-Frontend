import Image from "next/image";

export default function Avatar({ src, alt = "Avatar", size = 12, className = "" }: {
  src: string; alt: string; size?: number; className?: string;
}) {
  return (
    <figure className={` w-${size} h-${size} overflow-hidden rounded-full ring-2 ring-cyan-300/50 ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={48}
        height={48}
        className="w-full h-fullobject-cover"
      />
    </figure>
  );
}


