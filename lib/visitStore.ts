import fs from "fs";
import path from "path";

export type Visit = {
  id: string; // sha256(ip + "|" + userAgent) — the unique device+IP key
  ip: string;
  userAgent: string;
  country?: string;
  city?: string;
  region?: string;
  firstSeen: string;
  lastSeen: string;
  hits: number;
};

const dir = path.join(process.cwd(), "data");
const file = path.join(dir, "visits.json");

export function readVisits(): Visit[] {
  try {
    const raw = fs.readFileSync(file, "utf8");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function writeVisits(all: Visit[]): void {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(all, null, 2), "utf8");
}

export function clearVisits(): void {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, "[]", "utf8");
}
