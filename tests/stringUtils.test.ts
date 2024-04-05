import {
  PASSWORD_VALIDATION_PATTERN,
  removeTagsFromEmail,
  validateEmail,
} from "../utils/stringUtils";

describe("validate email", () => {
  it("should validate email 1.com as false", () => {
    expect(validateEmail("1.com")).toBeFalsy();
  });

  it("should validate email email1 as false", () => {
    expect(validateEmail("email1")).toBeFalsy();
  });

  it("should validate email email@gmail.com as true", () => {
    expect(validateEmail("email@gmail.com")).toBeTruthy();
  });

  it("should validate email as false", () => {
    expect(validateEmail("")).toBeFalsy();
  });

  it("should validate email email@yandex.ru as true", () => {
    expect(validateEmail("email@yandex.ru")).toBeTruthy();
  });

  it("should validate email email@gmail.com as false", () => {
    expect(validateEmail("emailgmail.com")).toBeFalsy();
  });

  it("should validate email email@gmail.com as false", () => {
    expect(validateEmail("emailgmail.com")).toBeFalsy();
  });
});

describe("validate password", () => {
  it("should return true for a valid password", () => {
    const password = "Abcd1234@";
    const result = PASSWORD_VALIDATION_PATTERN.test(password);

    expect(result).toBe(true);
  });

  it("should return true for a valid password with difficult symbol", () => {
    const password = "Aband123+";
    const result = PASSWORD_VALIDATION_PATTERN.test(password);

    expect(result).toBe(true);
  });

  it("should return true for a password from example", () => {
    const password = "Qicpec-refdi6-nopwyq,";
    const result = PASSWORD_VALIDATION_PATTERN.test(password);

    expect(result).toBe(true);
  });

  it("should return false for a password that is too short", () => {
    const password = "Abc1@";
    const result = PASSWORD_VALIDATION_PATTERN.test(password);

    expect(result).toBe(false);
  });

  it("should return false for a password without an uppercase letter", () => {
    const password = "abcd1234@";
    const result = PASSWORD_VALIDATION_PATTERN.test(password);

    expect(result).toBe(false);
  });

  it("should return false for a password without a lowercase letter", () => {
    const password = "ABCD1234@";
    const result = PASSWORD_VALIDATION_PATTERN.test(password);

    expect(result).toBe(false);
  });

  it("should return false for a password without a number", () => {
    const password = "Abcd@#$%";
    const result = PASSWORD_VALIDATION_PATTERN.test(password);

    expect(result).toBe(false);
  });

  it("should return false for a password without a special character", () => {
    const password = "Abcd1234";
    const result = PASSWORD_VALIDATION_PATTERN.test(password);

    expect(result).toBe(false);
  });

  it('should return true for a password with "', () => {
    const password = 'Abcd123"';
    const result = PASSWORD_VALIDATION_PATTERN.test(password);

    expect(result).toBe(true);
  });

  it("should return true for a password with _", () => {
    const password = "Abcd1234_";
    const result = PASSWORD_VALIDATION_PATTERN.test(password);

    expect(result).toBe(true);
  });
});

describe("removing tags", () => {
  it("removes one tag from email", () => {
    const email = "auto+remove_123@example.com";
    expect(removeTagsFromEmail(email)).toBe("auto@example.com");
  });

  it("removes several tags from email", () => {
    const email = "auto+remove1+remove2+remove3@example.com";
    expect(removeTagsFromEmail(email)).toBe("auto@example.com");
  });

  it("throws an error when incorrect parameters used", () => {
    const email = "auto+remove_123_example.com";
    expect(() => removeTagsFromEmail(email)).toThrow(
      "Incorrect email format provided"
    );
  });
});
