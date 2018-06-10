class End {
    /**
     * Creates state on end of game
     *
     * @param gameStateManager - manager that controls game states
     * @param players - field with players that played the game
     */
    constructor(gameStateManager, players) {
        this._gameStateManager = gameStateManager;
        this.KEYS = gameStateManager.KEYS;
        this._players = players;
        this._options = ["Hrát znovu", "Menu"];
        this._currentOption = 0;
        this._drawInit = false;

        //save score for single player
        if(this._players.length !== 2){
            this._score();
        }
    }

    //saves score to local storage
    _score(){
        //current score
        let score = this._players[0].kills - this._players[0].deaths;

        //results in local storage for given time
        let result = getResultFor(this._gameStateManager.TIME);

        //update results
        const insertField = [this._players[0].NAME, score];
        if (result.length > 0) {
            for (let i = result.length - 1; i >= -1; i--){
                if(i === -1){
                    result[0] = insertField;
                    break;
                }
                if(i === 9){
                    if(score <= result[i][1]) break;
                    else continue;
                }


                if(score <= result[i][1]) {
                    result[i + 1] = insertField;
                    break;
                } else {
                    result[i + 1] = result[i];
                }
            }

        } else {
            result = [insertField];
        }

        //save updated results
        saveField(this._gameStateManager.TIME, result);
    }

    /**
     * Updates end state - handles input
     * should be called every tick
     */
    update(){
        this._handleInput();
    }
    //reaction on input
    _handleInput() {
        switch (this.KEYS.pressed) {
            case this.KEYS.UP:
                this._currentOption -= 1;
                if (this._currentOption < 0) this._currentOption = this._options.length - 1;
                break;
            case this.KEYS.DOWN:
                this._currentOption += 1;
                if (this._currentOption > this._options.length - 1) this._currentOption = 0;
                break;
            case this.KEYS.ENTER:
                this._select();
                break;
        }
        this.KEYS.pressed = null;
    }

    //change state due to selection
    _select(){
        if(this._currentOption === 0){
            this._gameStateManager.currentState = "GAME";
        }
        if(this._currentOption === 1){
            this._gameStateManager.currentState = "MENU";
        }
    }


    /**
     * Draws end state on canvas
     * should be called every tick
     *
     * @param ctx - context used on canvas
     */
    draw(ctx){
        if(!this._drawInit) {
            ctx.fillStyle = "#002727";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            //draw title
            ctx.fillStyle = "#9eddd6";
            ctx.font = "75px Arial";
            ctx.fillText("Čas vypršel", WIDTH / 2, HEIGHT / 4);

            //sort players
            ctx.font = "20px Arial";
            this._players.sort(function(a, b){
                let differenceA = a.kills - a.deaths;
                let differenceB = b.kills - b.deaths;
                return differenceB - differenceA;
            });


            //calculate players positions
            let step = WIDTH / (this._players.length + 1);
            let height = HEIGHT / 3;

            //draw players
            for(let i = 0; i < this._players.length; i++){
                this._players[i]._drawPlayer(ctx, step * (i + 1) - this._players[i].SIZE/2, height, DOWN);

                ctx.fillStyle = "#9eddd6";
                ctx.fillText("Zabití: " + this._players[i].kills, step * (i + 1), height + 130);
                ctx.fillText("Smrtí: " + this._players[i].deaths, step * (i + 1), height + 160);
                ctx.fillText("Rozdíl: " + (this._players[i].kills - this._players[i].deaths), step * (i + 1), height + 190);
                ctx.fillStyle = "#14d8d7";
                if(this._players[i].NAME !== null){
                    ctx.fillText(this._players[i].NAME, step * (i + 1), height + 220);
                }
            }
            this._drawInit = true;
        }

        //draw text
        ctx.fillStyle = "#002727";
        ctx.fillRect(0, HEIGHT * 3/4 - 50, WIDTH, HEIGHT * 1/4);

        ctx.font = "40px Arial";

        for(let i = 0; i < this._options.length; i++){
            ctx.fillStyle = "#9eddd6";
            if(i === this._currentOption){
                ctx.fillStyle = "#be0a00";
                ctx.fillText(this._options[i], WIDTH / 2, HEIGHT * 3/4 + i * 50);
            } else {
                ctx.fillText(this._options[i], WIDTH / 2, HEIGHT * 3/4 + i * 50);
            }
        }
    }
}