//for namespace
class Keys{
    constructor(keys){
        this.LEFT = keys[0];
        this.RIGHT = keys[1];
        this.UP = keys[2];
        this.DOWN = keys[3];
        this.FIRE = keys[4];
        if(keys.length > 5) {
            this.ENTER = keys[5];
        }

        this._pressed = null;
    }
    set pressed(pressed){
        this._pressed = pressed;
    }
    get pressed(){
        return this._pressed;
    }

}
