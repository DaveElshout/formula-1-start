/// <reference path="Car.ts" />
/// <reference path="KeyboardListener.ts" />

class Game {
  // Necessary canvas attributes
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  // KeyboardListener so the player can move
  private keyboardListener: KeyboardListener;

  // the state of the game: begin, dice and end
  private gameState: GameState;
  //private diceState: number;
  private winner: string;

  //cars
  private myRedCar: Car;
  private myGreenCar: Car;
  private myBlueCar: Car;
  private color: string;

  //game variables
  private pressedKeys: string[];
  private redCarStarter: boolean = false;
  private greenCarStarter: boolean = false;
  private blueCarStarter: boolean = false;
  private redCarBoost: boolean = false;
  private greenCarBoost: boolean = false;
  private blueCarBoost: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.keyboardListener = new KeyboardListener();

    this.gameState = GameState.Begin;
    //this.diceState = 0;

    //my cars
    this.myRedCar = new Car("The Red Barron", 100, 50, "red");
    this.myGreenCar = new Car("The Green Viper", 100, 250, "green");
    this.myBlueCar = new Car("The Blue Dragon", 100, 450, "blue");

    //keypress var
    this.pressedKeys = [];

    //listens for keys
    window.addEventListener("keypress", this.keyChecker);

    this.loop();
  }

  /**
   * Function to give a number between 1 and 6
   * @returns {number} number - number between 1 and 6
   */
  private rollDice(): number {
    return this.randomNumber(1, 6);
  }

  /**
   * Method for the Game Loop
   * Based on the game state some actions have to be executed
   */
  private loop = () => {
    //clears canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //loops through the game states and redraws the current gamestate 60 fps
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

/**
 * checks if the character pressed is valid and never used before (no spam boosting etc)
 * @param ev contains the character the user pressed on the keyboard
 */
  private keyChecker = (ev: KeyboardEvent) => {
    let pressedKey: string = ev.key;
    console.log(`Key ${ev.key} has been pressed`);
    const letters: string[] = "qtoagl".split("");
    if (letters.indexOf(pressedKey) >= 0) {

      //makes sure the same keypress can not be registred wrong twice
      if (this.pressedKeys.indexOf(pressedKey) <= -1) {
        this.checkClickedLetter(pressedKey)
        this.pressedKeys.push(pressedKey);
        console.log(this.pressedKeys);
      }
    }

  }
  /**
   * changes a variable of a start or boost depending on the character
   * @param pressedKey contains a character which the game needs and has never been pressed before
   */
  private checkClickedLetter(pressedKey: string) {
    if (pressedKey == "q") {
      console.log("red car started");
      this.redCarStarter = true;
    } if (pressedKey == "t") {
      console.log("green car started");
      this.greenCarStarter = true
    } if (pressedKey == "o") {
      console.log("blue car started");
      this.blueCarStarter = true
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
  /**
   * shows starting message and when pressed space starts the game
   */
  private beginState() {
    this.draw();
    this.writeTextToCanvas("Press SPACE to start the game!", 40, this.canvas.width / 2, 30, "center", "white");
    //make a variable
    if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_SPACE)) {
      console.log("space is pressed, game started!");
      this.gameState = GameState.Dice;
    }
  }

  /**
   * rolls the dice and calculates the distance in pixels the cars need to travel
   */
  private diceState() {
    this.myRedCar.distance = this.rollDice() * 180;
    this.myGreenCar.distance = this.rollDice() * 180;
    this.myBlueCar.distance = this.rollDice() * 180;
    console.log(this.myRedCar.distance, this.myGreenCar.distance, this.myBlueCar.distance);
    this.gameState = GameState.Animate;
  }

  private animateState() {
    this.draw();
    //draws start instructions
    if (this.redCarStarter == false) {
      this.writeTextToCanvas("Start the engine with Q, and boost with A.", 40, this.canvas.width / 2, 100, "center", "red");
    }
    if (this.greenCarStarter == false) {
      this.writeTextToCanvas("Start the engine with T, and boost with G.", 40, this.canvas.width / 2, 300, "center", "green");
    }
    if (this.blueCarStarter == false) {
      this.writeTextToCanvas("Start the engine with Q, and boost with A.", 40, this.canvas.width / 2, 500, "center", "blue");
    }

    //animation logic
    if (this.redCarStarter == true && this.myRedCar.xPosition - 100 < this.myRedCar.distance) {
      this.draw();
      if (this.redCarBoost == true) {
        this.writeTextToCanvas("Boosted!", 25, 200, 150, "center", "white");
        this.myRedCar.move(40);
      } else {
        this.myRedCar.move(this.randomNumber(5, 20));
      }
    } if (this.greenCarStarter == true && this.myGreenCar.xPosition - 100 < this.myGreenCar.distance) {
      this.draw();
      if (this.greenCarBoost == true) {
        this.writeTextToCanvas("Boosted!", 25, 200, 350, "center", "white");
        this.myGreenCar.move(40);
      } else {
        this.myGreenCar.move(this.randomNumber(5, 25));
      }
    } if (this.blueCarStarter == true && this.myBlueCar.xPosition - 100 < this.myBlueCar.distance) {
      this.draw();
      if (this.blueCarBoost == true) {
        this.writeTextToCanvas("Boosted!", 25, 200, 55_0, "center", "white");
        this.myBlueCar.move(40);
      } else {
        this.myBlueCar.move(this.randomNumber(5, 15));
      }
    } if (this.myRedCar.xPosition - 100 >= this.myRedCar.distance &&
      this.myGreenCar.xPosition - 100 >= this.myGreenCar.distance &&
      this.myBlueCar.xPosition - 100 >= this.myBlueCar.distance) {
      this.gameState = GameState.End;
    }
  }

  /**
   * decides who won the game
   */
  private endState() {
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
    } else {
      this.winner = "It's a tie!";
    }
    this.writeTextToCanvas(this.winner, 40, this.canvas.width / 2, 650, "center", this.color);
    this.restartMechanism();
    this.draw();
  }

  /**
   * starts a new instance of the game
   */
  private restartMechanism() {
    this.writeTextToCanvas("Press anywhere to restart!", 60, this.canvas.width / 2, 700, "center", "white");
    let elem = document.getElementById('canvas');
    elem.onclick = function () {
      new Game(document.getElementById("canvas") as HTMLCanvasElement);
    };
  }

  /**
   * Function to draw all the cars on the canvas
   */
  private draw() {
    this.myRedCar.draw(this.ctx);
    this.myGreenCar.draw(this.ctx);
    this.myBlueCar.draw(this.ctx);
    this.writeTextToCanvas(this.myRedCar.name, 30, this.myRedCar.xPosition, this.myRedCar.yPosition, "start", "red")
    this.writeTextToCanvas(this.myGreenCar.name, 30, this.myGreenCar.xPosition, this.myGreenCar.yPosition, "start", "green")
    this.writeTextToCanvas(this.myBlueCar.name, 30, this.myBlueCar.xPosition, this.myBlueCar.yPosition, "start", "blue")
  }

  /**
   * Writes text to the canvas
   * @param {string} text - Text to write
   * @param {number} fontSize - Font size in pixels
   * @param {number} xCoordinate - Horizontal coordinate in pixels
   * @param {number} yCoordinate - Vertical coordinate in pixels
   * @param {string} alignment - Where to align the text
   * @param {string} color - The color of the text
   */
  public writeTextToCanvas(
    text: string,
    fontSize: number = 20,
    xCoordinate: number,
    yCoordinate: number,
    alignment: CanvasTextAlign = "center",
    color: string = "red"
  ) {
    this.ctx.font = `${fontSize}px Minecraft`;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = alignment;
    this.ctx.fillText(text, xCoordinate, yCoordinate);
  }
  /**
   * Renders a random number between min and max
   * @param {number} min - minimal time
   * @param {number} max - maximal time
   */
  public randomNumber(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }
}

/**
 * Start the game whenever the entire DOM is loaded
 */
let init = () =>
  new Game(document.getElementById("canvas") as HTMLCanvasElement);

// Add EventListener to load the game whenever the browser is ready
window.addEventListener("load", init);
