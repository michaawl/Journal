const { app, BrowserWindow, ipcMain } = require('electron')
const url = require('url');
const path = require('path');


function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Journal',
        width: '1000',
        height: '600',
        webPreferences: {
            contextIsolation: true,  // ipcRenderer
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }

    });

    mainWindow.webContents.openDevTools();

    const startUrl = url.format({
        pathname: path.join(__dirname, './app/build/index.html'),

        protocol: 'file',
    })

    mainWindow.loadURL(startUrl);
}    

app.whenReady().then(createMainWindow)

ipcMain.on('submit:todoform', (event, values) => {
    console.log('Received values in main process:', values);
    // Handle the form submission logic here.
});
