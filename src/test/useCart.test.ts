import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCart } from "@/hooks/useCart";

describe("useCart", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockFood = {
    id: "item-1",
    name: "Gresk Salat",
    description: "God salat",
    price: 139,
    category: "Salater",
    image: "https://example.com/img.jpg",
  };

  const mockFood2 = {
    id: "item-2",
    name: "Pasta Bolognese",
    description: "Hjemmelaget pasta",
    price: 189,
    category: "Hovedretter",
    image: "https://example.com/img2.jpg",
  };

  it("starts with empty cart", () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("adds an item to cart", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addItem(mockFood));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe("Gresk Salat");
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(139);
  });

  it("increments quantity when adding same item twice", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addItem(mockFood));
    act(() => result.current.addItem(mockFood));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(278);
  });

  it("handles multiple different items", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addItem(mockFood));
    act(() => result.current.addItem(mockFood2));

    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(139 + 189);
  });

  it("decrements quantity when removing", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addItem(mockFood));
    act(() => result.current.addItem(mockFood));
    act(() => result.current.removeItem("item-1"));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
  });

  it("removes item completely when quantity reaches 0", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addItem(mockFood));
    act(() => result.current.removeItem("item-1"));

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("does nothing when removing non-existent item", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addItem(mockFood));
    act(() => result.current.removeItem("non-existent"));

    expect(result.current.items).toHaveLength(1);
  });

  it("clears all items", () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addItem(mockFood));
    act(() => result.current.addItem(mockFood2));
    act(() => result.current.clearCart());

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("manages isOpen state", () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.isOpen).toBe(false);

    act(() => result.current.setIsOpen(true));
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.setIsOpen(false));
    expect(result.current.isOpen).toBe(false);
  });
});
