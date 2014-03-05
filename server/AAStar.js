// Annotated A*
//
// Currently just an A* implementation
//

exports.Point = function(x, y){
    this.x = x;
    this.y = y;
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.parent = null;
};

exports.AStarGrid = function(width, height){
    this.grid = new Array(width);
    for(var x = 0; x < width; x++){
        this.grid[x] = new Array(height);
        for(var y = 0; y < height; y++){
            this.grid[x][y] = 0;
        }
    }
};

exports.AStarGrid.prototype.findPath = function(x0, y0, x, y){
    //x0, y0 is the start point
    //x, y is the end point
    if(x === x0 && y0 === y)
        return [new Point(x, y)];
    var start = new exports.Point(x0, y0);
    var end = new exports.Point(x, y);
    var open = [];
    var closed = [];
    this.calculateHDistForPoint(start, end);
    open.push(start);
    while(open.length > 0){
        var shortestIndex = 0;
        for(var l = 0; l < open.length; l++){
            if(open[l].f < open[shortestIndex].f) shortestIndex = l;
        }
        var currentPoint = open[shortestIndex];

        if(currentPoint.x === end.x && currentPoint.y === end.y){
            //end case
            var curr = currentPoint;
            var ret = [];
            while(curr.parent){
                ret.push(curr);
                curr = curr.parent;
            }
            return ret.reverse();
        }
        this.removePointFromArray(currentPoint, open);
        closed.push(currentPoint);
        var neighbors = this.getNeighbors(currentPoint);
        //console.log(neighbors.length+" "+currentPoint.x+" "+currentPoint.y);
        for(var n = 0; n < neighbors.length; n++){
            var currentNeighbor = neighbors[n];
            if(this.grid[currentNeighbor.x][currentNeighbor.y] !== 0 ||
                    this.getIndexOfPoint(currentNeighbor, closed) !== -1)
                continue; //can't move onto this space, or already considered it

            var g = currentPoint.g+1;
            var gIsBest = false; 
            if(this.getIndexOfPoint(currentNeighbor, open) === -1){
                //don't already have this node
                gIsBest = true;
                currentNeighbor.h = this.calculateHDistForPoint(currentNeighbor, end);
                open.push(currentNeighbor);
            }
            else if(g < currentNeighbor.g){
                gIsBest = true;
            }

            if(gIsBest){
                currentNeighbor.parent = currentPoint;
                currentNeighbor.g = g;
                currentNeighbor.f = currentNeighbor.g+currentNeighbor.h;
            }
        }
    }
    return [];
};

exports.AStarGrid.prototype.getNeighbors = function(point){
    //this function assumes that point is a valid point
    var r = [];
    var x = point.x;
    var y = point.y;
    if(x-1 >= 0)
        r.push(new exports.Point(x-1, y));
    if(y-1 >= 0)
        r.push(new exports.Point(x, y-1));
    if(y+1 < this.grid[0].length)
        r.push(new exports.Point(x, y+1));
    if(x+1 < this.grid.length)
        r.push(new exports.Point(x+1, y));
    for(var i = 0; i < r.length; i++)
        r[i].parent = point;
    return r;
};

exports.AStarGrid.prototype.getIndexOfPoint = function(point, array){
    for(var x = 0; x < array.length; x++)
        if(array[x].x === point.x && array[x].y === point.y)
            return x;
    return -1;
};

exports.AStarGrid.prototype.removePointFromArray = function(point, array){
    var i = this.getIndexOfPoint(point, array);
    if(i != -1)
        array.splice(i, 1);
};

exports.AStarGrid.prototype.calculateHDistForPoint = function(point, end){
    return Math.abs(end.x-point.x)+Math.abs(end.y-point.y);
};
