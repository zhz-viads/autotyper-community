const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('autoTyper', {
  start(options) {
    return ipcRenderer.invoke('typing:start', options);
  },
  stop() {
    return ipcRenderer.invoke('typing:stop');
  },
  onStatus(listener) {
    const handler = (_event, payload) => listener(payload);
    ipcRenderer.on('typing:status', handler);
    return () => ipcRenderer.removeListener('typing:status', handler);
  }
});
