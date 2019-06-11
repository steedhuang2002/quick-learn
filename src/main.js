const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu } = electron;

let mainWindow, addWindow;

// Listen for app to be ready
app.on("ready", () => {
  // Create new window
  mainWindow = new BrowserWindow({});
  // Load html into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "windows/mainWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );
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
    title: "Add New Deck"
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

// Create menu template
const mainMenuTemplate = [
  {
    label: "Decks",
    submenu: [
      {
        label: "Add Deck",
        click() {
          createAddWindow();
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
    accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
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
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
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
