const { app, BrowserWindow } = require('electron')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 350,
    height: 270,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('./src/app/pages/index.html')
}

app.whenReady().then(() => {
  createWindow()
})
