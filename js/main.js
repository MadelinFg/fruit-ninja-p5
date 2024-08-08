// GENERAL VARIABLES
var cnv;
var score, points = 0;
var lives, x = 0;
var isPlay = false;
var gravity = 0.1;
var sword;
var fruit = [];
var fruitsList = ['apple', 'banana', 'peach', 'strawberry', 'watermelon', 'boom'];
var fruitsImgs = [], slicedFruitsImgs = [];
var livesImgs = [], livesImgs2 = [];
var boom, spliced, missed, over, start; // sounds
// var button, startButton;
// var timer;
// var counter = 60;
// var seconds, minutes;
// var timerValue = 60;

function preload() {
    // LOAD SOUNDS
    boom = loadSound('sounds/boom.mp3');
    spliced = loadSound('sounds/splatter.mp3');
    missed = loadSound('sounds/missed.mp3');
    start = loadSound('sounds/start.mp3');
    over = loadSound('sounds/over.mp3');

    // LOAD IMAGES
    for (var i = 0; i < fruitsList.length - 1; i++) {
        slicedFruitsImgs[2 * i] = loadImage('images/' + fruitsList[i] + '-1.png');
        slicedFruitsImgs[2 * i + 1] = loadImage('images/' + fruitsList[i] + '-2.png');
    }
    for (var i = 0; i < fruitsList.length; i++) {
        fruitsImgs[i] = loadImage('images/' + fruitsList[i] + '.png');
    }
    for (var i = 0; i < 3; i++) {
        livesImgs[i] = loadImage('images/x' + (i + 1) + '.png');
    }
    for (var i = 0; i < 3; i++) {
        livesImgs2[i] = loadImage('images/xx' + (i + 1) + '.png');
    }

    bg = loadImage('images/background.jpg');
    foregroundImg = loadImage('images/home-mask.png');
    fruitLogo = loadImage('images/fruit.png');
    ninjaLogo = loadImage('images/ninja.png');
    scoreImg = loadImage('images/score.png');
    newGameImg = loadImage('images/new-game.png');

    fruitImg = loadImage('images/fruitMode.png');
    gameOverImg = loadImage('images/game-over.png');
}

function setup() {
    cnv = createCanvas(1800, 2635);
    sword = new Sword(color("#FFFFFF"));
    frameRate(60);
    score = 0;
    lives = 3;
}

function draw() {
    clear();
    background(bg);

    /**
     * @params path - x - y - width - height
     */
    image(this.foregroundImg, 0, 0, 1800, 550);
    image(this.fruitLogo, 110, 30, 790, 330);
    image(this.ninjaLogo, 930, 125, 540, 215);
    image(this.newGameImg, 610, 960, 500, 500); // Draws the New Game blue circle on screen
    image(this.fruitImg, 790, 1125, 160, 160); // Draws the watermelon on screen

    cnv.mouseClicked(check);
    if (isPlay) {
        game();
    }
    //     if (timerValue >= 60) {
    //         text("0:" + timerValue, width / 2, height / 2);
    //     }
    //     if (timerValue < 60) {
    //         text('0:0' + timerValue, width / 2, height / 2);
    //     }
}

function check() { // Check for game start
    console.log("mouseX:", mouseX)
    console.log("mouseY:", mouseY)
    if (!isPlay && (mouseX > 750 && mouseX < 950 && mouseY > 900 && mouseY < 1290)) {
    // if (!isPlay && (mouseX > 300 && mouseX < 520 && mouseY > 350 && mouseY < 550)) {
        start.play();
        isPlay = true;
    }
}

function game() {
    clear();
    background(bg);
    if (mouseIsPressed) { // Draw sword
        // image(fruitImg, mouseX, mouseY);
        sword.swipe(mouseX, mouseY);
    }
    if (frameCount % 5 === 0) {
        if (noise(frameCount) > 0.69) {
            fruit.push(randomFruit()); // Display new fruit
        }
    }
    points = 0
    for (var i = fruit.length - 1; i >= 0; i--) {
        fruit[i].update();
        fruit[i].draw();
        if (!fruit[i].visible) {
            if (!fruit[i].sliced && fruit[i].name != 'boom') { // Missed fruit
                image(this.livesImgs2[0], fruit[i].x, fruit[i].y - 120, 50, 50);
                missed.play();
                lives--;
                x++;
            }
            if (lives < 1) { // Check for lives
                gameOver();
            }
            fruit.splice(i, 1);
        } else {
            if (fruit[i].sliced && fruit[i].name == 'boom') { // Check for bomb
                boom.play()
                gameOver();
            }
            if (sword.checkSlice(fruit[i]) && fruit[i].name != 'boom') { // Sliced fruit
                spliced.play();
                points++;
                fruit[i].update();
                fruit[i].draw();
            }
        }
    }
    if (frameCount % 2 === 0) {
        sword.update();
    }
    sword.draw();
    score += points;
    drawScore();
    drawLives();
}

function drawLives() {

    /**
     * @params path - x - y - width - height
     */
    image(this.livesImgs[0], width - 320, 200, livesImgs[0].width + 45, livesImgs[0].height + 45);
    image(this.livesImgs[1], width - 240, 200, livesImgs[1].width + 50, livesImgs[1].height + 50);
    image(this.livesImgs[2], width - 150, 200, livesImgs[2].width + 60, livesImgs[2].height + 60);

    if (lives <= 2) {
        image(this.livesImgs2[0], width - 320, 200, livesImgs2[0].width + 45, livesImgs2[0].height + 45);
    }
    if (lives <= 1) {
        image(this.livesImgs2[1], width - 240, 200, livesImgs2[1].width + 50, livesImgs2[1].height + 50);
    }
    if (lives === 0) {
        image(this.livesImgs2[2], width - 150, 200, livesImgs2[2].width + 60, livesImgs2[2].height + 60);
    }
}

function drawScore() {
    
    /**
     * @params path - x - y - width - height
     */
    image(this.scoreImg, 90, 230, 70, 70); // Draws the watermelon on screen

    textAlign(LEFT);
    noStroke();
    fill(255, 147, 21);
    textSize(100);

    /**
     * @params text - x - y
     */
    text(score, 170, 300); // Draws the score text next to the watermenlon image
}

function gameOver() {
    noLoop();
    over.play();
    clear();
    background(bg);

    /**
     * @params path - x - y - width - height
     */
    image(this.gameOverImg, 650, 1180, 490, 85); // Draws the Game Over image on scren

    lives = 0;

    button = createButton("Play again"); // Draw a Reset button to allow the user to go home
    button.id("reset");
    button.style("background-color", "maroon");
    button.style('font-size', '100px');
    button.style('color', '#fff');
    button.style('border', 'none');
    button.style('padding', '50px');
    button.position(890, 1350);
    button.mousePressed(resetSketch);
}

function resetSketch() {
    button.hide()

    isPlay = false
    score = 0
    lives = 3

    setup()
    draw()
}

// timer = createP("timer");
// setInterval(timeIt, 1000);

// textAlign(CENTER);
// setInterval(timeIt, 1000);

//   if (timerValue == 0) {
//     text('game over', width / 2, height / 2 + 15);
//   }
// fruit.push(new Fruit(random(width),height,3,"#FF00FF",random()));

// function timeIt() {
//     console.log("time");
//     if (timerValue > 0) {
//         console.log(timerValue);
//         timerValue--;
//         textAlign(CENTER);
//         noStroke();
//         fill(255,147,21);
//         textSize(50);
//         text(timerValue, 200, 250);
//     }
//   }