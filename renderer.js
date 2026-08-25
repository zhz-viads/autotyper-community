'use strict';

const textInput = document.querySelector('#textInput');
const intervalInput = document.querySelector('#intervalInput');
const countdownInput = document.querySelector('#countdownInput');
const characterSummary = document.querySelector('#characterSummary');
const timeSummary = document.querySelector('#timeSummary');
const statusText = document.querySelector('#statusText');
const progressText = document.querySelector('#progressText');
const progressBar = document.querySelector('#progressBar');
const startButton = document.querySelector('#startButton');
const stopButton = document.querySelector('#stopButton');

const activeStates = new Set(['countdown', 'typing', 'paused', 'stopping']);

function codePointCount(value) {
  return Array.from(value).length;
}

function updateSummary() {
  const count = codePointCount(textInput.value);
  const interval = Math.max(0, Number(intervalInput.value) || 0);
  const countdown = Math.max(0, Number(countdownInput.value) || 0);
  const seconds = countdown + Math.max(0, count - 1) * interval / 1000;
  characterSummary.textContent = `${count.toLocaleString()} Unicode code points`;
  timeSummary.textContent = `Estimated run time: ${seconds.toFixed(1)} seconds`;
  progressBar.max = Math.max(1, count);
  if (!startButton.disabled) progressText.textContent = `0 / ${count}`;
}

function setActive(active) {
  textInput.disabled = active;
  intervalInput.disabled = active;
  countdownInput.disabled = active;
  startButton.disabled = active;
  stopButton.disabled = !active;
}

function applyStatus(payload) {
  const state = payload?.state || 'ready';
  const typed = Math.max(0, Number(payload?.typed) || 0);
  const total = Math.max(0, Number(payload?.total) || codePointCount(textInput.value));
  statusText.textContent = payload?.message || 'Ready.';
  progressBar.max = Math.max(1, total);
  progressBar.value = state === 'ready' ? 0 : Math.min(typed, total);
  progressText.textContent = state === 'ready' ? `0 / ${total}` : `${typed} / ${total}`;
  setActive(activeStates.has(state));
}

async function startTyping() {
  setActive(true);
  applyStatus({ state: 'countdown', message: 'Preparing…', typed: 0, total: codePointCount(textInput.value) });

  const result = await window.autoTyper.start({
    text: textInput.value,
    intervalMs: Number(intervalInput.value),
    countdownSeconds: Number(countdownInput.value)
  });

  if (!result.ok) {
    applyStatus({ state: 'error', message: result.error, typed: 0, total: codePointCount(textInput.value) });
  }
}

async function stopTyping() {
  stopButton.disabled = true;
  statusText.textContent = 'Stopping…';
  const result = await window.autoTyper.stop();
  if (!result.ok) applyStatus({ state: 'ready', message: 'Ready.', typed: 0 });
}

textInput.addEventListener('input', updateSummary);
intervalInput.addEventListener('input', updateSummary);
countdownInput.addEventListener('change', updateSummary);
startButton.addEventListener('click', startTyping);
stopButton.addEventListener('click', stopTyping);

const unsubscribe = window.autoTyper.onStatus(applyStatus);
window.addEventListener('beforeunload', unsubscribe);

updateSummary();
applyStatus({ state: 'ready', message: 'Ready.', typed: 0, total: codePointCount(textInput.value) });
