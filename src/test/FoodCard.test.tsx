import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FoodCard from "@/components/FoodCard";
import { FoodItem } from "@/types/food";

const mockItem: FoodItem = {
  id: "test-1",
  name: "Bruschetta",
  description: "Ristet surdeigsbrød med tomater og basilikum",
  price: 89,
  category: "Småretter",
  image: "https://example.com/bruschetta.jpg",
  badge: "Populær",
};

describe("FoodCard", () => {
  it("renders item name, description and price", () => {
    render(<FoodCard item={mockItem} onAdd={() => {}} />);

    expect(screen.getByText("Bruschetta")).toBeInTheDocument();
    expect(screen.getByText(/Ristet surdeigsbrød/)).toBeInTheDocument();
    expect(screen.getByText("89 kr")).toBeInTheDocument();
  });

  it("renders badge when present", () => {
    render(<FoodCard item={mockItem} onAdd={() => {}} />);
    expect(screen.getByText("Populær")).toBeInTheDocument();
  });

  it("does not render badge when missing", () => {
    const itemWithoutBadge = { ...mockItem, badge: undefined };
    render(<FoodCard item={itemWithoutBadge} onAdd={() => {}} />);
    expect(screen.queryByText("Populær")).not.toBeInTheDocument();
  });

  it("calls onAdd with the item when button is clicked", () => {
    const onAdd = vi.fn();
    render(<FoodCard item={mockItem} onAdd={onAdd} />);

    const button = screen.getByRole("button", { name: /legg til/i });
    fireEvent.click(button);

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(mockItem);
  });

  it("renders image with correct alt text", () => {
    render(<FoodCard item={mockItem} onAdd={() => {}} />);
    const img = screen.getByAltText("Bruschetta");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockItem.image);
  });
});
