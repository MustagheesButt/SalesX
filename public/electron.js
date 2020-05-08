const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

function createWindow(pageSrc, { bg = '#ffffff', frame = true, show = true, transparent = false } = {}) {
    let window = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: bg,
        autoHideMenuBar: true,
        frame: frame,
        show: show,
        transparent: transparent,
        icon: path.join(__dirname, 'assets/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            preload: __dirname + '/preload.js'
        }
    })

    window.loadURL(
        isDev ? 'http://localhost:3000/' + pageSrc : `file://${path.join(__dirname, "../build/", pageSrc)}`
    )

    return window
}

function createSplashWindow(pageSrc, { bg = '#ffffff', show = false, transparent = false } = {}) {
    let window = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: bg,
        autoHideMenuBar: true,
        frame: false,
        show: show,
        transparent: transparent,
        webPreferences: {
            nodeIntegration: true
        }
    })

    window.loadURL(
        isDev ? `file://${path.join(__dirname, pageSrc)}` : `file://${path.join(__dirname, "../build/", pageSrc)}`
    )

    return window
}

function createWindowMain(show = true) {
    return createWindow('index.html', { show: show })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    let mainWindow = createWindowMain(false)
    let splashWindow = createSplashWindow('splash.html')

    splashWindow.once('ready-to-show', () => splashWindow.show())

    splashWindow.once('closed', () => {
        mainWindow.show()
    })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindowMain()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const server = require('./server')