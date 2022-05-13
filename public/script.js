document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const settingsBtn = document.getElementById("settings-btn")
    const settings = document.getElementById("settings")
    settings.style.zIndex = 1000
    const darkOverlay = document.getElementById("dark-overlay")
    let showSettings = false

    const playBtn = document.getElementById("play-btn")
    playBtn.addEventListener("click", () => {
        startGame()
    })
    
    const center = document.getElementById("center")
    const stats = document.getElementById("stats")

    const starTracker = document.getElementById("star-tracker")
    const healthTracker = document.getElementById("health-tracker")
    const powerTracker = document.getElementById("power-tracker")
    const speedTracker = document.getElementById("speed-tracker")

    const game = new Game(canvas, center)

    const balloonBackground = new BalloonBackground(canvas)
    balloonBackground.init()

    function toggleSettings() {
        settings.classList.remove("hide-settings-2")
        if (showSettings) {
            settings.classList.remove("show-settings")
            settings.classList.add("hide-settings")
            darkOverlay.style.opacity = 0
            game.paused = false
            balloonBackground.paused = false
            showSettings = false
        } else {
            settings.classList.remove("hide-settings")
            settings.classList.add("show-settings")
            darkOverlay.style.opacity = 1
            game.paused = true
            balloonBackground.paused = true
            showSettings = true
        }
    }

    document.addEventListener("keydown", event => {
        if (event.keyCode === 83 || event.keyCode === 27) {
            toggleSettings()
        } 
    })

    settingsBtn.addEventListener("click", toggleSettings)

    const mainText = document.getElementById("main-text")
    const smallText = document.getElementById("small-text")

    let show = true
    function toggleShow() {
        if (show) {
            mainText.style.opacity = 0.2
            smallText.style.opacity = 0.2
            show = false
        } else {
            mainText.style.opacity = 0.8
            smallText.style.opacity = 1
            show = true
        }
    }

    function startGame() {
        toggleShow()
        playBtn.style.opacity = 0
        playBtn.style.pointerEvents = "none"
        stats.style.opacity = 1

        balloonBackground.paused = true
        balloonBackground.stop()
        game.init()

        const statTracker = setInterval(() => {
            starTracker.innerText = game.stats.stars
            healthTracker.innerText = game.stats.health
        }, 100)
    }

})