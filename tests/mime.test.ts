import { extractThreadIdFromHeaderStr } from "../utils/mime-headers";

describe("MIME header parser", () => {
  it("does not parse References string with numeric thread id", async () => {
    const a = extractThreadIdFromHeaderStr('<9@mg.example.com> <20230125092916.3ac39bc2227d4852@mg.twelvedevs.com>');
    expect(a).toBe(undefined);
  });

  it("does not parse References looking like having uuid", async () => {
    const a = extractThreadIdFromHeaderStr('<20230218162351.9958b8dae040af69@mg.libertymeets.com>');
    expect(a).toBe(undefined);
  });

  it("parses References string with thread id as uuid", async () => {
    const a = extractThreadIdFromHeaderStr(' <e389593f-EA57-4286-83df-b202319b4825@mg.example.com> <20230125092916.3ac39bc2227d4852@mg.example.com>');
    expect(a).toBe('e389593f-EA57-4286-83df-b202319b4825');
  });

  it("parses To string with thread id as uuid", async () => {
    const a = extractThreadIdFromHeaderStr("LibertyMeets service <5baa1452-f65b-4ef7-8b9c-bbf5f4379a9e@mg.example.com>");
    expect(a).toBe('5baa1452-f65b-4ef7-8b9c-bbf5f4379a9e');
  });
});
