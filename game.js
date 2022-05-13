class Balloon {
    constructor (canvas, health, src, speedY) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.health = health || 1
        this.speedY = speedY || (health - 4)
        this.img = new Image()
        this.img.src = src || "/images/balloon-1.svg"
        this.size = 100
        this.x = 75 + Math.floor(Math.random() * (canvas.width - 150 - this.size))
        this.y = canvas.height + this.size
        this.display = false
        this.hit = false
        this.img.addEventListener("load", () => this.display = true)
        this.hitTop = false
    }

    draw(text = true) {
        this.ctx.drawImage(this.img, this.x, this.y, this.size, this.size)
        if (text) {
            this.ctx.font = "30px Open Sans"
            this.ctx.textAlign = "center"
            this.ctx.fillStyle = "rgb(80, 80, 80)"
            this.ctx.fillText(this.health, this.x + this.size / 2, this.y + this.size + 30)
        }
    }

    move(text = true) {
        if (this.y > -this.size - 30) {
            this.y += this.speedY
            this.draw(text)
        } else {
            this.hitTop = true
        }
    }
}

class Star {
    constructor (canvas, x) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.size = 50
        this.x = x + 8
        this.y = 40
        this.speedX = 0
        this.speedY = 5
        this.img = new Image()
        this.img.src = "/images/star.svg"
        this.display = false
        this.img.addEventListener("load", () => this.display = true)
    }

    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, this.size, this.size)
    }

    move() {
        if (this.y < this.canvas.height) {
            this.x += this.speedX
            this.y += this.speedY
            this.draw()
        } else {
            this.display = false
        }
    }
}

class StarShooter {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.size = 65
        this.x = canvas.width / 2 - this.size / 2
        this.y = 20
        this.img = new Image()
        this.img.src = "/images/party-hat.svg"
        this.display = false
        this.eventListener = ["mousemove", event => {
            this.move(event.pageX)
        }]

        this.img.addEventListener("load", () => this.display = true)
        document.addEventListener(...this.eventListener)
    }

    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, this.size, this.size)
    }

    move(pageX) {
        let canvasX = pageX - this.size / 2
        if (canvasX <= 0) {
            canvasX = 0
        } else if (canvasX >= this.canvas.width - this.size) {
            canvasX = this.canvas.width - this.size
        }
        this.x = canvasX
    }
}

class Game {
    constructor(canvas, center) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.center = center
        this.starShooter = new StarShooter(canvas)
        this.tick = 0
        this.canShoot = true
        this.balloons = []
        this.stars = []
        this.paused = false
        this.keyListener = ["keydown", event => {
            console.log(event.keyCode)
            if (event.keyCode === 32) {
                this.shootStar()
            }
        }]
        this.clickListener = ["click", event => {
            if (event.target === this.canvas || event.target === this.center) {
                this.shootStar()
            }
        }]
        this.stats = {
            health: 100,
            stars: 0,
            power: 1,
            speed: 1
        }
    }

    init() {
        document.addEventListener(...this.keyListener)
        document.addEventListener(...this.clickListener)
        const gameInterval = setInterval(() => {
            if (!this.paused) {
                if (this.tick % 2000 === 0) {
                    const randNum = Math.floor(Math.random() * 3) + 1
                    const randImage = `/images/balloon-${randNum}.svg`
                    this.balloons.push(new Balloon(this.canvas, randNum, randImage))
                }
                if (this.starShooter.display) {
                    this.canvas.width = window.innerWidth
                    this.canvas.height = window.innerHeight
                    this.ctx.clearRect(0, 0, canvas.width, canvas.height)
                    const delBalloons = []
                    for (let b = 0; b < this.balloons.length; b++) {
                        if (this.balloons[b].hitTop) {
                            this.stats.health -= this.balloons[b].health
                            delBalloons.push(b)
                        } else if (this.balloons[b].health > 0) {
                            this.balloons[b].move()
                        } else {
                            delBalloons.push(b)
                        }
                    }
                    for (const d of delBalloons) {
                        this.balloons.splice(d, 1)
                    }
                    const delStars = []
                    for (let s = 0; s < this.stars.length; s++) {
                        if (this.stars[s].display) {
                            this.stars[s].move()
                        } else {
                            delStars.push(s)
                        }
                    }
                    for (const d of delStars) {
                        this.stars.splice(d, 1)
                    }
                    this.checkCollision()
                    this.starShooter.draw()
                }
                this.tick += 10
            }
        }, 10)
    }

    shootStar() {
        if (this.canShoot) {
            this.stars.push(new Star(this.canvas, this.starShooter.x))
            this.canShoot = false
            setTimeout(() => this.canShoot = true, 300)
        }
    }

    checkCollision() {
        for (let s = 0; s < this.stars.length; s++) {
            for (let b = 0; b < this.balloons.length; b++) {
                if (this.stars[s].x < this.balloons[b].x + this.balloons[b].size &&
                  this.stars[s].x + this.stars[s].size > this.balloons[b].x &&
                  this.stars[s].y < this.balloons[b].y + this.balloons[b].size &&
                  this.stars[s].y + this.stars[s].size > this.balloons[b].y) {
                    if (!this.balloons[b].hit) {
                        this.balloons[b].health--
                        this.stats.stars ++
                        this.balloons[b].hit = true
                        setTimeout(() => this.balloons[b].hit = false, 300)
                    }

                }
            }
        }
    }

}

class BalloonBackground {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.balloons = []
        this.tick = 0
        this.paused = false
        this.interval = null
    }

    init() {
        this.interval = setInterval(() => {
            if (!this.paused) {
                if (this.tick % 1000 === 0) {
                    const randNum = Math.floor(Math.random() * 3) + 1
                    const randImage = `/images/balloon-${randNum}.svg`
                    this.balloons.push(new Balloon(this.canvas, randNum, randImage))
                }
                this.canvas.width = window.innerWidth
                this.canvas.height = window.innerHeight
                this.ctx.clearRect(0, 0, canvas.width, canvas.height)
                const delBalloons = []
                for (let b = 0; b < this.balloons.length; b++) {
                    if (this.balloons[b].hitTop) {
                        delBalloons.push(b)
                    } else {
                        this.balloons[b].move(false)
                    }
                }
                for (const d of delBalloons) {
                    this.balloons.splice(d, 1)
                }
                this.tick += 10
                
            }
        }, 10)
    }

    stop() {
        clearInterval(this.interval)
    }
}