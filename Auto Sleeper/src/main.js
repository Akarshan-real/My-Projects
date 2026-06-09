const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const configManager = require('./services/configManager');
const timerService = require('./services/timerService');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 680,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../build/icon.png')
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.on('close', (e) => {
        if (!app.isQuitting && timerService.timer) {
            e.preventDefault();
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
                type: 'warning',
                title: 'Timer Active',
                message: 'Auto Sleeper cannot be closed while a timer is running.',
                detail: 'Please cancel the timer first if you wish to close the application. If the PC is shutting down, the app will close automatically.',
                buttons: ['OK']
            });
        }
    });
}

app.on('before-quit', () => {
    app.isQuitting = true;
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-config', () => {
    return configManager.getConfig();
});

ipcMain.handle('update-config', (event, newConfig) => {
    configManager.updateConfig(newConfig);
    return true;
});

ipcMain.on('start-timer', (event, duration, config, isTestMode) => {
    timerService.start(duration, config, isTestMode);
});

ipcMain.on('stop-timer', () => {
    timerService.stop();
});

// Forward timer events to renderer
timerService.on('tick', (seconds) => {
    if (mainWindow) mainWindow.webContents.send('timer-tick', seconds);
});

timerService.on('executing', (status) => {
    if (mainWindow) mainWindow.webContents.send('timer-executing', status);
});

timerService.on('completed', (message) => {
    if (mainWindow) mainWindow.webContents.send('timer-completed', message);
});

timerService.on('stopped', () => {
    if (mainWindow) mainWindow.webContents.send('timer-stopped');
});
