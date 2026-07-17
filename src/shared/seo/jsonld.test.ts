import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "./jsonld";

describe("serializeJsonLd", () => {
  it("serializes plain schemas unchanged in meaning", () => {
    const out = serializeJsonLd({ "@type": "Product", name: "Draculaura" });
    expect(JSON.parse(out)).toEqual({ "@type": "Product", name: "Draculaura" });
  });

  it("prevents </script> breakout through string values", () => {
    const out = serializeJsonLd({
      name: '</script><script>alert("xss")</script>',
    });
    expect(out).not.toContain("</script>");
    expect(out).not.toContain("<");
    // Still valid JSON with the original value intact
    expect(JSON.parse(out).name).toBe('</script><script>alert("xss")</script>');
  });

  it("escapes angle brackets in nested values and keys", () => {
    const out = serializeJsonLd({
      description: "a <b>bold</b> claim",
      nested: { items: ["<img src=x onerror=alert(1)>"] },
    });
    expect(out).not.toMatch(/[<>]/);
    expect(JSON.parse(out).nested.items[0]).toBe("<img src=x onerror=alert(1)>");
  });

  it("escapes U+2028/U+2029 line separators", () => {
    const name = "a\u2028b\u2029c";
    const out = serializeJsonLd({ name });
    expect(out).not.toMatch(/[\u2028\u2029]/);
    expect(JSON.parse(out).name).toBe(name);
  });
});
