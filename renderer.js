const {
    ipcRenderer, remote
} = require("electron")

var path = require('path')


async function open_dialog_click_handler() {
    var imgGallery = document.getElementById('images-gallery')
    var files = await ipcRenderer.invoke('open-dialog:file')
    if (files && !files.canceled) {
        imgGallery.innerHTML=''
        files.filePaths.forEach(item => {
            var img = document.createElement('img')
            img.src = item
            img.alt = path.basename(item)
            img.classList = ['image']
            img.addEventListener('click', function () {
                var modal = document.getElementById('myModal')
                var modalImg = document.getElementById('img01')
                var capText = document.getElementById('caption')
                modal.style.display = "block"
                modalImg.src = this.src
                capText.innerHTML = this.alt
            })
            imgGallery.appendChild(img)
        })
    }
}

ipcRenderer.on('open-file-menu:click', open_dialog_click_handler)


ipcRenderer.on('theme-mode:checked', async (event, mode) => {
    await ipcRenderer.invoke('dark-mode:set', mode)
})

ipcRenderer.on('win-size:changed', (event, cmd) => {
    btnMax = document.getElementById("btn-maximize")
    if (cmd == "unmaximize") {
        btnMax.classList.remove("fa-window-restore")
        btnMax.classList.add('fa-window-maximize')
    } else if (cmd == "maximize") {
        btnMax.classList.remove('fa-window-maximize')
        btnMax.classList.add("fa-window-restore")
    }
})

// document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
//     const isDarkMode = await ipcRenderer.invoke('dark-mode:toggle')
//     document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
// })

// document.getElementById('reset-to-system').addEventListener('click', async () => {
//     await ipcRenderer.invoke('dark-mode:system')
//     document.getElementById('theme-source').innerHTML = 'System'
// })


document.getElementsByClassName('close')[0].addEventListener('click', function () {
    var modal = document.getElementById('myModal')
    modal.style.display = "none"
})

document.getElementsByClassName('modal')[0].addEventListener('click', function () {
    var modal = document.getElementById('myModal')
    modal.style.display = "none"
})

document.addEventListener('keydown', function (event) {
    var x = event.which || event.keyCode
    if (x == 27) {
        var modal = document.getElementById('myModal')
        modal.style.display = "none"
    }
})

document.getElementById("btn-minimize").addEventListener('click', async () => {
    await ipcRenderer.invoke('btn-minimize:click')
})

document.getElementById("btn-maximize").addEventListener('click', async () => {
    await ipcRenderer.invoke('btn-maximize:click')
})

document.getElementById("btn-close").addEventListener('click', async () => {
    await ipcRenderer.invoke('btn-close:click')
})

// document.getElementById("menu-file").addEventListener('click', async () => {
//     var submenu = document.getElementById('submenu-file')
//     submenu.style.display = submenu.style.display == 'block' ? 'none' : 'block'
// })

// document.getElementById("menu-view").addEventListener('click', async () => {
//     var submenu = document.getElementById('submenu-view')
//     submenu.style.display = submenu.style.display == 'block' ? 'none' : 'block'
// })

document.getElementById("app-icon").addEventListener('click',  (e) => {
    console.log(e)
    ipcRenderer.send('display-app-menu', { x: e.x, y: e.y })
})

