import { describe, expect, it } from "vitest";
import {
  MAX_ENCODED_LENGTH,
  buildShareLink,
  decodePayload,
  encodePayload,
  sharePathFor,
  validatePayload,
  type SharePayload,
} from "@/lib/share";
import { QUIZ_PACKS } from "@/lib/content/quizzes";

const card: SharePayload = {
  k: "card",
  v: 1,
  title: "A very serious card",
  body: "You have been officially noticed by the void.",
  extra: "no exchanges accepted",
  from: "The Management",
  tone: "compliment",
};

const award: SharePayload = {
  k: "award",
  v: 1,
  to: "Sam",
  award: "Professional Overthinker, First Class",
  reason: "For thinking about a reply for four hours and sending 'ok'.",
  from: "The Committee",
};

const load: SharePayload = {
  k: "load",
  v: 1,
  to: "Sam",
  steps: ["Calibrating vibes…", "Downloading more RAM…", "Asking the server politely…"],
  finale: { title: "Told you", body: "That was a fake loading screen. Your files are fine." },
};

const drama: SharePayload = {
  k: "drama",
  v: 1,
  kicker: "DEVELOPING STORY",
  headline: "Local cat refuses to move from keyboard",
  sub: "Productivity experts are baffled.",
  quote: "\"I was here first,\" says cat.",
  byline: "The Trollverse Wire · entirely fictional",
};

const quiz: SharePayload = {
  k: "quiz",
  v: 1,
  pack: QUIZ_PACKS[0].id,
  to: "Sam",
  got: 3,
  from: "Alex",
};

describe("encode/decode round trip", () => {
  for (const payload of [card, award, load, drama, quiz]) {
    it(`round-trips a ${payload.k} payload`, () => {
      const decoded = decodePayload(encodePayload(payload));
      expect(decoded).toEqual(payload);
    });
  }

  it("produces base64url without padding characters", () => {
    const encoded = encodePayload(card);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});

describe("decodePayload rejects bad input", () => {
  it("returns null for empty/nullish input", () => {
    expect(decodePayload(null)).toBeNull();
    expect(decodePayload(undefined)).toBeNull();
    expect(decodePayload("")).toBeNull();
  });

  it("returns null for oversized input", () => {
    expect(decodePayload("a".repeat(MAX_ENCODED_LENGTH + 1))).toBeNull();
  });

  it("returns null for invalid base64", () => {
    expect(decodePayload("!!!not-base64!!!")).toBeNull();
  });

  it("returns null for valid base64 that is not JSON", () => {
    expect(decodePayload(btoa("hello world"))).toBeNull();
  });

  it("returns null for JSON with a wrong version", () => {
    const bogus = btoa(JSON.stringify({ ...card, v: 99 }));
    expect(decodePayload(bogus)).toBeNull();
  });

  it("returns null when a required field is missing", () => {
    const bogus = btoa(JSON.stringify({ k: "card", v: 1, title: "Only a title" }));
    expect(decodePayload(bogus)).toBeNull();
  });

  it("returns null for unknown kinds", () => {
    const bogus = btoa(JSON.stringify({ k: "spaghetti", v: 1, title: "x", body: "y" }));
    expect(decodePayload(bogus)).toBeNull();
  });

  it("returns null for quiz packs that do not exist", () => {
    const bogus = btoa(JSON.stringify({ k: "quiz", v: 1, pack: "fake-pack", to: "Sam", got: 1 }));
    expect(decodePayload(bogus)).toBeNull();
  });
});

describe("validatePayload sanitization", () => {
  it("clamps quiz scores into range", () => {
    const high = validatePayload({ k: "quiz", v: 1, pack: QUIZ_PACKS[0].id, to: "Sam", got: 999 });
    const low = validatePayload({ k: "quiz", v: 1, pack: QUIZ_PACKS[0].id, to: "Sam", got: -5 });
    expect(high).toMatchObject({ got: 9 });
    expect(low).toMatchObject({ got: 0 });
  });

  it("strips control characters and trims whitespace", () => {
    const result = validatePayload({
      k: "card",
      v: 1,
      title: "  Hello\u0000 World  ",
      body: "Body\u0007 text\r\nwith newline",
    });
    expect(result).toMatchObject({ title: "Hello World", body: "Body text\nwith newline" });
  });

  it("drops the compliment tone unless explicitly set", () => {
    const result = validatePayload({ k: "card", v: 1, title: "Hi", body: "Yo", tone: "spooky" });
    expect(result).toMatchObject({ tone: undefined });
  });

  it("caps load steps at ten", () => {
    const steps = Array.from({ length: 25 }, (_, index) => `step ${index}`);
    const result = validatePayload({ k: "load", v: 1, to: "Sam", steps });
    if (result && result.k === "load") {
      expect(result.steps).toHaveLength(10);
    } else {
      throw new Error("expected a load payload");
    }
  });
});

describe("buildShareLink", () => {
  it("maps kinds to paths", () => {
    expect(sharePathFor("card")).toBe("/t/card");
    expect(sharePathFor("award")).toBe("/t/award");
    expect(sharePathFor("load")).toBe("/t/loading");
    expect(sharePathFor("drama")).toBe("/t/drama");
    expect(sharePathFor("quiz")).toBe("/t/quiz");
  });

  it("builds a full URL with the encoded payload", () => {
    const link = buildShareLink(award, "https://example.test");
    expect(link.startsWith("https://example.test/t/award?d=")).toBe(true);
    const encoded = link.split("?d=")[1];
    expect(decodePayload(encoded)).toEqual(award);
  });
});
