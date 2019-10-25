const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

// Set environment
process.env.NODE_ENV = "development"; // production

let mainWindow, addWindow;

// Listen for app to be ready
app.on("ready", () => {
  // Create new window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    minHeight: 500,
    minWidth: 600,
    resizable: true,
    frame: false
  });
  // Load html into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "windows/mainWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.setMenuBarVisibility(false);

  // Quit all windows when closed
  mainWindow.on("closed", () => {
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Handles creating add deck window
function createAddWindow() {
  // Create new window
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add New Deck",
    webPreferences: {
      nodeIntegration: true
    }
  });
  // Load html into window
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "windows/addWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );
  // Set addwindow to null when closed to save memory
  addWindow.on("closed", () => {
    addWindow = null;
  });
}

// Catch addDeck:add
ipcMain.on("addDeck:add", (e, deck) => {
  mainWindow.webContents.send("addDeck:add", deck);
  addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
  {
    label: "Decks",
    submenu: [
      {
        label: "Add Deck",
        click() {
          createAddWindow();
          // mainWindow.webContents.send("addDeck:clear")
        }
      },
      {
        label: "Delete Deck"
      },
      {
        label: "Edit Deck"
      },
      {
        label: "Switch Deck"
      }
    ]
  },
  {
    label: "Quit",
    accelerator: process.platform == "darwin" ? "Command+W" : "Ctrl+W",
    click() {
      app.quit();
    }
  }
];

// If mac, add empty object to menu (avoids 'electron' menu item)
if (process.platform == "darwin") {
  mainMenuTemplate.unshift({});
}

// Add dev tools item if not production release
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Dev Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+Shift+I" : "Ctrl+Shift+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });
}
