class PlayerAI extends Player {

    /**
     * Creates AI player with given if, map, color and eye color
     *
     * @param id - id of player
     * @param map - map that player is on
     * @param color - color of player
     * @param eyeColor - color of player's eyes
     */
    constructor(id, map, color, eyeColor) {
        super(id, map, color, eyeColor);
        this.canPlay = true;
        this.willPlay = false;
    }

    /**
     * Updates AI player's and it's bullets position and set it's next action.
     * should be called every tick
     */
    update(){
        super.update();
        this._updateAI()
    }

    //controls position around AI
    _updateAI(){
        this.willPlay = false;
        this._checkUp();
        this._checkDown();
        this._checkLeft();
        this._checkRight();
    }

    _checkUp(){
        if(this.canPlay){
            for(let i = 0; i < this.mapY; i++){
                this._checkPosition(this.mapX, i);
            }
            if(this.willPlay){
                this._play(UP);
            }
        }
    }

    _checkDown(){
        if(this.canPlay){
            for(let i = this.map.ROWS - 1; i > this.mapY; i--){
                this._checkPosition(this.mapX, i);
            }
            if(this.willPlay){
                this._play(DOWN);
            }
        }
    }

    _checkLeft(){
        if(this.canPlay){
            for(let i = 0; i < this.mapX; i++){
                this._checkPosition(i, this.mapY);
            }
            if(this.willPlay){
                this._play(LEFT);
            }
        }
    }

    _checkRight(){
        if(this.canPlay){
            for(let i = this.map.COLUMNS - 1; i > this.mapX; i--){
                this._checkPosition(i, this.mapY);
            }
            if(this.willPlay){
                this._play(RIGHT);
            }
        }
    }

    //sets this.willPlay to true if there is non-blocked player on given position, false if there is tree
    _checkPosition(x, y){
        if(this.map.getContentOnPosition(x, y) === -1){
            this.willPlay = true;
        }
        if(this.map.getContentOnPosition(x, y) > -1){
            this.willPlay = false;
        }
    }

    //AI will perform action
    _play(direction){
        this.canPlay = false;
        if(this.direction !== direction) {
            setTimeout(() => {
                this.direction = direction;
                this.canPlay = true;
            }, 200 + Math.floor(Math.random() * 200));
        } else {
            setTimeout(() => {
                this.fire();
            }, 450 + Math.floor(Math.random() * 300));
            setTimeout(() => {
                this.canPlay = true;
            }, 800 + Math.floor(Math.random() * 400));
        }
    }
}