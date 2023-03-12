import { BrowserWindow, Menu, app, nativeImage } from 'electron'
import * as path from 'path'

const createWindow = () => {
    Menu.setApplicationMenu(null)
    const win = new BrowserWindow({
        width: 800, height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'index.js')
        }
    })
    win.setIcon(nativeImage.createFromPath('../public/favicon.ico'))
    win.loadFile('../dist/index.html')
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

console.info(`... app main.ts ...`)
