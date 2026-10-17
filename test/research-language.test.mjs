import { test } from "node:test";
import assert from "node:assert/strict";
import {
  preferredLanguage,
  readingLink,
} from "../docs/research/preferences.js";

test("saved English wins over a Korean browser; an explicit link wins over either", () => {
  assert.equal(preferredLanguage("", "en", "ko-KR"), "en");
  assert.equal(preferredLanguage("", "ko", "en-US"), "ko");
  assert.equal(preferredLanguage("?lang=en", "ko", "ko-KR"), "en");
  assert.equal(preferredLanguage("?lang=ko", "en", "en-US"), "ko");
  assert.equal(preferredLanguage("?lang=invalid", "en", "ko-KR"), "en");
  assert.equal(preferredLanguage("", null, "ko-KR"), "ko");
  assert.equal(preferredLanguage("", "invalid", undefined), "en");
});

test("reading links retain language, case selection and anchors without rewriting evidence downloads", () => {
  const base =
    "https://minjae-lee-kr.github.io/research/partial-data/?case=nonnull&lang=ko#raw";
  assert.equal(
    readingLink("../client-cache/?case=none-warm#comparison", base, "ko"),
    "/research/client-cache/?case=none-warm&lang=ko#comparison",
  );
  assert.equal(
    readingLink("../../?lang=en#research", base, "ko"),
    "/?lang=ko#research",
  );
  assert.equal(readingLink("#raw", base, "ko"), "#raw");
  for (const href of [
    "recording.json",
    "./model.js",
    "image.svg",
    "https://github.com/minjae-lee-kr/",
    "mailto:example@example.test",
  ])
    assert.equal(readingLink(href, base, "ko"), href);
  assert.equal(readingLink("../../", base, "xx"), "../../");
});
