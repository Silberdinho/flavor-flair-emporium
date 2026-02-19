import { describe, it, expect } from "vitest";

/**
 * Tests for checkout contact info validation logic.
 * Mirrors the validation in CartDrawer.tsx.
 */

interface CheckoutContactInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  comment?: string;
}

function validateContactInfo(contactInfo: CheckoutContactInfo): string | null {
  const requiredFields: Array<keyof CheckoutContactInfo> = [
    "fullName",
    "email",
    "phone",
    "address",
    "postalCode",
    "city",
  ];

  const missingField = requiredFields.find((field) => !contactInfo[field]?.trim());
  if (missingField) {
    return "Fyll ut navn, e-post, telefon og adresse for å fullføre kjøpet.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactInfo.email.trim())) {
    return "E-postadressen ser ugyldig ut.";
  }

  return null;
}

describe("validateContactInfo", () => {
  const validContact: CheckoutContactInfo = {
    fullName: "Ola Nordmann",
    email: "ola@example.com",
    phone: "+47 12345678",
    address: "Storgata 1",
    postalCode: "0155",
    city: "Oslo",
  };

  it("returns null for valid contact info", () => {
    expect(validateContactInfo(validContact)).toBeNull();
  });

  it("fails when fullName is empty", () => {
    expect(validateContactInfo({ ...validContact, fullName: "" })).toBeTruthy();
  });

  it("fails when fullName is only spaces", () => {
    expect(validateContactInfo({ ...validContact, fullName: "   " })).toBeTruthy();
  });

  it("fails when email is empty", () => {
    expect(validateContactInfo({ ...validContact, email: "" })).toBeTruthy();
  });

  it("fails for invalid email format", () => {
    expect(validateContactInfo({ ...validContact, email: "not-an-email" })).toBe(
      "E-postadressen ser ugyldig ut.",
    );
  });

  it("fails for email without domain", () => {
    expect(validateContactInfo({ ...validContact, email: "user@" })).toBe(
      "E-postadressen ser ugyldig ut.",
    );
  });

  it("fails when phone is empty", () => {
    expect(validateContactInfo({ ...validContact, phone: "" })).toBeTruthy();
  });

  it("fails when address is empty", () => {
    expect(validateContactInfo({ ...validContact, address: "" })).toBeTruthy();
  });

  it("fails when postalCode is empty", () => {
    expect(validateContactInfo({ ...validContact, postalCode: "" })).toBeTruthy();
  });

  it("fails when city is empty", () => {
    expect(validateContactInfo({ ...validContact, city: "" })).toBeTruthy();
  });

  it("accepts optional comment as undefined", () => {
    expect(validateContactInfo({ ...validContact, comment: undefined })).toBeNull();
  });

  it("accepts optional comment with content", () => {
    expect(validateContactInfo({ ...validContact, comment: "Ingen løk" })).toBeNull();
  });

  it("accepts various valid email formats", () => {
    const emails = ["a@b.no", "user.name@domain.co.uk", "test+tag@gmail.com"];
    for (const email of emails) {
      expect(validateContactInfo({ ...validContact, email })).toBeNull();
    }
  });
});
