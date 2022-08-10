var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
let sx = 40;
let sy = 60;
let ax = 700;
let ay = 700;
var tx,ty,hx,hy
let invinc = 0
let hard = true
let speedmod = 6
let movement = [0,0];
let setup = false
let snake_movement = [0,0];
var body = [sx,sy,sx-20,sy];
let visited = []
let grid = []
let optimal = []
for (let i = 0; i < parseInt(canvas.height/20); i++) {
    let temp = []
    let temp2 = []
    for (let j = 0; j < parseInt(canvas.width/20); j++) {
        temp.push(0)
        temp2.push(0)
    }
    grid.push(temp)
    optimal.push(temp2)
}

let gameval = -1
let xmode = true
let snake_behind = false
let snake_ontop = false
if (sx < ax) {
    snake_behind = true
}
if (sy < ay) {
    snake_ontop = true
}
let count = 0
document.addEventListener("keydown",function(event) {
    gameval = 0
    if (event.keyCode == 68) {
        movement[0] = 20;
        movement[1] = 0;
    }
    else if (event.keyCode == 65) {
        movement[0] = -20;
        movement[1] = 0;
    }
    else if (event.keyCode == 87) {
        movement[0] = 0;
        movement[1] = -20;
    }
    else if (event.keyCode == 83) {
        movement[0] = 0;
        movement[1] = 20;
    }
})
function snakeai() {
    // if ((snake_behind && body[0] >= ax) || (!snake_behind&& body[0] <= ax)) {
    //     xmode = false
    // }
    // else if ((snake_ontop && body[1] >= ay) || (!snake_ontop && body[1] <= ay)) {
    //     xmode = true
    // }
    // if (body[0] < ax) {
    //     snake_behind = true
    // } else {
    //     snake_behind = false
    // }
    // if (body[1] < ax) {
    //     snake_ontop = true
    // } else {
    //     snake_ontop = false
    // }
    // if (xmode) {
    //     snake_movement[1] = 0
    //     if (ax > body[0]) {
    //         snake_movement[0] = 20
    //     }
    //     if (ax < body[0]) {
    //         snake_movement[0] = -20
    //     }
    // } else {
    //     snake_movement[0] = 0
    //     if (ay > body[1]) {
    //         snake_movement[1] = 20
    //     }
    //     if (ay < body[1]) {
    //         snake_movement[1] = -20
    //     }
    // }
    let m1 = [0,-20,0,20,0]
    let m2 = [0,0,-20,0,20]
    // there's a problem here but idk what it is ;( ....
    if (snake_movement[0] == 0 || snake_movement[0] != -1 * m1[optimal[body[1]/20][body[0]/20]]) {
        snake_movement[0] = m1[optimal[body[1]/20][body[0]/20]]
    }
    if (snake_movement[1] == 0 || snake_movement[1] != -1 * m2[optimal[body[1]/20][body[0]/20]]) {
        snake_movement[1] = m2[optimal[body[1]/20][body[0]/20]]
    }
}
function check_end() {
    // 0 nothing
    // 1 snake loss / player win
    // 2 player loss / snake win
    if (gameval == -1) {
        return -1
    }
    for (let i = 2; i < body.length; i+=2) {
        if (body[0] == body[i] && body[1] == body[i+1] && body[body.length-2] != sx && body[body.length-1] != sy) {
            return 1;
        }
    }
    for (let i = 0; i < body.length; i+=2) {
        if (body[i] == ax && body[i+1] == ay) {
            return 2;
        }
    }
    return 0
}
function snakemove() {
    if (gameval == -1) {
        return 0
    }
    for (let i = body.length-1; i > 1; i-=1) {
        body[i] = body[i-2];
    }
    if (body[0] + snake_movement[0] >= 0 || body[0] + snake_movement[0] < canvas.width/20) {
        body[0] = body[0] + snake_movement[0]
    }
    if (body[1] + snake_movement[1] >= 0 || body[1] + snake_movement[1] < canvas.height/20) {
        body[1] = body[1] + snake_movement[1]
    }
}
function snake() {
    if (count % 5 == 0) {
        snakeai()
        snakemove()
    }
    ctx.beginPath();
    ctx.rect(body[0],body[1],20,20)
    ctx.closePath()
    ctx.fillStyle = "black"
    ctx.fill();

    ctx.beginPath()
    for (let i = 2; i < body.length; i+=2) {
        ctx.rect(body[i],body[i+1],20,20);
    }
    ctx.closePath();
    ctx.fillStyle = "green";
    ctx.fill();
    document.getElementById("snakecoords").innerHTML = "Snake: " + String(body[0]) + " " + String(body[1])
    document.getElementById("snakestats").innerHTML = String(snake_behind) + " " + String(snake_ontop)

}
function apple() {
    if (ax == tx && ay == ty) {
        tx = (parseInt(Math.random()*100) % 70) * 20
        ty = (parseInt(Math.random()*100) % 39) * 20
        speedmod = 2
    }
    if (ax == hx && ay == hy) {
        hx = (parseInt(Math.random()*100) % 70) * 20
        hy = (parseInt(Math.random()*100) % 39) * 20
        hard = true
    }
    if (count % speedmod == 0) {
        ax += movement[0];
        ay += movement[1];
        if (ax < 0) {
            ax += 20;
        }
        if (ax >= canvas.width) {
            ax -= 20;
        }
        if (ay < 0) {
            ay += 20;
        }
        if (ay >= canvas.height) {
            ay -= 20;
        }
    }
    ctx.beginPath();
    ctx.rect(ax,ay,20,20)
    ctx.closePath();
    if (hard == false) {
        ctx.fillStyle = "red"
    } else {
        ctx.fillStyle = "#FFA500"
    }
    ctx.fill();
    document.getElementById("playercoords").innerHTML = "Apple: " + String(ax) + " " + String(ay)
}
function turbo() {
    ctx.beginPath()
    ctx.rect(tx,ty,20,20)
    ctx.closePath()
    ctx.fillStyle = "blue"
    ctx.fill();

}
function harden() {
    ctx.beginPath()
    ctx.rect(hx,hy,20,20)
    ctx.closePath()
    ctx.fillStyle = "gray"
    ctx.fill()
}
function updategrid() {
    // 0 is nothing, 1 is apple, 2 is snake
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            grid[i][j] = 0
        }
    }
    grid[ay/20][ax/20] = 1
    for (let i = 0; i < body.length; i+=2) {
        grid[body[i+1]/20][body[i]/20] = 2
    }
}
function search() {
    visited = []
    for (let i = 0; i < parseInt(canvas.height/20); i++) {
        let temp = []
        for (let j = 0; j < parseInt(canvas.width/20); j++) {
            if (grid[i][j] == 2) {
                temp.push(1)
            } else {
                temp.push(0)
            }
        }
        visited.push(temp)
    }
    queue = []
    queue.push(ax/20)
    queue.push(ay/20)
    visited[ay/20][ax/20] = 1
    while (queue.length > 0) {
        x = queue.shift()
        y = queue.shift()
        if (x == body[0]/20 && y == body[1]/20) {
            optimal[body[1]/20][body[0]/20] = 1
            break
        }
        /*
                 2
               1-X-3
                 4
         */
        if (x-1 >= 0 && visited[y][x-1] == 0) {
            // Check Left - 1
            queue.push(x-1)
            queue.push(y)
            visited[y][x-1] = 1
            optimal[y][x-1] = 3
        }if (y-1 >= 0 && visited[y-1][x] == 0) {
            // Check Up - 2
            queue.push(x)
            queue.push(y-1)
            visited[y-1][x] = 1
            optimal[y-1][x] = 4
        }if (x+1 < grid[0].length && visited[y][x+1] == 0) {
            // Check Right 3
            queue.push(x+1)
            queue.push(y)
            visited[y][x+1] = 1
            optimal[y][x+1] = 1
        }if (y+1 < grid.length && visited[y+1][x] == 0) {
            // Check Down 4
            queue.push(x)
            queue.push(y+1)
            visited[y+1][x] = 1
            optimal[y+1][x] = 2
        }
    }
    document.getElementById("win").innerHTML = optimal[body[1]/20][body[0]/20] + " " + gameval + " " + invinc + " " + count

}
function draw() {
    count += 1
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (speedmod < 6) {
        if (count % 50 == 0) {
            speedmod += 1
        }
    }
    if (gameval == -1 && setup == false) {
        count = 0
        invinc = 0
        setup = true
        updategrid()
        search()
        ax = (parseInt(Math.random()*100) % 70) * 20
        ay = (parseInt(Math.random()*100) % 39) * 20
        sx = (parseInt(Math.random()*100) % 70) * 20
        sy = (parseInt(Math.random()*100) % 39) * 20
        tx = (parseInt(Math.random()*100) % 70) * 20
        ty = (parseInt(Math.random()*100) % 39) * 20
        hx = (parseInt(Math.random()*100) % 70) * 20
        hy = (parseInt(Math.random()*100) % 39) * 20
        while (hx == tx && hy == ty) {
            hx = (parseInt(Math.random()*100) % 70) * 20
            hy = (parseInt(Math.random()*100) % 39) * 20
        }
        for (let i = 0; i < body.length-1; i+=2) {
            body[i] = sx;
            body[i+1] = sy;
        }
    }
    if (gameval == 2 && count > invinc) {
        invinc = count + 50
        if (hard == false) {
            gameval = -1
            setup = false
            movement[0] = 0
            movement[1] = 0
        } else {
            hard = false
        }
        body.push(sx)
        body.push(sy)
    }
    updategrid()
    search()
    snake();
    apple();
    turbo();
    harden();
    gameval = check_end()
    if (gameval == 1 && count > 50) {
        document.getElementById("myCanvas").style.display = "none"
    }
    if (gameval == 2 && count > invinc) {
        if (hard == false) {
            gameval = -1
            setup = false
            movement[0] = 0
            movement[1] = 0
        } else {
            hard = false
        }
        invinc = count + 50
        body.push(sx)
        body.push(sy)
    }

}

draw()
setInterval(draw,15);
