// TODO make start window


// ============== MAIN VARIABLES ==============
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const GRAVITY = 0.5
const wallList = []
const GAP = 120

let makeWallIntervalID, removeWallIntervalID;
let myBird;
let gameover = false
let score = 0
let scoreOutput = document.querySelector("[data-score]")

if(window.innerWidth < 600){
    canvas.width = window.innerWidth
    canvas.height = 500
}
else{
    canvas.width = 700
    canvas.height = 400
}


// ============== END MAIN VARIABLES ==============





// ============== UTILITY FUNCTIONS ==============

function Draw(x,y){
    ctx.beginPath()
    ctx.lineWidth = 5
    ctx.lineCap = "round"
    ctx.strokeStyle = "#000"
    ctx.lineTo(x,y)
    ctx.stroke()
}

function randInt(min,max){
    return Math.floor( Math.random() * (max - min) ) + min
}

function makeWall(){
    const TopWallHeight = randInt(20,canvas.height - 200) 
    wallList.push(new Wall(TopWallHeight))
    const BottomWallHeight = GAP + canvas.height - TopWallHeight 
    const BottomWallY = GAP + TopWallHeight
    wallList.push(new Wall(BottomWallHeight,BottomWallY))
}

function removeWall(wall){
    const index =  wallList.indexOf(wall)
    wallList.splice(index,1)
}

function updateWalls(){
    
}

function collosion(box1,box2){
    return (box1.pos.x + box1.width > box2.pos.x && box1.pos.y < box2.pos.y + box2.height && box1.pos.x < box2.pos.x + box2.width && box1.pos.y + box1.height > box2.pos.y)
}
function collosion2(circle,box2){
    return (circle.pos.x + circle.width > box2.pos.x && circle.pos.y - circle.height < box2.pos.y + box2.height && circle.pos.x - circle.width < box2.pos.x + box2.width && circle.pos.y + circle.height > box2.pos.y)
}

function GameOver(){
    gameover = true
    clearInterval(makeWallIntervalID) 
    clearInterval(removeWallIntervalID) 
    myBird.speed.y = 0
    myBird.canJump = false
    wallList.forEach(wall=>{
        wall.speed = 0
    })
}

// ============== END UTILITY FUNCTIONS ==============




// ============== MAIN CLASSES ==============


class Vector2D{
    constructor(x,y){
        this.x = x
        this.y = y
    }
}

const Background = {
    pos : new Vector2D(0,0),
    draw : function(){
        ctx.beginPath()
        ctx.fillStyle = "#fff"
        ctx.fillRect(this.pos.x,this.pos.y,canvas.width,canvas.height)
        ctx.fill()
    }
}


class Bird{
    constructor(pos){
        this.pos = pos
        this.radius = 15
        this.width = this.radius
        this.height = this.radius
        this.speed = new Vector2D(0,5)
        this.jumpForce = 10
        this.canJump = true
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = "rgb(255, 230, 0)"
        ctx.arc(this.pos.x,this.pos.y,this.radius,0,Math.PI*2)
        ctx.fill()
        Draw(this.pos.x,this.pos.y)
    }
    move(){
        this.collisionWithGround()
        this.update()
    }
    collisionWithGround(){
        if(this.pos.y + this.radius + this.radius >= canvas.height) {
            this.speed.y = 0
            // correct the pos to be on tob of the ground exactly
            this.pos.y = canvas.height - this.radius
            GameOver()
        }
    }
    update(){
        this.pos.y += this.speed.y
        this.speed.y += GRAVITY
        this.draw()
    }
    jump(){
        if(this.canJump){
            this.speed.y = -(this.jumpForce - 4)
            this.pos.y -= this.jumpForce
        }
    }
}

class Wall{
    constructor(height = 200,y=0){
        this.width = 50
        this.pos = new Vector2D(canvas.width,y)
        this.height = height
        this.speed = 5
        this.frames = 0 
        this.canRemove = false
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = "rgb(255, 0, 170)"
        ctx.fillRect(this.pos.x,this.pos.y,this.width,this.height)
        ctx.fill()
    }
    move(){
        if(this.frames > 150){
            this.canRemove = true
        }
        this.draw()
        this.pos.x -= this.speed
        this.frames++
    }
}




myBird = new Bird(new Vector2D(canvas.width/4,canvas.height/6))

// ============== END MAIN CLASSES ==============




// ============== INPUT LISTENERS ==============

addEventListener("keypress",(event)=>{
    if(event.code === "Space"){
        myBird.jump()
    }
})
canvas.addEventListener("touchstart",()=>{
    myBird.jump()
})

// ============== END INPUT LISTENERS ==============




// ============== START & UPDATE ==============

makeWallIntervalID = setInterval(()=>{
    makeWall()
},1000)


// removing elements from array every 1 second if canRemove
removeWallIntervalID = setInterval(() => {
    wallList.forEach(wall=>{
        if(wall.canRemove)
            removeWall(wall)
    })
}, 1000);





function Start(){

}

function Update(){
    requestAnimationFrame(Update)

    if(!gameover){
        Background.draw()
        wallList.forEach(wall=>{
            if(collosion2(myBird,wall)){
                GameOver()
            }
            wall.move()
        })
        myBird.move()
        scoreOutput.textContent = score
        score++
    }
}

Update()

// ============== END START & UPDATE ==============










