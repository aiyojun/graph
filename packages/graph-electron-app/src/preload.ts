const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('axios', {
    get: (url) => new Promise((resolve) => {
        ipcRenderer.once('http', (e, resp) => resolve({data: resp}))
        ipcRenderer.send('http', ['GET', url])
    }),
    post: (url, data) => new Promise((resolve) => {
        ipcRenderer.once('http', (e, resp) => resolve({data: resp}))
        ipcRenderer.send('http', ['POST', url, data])
    }),
})