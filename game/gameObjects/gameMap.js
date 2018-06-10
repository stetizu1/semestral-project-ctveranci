const MAP_WIDTH = 1200;
const MAP_HEIGHT = 720;

class GameMap{
    /**
     * Creates GameMap object for game
     *
     * @param map - null or two-dimensional field with integer identificator of map items
     * @param START_X - start for x-axis on canvas
     * @param START_Y - start for y-axis on canvas
     */
    constructor(map, START_X, START_Y){

        this.START_X = START_X;
        this.START_Y = START_Y;

        this.FIELD_SIZE = 60;
        this.COLUMNS = MAP_WIDTH / this.FIELD_SIZE;
        this.ROWS = MAP_HEIGHT / this.FIELD_SIZE;

        this.images = [];
        if(map === null){
            this._generateDefaultMap();
            this._placeRandomTrees(15);
        }
        else {
            this.map = map;
            this._placeTreesFromMap();
        }
    }

    //generates empty battlefield to this.map
    _generateDefaultMap() {
        this.map = [];
        for (let i = 0; i < this.ROWS; i++) {
            let line = [];
            for (let j = 0; j < this.COLUMNS; j++) {
                line.push(-2);
            }
            this.map.push(line);
        }
    }

    //fills map with random placed trees
    _placeRandomTrees(num){
        if(num > 15) num = 15;
        for(let i = 0; i < num; i++) {
            let placed = false;
            while(!placed) {
                let col = Math.floor(Math.random() * (this.COLUMNS - 1));
                let row = Math.floor(Math.random() * (this.ROWS - 1));
                if (this._isAlone(row, col)) {

                    let tree = Math.floor(Math.random() * 9);
                    this._placeTreeOnMap(col, row, tree);
                    placed = true;
                }
            }
        }
    }

    //controls if tree can be placed - does not have any neighbour tree - prevents blocking some position on map
    _isAlone(row, col){
        //nothing on target square
        if(this.map[row][col] === -2 &&
            this.map[row][col + 1] === -2 &&
            this.map[row + 1][col] === -2 &&
            this.map[row + 1][col + 1] === -2){

            //check up if there is space left
            if (row > 0){
                //up
                if(this.map[row - 1][col] !== -2 || this.map[row - 1][col + 1] !== -2) return false;

                //up left
                if(col > 0){
                    if(this.map[row - 1][col - 1] !== -2) return false;
                }
                //up right
                if(col < this.COLUMNS - 2){
                    if(this.map[row - 1][col + 2] !== -2) return false;
                }
            }

            //check down if there is space left
            if(row < this.ROWS - 2){
                if(this.map[row + 2][col] !== -2 || this.map[row + 2][col + 1] !== -2) return false;

                //down left
                if(col > 0){
                    if(this.map[row + 2][col - 1] !== -2) return false;
                }
                //down right
                if(col < this.COLUMNS - 2){
                    if(this.map[row + 2][col + 2] !== -2) return false;
                }
            }

            //check left if there is space left
            if(col > 0){
                if(this.map[row][col - 1] !== -2 || this.map[row + 1][col - 1] !== -2) return false;
            }

            //check right if there is space left
            if(col < this.COLUMNS - 2){
                if(this.map[row][col + 2] !== -2 || this.map[row + 1][col + 2] !== -2) return false;
            }
            return true;

        }
        return false;
    }

    //places tree to this.map and adding image
    _placeTreeOnMap(targetCol, targetRow, treeNumber){
        if(targetRow > this.ROWS - 1 || targetRow < 0 || targetCol > this.COLUMNS - 1 || targetCol < 0)
            return;

        this.map[targetRow][targetCol] = treeNumber;
        this.map[targetRow][targetCol + 1] = treeNumber;
        this.map[targetRow + 1][targetCol] = treeNumber;
        this.map[targetRow + 1][targetCol + 1] = treeNumber;

        this._addTreeImage(treeNumber, targetRow, targetCol);
    }

    //places tree images due to its position on map
    _placeTreesFromMap() {
        for (let i = 0; i < this.ROWS - 1; i++) {
            for (let j = 0; j < this.COLUMNS - 1; j++) {
                let current = map[i][j];
                if (current !== -2){
                    if(map[i+1][j] === current &&
                        map[i][j+1] === current &&
                        map[i+1][j+1] === current){
                        this._addTreeImage(current, i, j);
                    }
                }
            }
        }
    }

    //adds one tree image to images
    _addTreeImage(treeNumber, targetRow, targetCol) {
        let imgTree = new Image();
        imgTree.src = "pictures/trees.png";

        let sWidth = 100;
        let sHeight = 100;
        let sx = (treeNumber % 3) * sWidth;
        let sy = Math.floor(treeNumber / 3) * sHeight;

        let x = targetCol * this.FIELD_SIZE + this.START_X;
        let y = targetRow * this.FIELD_SIZE + this.START_Y;

        this.images.push([imgTree, sx, sy, sWidth, sHeight, x, y]);
    }


    /**
     * Block position - set filed value to player
     *
     * @param column
     * @param row
     */
    blockPositionWithPlayer(column, row) {
        this.map[row][column] = -1;
    }

    /**
     * Free position - set field value to nothing
     *
     * @param column - target column
     * @param row - target row
     */
    freePosition(column, row) {
        this.map[row][column] = -2;
    }

    /**
     * Returns number of content on given position
     *
     * @param column - given column
     * @param row - given row
     * @returns {*} int with identificator of item on position
     */
    getContentOnPosition(column, row){
        return this.map[row][column];
    }

    /**
     * Controls if player can move on target position
     *
     * @param column - target column
     * @param row - target row
     * @returns {boolean} true if player can step on target position
     */
    canMove(column, row) {
        //out of map
        if (column >= 0 && column < this.COLUMNS && row >= 0 && row < this.ROWS){
            //blocked field
            return this.map[row][column] < -1;
        }
        return false;
    }

    /**
     * Controls if bullet can go through target position
     *
     * @param column - target column
     * @param row - target row
     * @returns {boolean} true if bullet will go through target position (is not a tree)
     */
    canFire(column, row){
        if (column >= 0 && column < this.COLUMNS && row >= 0 && row < this.ROWS){
            //blocked field
            return this.map[row][column] < 0;
        }
        return false;
    }

    /**
     * Draws map on canvas
     * should be called every tick
     *
     * @param ctx - context used on canvas
     */
    draw(ctx) {
        ctx.fillStyle = "#2a7f35";
        ctx.fillRect(this.START_X, this.START_Y, MAP_WIDTH, MAP_HEIGHT);
        ctx.fillStyle = "#2c8d3d";
        for (let i = this.START_X; i < MAP_WIDTH + this.START_X; i += this.FIELD_SIZE){
            for (let j = this.START_Y; j < MAP_HEIGHT + this.START_Y; j += this.FIELD_SIZE * 2) {
                ctx.fillRect(i, j, this.FIELD_SIZE, this.FIELD_SIZE);
            }
            i += this.FIELD_SIZE;
            for (let j = this.START_Y + this.FIELD_SIZE; j < MAP_HEIGHT + this.START_Y; j += this.FIELD_SIZE * 2) {
                ctx.fillRect(i, j, this.FIELD_SIZE, this.FIELD_SIZE);
            }
        }
        for(let i = 0; i < this.images.length; i++){
            ctx.drawImage(this.images[i][0], this.images[i][1], this.images[i][2], this.images[i][3], this.images[i][4],
                this.images[i][5], this.images[i][6], this.FIELD_SIZE * 2, this.FIELD_SIZE * 2);
        }
    }

}