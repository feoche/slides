/** Minimal shape of a markdown-it token, enough for `markSubtitles` */
export interface HeadingToken {
    type: string;
    tag: string;
    map: [number, number] | null;
    attrJoin(name: string, value: string): void;
}

/**
 * Add the `subtitle` class to each `###` heading written on the line right after
 * a `#`/`##` title. A blank line in between makes it a regular heading.
 */
export function markSubtitles(tokens: HeadingToken[]): void {
    tokens.forEach((token, i) => {
        if (token.type !== 'heading_open' || token.tag !== 'h3' || i < 3) {
            return;
        }
        const title = tokens[i - 3];
        if (tokens[i - 1].type === 'heading_close'
            && title.type === 'heading_open'
            && ['h1', 'h2'].includes(title.tag)
            && title.map && token.map
            && title.map[1] === token.map[0]) {
            token.attrJoin('class', 'subtitle');
        }
    });
}
