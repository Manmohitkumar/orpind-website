const fs = require('fs');
const path = require('path');

const ctrlDir = 'src/controllers';
const svcDir = 'src/services';

const ctrlFiles = fs.readdirSync(ctrlDir).filter(f => f.endsWith('.js'));
const mismatches = [];

for (const cf of ctrlFiles) {
  const ctrlContent = fs.readFileSync(path.join(ctrlDir, cf), 'utf8');
  const importRegex = /import (\w+) from ["']([^"']+\.service\.js)["']/g;
  const svcImports = [...ctrlContent.matchAll(importRegex)];
  
  for (const match of svcImports) {
    const alias = match[1];
    const svcPath = match[2];
    const resolved = path.resolve(ctrlDir, svcPath);
    if (!fs.existsSync(resolved)) {
      mismatches.push(cf + ' -> ' + svcPath + ' FILE NOT FOUND');
      continue;
    }
    
    const svcContent = fs.readFileSync(resolved, 'utf8');
    const methods = [...svcContent.matchAll(/async ([a-zA-Z]+)\s*\(/g)].map(m => m[1]);
    const methodCalls = [...ctrlContent.matchAll(new RegExp(alias + '\\.([a-zA-Z]+)\\s*\\(', 'g'))];
    
    for (const mc of methodCalls) {
      const methodName = mc[1];
      if (!methods.includes(methodName)) {
        mismatches.push(cf + ' -> ' + svcPath.split('/').pop() + '.' + methodName + ' NOT FOUND (has: ' + methods.join(', ') + ')');
      }
    }
  }
}

if (mismatches.length === 0) {
  console.log('All service method references OK!');
} else {
  mismatches.forEach(m => console.log('MISMATCH: ' + m));
  console.log('Total: ' + mismatches.length);
}
