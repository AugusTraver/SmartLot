export function isPayloadTooBig(body) {
  const bytes = new TextEncoder().encode(JSON.stringify(body)).length;
  return bytes > 10_000;
}
