/**
 * Safe JSON-LD serialization.
 *
 * JSON-LD is injected into the page via a <script type="application/ld+json">
 * tag. Values originate from the backend API, whose content ultimately comes
 * from scraped source websites — it must be treated as untrusted. A literal
 * `</script>` inside any string value would terminate the script element and
 * turn the remainder of the payload into executable markup.
 *
 * Escaping `<`, `>` and the JS line separators as \uXXXX keeps the payload
 * valid JSON (JSON.parse-compatible) while making script-tag breakout
 * impossible.
 */
export function serializeJsonLd(schema: Record<string, unknown>): string {
  return JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
