const {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    nativeTheme
} = require('electron')

const { menu } = require('./menu')

const Store = require('electron-store');

const store = new Store();

const isWindows = process.platform === "win32";

function createWindow() {
    nativeTheme.themeSource =  store.get('theme-mode', 'system')
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minHeight:480,
        minWidth: 640,
        frame: false,
        webPreferences: {
            nodeIntegration: true,

        }

    })

    ipcMain.handle('btn-minimize:click', () => {
        if (win.minimizable) {
            win.minimize()
        }
    })

    ipcMain.handle('btn-maximize:click', () => {
        if (win.maximizable) {
            if (!win.isMaximized()) {
                win.maximize()
            } else {
                win.unmaximize()
            }
        }
    })

    ipcMain.handle('btn-close:click', () => {
        if (process.platform !== 'darwin') {
            win.close()
        }
    })

    ipcMain.on(`display-app-menu`, function (e, args) {
        if (isWindows && win) {
            menu.popup({
                window: win,
                x: args.x,
                y: args.y
            });
        }
    });

    win.on('maximize', () => {
        win.webContents.send('win-size:changed', 'maximize')
    })

    win.on('unmaximize', () => {
        win.webContents.send('win-size:changed', 'unmaximize')
    })

    win.loadFile('index.html')
}

ipcMain.handle('dark-mode:set', (event, mode) => {
    if (-1 != ['system', 'dark', 'light'].indexOf(mode)) {
        nativeTheme.themeSource = mode
        store.set('theme-mode', mode)
    }
})

ipcMain.handle('open-dialog:file', () => {
    return dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{
            name: 'Images',
            extensions: ['jpg', 'png', 'gif']
        }]
    })
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
