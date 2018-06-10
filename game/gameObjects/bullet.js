const BULLET_SIZE = 10;
class Bullet {
    /**
     * Creates bullet for player
     *
     * @param direction - in which will bullet move
     * @param owner - id of player whose bullet it is
     * @param map - map that bullet is on
     */
    constructor(direction, owner, map) {
        this.map = map;

        this._delete = false;
        this._direction = direction;
        this._owner = owner;
        this._speed = 20;

        this._setMovement();

        this._drawX = this._x + this.map.START_X;
        this._drawY = this._y + this.map.START_Y;
    }

    //sets dx and dy due to direction
    _setMovement(){
        switch (this._direction){
            case LEFT:
                this._dx = -this._speed;
                this._dy = 0;
                break;
            case RIGHT:
                this._dx = this._speed;
                this._dy = 0;
                break;
            case UP:
                this._dx = 0;
                this._dy = -this._speed;
                break;
            case DOWN:
                this._dx = 0;
                this._dy = this._speed;
                break;
        }
    }

    get delete(){
        return this._delete;
    }
    set delete(del){
        this._delete = del;
    }

    /**
     * Set position of bullet due to map coordinates
     *
     * @param mapX - x map coordinate
     * @param mapY - y map coordinate
     */
    setPosition(mapX, mapY){
        this._mapX = mapX;
        this._mapY = mapY;

        this._x = this._mapX * this.map.FIELD_SIZE + 30;
        this._y = this._mapY * this.map.FIELD_SIZE + 30;
    }

    /**
     * Controls if bullet hits player
     *
     * @param player to control
     * @returns {boolean} true if target player is on same position as bullet
     */
    intersects(player){
        return this._owner !== player.id && this._mapX === player.mapX && this._mapY === player.mapY;
    }

    /**
     * Updates bullets position
     * should be called every tick
     */
    update(){
        //delete if out of bounds
        if(!this.map.canFire(this._mapX, this._mapY)){
            this._delete = true;
            return;
        }
        this._x += this._dx;
        this._y += this._dy;

        this._mapX = Math.floor(this._x / this.map.FIELD_SIZE);
        this._mapY = Math.floor(this._y / this.map.FIELD_SIZE);

        this._drawX = this._x + this.map.START_X - (BULLET_SIZE / 2);
        this._drawY = this._y + this.map.START_Y - (BULLET_SIZE / 2);
    }

    /**
     * draws bullet on canvas
     * should be called every tick
     *
     * @param ctx - context used on canvas
     */
    draw(ctx) {
        ctx.fillStyle = "#fbff00";
        ctx.fillRect(this._drawX, this._drawY, BULLET_SIZE, BULLET_SIZE);
    }
}