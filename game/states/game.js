class Game {
    constructor(gameStateManager) {
        this._gameStateManager = gameStateManager;
        this._BG_MUSIC = new Audio("sound/Bedtime Story (Pillow Bros).mp3");
        this._BG_MUSIC.load();
        this._BG_MUSIC.play();

        //one player game
        if (this._gameStateManager.KEYS2 === null) {
            this._gameStateManager = gameStateManager;
            this.map = new GameMap(gameStateManager.MAP, 180, 0);
            this._players = [
                new Player(1, this.map, "#000000", "#b0fbff", this._gameStateManager.PLAYER_1_NAME),
                new PlayerAI(2, this.map, "#b0fbff", "#000000"),
                new PlayerAI(3, this.map, "#ffaf22", "#2b4523"),
                new PlayerAI(4, this.map, "#68ff9c", "#8d4e51")
            ];
            this._playersStatusBar = [
                new StatusBar(0, 0, STATUS_HEIGHT_PLAYER, this._players[0]),
                new StatusBar(WIDTH - STATUS_WIDTH, 0, STATUS_HEIGHT_AI, this._players[1]),
                new StatusBar(WIDTH - STATUS_WIDTH, STATUS_HEIGHT_AI, STATUS_HEIGHT_AI, this._players[2]),
                new StatusBar(WIDTH - STATUS_WIDTH, STATUS_HEIGHT_AI * 2, STATUS_HEIGHT_AI, this._players[3])
            ];
            this.KEYS = [this._gameStateManager.KEYS];
        }
        //two player game
        else {
            this.map = new GameMap(gameStateManager.MAP, 180, 0);
            this._players = [
                new Player(1, this.map, "#000000", "#b0fbff", this._gameStateManager.PLAYER_1_NAME),
                new Player(2, this.map, "#b0fbff", "#000000", this._gameStateManager.PLAYER_2_NAME)
            ];
            this._playersStatusBar = [new StatusBar(0, 0, STATUS_HEIGHT_PLAYER, this._players[0]), new StatusBar(WIDTH - STATUS_WIDTH, 0, STATUS_HEIGHT_PLAYER, this._players[1])];
            this.KEYS = [this._gameStateManager.KEYS1, this._gameStateManager.KEYS2];
        }
        this._timer = new Timer(STATUS_WIDTH - 5, MAP_HEIGHT, this._gameStateManager.TIME);
    }

    get players(){
        return this._players;
    }

    update(){
        if(this._timer.time < 0){
            this._BG_MUSIC.pause();
            this._gameStateManager.currentState = "END";
        }
        for(let i = 0; i < this.KEYS.length; i++) {
            this._handleInput(this.KEYS[i], this._players[i]);
        }
        for(let i = 0; i < this._players.length; i++) {
            this._players[i].update();
            this._players[i].checkAttack(this._players);
        }
        for (let i = 0; i < this._playersStatusBar.length; i++) {
            this._playersStatusBar[i].update();
        }
        this._timer.update();
    }

    stopMusic(){
        this._BG_MUSIC.pause();
    }

    draw(ctx) {
        this.map.draw(ctx);
        for (let i = 0; i < this._players.length; i++) {
            this._players[i].draw(ctx);
        }
        for (let i = 0; i < this._playersStatusBar.length; i++) {
            this._playersStatusBar[i].draw(ctx);
        }
        this._timer.draw(ctx);
    }

    _handleInput(keys, player) {
        switch (keys.pressed) {
            case keys.LEFT:
                player.direction = LEFT;
                player.step(-1, 0);
                break;
            case keys.RIGHT:
                player.direction = RIGHT;
                player.step(1, 0);
                break;
            case keys.UP:
                player.direction = UP;
                player.step(0, -1);
                break;
            case keys.DOWN:
                player.direction = DOWN;
                player.step(0, 1);
                break;
            case keys.FIRE:
                player.fire();
        }
        keys.pressed = null;
    }


}