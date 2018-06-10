const WIDTH = MAP_WIDTH + 2 * STATUS_WIDTH;
const HEIGHT = MAP_HEIGHT + TIMER_HEIGHT;

class GameWindow {
    constructor(section, time, numberOfPlayers, map, namePlayer1, namePlayer2=null) {
        const canvas = document.createElement("canvas");
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        this.numberOfPlayers = numberOfPlayers;

        const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Enter"];
        const keys1 = ["a", "d", "w", "s", "z"];
        const keys2 = ["j", "l", "i", "k", "m"];

        this.KEYS = new Keys(keys);

        if(numberOfPlayers === 2) {
            this.KEYS1 = new Keys(keys1);
            this.KEYS2 = new Keys(keys2);
        }

        //keyup - only one canPlay generated (while key stay pressed, it generates many keypress and many keydown events)
        this.addKeyListeners = (event) => {
            //set key to pressed it it is from target set
            if(keys.indexOf(event.key) !== -1) {
                this.KEYS.pressed = event.key;
            }
            if(this.numberOfPlayers === 2) {
                if (keys1.indexOf(event.key) !== -1) {
                    this.KEYS1.pressed = event.key;
                }
                if (keys2.indexOf(event.key) !== -1) {
                    this.KEYS2.pressed = event.key;
                }
            }
        };
        document.body.addEventListener("keyup", this.addKeyListeners);

        //prevent scrolling
        this.preventWindowMove = (event) => {
            if(event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === " ") event.preventDefault();
        };
        document.addEventListener("keydown", this.preventWindowMove);

        this._context = canvas.getContext("2d");
        //set center align for all text in gameObjects
        this._context.textAlign = "center";

        const FPS = 60;
        this.targetTime = 1000 / FPS;

        //creates game state manager
        if(this.numberOfPlayers === 1) {
            this.gameManager = new GameStateManager(this.KEYS, time, map, namePlayer1);
        } else {
            this.gameManager = new GameStateManager(this.KEYS, time, map, namePlayer1, namePlayer2, this.KEYS1, this.KEYS2);
        }

        this.canvas = canvas;
        section.appendChild(canvas);
    }
    destroyWindow(){
        this.gameManager.destroy();
        document.removeEventListener("keydown", this.preventWindowMove);
        document.body.removeEventListener("keyup", this.addKeyListeners);
    }

    _update(){
        this.gameManager.update();
    }

    _draw(){
        this.gameManager.draw(this._context);
    }

    run(){
        // currentState loop
        this.start = Date.now();
        this._update();
        this._draw();
        this.elapsed = Date.now() - this.start;

        this.wait = this.targetTime - this.elapsed;

        if (this.wait < 0) this.wait = 5;
        setTimeout(()=> this.run(), this.wait)
    }
}