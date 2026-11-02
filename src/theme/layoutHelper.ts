const EXTERNAL_URL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

/**
 * Resolve urls from frontmatter and append with the base url.
 * A bare file name (`visio.jpg`, `./visio.jpg`) is a file of the deck's `img/` too:
 * resolved from the base url, not from the current route (`/presenter/19`…)
 */
export function resolveAssetUrl(url: string) {
    const base = import.meta.env?.BASE_URL ?? '/'
    if (EXTERNAL_URL.test(url))
        return url
    return base + url.replace(/^\.?\//, '')
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
 * Format date from frontmatter or current date as DD/MM/YYYY (zero-padded),
 * whatever the browser locale.
 */
export function formatDate(dateString?: string | Date): string {
    const pad = (n: number) => String(n).padStart(2, '0')
    if (dateString) {
        const date = new Date(dateString)
        // If date parsing fails, return the original string
        if (Number.isNaN(date.getTime())) return String(dateString)
        // `date: 2026-11-19` is parsed as UTC midnight: read UTC parts to avoid a timezone shift
        return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`
    }
    const now = new Date()
    return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`
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
