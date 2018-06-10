const STATUS_WIDTH = 180;
const STATUS_HEIGHT_PLAYER = 840;
const STATUS_HEIGHT_AI = 280;

class StatusBar {
    /**
     * Creates status bar for given player
     *
     * @param START_X - start for x-axis on canvas
     * @param START_Y - start for y-axis on canvas
     * @param STATUS_HEIGHT - height on canvas
     * @param player - player that status bar is for
     */
    constructor(START_X, START_Y, STATUS_HEIGHT, player) {
        this.START_X = START_X;
        this.START_Y = START_Y;
        this.STATUS_HEIGHT = STATUS_HEIGHT;

        this._player = player;
        this._deaths = this._player.deaths;
        this._kills = this._player.kills;
        this._bullets = this._player._bulletsNumber;
    }

    /**
     * Updates status bar
     * should be called every tick
     */
    update(){
        this._deaths = this._player.deaths;
        this._kills = this._player.kills;
        this._bullets = this._player._bulletsNumber;
    }

    /**
     * Draws status bar on canvas
     * should be called every tick
     *
     * @param ctx - context used on canvas
     */
    draw(ctx){
        //draw frame
        ctx.fillStyle = "#447573";
        ctx.fillRect(this.START_X, this.START_Y, STATUS_WIDTH, this.STATUS_HEIGHT);
        ctx.fillStyle = "#333134";
        ctx.fillRect(this.START_X + 5, this.START_Y + 5, STATUS_WIDTH - 10, this.STATUS_HEIGHT - 10);

        //draw player
        const playerX = this.START_X + STATUS_WIDTH / 2 - this._player.SIZE / 2;
        const playerY = this.START_Y + 30;
        this._player._drawPlayer(ctx, playerX, playerY, DOWN);

        //set font
        ctx.fillStyle = "#ADF5FF";
        ctx.font = "20px Arial";

        //draw kills
        ctx.fillText("Zabití:", this.START_X + STATUS_WIDTH / 2 , this.START_Y + 110);
        ctx.fillText(this._kills, this.START_X + STATUS_WIDTH / 2 , this.START_Y + 130);

        //draw deaths
        ctx.fillText("Smrtí:", this.START_X + STATUS_WIDTH / 2 , this.START_Y + 150);
        ctx.fillText(this._deaths, this.START_X + STATUS_WIDTH / 2 , this.START_Y + 170);

        //draw bullets
        ctx.fillText("Nábojů:", this.START_X + STATUS_WIDTH / 2 , this.START_Y + 190);
        this._drawBullets(this.START_X, this.START_Y + 200, ctx);

        ctx.fillStyle = "#14d8d7";
        if(this._player.NAME !== null){
            ctx.fillText(this._player.NAME, this.START_X + STATUS_WIDTH / 2 , this.START_Y + 245);
        }
    }

    //draws bullets due to bullets count
    _drawBullets(x, y, ctx){
        ctx.fillStyle = "#fbff00";
        x = x - BULLET_SIZE / 2;
        let step = STATUS_WIDTH / 6;
        for(let i = 0; i < this._bullets; i++) {
            x += step;
            ctx.fillRect(x , y, BULLET_SIZE, BULLET_SIZE);
        }
    }
}