const positions = ["left", "right", "up", "down"];
const LEFT = positions[0];
const RIGHT = positions[1];
const UP = positions[2];
const DOWN = positions[3];

class Player {
    constructor(id, map, color, eyeColor, name=null) {
        this._id = id;
        this.map = map;

        this.SIZE = this.map.FIELD_SIZE - 10;
        this.PLAYER_COLOR = color;
        this.EYE_COLOR = eyeColor;
        this.NAME = name;

        this._deaths = 0;
        this._kills = 0;

        this._bulletsNumber = 5;
        this._bulletTime = 200; // time between bullets
        this._reloadTime = 2000; // time for reload
        this._bulletsAdd = false; //if it is set timeout for adding bullets
        this._bullets = [];
        this._canFire = true;

        this._RESPAWN_SOUND = new Audio("sound/respawn.mp3");
        this._SHOOT_SOUND = new Audio("sound/shoot.mp3");

        this.setRandomPosition();
    }

    setRandomPosition(){
        this._mapX = Math.floor(Math.random() * this.map.COLUMNS);
        this._mapY = Math.floor(Math.random() * this.map.ROWS);

        while (!this.map.canMove(this._mapX, this.mapY)){
            this._mapX = Math.floor(Math.random() * this.map.COLUMNS);
            this._mapY = Math.floor(Math.random() * this.map.ROWS);
        }

        this._x = this._mapX * this.map.FIELD_SIZE + 5;
        this._y = this._mapY * this.map.FIELD_SIZE + 5;

        this._drawX = this._x + this.map.START_X;
        this._drawY = this._y + this.map.START_Y;

        this._direction = positions[Math.floor(Math.random() * positions.length)];
        this._prevDirection = this._direction;

        this.map.blockPositionWithPlayer(this._mapX, this._mapY);
    }


    get id() {
        return this._id;
    }

    get mapX() {
        return this._mapX;
    }
    get mapY() {
        return this._mapY;
    }

    update(){
        this._x = this._mapX * this.map.FIELD_SIZE + 5;
        this._y = this._mapY * this.map.FIELD_SIZE + 5;

        for(let i = 0; i < this._bullets.length; i++){
            this._bullets[i].update();
        }

        this._drawX = this._x + this.map.START_X;
        this._drawY = this._y + this.map.START_Y;
    }
    checkAttack(players){
        for(let i = 0; i < players.length; i++){
            for(let j = 0; j < this._bullets.length; j++){
                if(this._bullets[j].intersects(players[i])){
                    players[i].hit();
                    this._bullets[j].delete = true;
                    this._kills += 1;
                }
            }
        }
    }

    hit(){
        this._deaths += 1;
        this.map.freePosition(this._mapX, this._mapY);
        this.setRandomPosition();
        this._RESPAWN_SOUND.load();
        this._RESPAWN_SOUND.play();
    }

    draw(ctx){
        for(let i = 0; i < this._bullets.length; i++){
            if (this._bullets[i].delete){
                this._bullets.splice(i, i+1);
                i++;
            } else {
                this._bullets[i].draw(ctx);
            }
        }
        this.drawPlayer(ctx, this._drawX, this._drawY, this._direction);
    }

    drawPlayer(ctx, x, y, direction){
        //draw body
        ctx.fillStyle = this.PLAYER_COLOR;
        ctx.fillRect(x, y, this.SIZE, this.SIZE);

        //draw eyes
        ctx.fillStyle = this.EYE_COLOR;
        switch (direction){
            case LEFT:
                ctx.fillRect(x + 5, y + 15, 8, 8);
                ctx.fillRect(x + 5, y + 25, 8, 8);
                break;
            case RIGHT:
                ctx.fillRect(x + this.SIZE - 13, y + 15, 8, 8);
                ctx.fillRect(x + this.SIZE - 13, y + 25, 8, 8);
                break;
            case UP:
                ctx.fillRect(x + 15, y + 5, 8, 8);
                ctx.fillRect(x + 25, y + 5, 8, 8);
                break;
            case DOWN:
                ctx.fillRect(x + 15, y + this.SIZE - 13, 8, 8);
                ctx.fillRect(x + 25, y + this.SIZE - 13, 8, 8);
                break;
        }
    }

    set direction(key){
        this._prevDirection = this._direction;
        this._direction = key;
    }
    get direction(){
        return this._direction;
    }

    get deaths(){
        return this._deaths;
    }
    get kills(){
        return this._kills;
    }

    step(stepX, stepY) {
        if (this._prevDirection === this._direction){
            let canMove = this.map.canMove(this._mapX + stepX, this._mapY + stepY);

            if(canMove){
                this.map.freePosition(this._mapX, this._mapY);
                this._mapX += stepX;
                this._mapY += stepY;
                this.map.blockPositionWithPlayer(this._mapX, this._mapY);
            }
        }
        else {
            this._prevDirection = this._direction;
        }
    }
    fire(){
        //if he had enough bullets and it is enough time from last shot
        if(this._bulletsNumber > 0 && this._canFire) {

            this._SHOOT_SOUND.load();
            this._SHOOT_SOUND.play();
            this._canFire = false;
            let b = new Bullet(this._direction, this._id, this.map);
            b.setPosition(this._mapX, this._mapY);
            this._bullets.push(b);
            setTimeout(()=> { this._canFire = true; }, this._bulletTime);
            this._bulletsNumber--;
        }
        if(this._bulletsNumber === 0 && !this._bulletsAdd){
            this._bulletsAdd = true;
            setTimeout(()=> {
                this._bulletsAdd = false;
                this._bulletsNumber = 5;
            }, this._reloadTime);
        }
    }
}