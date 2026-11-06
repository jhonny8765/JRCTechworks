import Image from "next/image";

const imageDimensions: Record<string, { width: number; height: number }> = {
  "/projects/sukisuite.png": { width: 1597, height: 806 },
  "/projects/better-yield.png": { width: 1599, height: 813 },
};

export default function BrowserFrame({
  src,
  alt,
  hostname,
  className = "",
  priority = false,
  sizes = "(max-width: 700px) 92vw, (max-width: 1150px) 52vw, 620px",
}: {
  src: string;
  alt: string;
  hostname: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const dimensions = imageDimensions[src] ?? { width: 1599, height: 813 };

  return (
    <div className={"browser-frame " + className}>
      <div className="browser-bar" aria-hidden="true">
        <span className="browser-dots"><i /><i /><i /></span>
        <span className="browser-domain">{hostname}</span>
        <span className="browser-bar-space" />
      </div>
      <Image
        src={src}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        className="browser-image"
        priority={priority}
        sizes={sizes}
      />
    </div>
  );
}
