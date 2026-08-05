import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATES_DIR = join(__dirname, 'templates');

const templateCache = new Map();

async function loadTemplate(templateName) {
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName);
  }

  const filePath = join(TEMPLATES_DIR, `${templateName}.html`);
  const content = await readFile(filePath, 'utf-8');
  templateCache.set(templateName, content);
  return content;
}

export async function renderTemplate(templateName, data = {}) {
  let html = await loadTemplate(templateName);

  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    const safeValue = value === null || value === undefined ? '' : String(value);
    html = html.replace(placeholder, safeValue);
  }

  const remainingPlaceholders = html.match(/\{\{[^}]+\}\}/g);
  if (remainingPlaceholders) {
    for (const placeholder of remainingPlaceholders) {
      html = html.replace(placeholder, '');
    }
  }

  return html;
}

export function clearTemplateCache() {
  templateCache.clear();
}
