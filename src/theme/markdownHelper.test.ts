import { test } from "node:test";
import assert from "node:assert/strict";
import { markSubtitles, type HeadingToken } from "./markdownHelper.ts";

// Builds the markdown-it tokens of two consecutive headings
const headings = (titleTag: string, titleLine: number, tag: string, line: number) => {
  const token = (type: string, tag: string, map: [number, number] | null): HeadingToken & { classes: string[] } => ({
    type, tag, map, classes: [],
    attrJoin(_name, value) { this.classes.push(value); },
  });
  return [
    token("heading_open", titleTag, [titleLine, titleLine + 1]),
    token("inline", "", [titleLine, titleLine + 1]),
    token("heading_close", titleTag, null),
    token("heading_open", tag, [line, line + 1]),
  ];
};

test("markSubtitles marks a ### right after a title", () => {
  for (const titleTag of ["h1", "h2"]) {
    const tokens = headings(titleTag, 0, "h3", 1);
    markSubtitles(tokens);
    assert.deepEqual(tokens[3].classes, ["subtitle"]);
  }
});

test("markSubtitles ignores a ### separated by a blank line", () => {
  const tokens = headings("h2", 0, "h3", 2);
  markSubtitles(tokens);
  assert.deepEqual(tokens[3].classes, []);
});

test("markSubtitles ignores other headings", () => {
  for (const [titleTag, tag] of [["h3", "h3"], ["h2", "h4"]]) {
    const tokens = headings(titleTag, 0, tag, 1);
    markSubtitles(tokens);
    assert.deepEqual(tokens[3].classes, []);
  }
});
