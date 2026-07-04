import fs from "fs";
import path from "path";

export type Rsvp = {
  name: string;
  attending: "yes" | "no";
  guests?: string;
  message?: string;
  at: string; // ISO timestamp
};

// Submissions are appended to data/rsvps.json at the project root. This works
// for local `npm run dev` / `npm start` and any host with a writable, persistent
// filesystem. (On ephemeral serverless hosts like Vercel this resets on each
// deploy — swap to a database there.)
const dir = path.join(process.cwd(), "data");
const file = path.join(dir, "rsvps.json");

export function readRsvps(): Rsvp[] {
  try {
    const raw = fs.readFileSync(file, "utf8");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addRsvp(entry: Rsvp): void {
  const all = readRsvps();
  all.push(entry);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(all, null, 2), "utf8");
}

export function clearRsvps(): void {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, "[]", "utf8");
}
