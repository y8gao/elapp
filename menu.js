const {
  app,
  Menu,
  dialog,
} = require('electron')

var os = require('os')

const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [{
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services'
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [{
        label: 'Open File...',
        click: async (item, focusWin) => {
          focusWin.webContents.send('open-file-menu:click')
        }
      },
      {
        type: 'separator'
      },
      isMac ? {
        role: 'close'
      } : {
        role: 'quit'
      }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [{
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      ...(isMac ? [{
          role: 'pasteAndMatchStyle'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectAll'
        },
        {
          type: 'separator'
        },
        {
          label: 'Speech',
          submenu: [{
              role: 'startSpeaking'
            },
            {
              role: 'stopSpeaking'
            }
          ]
        }
      ] : [{
          role: 'delete'
        },
        {
          type: 'separator'
        },
        {
          role: 'selectAll'
        }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [{
        role: 'reload'
      },
      {
        role: 'forceReload'
      },
      {
        role: 'toggleDevTools'
      },
      {
        type: 'separator'
      },
      {
        label: "Theme Mode",
        submenu: [{
            label: "System",
            type: 'radio',
            click: async (e, focusWin) => {
              if (e.checked) {
                focusWin.webContents.send('theme-mode:checked', 'system')
              }
            }
          },
          {
            label: "Light",
            type: 'radio',
            click: async (e, focusWin) => {
              if (e.checked) {
                focusWin.webContents.send('theme-mode:checked', 'light')
              }
            }
          },
          {
            label: "Dark",
            type: 'radio',
            click: async (e, focusWin) => {
              if (e.checked) {
                focusWin.webContents.send('theme-mode:checked', 'dark')
              }
            }
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        role: 'resetZoom'
      },
      {
        role: 'zoomIn'
      },
      {
        role: 'zoomOut'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [{
        role: 'minimize'
      },
      {
        role: 'zoom'
      },
      ...(isMac ? [{
          type: 'separator'
        },
        {
          role: 'front'
        },
        {
          type: 'separator'
        },
        {
          role: 'window'
        }
      ] : [{
        role: 'close'
      }])
    ]
  },
  {
    role: 'help',
    submenu: [{
        label: 'Learn More',
        click: async () => {
          const {
            shell
          } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      },
      {
        type: 'separator'
      },
      {
        label: "About",
        click: async () => {

          dialog.showMessageBox({
            type: "info",
            title: "About",
            message: "PicViewer",
            detail: [
              "Version: " + process.version,
              "Node: " + process.versions.node,
              "Electron: " + process.versions.electron,
              "Chrome: " + process.versions.chrome,
              "V8: " + process.versions.v8,
              "OS: " + os.version + " " + process.arch + " " + process.getSystemVersion()
            ].join("\n")
          })
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

module.exports = {
  menu,
};
