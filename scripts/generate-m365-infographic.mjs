import { readFile, writeFile } from 'node:fs/promises';
import { renderDependencySvg } from '../src/dependencySvg.js';
const target=new URL('../public/infographie-microsoft365.svg',import.meta.url);
const svg=renderDependencySvg('',true);
if (process.argv.includes('--check')) {
  if (await readFile(target,'utf8') !== svg) throw new Error('Regenerate the Microsoft 365 SVG after changing dependencies.');
} else await writeFile(target,svg);
console.log('OK : infographie SVG Microsoft 365 synchronisée.');
