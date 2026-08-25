'use strict';

const path = require('node:path');
const { Worker } = require('node:worker_threads');
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');

let mainWindow = null;
let activeWorker = null;
let runSequence = 0;

function sendStatus(payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('typing:status', payload);
  }
}

function restoreWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

function finishRun(worker, payload) {
  if (activeWorker !== worker) return;
  activeWorker = null;
  globalShortcut.unregister('Escape');
  sendStatus(payload);
  restoreWindow();
}

function requestStop(reason = 'Stopped') {
  const worker = activeWorker;
  if (!worker) return false;

  sendStatus({ state: 'stopping', message: 'Stopping…' });
  worker.postMessage({ type: 'stop', reason });

  const fallback = setTimeout(() => {
    if (activeWorker !== worker) return;
    worker.terminate();
    finishRun(worker, { state: 'ready', message: reason, typed: 0 });
  }, 1500);
  fallback.unref();
  return true;
}

function validateStartOptions(raw) {
  const text = String(raw?.text ?? '').replace(/\r\n?/g, '\n');
  const intervalMs = Math.round(Number(raw?.intervalMs));
  const countdownSeconds = Math.round(Number(raw?.countdownSeconds));

  if (!text.length) throw new Error('Enter some text first.');
  if (text.length > 200000) throw new Error('Text is limited to 200,000 characters.');
  if (!Number.isFinite(intervalMs) || intervalMs < 10 || intervalMs > 5000) {
    throw new Error('Interval must be between 10 and 5000 milliseconds.');
  }
  if (!Number.isFinite(countdownSeconds) || countdownSeconds < 3 || countdownSeconds > 30) {
    throw new Error('Countdown must be between 3 and 30 seconds.');
  }

  return { text, intervalMs, countdownSeconds };
}

function startRun(options) {
  if (process.platform !== 'win32') throw new Error('AutoTyper Community supports Windows only.');
  if (activeWorker) throw new Error('A typing run is already active.');

  const runId = ++runSequence;
  const worker = new Worker(path.join(__dirname, 'worker.js'), {
    workerData: { ...options, runId }
  });
  activeWorker = worker;

  const registered = globalShortcut.register('Escape', () => requestStop('Stopped with Esc.'));
  if (!registered) {
    activeWorker = null;
    worker.terminate();
    throw new Error('Could not register the global Esc stop shortcut.');
  }

  worker.on('message', payload => {
    if (activeWorker !== worker) return;
    if (payload.state === 'done' || payload.state === 'ready' || payload.state === 'error') {
      finishRun(worker, payload);
      return;
    }
    sendStatus(payload);
  });

  worker.on('error', error => {
    finishRun(worker, { state: 'error', message: error.message, typed: 0 });
  });

  worker.on('exit', code => {
    if (activeWorker === worker) {
      finishRun(worker, {
        state: code === 0 ? 'ready' : 'error',
        message: code === 0 ? 'Stopped.' : `Worker exited with code ${code}.`,
        typed: 0
      });
    }
  });

  mainWindow.minimize();
  sendStatus({ state: 'countdown', message: 'Focus the target window.', typed: 0 });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 860,
    height: 680,
    minWidth: 680,
    minHeight: 560,
    backgroundColor: '#101214',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  mainWindow.loadFile('index.html');
}

ipcMain.handle('typing:start', (_event, raw) => {
  try {
    const options = validateStartOptions(raw);
    startRun(options);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

ipcMain.handle('typing:stop', () => ({ ok: requestStop('Stopped from the app.') }));

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
app.on('before-quit', () => {
  globalShortcut.unregisterAll();
  if (activeWorker) activeWorker.terminate();
});

module.exports = { validateStartOptions };
