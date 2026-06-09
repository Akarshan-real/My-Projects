const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getConfig: () => ipcRenderer.invoke('get-config'),
    updateConfig: (config) => ipcRenderer.invoke('update-config', config),
    startTimer: (duration, config, isTestMode) => ipcRenderer.send('start-timer', duration, config, isTestMode),
    stopTimer: () => ipcRenderer.send('stop-timer'),
    onTick: (callback) => ipcRenderer.on('timer-tick', (_event, value) => callback(value)),
    onExecuting: (callback) => ipcRenderer.on('timer-executing', (_event, value) => callback(value)),
    onCompleted: (callback) => ipcRenderer.on('timer-completed', (_event, value) => callback(value)),
    onStopped: (callback) => ipcRenderer.on('timer-stopped', () => callback())
});
