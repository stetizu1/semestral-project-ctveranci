const MAP_WIDTH = 1200;
const MAP_HEIGHT = 720;

class GameMap{
    constructor(map, START_X, START_Y){

        this.START_X = START_X;
        this.START_Y = START_Y;

        this.FIELD_SIZE = 60;
        this.COLUMNS = MAP_WIDTH / this.FIELD_SIZE;
        this.ROWS = MAP_HEIGHT / this.FIELD_SIZE;

        this.images = [];
        this.generateDefaultMap();
        if(map === null){
            this.generateDefaultMap();
            this.placeRandomTrees(15);
            /*
            var line = "";
            for(var i = 0; i < this.ROWS; i++){
                for(var j = 0; j < this.COLUMNS; j++){
                    line += this.map[i][j];
                }
                console.log(line);
                line = "";
            }
            */
        }
        else {
            this.map = map;
            this.placeTreesFromMap();
        }
    }

    placeTreesFromMap() {
        for (let i = 0; i < this.ROWS - 1; i++) {
            for (let j = 0; j < this.COLUMNS - 1; j++) {
                let current = map[i][j];
                if (current !== -2){
                    if(map[i+1][j] === current &&
                        map[i][j+1] === current &&
                        map[i+1][j+1] === current){
                        this.addTreeImage(current, i, j);
                    }
                }
            }
        }
    }

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

    generateDefaultMap() {
        this.map = [];
        for (let i = 0; i < this.ROWS; i++) {
            let line = [];
            for (let j = 0; j < this.COLUMNS; j++) {
                line.push(-2);
            }
            this.map.push(line);
        }
    }

    placeTree(targetCol, targetRow, treeNumber){
        if(targetRow > this.ROWS - 1 || targetRow < 0 || targetCol > this.COLUMNS - 1 || targetCol < 0)
            return;

        this.map[targetRow][targetCol] = treeNumber;
        this.map[targetRow][targetCol + 1] = treeNumber;
        this.map[targetRow + 1][targetCol] = treeNumber;
        this.map[targetRow + 1][targetCol + 1] = treeNumber;

        this.addTreeImage(treeNumber, targetRow, targetCol);
    }

    isAlone(row, col){
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

    placeRandomTrees(num){
        if(num > 15) num = 15;
        for(let i = 0; i < num; i++) {
            let placed = false;
            while(!placed) {
                let col = Math.floor(Math.random() * (this.COLUMNS - 1));
                let row = Math.floor(Math.random() * (this.ROWS - 1));
                if ( this.isAlone(row, col)) {

                    let tree = Math.floor(Math.random() * 9);
                    this.placeTree(col, row, tree);
                    placed = true;
                }
            }
        }
    }

    blockPositionWithPlayer(x, y) {
        this.map[y][x] = -1;
    }

    freePosition(x, y) {
        this.map[y][x] = -2;
    }

    getContentOnPosition(x, y){
        return this.map[y][x];
    }

    canMove(x, y) {
        //out of map
        if (x >= 0 && x < this.COLUMNS && y >= 0 && y < this.ROWS){
            //blocked field
            return this.map[y][x] < -1;
        }
        return false;
    }
    canFire(x, y){
        if (x >= 0 && x < this.COLUMNS && y >= 0 && y < this.ROWS){
            //blocked field
            return this.map[y][x] < 0;
        }
        return false;
    }

    addTreeImage(treeNumber, targetRow, targetCol) {
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
}