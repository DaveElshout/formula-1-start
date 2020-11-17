class Car {
    constructor(name, xPosition, yPosition, color) {
        this._name = name;
        this._xPosition = xPosition;
        this._yPosition = yPosition;
        this._distance = 0;
        this.color = color;
        this.image = this.loadNewImage(`./assets/img/${color}-racing-car.png`);
        console.log(this.image);
    }
    set distance(dist) {
        this._distance = dist;
    }
    get distance() {
        return this._distance;
    }
    get xPosition() {
        return this._xPosition;
    }
    get yPosition() {
        return this._yPosition;
    }
    get name() {
        return this._name;
    }
    move(speed) {
        this._xPosition += speed;
    }
    draw(ctx) {
        ctx.drawImage(this.image, this._xPosition, this._yPosition);
    }
    loadNewImage(source) {
        const img = new Image();
        img.src = source;
        return img;
    }
}
class KeyboardListener {
    constructor() {
        this.keyDown = (ev) => {
            this.keyCodeStates[ev.keyCode] = true;
        };
        this.keyUp = (ev) => {
            this.keyCodeStates[ev.keyCode] = false;
        };
        this.keyCodeStates = new Array();
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("keyup", this.keyUp);
    }
    isKeyDown(keyCode) {
        return this.keyCodeStates[keyCode] === true;
    }
}
KeyboardListener.KEY_SPACE = 32;
KeyboardListener.KEY_LEFT = 37;
KeyboardListener.KEY_UP = 38;
KeyboardListener.KEY_RIGHT = 39;
KeyboardListener.KEY_DOWN = 40;
KeyboardListener.KEY_R = 82;
class Game {
    constructor(canvas) {
        this.redCarStarter = false;
        this.greenCarStarter = false;
        this.blueCarStarter = false;
        this.redCarBoost = false;
        this.greenCarBoost = false;
        this.blueCarBoost = false;
        this.loop = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.gameState === GameState.Begin) {
                this.beginState();
            }
            else if (this.gameState === GameState.Dice) {
                this.diceState();
            }
            else if (this.gameState === GameState.Animate) {
                this.animateState();
            }
            else if (this.gameState === GameState.End) {
                this.endState();
            }
            requestAnimationFrame(this.loop);
        };
        this.keyChecker = (ev) => {
            let pressedKey = ev.key;
            console.log(`Key ${ev.key} has been pressed`);
            const letters = "qtoagl".split("");
            if (letters.indexOf(pressedKey) >= 0) {
                if (this.pressedKeys.indexOf(pressedKey) <= -1) {
                    this.checkClickedLetter(pressedKey);
                    this.pressedKeys.push(pressedKey);
                    console.log(this.pressedKeys);
                }
            }
        };
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.keyboardListener = new KeyboardListener();
        this.gameState = GameState.Begin;
        this.myRedCar = new Car("The Red Barron", 100, 50, "red");
        this.myGreenCar = new Car("The Green Viper", 100, 250, "green");
        this.myBlueCar = new Car("The Blue Dragon", 100, 450, "blue");
        this.pressedKeys = [];
        window.addEventListener("keypress", this.keyChecker);
        this.loop();
    }
    rollDice() {
        return this.randomNumber(1, 6);
    }
    checkClickedLetter(pressedKey) {
        if (pressedKey == "q") {
            console.log("red car started");
            this.redCarStarter = true;
        }
        if (pressedKey == "t") {
            console.log("green car started");
            this.greenCarStarter = true;
        }
        if (pressedKey == "o") {
            console.log("blue car started");
            this.blueCarStarter = true;
        }
        if (pressedKey == "a") {
            this.redCarBoost = true;
            this.myRedCar.distance += this.rollDice() * 40;
        }
        if (pressedKey == "g") {
            this.greenCarBoost = true;
            this.myGreenCar.distance += this.rollDice() * 40;
        }
        if (pressedKey == "l") {
            this.blueCarBoost = true;
            this.myBlueCar.distance += this.rollDice() * 40;
        }
    }
    beginState() {
        this.draw();
        this.writeTextToCanvas("Press SPACE to start the game!", 40, this.canvas.width / 2, 30, "center", "white");
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_SPACE)) {
            console.log("space is pressed, game started!");
            this.gameState = GameState.Dice;
        }
    }
    diceState() {
        this.myRedCar.distance = this.rollDice() * 180;
        this.myGreenCar.distance = this.rollDice() * 180;
        this.myBlueCar.distance = this.rollDice() * 180;
        console.log(this.myRedCar.distance, this.myGreenCar.distance, this.myBlueCar.distance);
        this.gameState = GameState.Animate;
    }
    animateState() {
        this.draw();
        if (this.redCarStarter == false) {
            this.writeTextToCanvas("Start the engine with Q, and boost with A.", 40, this.canvas.width / 2, 100, "center", "red");
        }
        if (this.greenCarStarter == false) {
            this.writeTextToCanvas("Start the engine with T, and boost with G.", 40, this.canvas.width / 2, 300, "center", "green");
        }
        if (this.blueCarStarter == false) {
            this.writeTextToCanvas("Start the engine with Q, and boost with A.", 40, this.canvas.width / 2, 500, "center", "blue");
        }
        if (this.redCarStarter == true && this.myRedCar.xPosition - 100 < this.myRedCar.distance) {
            this.draw();
            if (this.redCarBoost == true) {
                this.writeTextToCanvas("Boosted!", 25, 200, 150, "center", "white");
                this.myRedCar.move(40);
            }
            else {
                this.myRedCar.move(this.randomNumber(5, 20));
            }
        }
        if (this.greenCarStarter == true && this.myGreenCar.xPosition - 100 < this.myGreenCar.distance) {
            this.draw();
            if (this.greenCarBoost == true) {
                this.writeTextToCanvas("Boosted!", 25, 200, 350, "center", "white");
                this.myGreenCar.move(40);
            }
            else {
                this.myGreenCar.move(this.randomNumber(5, 25));
            }
        }
        if (this.blueCarStarter == true && this.myBlueCar.xPosition - 100 < this.myBlueCar.distance) {
            this.draw();
            if (this.blueCarBoost == true) {
                this.writeTextToCanvas("Boosted!", 25, 200, 550, "center", "white");
                this.myBlueCar.move(40);
            }
            else {
                this.myBlueCar.move(this.randomNumber(5, 15));
            }
        }
        if (this.myRedCar.xPosition - 100 >= this.myRedCar.distance &&
            this.myGreenCar.xPosition - 100 >= this.myGreenCar.distance &&
            this.myBlueCar.xPosition - 100 >= this.myBlueCar.distance) {
            this.gameState = GameState.End;
        }
    }
    endState() {
        if (this.myRedCar.distance > this.myGreenCar.distance && this.myRedCar.distance > this.myBlueCar.distance) {
            this.winner = "Red Won!";
            this.color = "red";
        }
        else if (this.myGreenCar.distance > this.myRedCar.distance && this.myGreenCar.distance > this.myBlueCar.distance) {
            this.winner = "Green Won!";
            this.color = "green";
        }
        else if (this.myBlueCar.distance > this.myRedCar.distance && this.myBlueCar.distance > this.myGreenCar.distance) {
            this.winner = "Blue Won!";
            this.color = "blue";
        }
        else {
            this.winner = "It's a tie!";
        }
        this.writeTextToCanvas(this.winner, 40, this.canvas.width / 2, 650, "center", this.color);
        this.restartMechanism();
        this.draw();
    }
    restartMechanism() {
        this.writeTextToCanvas("Press anywhere to restart!", 60, this.canvas.width / 2, 700, "center", "white");
        let elem = document.getElementById('canvas');
        elem.onclick = function () {
            new Game(document.getElementById("canvas"));
        };
    }
    draw() {
        this.myRedCar.draw(this.ctx);
        this.myGreenCar.draw(this.ctx);
        this.myBlueCar.draw(this.ctx);
        this.writeTextToCanvas(this.myRedCar.name, 30, this.myRedCar.xPosition, this.myRedCar.yPosition, "start", "red");
        this.writeTextToCanvas(this.myGreenCar.name, 30, this.myGreenCar.xPosition, this.myGreenCar.yPosition, "start", "green");
        this.writeTextToCanvas(this.myBlueCar.name, 30, this.myBlueCar.xPosition, this.myBlueCar.yPosition, "start", "blue");
    }
    writeTextToCanvas(text, fontSize = 20, xCoordinate, yCoordinate, alignment = "center", color = "red") {
        this.ctx.font = `${fontSize}px Minecraft`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = alignment;
        this.ctx.fillText(text, xCoordinate, yCoordinate);
    }
    randomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}
let init = () => new Game(document.getElementById("canvas"));
window.addEventListener("load", init);
var GameState;
(function (GameState) {
    GameState[GameState["Begin"] = 0] = "Begin";
    GameState[GameState["Dice"] = 1] = "Dice";
    GameState[GameState["Animate"] = 2] = "Animate";
    GameState[GameState["End"] = 3] = "End";
})(GameState || (GameState = {}));
//# sourceMappingURL=app.js.map