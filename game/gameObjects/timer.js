const TIMER_WIDTH = MAP_WIDTH + 10;
const TIMER_HEIGHT = 120;

class Timer{
    constructor(START_X, START_Y, time) {
        this.START_X = START_X;
        this.START_Y = START_Y;
        this._secondSet = false;
        this._time = time;
    }
    get time(){
        return this._time;
    }

    update(){
        if(!this._secondSet){
            this._secondSet = true;
            setTimeout(() =>{
                this._time -= 1;
                this._secondSet = false;
            }, 1000)
        }
    }

    draw(ctx){
        //draw frame
        ctx.fillStyle = "#447573";
        ctx.fillRect(this.START_X, this.START_Y, TIMER_WIDTH, TIMER_HEIGHT);
        ctx.fillStyle = "#333134";
        ctx.fillRect(this.START_X, this.START_Y + 5, TIMER_WIDTH, TIMER_HEIGHT - 10);


        //draw time
        ctx.fillStyle = "#ADF5FF";
        ctx.font = "80px Arial";
        ctx.fillText(this._time, this.START_X + TIMER_WIDTH / 2 , this.START_Y + TIMER_HEIGHT / 2 + 20);
    }
}