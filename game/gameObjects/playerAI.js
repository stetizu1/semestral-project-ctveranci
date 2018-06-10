class PlayerAI extends Player {

    constructor(id, map, color, eyeColor) {
        super(id, map, color, eyeColor);
        this.canPlay = true;
        this.willPlay = false;
    }

    update(){
        super.update();
        this.updateAI()
    }
    updateAI(){
        this.willPlay = false;
        this.checkUp();
        this.checkDown();
        this.checkLeft();
        this.checkRight();
    }

    checkUp(){
        if(this.canPlay){
            for(let i = 0; i < this.mapY; i++){
                this.checkPosition(this.mapX, i);
            }
            if(this.willPlay){
                this.play(UP);
            }
        }
    }

    checkDown(){
        if(this.canPlay){
            for(let i = this.map.ROWS - 1; i > this.mapY; i--){
                this.checkPosition(this.mapX, i);
            }
            if(this.willPlay){
                this.play(DOWN);
            }
        }
    }

    checkLeft(){
        if(this.canPlay){
            for(let i = 0; i < this.mapX; i++){
                this.checkPosition(i, this.mapY);
            }
            if(this.willPlay){
                this.play(LEFT);
            }
        }
    }

    checkRight(){
        if(this.canPlay){
            for(let i = this.map.COLUMNS - 1; i > this.mapX; i--){
                this.checkPosition(i, this.mapY);
            }
            if(this.willPlay){
                this.play(RIGHT);
            }
        }
    }

    checkPosition(x, y){
        if(this.map.getContentOnPosition(x, y) === -1){
            this.willPlay = true;
        }
        if(this.map.getContentOnPosition(x, y) > -1){
            this.willPlay = false;
        }
    }
    play(direction){
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