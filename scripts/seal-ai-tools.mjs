import { writeFile } from 'node:fs/promises';
import { sealCatalog, openCatalog } from '../src/ai-vault.mjs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

let password='';
if(process.stdin.isTTY) {
  process.stdout.write('Nouveau mot de passe (saisie masquée) : ');
  process.stdin.setRawMode(true);process.stdin.resume();process.stdin.setEncoding('utf8');
  password=await new Promise((resolve,reject)=>{
    const read=chunk=>{for(const char of chunk){if(char==='\u0003'){process.stdin.setRawMode(false);process.stdin.pause();reject(new Error('Annulé.'));return;}if(char==='\r'||char==='\n'){process.stdin.off('data',read);process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n');resolve(password);return;}if(char==='\u007f'||char==='\b')password=password.slice(0,-1);else password+=char;}};
    process.stdin.on('data',read);
  });
}else {for await(const chunk of process.stdin)password+=chunk.toString();password=password.replace(/\r?\n$/,'');}
if(password.length<10 || Buffer.byteLength(password)>256)throw new Error('Choisissez entre 10 caractères et 256 octets. Une phrase de passe longue est préférable.');
const source=resolve(process.argv[2] || 'server/ai-skills.mjs');
const {skillGroups}=await import(pathToFileURL(source).href);
const encrypted=await sealCatalog(skillGroups,password);
const verified=await openCatalog(encrypted,password);password='';
if(verified.flatMap(g=>g.skills).length!==52)throw new Error('52 fiches attendues.');
await writeFile(new URL('../public/ai-catalog.enc.json',import.meta.url),JSON.stringify(encrypted)+'\n');
console.log('Catalogue chiffré et vérifié : 52 fiches. Aucun mot de passe enregistré.');
