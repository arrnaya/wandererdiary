/**
 * Local cover images that are committed to the repo and work everywhere
 * (including Vercel). These take precedence over DB cover images so that
 * uploaded media files don't need to persist on the server filesystem.
 *
 * To add more: place the image in apps/web/public/images/ and add the
 * slug → filename mapping below.
 */
const LOCAL_IMAGE_MAP: Record<string, string> = {
  'marrakech-off-the-map-authentic-medina': '/images/marrakech.png',
  'new-zealand-south-island-road-trip': '/images/new-zealand-a-road-trip.png',
  'hidden-kyoto-temples-without-crowds': '/images/hidden-kyoto.png',
  'lisbon-after-dark-foodie-tascas': '/images/lisbon-after-dark.png',
  'solo-patagonia-w-circuit-photography': '/images/pantagonia.png',
}

export function getLocalCoverImage(
  slug: string,
  title: string
): { url: string; alt: string } | undefined {
  const path = LOCAL_IMAGE_MAP[slug]
  if (!path) return undefined
  return { url: path, alt: title }
}

/**
 * Resolve the cover image for a story.
 * Local images in /public/images/ take precedence over DB cover images,
 * because local files are committed to git and work on Vercel.
 */
export function resolveCoverImage(story: {
  slug: string
  title: string
  coverImage?: { url?: string; alt?: string } | null
}): { url: string; alt: string } | undefined {
  const local = getLocalCoverImage(story.slug, story.title)
  if (local) return local

  if (story.coverImage?.url) {
    return {
      url: story.coverImage.url,
      alt: story.coverImage.alt || story.title,
    }
  }

  return undefined
}
