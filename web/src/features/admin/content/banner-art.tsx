import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";

/**
 * A banner as the app draws it (Figma "banner Món ngon mỗi ngày", 358×72): its title and the line under it on the
 * lime wash, its picture, and the arrow that opens it. The grid, the editor's drop zone and the phone preview
 * show the same banner. Without a picture its place stays a pale tile.
 */
export function BannerArt({
  title,
  subtitle,
  imageUrl,
}: {
  title: string;
  subtitle: string;
  imageUrl?: string;
}) {
  return (
    <div className="flex h-18 w-full max-w-90 items-center gap-3 overflow-hidden rounded-xl bg-fresh-muted py-1.5 pr-4.5 pl-4.5">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-bar-title text-fresh-foreground">{title}</span>
        <span className="truncate text-label text-muted-foreground">{subtitle}</span>
      </div>
      {imageUrl ? (
        // Unoptimized: a picture the admin just chose lives only in this browser until it is uploaded.
        <Image
          src={imageUrl}
          alt=""
          width={84}
          height={60}
          unoptimized
          className="h-15 w-21 shrink-0 rounded-2xl object-cover"
        />
      ) : (
        <span aria-hidden className="h-15 w-21 shrink-0 rounded-2xl bg-card" />
      )}
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-fresh-foreground text-primary-foreground"
      >
        <ArrowRightIcon className="size-3.5" />
      </span>
    </div>
  );
}
