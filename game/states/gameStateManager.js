class GameStateManager {
    constructor(keys, time, map, namePlayer1, namePlayer2 = null, keysPlayer1 = null, keysPlayer2 = null) {
        this.KEYS = keys;
        this.TIME = time;
        this.MAP = map;
        this.PLAYER_1_NAME = namePlayer1;
        this.PLAYER_2_NAME = namePlayer2;
        this.KEYS1 = keysPlayer1;
        this.KEYS2 = keysPlayer2;
        this._currentStateString = "MENU";
        this._currentState = new Menu(this, this.KEYS);
    }
    set currentState(state){
        switch (state){
            case "MENU":
                this._currentStateString = "MENU";
                this._currentState = new Menu(this);
                break;
            case "GAME":
                this._currentStateString = "GAME";
                //two player game
                if (this.KEYS1 !== null){
                    this._currentState = new Game(this);
                    break;
                }
                //one player game
                else {
                    this._currentState = new Game(this);
                    break;
                }

            case "END":
                //only go to END from GAME
                this._currentStateString = "END";
                const players = this._currentState.players;
                this._currentState = new End(this, players);
                break;
        }
    }

    update(){
        this._currentState.update();
    }

    draw(ctx){
        this._currentState.draw(ctx);
    }
    destroy(){
        if (this._currentStateString === "GAME"){
            this._currentState.stopMusic();
        }
    }

}