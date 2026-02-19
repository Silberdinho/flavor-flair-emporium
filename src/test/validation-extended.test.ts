import { describe, it, expect } from "vitest";

/**
 * Extended validation tests matching the updated CartDrawer validation
 * (postal code format, phone format, name length).
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

  if (contactInfo.fullName.trim().length < 2) {
    return "Navn må være minst 2 tegn.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactInfo.email.trim())) {
    return "E-postadressen ser ugyldig ut.";
  }

  if (!/^[\d\s+\-()]{3,20}$/.test(contactInfo.phone.trim())) {
    return "Telefonnummer ser ugyldig ut.";
  }

  if (!/^\d{4}$/.test(contactInfo.postalCode.trim())) {
    return "Postnummer må være 4 siffer.";
  }

  return null;
}

describe("validateContactInfo — extended checks", () => {
  const validContact: CheckoutContactInfo = {
    fullName: "Ola Nordmann",
    email: "ola@example.com",
    phone: "+47 12345678",
    address: "Storgata 1",
    postalCode: "0155",
    city: "Oslo",
  };

  // --- Postnummer ---
  it("rejects postal code with 3 digits", () => {
    expect(validateContactInfo({ ...validContact, postalCode: "015" })).toBe(
      "Postnummer må være 4 siffer.",
    );
  });

  it("rejects postal code with 5 digits", () => {
    expect(validateContactInfo({ ...validContact, postalCode: "01550" })).toBe(
      "Postnummer må være 4 siffer.",
    );
  });

  it("rejects postal code with letters", () => {
    expect(validateContactInfo({ ...validContact, postalCode: "AB12" })).toBe(
      "Postnummer må være 4 siffer.",
    );
  });

  it("accepts valid 4-digit postal codes", () => {
    for (const code of ["0155", "9999", "1000", "4630"]) {
      expect(validateContactInfo({ ...validContact, postalCode: code })).toBeNull();
    }
  });

  // --- Telefon ---
  it("rejects phone with letters", () => {
    expect(validateContactInfo({ ...validContact, phone: "ring meg" })).toBe(
      "Telefonnummer ser ugyldig ut.",
    );
  });

  it("rejects phone that is too short", () => {
    expect(validateContactInfo({ ...validContact, phone: "12" })).toBe(
      "Telefonnummer ser ugyldig ut.",
    );
  });

  it("accepts phone with spaces and country code", () => {
    expect(validateContactInfo({ ...validContact, phone: "+47 999 88 777" })).toBeNull();
  });

  it("accepts phone with parentheses", () => {
    expect(validateContactInfo({ ...validContact, phone: "(+47) 12345678" })).toBeNull();
  });

  // --- Navn lengde ---
  it("rejects single-character name", () => {
    expect(validateContactInfo({ ...validContact, fullName: "O" })).toBe(
      "Navn må være minst 2 tegn.",
    );
  });

  it("accepts two-character name", () => {
    expect(validateContactInfo({ ...validContact, fullName: "Li" })).toBeNull();
  });
});
