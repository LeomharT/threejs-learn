import { lstatSync, readdirSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dirs = readdirSync(resolve('src/'));

const input = {};

for (const d of dirs) {
  const dirPath = __dirname + sep + 'src';

  const filePath = dirPath + sep + d;

  const status = lstatSync(filePath);

  if (status.isDirectory()) {
    input[d] = resolve(filePath, 'index.html');
  }
}

console.log(resolve(__dirname, 'src/aaa/index.html'));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {},
    },
  },
});
