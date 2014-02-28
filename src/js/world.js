// World class file
//

function World(tileSize, width, height){
    this.size = {width:height};
    this.size.width = width;
    this.size.height = height;
    this.tileSize = tileSize;
    //create tile matrix
    this.tiles = [];
    for(var x = 0; x < this.size.width; x++){
        this.tiles[x] = new Array(this.size.height);
    }
    for(x = 0; x < this.size.width; x++){
        for(var y = 0; y < this.size.height; y++){
            this.tiles[x][y] = new Tile();
        }
    }
    this.renderCanvas = document.createElement('canvas');
    this.renderCanvas.width = this.size.width*this.tileSize;
    this.renderCanvas.height = this.size.height*this.tileSize;
    this.renderContext = this.renderCanvas.getContext('2d');
}

World.prototype.draw = function(state){
    // prerenders all the tiles once otherwise it runs at like 10 fps
    var tileSize = this.tileSize;
    for(var x = 0; x < this.size.width; x++){
        for(var y = 0; y < this.size.height; y++){
            this.renderContext.fillStyle = this.tiles[x][y].fillStyle;
            this.renderContext.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
        }
    }
};

World.prototype.generateRandomTileColors = function(){
    for(var x = 0; x < this.size.width; x++){
        for(var y = 0; y < this.size.height; y++){
            this.tiles[x][y].fillStyle = getRandomColor();
        }
    }
};

function getRandomColor() {
    var r = Math.floor(Math.random()*256);
    var g = Math.floor(Math.random()*256);
    var b = Math.floor(Math.random()*256);

    var hexR = r.toString(16);
    var hexG = g.toString(16);
    var hexB = b.toString(16);

    if (hexR.length == 1) {
        hexR = "0" + hexR;
    }

    if (hexG.length == 1) {
        hexG = "0" + hexG;
    }

    if (hexB.length == 1) {
        hexB = "0" + hexB;
    }

    var hexColor = "#" + hexR + hexG + hexB;
    return hexColor.toUpperCase();
}
