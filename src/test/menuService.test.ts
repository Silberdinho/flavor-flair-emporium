import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMenuItems } from "@/services/menuService";
import { menuItems as fallbackMenuItems } from "@/data/menu";

// Mock supabase module
vi.mock("@/lib/supabase", () => ({
  supabase: null,
}));

describe("menuService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns fallback menu when supabase is not configured", async () => {
    const items = await getMenuItems();
    expect(items).toEqual(fallbackMenuItems);
    expect(items.length).toBeGreaterThan(0);
  });

  it("fallback items all have required fields", async () => {
    const items = await getMenuItems();
    for (const item of items) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.price).toBeGreaterThan(0);
      expect(item.category).toBeTruthy();
      expect(item.image).toBeTruthy();
    }
  });

  it("fallback items cover all expected categories", async () => {
    const items = await getMenuItems();
    const categories = new Set(items.map((i) => i.category));
    expect(categories).toContain("Småretter");
    expect(categories).toContain("Salater");
    expect(categories).toContain("Hovedretter");
    expect(categories).toContain("Drikke");
  });
});
