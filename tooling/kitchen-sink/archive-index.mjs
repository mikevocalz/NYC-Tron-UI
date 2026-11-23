import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { candidateArchives, sha256 } from './prepare-consumer.mjs';

const directory = resolve(process.argv[2] ?? '');
if (!process.argv[2]) throw new Error('Usage: archive-index.mjs <packed-candidate-directory>');
const archives = candidateArchives(directory);
if (new Set(archives.map(archive => archive.version)).size !== 1) throw new Error('Candidate versions differ');
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const sourceDirty = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim().length > 0;
if (process.env.CI && sourceDirty) throw new Error('CI candidate archives require a clean source checkout');
writeFileSync(join(directory, 'candidate.json'), JSON.stringify({ schemaVersion: 1, sourceCommit, sourceDirty, version: archives[0].version, archives }, null, 2) + '\n');
writeFileSync(join(directory, 'SHA256SUMS'), archives.map(archive => `${sha256(readFileSync(join(directory, archive.filename)))}  ${archive.filename}`).join('\n') + '\n');
