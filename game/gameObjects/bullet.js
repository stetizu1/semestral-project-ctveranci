const BULLET_SIZE = 10;
class Bullet{
    constructor(direction, owner, map) {

        this.map = map;

        this._delete = false;
        this._direction = direction;
        this._owner = owner;
        this._speed = 20;

        this.setDirection();

        this._drawX = this._x + this.map.START_X;
        this._drawY = this._y + this.map.START_Y;
    }
    get delete(){
        return this._delete;
    }
    set delete(del){
        this._delete = del;
    }

    setPosition(mapX, mapY){
        this._mapX = mapX;
        this._mapY = mapY;

        this._x = this._mapX * this.map.FIELD_SIZE + 30;
        this._y = this._mapY * this.map.FIELD_SIZE + 30;
    }

    setDirection(){
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

    intersects(player){
        return this._owner !== player.id && this._mapX === player.mapX && this._mapY === player.mapY;
    }

    update(){
        //delete if out of bounds
        if(!this.map.canFire(this._mapX, this._mapY)){
            this._delete = true;
            return;
        }
        /*
        if(this._x < - BULLET_SIZE / 2 || this._x > MAP_WIDTH + BULLET_SIZE / 2 ||
            this._y < - BULLET_SIZE || this._y > MAP_HEIGHT + BULLET_SIZE / 2){
            this._delete = true;
            return;
        }
        */
        this._x += this._dx;
        this._y += this._dy;

        this._mapX = Math.floor(this._x / this.map.FIELD_SIZE);
        this._mapY = Math.floor(this._y / this.map.FIELD_SIZE);

        this._drawX = this._x + this.map.START_X - (BULLET_SIZE / 2);
        this._drawY = this._y + this.map.START_Y - (BULLET_SIZE / 2);
    }
    draw(ctx) {
        ctx.fillStyle = "#fbff00";
        ctx.fillRect(this._drawX, this._drawY, BULLET_SIZE, BULLET_SIZE);
    }
}