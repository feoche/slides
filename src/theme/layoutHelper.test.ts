import { test } from "node:test";
import assert from "node:assert/strict";
import { detectMediaKind, toYouTubeEmbed } from "./layoutHelper.ts";

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
