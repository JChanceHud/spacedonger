// annotatedAStar.js
//

//0 represents empty space, 1 represents occupied space, above that is the amount of surrounding clear distance

function AAStar(width, height){
    this.grid = [];
    for(var x = 0; x < width; x++){
        this.grid[x] = new Array(height);
        for(var y = 0; y < height; y++){
            this.grid[x][y] = 0;
        }
    }
}

AAStar.prototype.upgradeGridDistances = function(){
    
};
