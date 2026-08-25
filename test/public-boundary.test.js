'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

test('local project state is ignored by the repository', () => {
  const ignore = fs.readFileSync(path.join(projectRoot, '.gitignore'), 'utf8');
  for (const localStateFile of ['MEMORY.md', 'TASK_BRIEF.md', 'CHANGELOG.md', 'AUTHOR.md']) {
    assert.match(ignore, new RegExp(`^${localStateFile.replace('.', '\\.')}$`, 'm'));
  }
});

test('Windows package command excludes local project state', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  const command = packageJson.scripts['package:win'];
  for (const localStateName of ['MEMORY', 'TASK_BRIEF', 'CHANGELOG', 'AUTHOR']) {
    assert.match(command, new RegExp(localStateName), localStateName);
  }
  assert.match(command, /test\|dist/);
});

test('runtime source surface stays small and explicit', () => {
  const expectedRuntimeFiles = ['index.html', 'main.js', 'preload.js', 'renderer.js', 'worker.js'];
  const runtimeFiles = fs.readdirSync(projectRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.html')))
    .map((entry) => entry.name)
    .sort();

  assert.deepEqual(runtimeFiles, expectedRuntimeFiles);
});

test('runtime files contain no local Windows user path', () => {
  for (const relativePath of ['main.js', 'preload.js', 'renderer.js', 'worker.js', 'index.html']) {
    const content = fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
    assert.doesNotMatch(content, /C:\\Users\\/i, relativePath);
  }
});
