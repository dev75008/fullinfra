const encoder = new TextEncoder();
const aad = encoder.encode('fullinfra:ai-catalog:v1');
const iterations = 1200000;
const encode = bytes => btoa(String.fromCharCode(...bytes));
const decode = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));

function validateGroups(groups) {
  if (!Array.isArray(groups) || !groups.length || groups.length > 30) throw new Error('Catalogue invalide.');
  const ids = new Set();
  for (const group of groups) {
    if (!group || !['id','name','description'].every(k => typeof group[k] === 'string') || !Array.isArray(group.skills)) throw new Error('Domaine invalide.');
    for (const skill of group.skills) {
      if (!skill || !['id','name','summary','usage','example','requirements'].every(k => typeof skill[k] === 'string' && skill[k].length > 0) || ids.has(skill.id)) throw new Error('Fiche invalide.');
      ids.add(skill.id);
    }
  }
  return groups;
}
async function derive(password, salt, usage) {
  if (typeof password !== 'string' || !password.length || encoder.encode(password).length > 256) throw new Error('Mot de passe invalide.');
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations}, material, {name:'AES-GCM',length:256}, false, [usage]);
}
export async function sealCatalog(groups, password) {
  validateGroups(groups);
  const salt = crypto.getRandomValues(new Uint8Array(32)), iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await derive(password, salt, 'encrypt');
  const ciphertext = await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128}, key, encoder.encode(JSON.stringify(groups)));
  return {version:1,kdf:'PBKDF2-SHA-256',iterations,cipher:'AES-256-GCM',salt:encode(salt),iv:encode(iv),ciphertext:encode(new Uint8Array(ciphertext))};
}
export async function openCatalog(envelope, password) {
  if (!crypto?.subtle) throw new Error('Un navigateur récent et une connexion HTTPS sont nécessaires.');
  if (!envelope || envelope.version !== 1 || envelope.kdf !== 'PBKDF2-SHA-256' || envelope.iterations !== iterations || envelope.cipher !== 'AES-256-GCM' || typeof envelope.ciphertext !== 'string' || envelope.ciphertext.length > 2000000) throw new Error('Format de catalogue non pris en charge.');
  const salt = decode(envelope.salt), iv = decode(envelope.iv), ciphertext = decode(envelope.ciphertext);
  if (salt.length !== 32 || iv.length !== 12 || ciphertext.length < 16) throw new Error('Catalogue endommagé.');
  const key = await derive(password, salt, 'decrypt');
  let plaintext;
  try { plaintext = await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128}, key, ciphertext); }
  catch { throw new Error('Mot de passe incorrect ou catalogue endommagé.'); }
  try { return validateGroups(JSON.parse(new TextDecoder().decode(plaintext))); }
  finally { new Uint8Array(plaintext).fill(0); }
}
