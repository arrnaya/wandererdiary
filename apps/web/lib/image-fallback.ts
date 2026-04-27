/**
 * Fallback images for stories when no coverImage is set in the database.
 * Maps story slugs to local static image paths in /public/images/.
 *
 * To add more: place the image in apps/web/public/images/ and add the
 * slug → filename mapping below.
 */
const LOCAL_IMAGE_MAP: Record<string, string> = {
  'marrakech-off-the-map-authentic-medina': '/images/marrakech.png',
  'new-zealand-south-island-road-trip': '/images/new-zealand-a-road-trip.png',
}

export function getLocalCoverImage(
  slug: string,
  title: string
): { url: string; alt: string } | undefined {
  const path = LOCAL_IMAGE_MAP[slug]
  if (!path) return undefined
  return { url: path, alt: title }
}
