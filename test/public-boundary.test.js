'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

test('private project state is ignored by the public repository', () => {
  const ignore = fs.readFileSync(path.join(projectRoot, '.gitignore'), 'utf8');
  for (const privateFile of ['MEMORY.md', 'TASK_BRIEF.md', 'CHANGELOG.md', 'AUTHOR.md']) {
    assert.match(ignore, new RegExp(`^${privateFile.replace('.', '\\.')}$$`, 'm'));
  }
});

test('Windows package command excludes local project state', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  const command = packageJson.scripts['package:win'];
  for (const privateFile of ['MEMORY', 'TASK_BRIEF', 'CHANGELOG', 'AUTHOR']) {
    assert.match(command, new RegExp(privateFile), privateFile);
  }
  assert.match(command, /test\|dist/);
});

test('public runtime has no private V8 model modules', () => {
  const forbiddenPaths = [
    'electron/typer/model',
    'electron/typer/rhythm.js',
    'electron/typer/typo.js',
    'tools/build-protected-release.js'
  ];
  for (const relativePath of forbiddenPaths) {
    assert.equal(fs.existsSync(path.join(projectRoot, relativePath)), false, relativePath);
  }
});

test('runtime files contain no local Windows user path', () => {
  for (const relativePath of ['main.js', 'preload.js', 'renderer.js', 'worker.js', 'index.html']) {
    const content = fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
    assert.doesNotMatch(content, /C:\\Users\\/i, relativePath);
  }
});
