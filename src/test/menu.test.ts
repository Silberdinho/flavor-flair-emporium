import { describe, it, expect } from "vitest";
import { menuItems } from "@/data/menu";

describe("menu fallback data", () => {
  it("contains menu items", () => {
    expect(menuItems.length).toBeGreaterThan(0);
  });

  it("every item has required fields", () => {
    for (const item of menuItems) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.price).toBeGreaterThan(0);
      expect(item.category).toBeTruthy();
      expect(item.image).toBeTruthy();
    }
  });

  it("every item has a unique id", () => {
    const ids = menuItems.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("prices are reasonable (> 0 and < 10 000)", () => {
    for (const item of menuItems) {
      expect(item.price).toBeGreaterThan(0);
      expect(item.price).toBeLessThan(10_000);
    }
  });

  it("image URLs are valid https URLs", () => {
    for (const item of menuItems) {
      expect(item.image).toMatch(/^https:\/\//);
    }
  });
});
