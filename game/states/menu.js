class Menu {
    constructor(gameStateManager){
        this._gameStateManager = gameStateManager;
        this.KEYS = gameStateManager.KEYS;
        this._currentOption = 0;
        this._options = ["Nová hra", "Ovládání"];
    }

    update(){
        this._handleInput();
    }

    draw(ctx){
        ctx.fillStyle = "#b0fbff";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = "#0b5859";
        ctx.font = "100px Arial";
        ctx.fillText("Čtveránci", WIDTH / 2, HEIGHT / 4);

        ctx.font = "60px Arial";
        for(let i = 0; i < this._options.length; i++){
            if(i === this._currentOption){
                ctx.fillStyle = "#be0a00";
                ctx.fillText(this._options[i], WIDTH / 2, HEIGHT / 2 - 50 + i * 70);
                ctx.fillStyle = "#0b5859";
            } else {
                ctx.fillText(this._options[i], WIDTH / 2, HEIGHT / 2 - 50 + i * 70);
            }
        }

    }

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

    _select(){
        if(this._currentOption === 0){
            this._gameStateManager.currentState = "GAME";
        }
    }

}