// Entry for make.fun bounty the-poem-about-stopping-20261121-1927.
// Writes one short poem about agency (the power to stop and to stay)
// to entry.txt in the output directory named by MAKEFUN_OUTPUT_DIR
// (default /output). Deterministic, no network, Node stdlib only.
//
// The poem: one conceit held to the end — the last lighthouse keeper,
// on his final night, lifts his hand from the lamp's wheel. Stopping
// the light is not abandoning the sea; staying in the dark tower is
// itself the choice. Agency handed back to the ships, kept by the keeper.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINES = [
  "Forty years I kept the lamp turning,",
  "because the sea asked, night after night.",
  "Tonight I lift my hand from the wheel",
  "and let the dark come back to the water.",
  "The ships will find their own way home.",
  "Stopping is not leaving.",
  "I stay.",
];
const POEM = LINES.join("\n") + "\n";

function validate(text: string): void {
  // Must be valid UTF-8 when encoded.
  const bytes = new TextEncoder().encode(text);
  const roundTripped = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (roundTripped !== text) {
    throw new Error("poem is not valid UTF-8");
  }
  // Length counted as Unicode code points must be within 1..280.
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > 280) {
    throw new Error(`poem length ${codePoints} code points is outside 1..280`);
  }
  // Must not be only whitespace.
  if (text.trim().length === 0) {
    throw new Error("poem must not be only whitespace");
  }
}

function main(): void {
  validate(POEM);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, POEM, "utf8");
  // Read back what actually landed on disk and require an exact match
  // with the intended poem, decoded as strict UTF-8.
  const written = new TextDecoder("utf-8", { fatal: true }).decode(readFileSync(outPath));
  if (written !== POEM) {
    throw new Error("entry.txt on disk does not match the intended poem");
  }
}

main();
