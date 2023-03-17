import { BrowserWindow, Menu, app, nativeImage, ipcMain } from 'electron'
import * as path from 'path'
import axios from "axios";

let win
const proxy = `http://10.8.7.2:8080`
const prefix = `/api`

const createWindow = () => {
    Menu.setApplicationMenu(null)
    win = new BrowserWindow({
        width: 800, height: 600,
        icon: '../../graph-engine/src/assets/favicon.png',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('../../graph-web-app/dist/index.html')
    // win.maximize()
    // win.webContents.openDevTools()
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
ipcMain.on('http', (e, [method, url, data]) => {
    url = url.replace(prefix, '')
    const handle = {
        GET : () => { axios.get(`${proxy}${url}`).then(resp => win.webContents.send('http', resp.data)) },
        POST: () => { axios.post(`${proxy}${url}`, data).then(resp => win.webContents.send('http', resp.data)) },
    }
    if (handle[method] !== undefined) {
        handle[method]()
    }
})

console.info(`... app main.ts ...`)
