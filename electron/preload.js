const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    navigate: (page) => ipcRenderer.invoke('navigate', page),

    getApiUrl: () => 'http://localhost:3000/api',

    platform: process.platform,

    version: process.versions.electron,

    selectDirectory: () => ipcRenderer.invoke('select-directory'),

    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    startUpdate: () => ipcRenderer.invoke('start-update'),
    onUpdateProgress: (callback) => ipcRenderer.on('update-progress', callback),
    onUpdateError: (callback) => ipcRenderer.on('update-error', callback),

    windowMinimize: () => ipcRenderer.invoke('window-minimize'),
    windowMaximize: () => ipcRenderer.invoke('window-maximize'),
    windowClose: () => ipcRenderer.invoke('window-close'),
    windowIsMaximized: () => ipcRenderer.invoke('window-is-maximized'),
});
