'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { inputsForSymbol, sameWindow, splitCodePoints } = require('../worker');

test('splitCodePoints keeps surrogate pairs atomic', () => {
  assert.deepEqual(splitCodePoints('A😀𠮷中'), ['A', '😀', '𠮷', '中']);
});

test('BMP Unicode character produces one keydown and keyup pair', () => {
  const inputs = inputsForSymbol('中');
  assert.equal(inputs.length, 2);
  assert.equal(inputs[0].u.ki.wScan, '中'.charCodeAt(0));
  assert.equal(inputs[0].u.ki.dwFlags, 0x0004);
  assert.equal(inputs[1].u.ki.dwFlags, 0x0006);
});

test('supplementary Unicode character is one atomic four-event batch', () => {
  const inputs = inputsForSymbol('😀');
  assert.equal(inputs.length, 4);
  assert.equal(inputs[0].u.ki.wScan, 0xd83d);
  assert.equal(inputs[2].u.ki.wScan, 0xde00);
});

test('newline and tab use ordinary virtual control keys', () => {
  const newline = inputsForSymbol('\n');
  const tab = inputsForSymbol('\t');
  assert.equal(newline[0].u.ki.wVk, 0x0d);
  assert.equal(tab[0].u.ki.wVk, 0x09);
  assert.equal(newline[1].u.ki.dwFlags, 0x0002);
  assert.equal(tab[1].u.ki.dwFlags, 0x0002);
});

test('window handles compare consistently across number representations', () => {
  assert.equal(sameWindow(123n, '123'), true);
  assert.equal(sameWindow(123n, 124), false);
});
