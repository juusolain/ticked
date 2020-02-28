const { app, BrowserWindow, screen } = require('electron');
const path = require('path');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

if(require('electron-is-dev')){
  require('electron-reload')(__dirname);
}else{
  require('update-electron-app')();
}

app.allowRendererProcessReuse = true; //Get rid of warnings - doesnt affect this project due to always quitting after closing renderer

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const mainWindow = new BrowserWindow({
    width: 0.75*width,
    height: 0.75*height,
    webPreferences: {
      preload: __dirname + '/preload.js',
    },
    backgroundColor: '#ABCDEF'
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

