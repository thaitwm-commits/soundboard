#!/usr/bin/env node
/**
 * Scans /sound for audio files and writes /sounds.json.
 * Run manually with `node scripts/generate-manifest.js`, or let the
 * GitHub Action in .github/workflows/update-soundboard.yml run it
 * automatically on every push that touches sound/**.
 *
 * Folder convention:
 *   sound/Scene 1.1/applause.mp3   -> grouped under "Scene 1.1"
 *   sound/gavel-bang.mp3           -> grouped under "General"
 * Sort order within a group follows filename, so prefix files with
 * numbers (01-applause.mp3, 02-gavel.mp3) to control cue order.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOUND_DIR = path.join(ROOT, 'sound');
const OUTPUT_FILE = path.join(ROOT, 'sounds.json');
const AUDIO_EXT = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];

function toLabel(filename) {
  const name = filename.replace(/\.[^/.]+$/, '');
  const cleaned = name.replace(/^\d+[-_.\s]*/, ''); // strip leading order prefix like "01-"
  return cleaned
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || name;
}

function scanFlat(dir, relBase) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile())
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  for (const entry of entries) {
    const ext = path.extname(entry.name).toLowerCase();
    if (!AUDIO_EXT.includes(ext)) continue;
    files.push({
      file: entry.name,
      label: toLabel(entry.name),
      path: 'sound/' + (relBase ? relBase + '/' : '') + entry.name,
    });
  }
  return files;
}

function buildManifest() {
  const groups = [];

  // Files directly inside sound/ -> "General" group
  const rootFiles = scanFlat(SOUND_DIR, '');
  if (rootFiles.length) {
    groups.push({ name: 'General', cues: rootFiles });
  }

  // One subfolder = one group, in folder-name order
  if (fs.existsSync(SOUND_DIR)) {
    const subdirs = fs.readdirSync(SOUND_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    for (const dir of subdirs) {
      const cues = scanFlat(path.join(SOUND_DIR, dir.name), dir.name);
      if (cues.length) {
        groups.push({ name: dir.name, cues });
      }
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    totalCues: groups.reduce((sum, g) => sum + g.cues.length, 0),
    groups,
  };
}

const manifest = buildManifest();
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${OUTPUT_FILE}`);
console.log(`Groups: ${manifest.groups.length}, total cues: ${manifest.totalCues}`);
