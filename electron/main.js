const { app, BrowserWindow, ipcMain, dialog, nativeImage } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let serverProcess;

const isDev = process.env.ELECTRON_IS_DEV === '0' ? false : !app.isPackaged;
const BACKEND_PORT = process.env.BACKEND_PORT || process.env.PORT || 3500;

let splashWindow;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 380,
    height: 280,
    frame: false,
    transparent: true,
    resizable: false,
    center: true,
    alwaysOnTop: true,
    webPreferences: { contextIsolation: true }
  });

  const splashHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, 'Inter', sans-serif;
          background: rgba(9, 9, 11, 0.97);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          border-radius: 16px;
          border: 1px solid rgba(139, 92, 246, 0.25);
        }
        .logo { 
          font-size: 42px; 
          font-weight: 900;
          margin-bottom: 16px; 
          filter: drop-shadow(0 0 24px rgba(139,92,246,0.5)); 
          background: linear-gradient(135deg, #fff 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .title { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
        .sub { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 4px; }
        .loader {
          margin-top: 28px;
          width: 120px;
          height: 3px;
          background: rgba(255,255,255,0.08);
          border-radius: 99px;
          overflow: hidden;
        }
        .bar {
          height: 100%;
          width: 40%;
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
          border-radius: 99px;
          animation: slide 1.2s ease-in-out infinite;
        }
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        .status { margin-top: 14px; font-size: 11px; color: rgba(255,255,255,0.3); }
      </style>
    </head>
    <body>
      <div class="logo">Vz</div>
      <div class="title">iFinance</div>
      <div class="sub">Financial Manager</div>
      <div class="loader"><div class="bar"></div></div>
      <div class="status">Đang khởi động dịch vụ...</div>
    </body>
    </html>
  `;

  splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(splashHTML)}`);
}

function closeSplash() {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.close();
    splashWindow = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, '../frontend/assets/icon.png'),
    show: false,
    backgroundColor: '#09090b'
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../client/dist/index.html'));
  }

  const { shell } = require('electron');
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://t.me/')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startBackendServer() {
  const serverPath = path.join(__dirname, '../backend/server.js');

  serverProcess = spawn(process.execPath, [serverPath], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      NODE_ENV: isDev ? 'development' : 'production',
      PORT: String(BACKEND_PORT)
    }
  });

  serverProcess.on('error', (err) => {
    console.error('Failed to start backend server:', err);
  });

  serverProcess.on('exit', (code) => {
    console.log(`Backend server exited with code ${code}`);
  });
}

function setupAutoUpdater() {
  // Never run auto-updater in dev mode
  if (isDev) return;

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.setFeedURL({
    provider: 'generic',
    url: `http://localhost:${BACKEND_PORT}/updates`
  });

  autoUpdater.on('checking-for-update', () => {
    console.log('[AutoUpdater] Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('[AutoUpdater] Update available:', info.version);
  });

  autoUpdater.on('update-not-available', () => {
    console.log('[AutoUpdater] No update available.');
  });

  autoUpdater.on('download-progress', (progressObj) => {
    if (mainWindow) {
      mainWindow.webContents.send('update-progress', progressObj);
    }
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('[AutoUpdater] Update downloaded. Installing...');
    autoUpdater.quitAndInstall(false, true);
  });

  autoUpdater.on('error', (err) => {
    console.error('[AutoUpdater] Error:', err.message);
    if (mainWindow) {
      mainWindow.webContents.send('update-error', err.message);
    }
  });
}

app.whenReady().then(() => {
  // Show splash immediately while backend starts
  createSplashWindow();
  startBackendServer();

  // Poll the backend until it responds, then open the window
  const MAX_WAIT_MS = 30000; // 30 seconds max
  const POLL_INTERVAL_MS = 500;
  let waited = 0;

  function waitForBackend() {
    const http = require('http');
    const req = http.get(`http://127.0.0.1:${BACKEND_PORT}/api/releases/current`, (res) => {
      // Any response (even 4xx) means the server is up
      closeSplash();
      createWindow();
      setupAutoUpdater();
    });
    req.on('error', () => {
      waited += POLL_INTERVAL_MS;
      if (waited >= MAX_WAIT_MS) {
        console.error('Backend did not start in time. Opening window anyway.');
        closeSplash();
        createWindow();
        setupAutoUpdater();
      } else {
        setTimeout(waitForBackend, POLL_INTERVAL_MS);
      }
    });
    req.setTimeout(400, () => {
      req.destroy();
      waited += POLL_INTERVAL_MS;
      if (waited >= MAX_WAIT_MS) {
        closeSplash();
        createWindow();
        setupAutoUpdater();
      } else {
        setTimeout(waitForBackend, POLL_INTERVAL_MS);
      }
    });
  }

  // Give the backend process a moment to spawn before polling
  setTimeout(waitForBackend, 1500);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

// ─── IPC Handlers ────────────────────────────────────────────────────────────

ipcMain.handle('navigate', (event, page) => {
  const pagePath = path.join(__dirname, '../frontend/pages', `${page}.html`);
  if (mainWindow) mainWindow.loadFile(pagePath);
});

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

// Window control handlers for custom titlebar
ipcMain.handle('window-minimize', () => { if (mainWindow) mainWindow.minimize(); });
ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  }
});
ipcMain.handle('window-close', () => { if (mainWindow) mainWindow.close(); });
ipcMain.handle('window-is-maximized', () => mainWindow ? mainWindow.isMaximized() : false);

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('start-update', async () => {
  try {
    await autoUpdater.downloadUpdate();
  } catch (err) {
    console.error('[AutoUpdater] Download failed:', err.message);
    if (mainWindow) {
      mainWindow.webContents.send('update-error', err.message);
    }
  }
});
