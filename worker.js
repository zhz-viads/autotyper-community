'use strict';

const { isMainThread, parentPort, workerData } = require('node:worker_threads');

const INPUT_KEYBOARD = 1;
const KEYEVENTF_KEYUP = 0x0002;
const KEYEVENTF_UNICODE = 0x0004;
const VK_TAB = 0x09;
const VK_RETURN = 0x0d;

function splitCodePoints(text) {
  return Array.from(String(text));
}

function keyInput(wVk, wScan, flags) {
  return {
    type: INPUT_KEYBOARD,
    u: { ki: { wVk, wScan, dwFlags: flags, time: 0, dwExtraInfo: 0 } }
  };
}

function inputsForSymbol(symbol) {
  if (symbol === '\n') {
    return [keyInput(VK_RETURN, 0, 0), keyInput(VK_RETURN, 0, KEYEVENTF_KEYUP)];
  }
  if (symbol === '\t') {
    return [keyInput(VK_TAB, 0, 0), keyInput(VK_TAB, 0, KEYEVENTF_KEYUP)];
  }

  const inputs = [];
  for (let index = 0; index < symbol.length; index += 1) {
    const unit = symbol.charCodeAt(index);
    inputs.push(keyInput(0, unit, KEYEVENTF_UNICODE));
    inputs.push(keyInput(0, unit, KEYEVENTF_UNICODE | KEYEVENTF_KEYUP));
  }
  return inputs;
}

function createWin32Bindings(koffi) {
  const KEYBDINPUT = koffi.struct('COMMUNITY_KEYBDINPUT', {
    wVk: 'uint16',
    wScan: 'uint16',
    dwFlags: 'uint32',
    time: 'uint32',
    dwExtraInfo: 'uintptr_t'
  });
  const MOUSEINPUT = koffi.struct('COMMUNITY_MOUSEINPUT', {
    dx: 'int32',
    dy: 'int32',
    mouseData: 'uint32',
    dwFlags: 'uint32',
    time: 'uint32',
    dwExtraInfo: 'uintptr_t'
  });
  const HARDWAREINPUT = koffi.struct('COMMUNITY_HARDWAREINPUT', {
    uMsg: 'uint32',
    wParamL: 'uint16',
    wParamH: 'uint16'
  });
  const INPUT_UNION = koffi.union('COMMUNITY_INPUT_UNION', {
    ki: KEYBDINPUT,
    mi: MOUSEINPUT,
    hi: HARDWAREINPUT
  });
  const INPUT = koffi.struct('COMMUNITY_INPUT', { type: 'uint32', u: INPUT_UNION });
  const inputSize = koffi.sizeof(INPUT);
  if (inputSize !== 40) throw new Error(`Unsupported INPUT size: ${inputSize}. Use Windows x64.`);

  const user32 = koffi.load('user32.dll');
  return {
    inputSize,
    getForegroundWindow: user32.func('uintptr_t GetForegroundWindow()'),
    sendInput: user32.func('uint32 SendInput(uint32 cInputs, COMMUNITY_INPUT *pInputs, int cbSize)')
  };
}

function sameWindow(left, right) {
  return String(left) === String(right);
}

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function run() {
  const koffi = require('koffi');
  const win32 = createWin32Bindings(koffi);
  const symbols = splitCodePoints(workerData.text);
  let stopped = false;
  let stopReason = 'Stopped.';
  let typed = 0;
  let wasPaused = false;

  parentPort.on('message', message => {
    if (message?.type === 'stop') {
      stopped = true;
      stopReason = message.reason || stopReason;
    }
  });

  for (let remaining = workerData.countdownSeconds; remaining > 0; remaining -= 1) {
    if (stopped) break;
    parentPort.postMessage({
      state: 'countdown',
      message: `Focus the target window. Starting in ${remaining}…`,
      typed,
      total: symbols.length
    });
    await wait(1000);
  }

  if (stopped) {
    parentPort.postMessage({ state: 'ready', message: stopReason, typed: 0, total: symbols.length });
    return;
  }

  const targetWindow = win32.getForegroundWindow();
  if (!targetWindow) throw new Error('No foreground target window was detected.');

  parentPort.postMessage({ state: 'typing', message: 'Typing…', typed, total: symbols.length });

  for (const symbol of symbols) {
    while (!stopped && !sameWindow(win32.getForegroundWindow(), targetWindow)) {
      if (!wasPaused) {
        wasPaused = true;
        parentPort.postMessage({
          state: 'paused',
          message: 'Paused because the target window lost focus.',
          typed,
          total: symbols.length
        });
      }
      await wait(100);
    }

    if (stopped) break;
    if (wasPaused) {
      wasPaused = false;
      parentPort.postMessage({ state: 'typing', message: 'Target restored. Typing…', typed, total: symbols.length });
    }

    const inputs = inputsForSymbol(symbol);
    const delivered = win32.sendInput(inputs.length, inputs, win32.inputSize);
    if (delivered !== inputs.length) {
      throw new Error(`Windows accepted ${delivered} of ${inputs.length} input events.`);
    }

    typed += 1;
    parentPort.postMessage({ state: 'typing', message: 'Typing…', typed, total: symbols.length });
    if (typed < symbols.length) await wait(workerData.intervalMs);
  }

  if (stopped) {
    parentPort.postMessage({ state: 'ready', message: stopReason, typed: 0, total: symbols.length });
  } else {
    parentPort.postMessage({ state: 'done', message: `Completed ${typed} characters.`, typed, total: symbols.length });
  }
}

if (!isMainThread) {
  run().catch(error => {
    parentPort.postMessage({ state: 'error', message: error.message, typed: 0 });
  });
}

module.exports = { createWin32Bindings, splitCodePoints, inputsForSymbol, sameWindow };
