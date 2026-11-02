import { test } from "node:test";
import assert from "node:assert/strict";
import { detectMediaKind, formatDate, resolveAssetUrl, toYouTubeEmbed } from "./layoutHelper.ts";

test("resolveAssetUrl serves deck files from the base url, whatever the page route", () => {
  assert.equal(resolveAssetUrl("/visio.jpg"), "/visio.jpg");
  assert.equal(resolveAssetUrl("visio.jpg"), "/visio.jpg");
  assert.equal(resolveAssetUrl("./visio.jpg"), "/visio.jpg");
  assert.equal(resolveAssetUrl("https://example.com/a.png"), "https://example.com/a.png");
  assert.equal(resolveAssetUrl("data:image/png;base64,AAAA"), "data:image/png;base64,AAAA");
});

test("detectMediaKind classifies by extension and host", () => {
  assert.equal(detectMediaKind("/foo.png"), "image");
  assert.equal(detectMediaKind("/foo.JPG?x=1"), "image");
  assert.equal(detectMediaKind("/clip.mp4"), "video");
  assert.equal(detectMediaKind("/clip.webm"), "video");
  assert.equal(detectMediaKind("https://youtu.be/abc123"), "youtube");
  assert.equal(detectMediaKind("https://www.youtube.com/watch?v=abc123"), "youtube");
  assert.equal(detectMediaKind("https://example.com/app"), "iframe");
  assert.equal(detectMediaKind(undefined), "iframe");
  assert.equal(detectMediaKind(""), "iframe");
});

test("toYouTubeEmbed normalizes all URL forms", () => {
  assert.equal(toYouTubeEmbed("https://www.youtube.com/watch?v=abc123"), "https://www.youtube.com/embed/abc123");
  assert.equal(toYouTubeEmbed("https://youtu.be/abc123"), "https://www.youtube.com/embed/abc123");
  assert.equal(toYouTubeEmbed("https://www.youtube.com/embed/abc123"), "https://www.youtube.com/embed/abc123");
  assert.equal(toYouTubeEmbed("https://www.youtube.com/shorts/abc123"), "https://www.youtube.com/embed/abc123");
});

test("toYouTubeEmbed preserves timestamp as start=", () => {
  assert.equal(toYouTubeEmbed("https://youtu.be/abc123?t=90"), "https://www.youtube.com/embed/abc123?start=90");
  assert.equal(toYouTubeEmbed("https://www.youtube.com/watch?v=abc123&t=90s"), "https://www.youtube.com/embed/abc123?start=90");
});

test("toYouTubeEmbed returns input unchanged when no id", () => {
  assert.equal(toYouTubeEmbed("https://youtube.com/"), "https://youtube.com/");
});

test("formatDate renders DD/MM/YYYY with leading zeros", () => {
  assert.equal(formatDate("2026-11-19"), "19/11/2026");
  assert.equal(formatDate("2026-03-05"), "05/03/2026");
  assert.equal(formatDate(new Date(Date.UTC(2024, 5, 1))), "01/06/2024");
  assert.equal(formatDate("not a date"), "not a date");
  assert.match(formatDate(), /^\d{2}\/\d{2}\/\d{4}$/);
});
