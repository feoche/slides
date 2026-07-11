/**
 * Resolve urls from frontmatter and append with the base url
 */
export function resolveAssetUrl(url: string) {
    if (url.startsWith('/'))
        return import.meta.env.BASE_URL + url.slice(1)
    return url
}

export type MediaKind = "image" | "video" | "youtube" | "iframe";

export const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i;
const VIDEO_EXT = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;
const YOUTUBE_RE = /(?:youtube\.com|youtu\.be)/i;

export function detectMediaKind(src?: string): MediaKind {
    if (!src) return "iframe";
    if (YOUTUBE_RE.test(src)) return "youtube";
    if (VIDEO_EXT.test(src)) return "video";
    if (IMAGE_EXT.test(src)) return "image";
    return "iframe";
}

export function toYouTubeEmbed(url: string): string {
    const idMatch = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]+)/i,
    );
    if (!idMatch) return url;
    const id = idMatch[1];
    const tsMatch = url.match(/[?&](?:t|start)=(\d+)s?/i);
    const query = tsMatch ? `?start=${tsMatch[1]}` : "";
    return `https://www.youtube.com/embed/${id}${query}`;
}

export function handleBackground(background?: string, dim = false, backgroundSize = 'cover'): CSSProperties {
    const isColor = background && (background[0] === '#' || background.startsWith('rgb'))

    const style = {
        background: isColor
            ? background
            : undefined,
        color: (background && !isColor)
            ? 'white'
            : undefined,
        backgroundImage: isColor
            ? undefined
            : background
                ? dim
                    ? `linear-gradient(#0005, #0008), url(${resolveAssetUrl(background)})`
                    : `url("${resolveAssetUrl(background)}")`
                : undefined,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize,
    }

    if (!style.background)
        delete style.background

    return style
}

/**
 * Format date from frontmatter or current date
 */
export function formatDate(dateString?: string): string {
    if (dateString) {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString()
        } catch (e) {
            // If date parsing fails, return the original string
            return dateString
        }
    }
    return new Date().toLocaleDateString()
}

const HIGHLIGHT_LAYOUTS = [
    'cover',
    'end',
    'fact',
    'intro',
    'section',
]

/**
 * Check if a layout should have highlight applied
 */
export function shouldHighlightLayout(layout: string): boolean {
    return HIGHLIGHT_LAYOUTS.indexOf(layout.toLowerCase()) !== -1;
}
