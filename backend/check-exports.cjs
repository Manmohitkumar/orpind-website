const fs = require('fs');
const path = require('path');
const routeDir = 'src/routes/v1';
const ctrlDir = 'src/controllers';

const routeFiles = fs.readdirSync(routeDir).filter(f => f.endsWith('.routes.js'));
const errors = [];

for (const rf of routeFiles) {
  const routeContent = fs.readFileSync(path.join(routeDir, rf), 'utf8');
  const importRegex = /import \* as (\w+) from ["']([^"']+)["']/;
  const ctrlMatch = routeContent.match(importRegex);
  if (!ctrlMatch) continue;
  const alias = ctrlMatch[1];
  const ctrlPath = ctrlMatch[2];
  
  const resolved = path.resolve(routeDir, ctrlPath);
  if (!fs.existsSync(resolved)) {
    errors.push(rf + ': controller file not found: ' + ctrlPath);
    continue;
  }
  
  const ctrlContent = fs.readFileSync(resolved, 'utf8');
  const exportBlock = ctrlContent.match(/export const \{([^}]+)\}/);
  if (!exportBlock) {
    errors.push(rf + ': no named exports found in controller');
    continue;
  }
  const exported = exportBlock[1].split(',').map(s => s.trim()).filter(Boolean);
  
  const refRegex = new RegExp(alias + '\\.([a-zA-Z]+)', 'g');
  const refs = [...routeContent.matchAll(refRegex)];
  for (const ref of refs) {
    const method = ref[1];
    if (!exported.includes(method)) {
      errors.push(rf + ': ' + alias + '.' + method + ' NOT in exports: [' + exported.join(', ') + ']');
    }
  }
}

if (errors.length === 0) {
  console.log('All controller references OK!');
} else {
  errors.forEach(e => console.log('ERROR: ' + e));
  console.log('\nTotal errors: ' + errors.length);
}
