import { describe, it, expect } from "vitest";
import {
  stripHtml,
  escapeHtml,
  sanitizeText,
  sanitizeEmail,
  sanitizePhone,
} from "@/lib/sanitize";

describe("stripHtml", () => {
  it("removes simple HTML tags", () => {
    expect(stripHtml("<b>Hello</b>")).toBe("Hello");
  });

  it("removes script tags", () => {
    expect(stripHtml('<script>alert("xss")</script>Tekst')).toBe('alert("xss")Tekst');
  });

  it("handles strings without HTML", () => {
    expect(stripHtml("Plain text")).toBe("Plain text");
  });

  it("removes nested tags", () => {
    expect(stripHtml("<div><span>Innhold</span></div>")).toBe("Innhold");
  });
});

describe("escapeHtml", () => {
  it("escapes ampersands", () => {
    expect(escapeHtml("A & B")).toBe("A &amp; B");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes quotes", () => {
    expect(escapeHtml('"hello\'')).toBe("&quot;hello&#039;");
  });

  it("returns safe text unchanged", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });
});

describe("sanitizeText", () => {
  it("trims whitespace", () => {
    expect(sanitizeText("  Hello  ")).toBe("Hello");
  });

  it("strips HTML and trims", () => {
    expect(sanitizeText("  <b>Bold</b>  ")).toBe("Bold");
  });

  it("enforces maxLength", () => {
    const long = "A".repeat(600);
    expect(sanitizeText(long, 100)).toHaveLength(100);
  });

  it("uses default maxLength of 500", () => {
    const long = "B".repeat(700);
    expect(sanitizeText(long)).toHaveLength(500);
  });
});

describe("sanitizeEmail", () => {
  it("lowercases and trims", () => {
    expect(sanitizeEmail("  User@Example.COM  ")).toBe("user@example.com");
  });

  it("strips HTML tags", () => {
    expect(sanitizeEmail("<script>x</script>user@test.com")).toBe("xuser@test.com");
  });

  it("enforces max length of 254", () => {
    const long = "a".repeat(300) + "@test.com";
    expect(sanitizeEmail(long).length).toBeLessThanOrEqual(254);
  });
});

describe("sanitizePhone", () => {
  it("keeps valid phone characters", () => {
    expect(sanitizePhone("+47 123 45 678")).toBe("+47 123 45 678");
  });

  it("removes letters and special characters", () => {
    expect(sanitizePhone("tel: +47-123abc!")).toBe("+47-123");
  });

  it("enforces max length of 20", () => {
    const long = "1".repeat(30);
    expect(sanitizePhone(long)).toHaveLength(20);
  });
});
