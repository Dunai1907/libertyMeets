import addressparser from "addressparser";

describe("addressparser", () => {
  it("can parse", () => {
    const fromStr = "Vadim Burdylev <vburdylev@twelvedevs.com>";
    const a = addressparser(fromStr);
    expect(a).toBeTruthy();
    expect(a.length).toBe(1);
    expect(a[0].address).toBe("vburdylev@twelvedevs.com");
    expect(a[0].name).toBe("Vadim Burdylev");
  });
});
