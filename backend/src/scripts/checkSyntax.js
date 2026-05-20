const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const targets = [path.join(root, 'server.js'), path.join(root, 'src')];

function collectJavaScriptFiles(target) {
  const stat = fs.statSync(target);

  if (stat.isFile()) {
    return target.endsWith('.js') ? [target] : [];
  }

  return fs.readdirSync(target).flatMap((entry) =>
    collectJavaScriptFiles(path.join(target, entry))
  );
}

const files = targets.flatMap(collectJavaScriptFiles);

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}
