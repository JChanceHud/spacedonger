// Annotated A*
//
// Currently just an A* implementation
//

var heap = require('./binaryHeap.js');

exports.Point = function(x, y, moveCost){
    this.x = x;
    this.y = y;
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.closed = false; //weather or not it's been disqualified
    this.visited = false; //whether or not it's added to the open heap
    this.moveCost = (moveCost===undefined)?1:moveCost;
    this.parent = null;
};

exports.AStarGrid = function(width, height){
    this.grid = new Array(width);
    for(var x = 0; x < width; x++){
        this.grid[x] = new Array(height);
        for(var y = 0; y < height; y++){
            this.grid[x][y] = {val:0,closed:false,visited:false};
        }
    }
    this.width = width;
    this.height = height;
    this.hAlg = 0;
    this.diagonal = false;
    //debug
    this.nodesExplored = 0;
};

exports.AStarGrid.prototype.findPath = function(x0, y0, x, y){
    //x0, y0 is the start point
    //x, y is the end point
    if(x === x0 && y0 === y)
        return [new exports.Point(x, y)];
    var start = new exports.Point(x0, y0);
    var end = new exports.Point(x, y);
    var open = new heap.BinaryHeap(function(object){
        if(object !== undefined)
            return object.f;
    console.log("g is undefined");
        return 0;
    });
    for(var xx = 0; xx < this.grid.length; xx++){
        for(var yy = 0; yy < this.grid[0].length; yy++){
            this.grid[xx][yy].closed = false;
            this.grid[xx][yy].visited = false;
        }
    }
    this.calculateHDistForPoint(start, end);
    open.push(start);
    this.nodesExplored = 1; //debug
    this.iterations = 0;
    while(open.size() > 0){
        this.iterations++;
        var currentPoint = open.pop();
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
        currentPoint.closed = true;
        this.grid[currentPoint.x][currentPoint.y].closed = true;
        var neighbors = this.getNeighbors(currentPoint);

        for(var n = 0; n < neighbors.length; n++){
            var currentNeighbor = neighbors[n];
            if(this.grid[currentNeighbor.x][currentNeighbor.y].val !== 0 ||
                    currentNeighbor.closed)
                continue; //can't move onto this space, or already considered it
            var g = currentPoint.g + currentNeighbor.moveCost;
            var beenVisited = currentNeighbor.visited;

            if(!beenVisited || g < currentNeighbor.g){
                currentNeighbor.visited = true;
                this.grid[currentNeighbor.x][currentNeighbor.y].visited = true;
                currentNeighbor.parent = currentPoint;
                currentNeighbor.h = this.calculateHDistForPoint(currentNeighbor, end);
                currentNeighbor.g = g;
                currentNeighbor.f = currentNeighbor.g + currentNeighbor.h;

                if(!beenVisited){
                    open.push(currentNeighbor);
                    this.nodesExplored++; //debug
                }
                else{
                    console.log("rescoring");
                    open.rescore(currentNeighbor);
                }
            }
        }
    }
    return [];
};

exports.AStarGrid.prototype.smoothPath = function(path){
    var r = [];
    var start = path[0];
    r[0] = start;
    for(var x = 1; x < path.length; x++){
        var ri = r.length-1;
        var axis = 0;
        if(r[ri].x === r[ri].x)
            axis = 1;
        else
            axis = 2;
        if(axis === 0 && (path[x].x === r[ri].x || path[x].y === r[ri].y))
            continue;
        else if(axis === 1 && path[x].x === r[ri].x)
            continue;
        else if(axis === 2 && path[x].y === r[ri].y)
            continue;
        else
            r[++ri] = path[x];
    }
    return r;
};

exports.AStarGrid.prototype.getNeighbors = function(point){
    //this function assumes that point is a valid point
    var r = [];
    var x = point.x;
    var y = point.y;
    var diag = 1;
    if(x-1 >= 0){
        r.push(new exports.Point(x-1, y));
        if(this.diagonal){
            if(y+1 < this.grid[0].length)
                r.push(new exports.Point(x-1, y+1, diag));
            if(y-1 >= 0)
                r.push(new exports.Point(x-1, y-1, diag));
        }
    }
    if(y-1 >= 0)
        r.push(new exports.Point(x, y-1));
    if(y+1 < this.grid[0].length)
        r.push(new exports.Point(x, y+1));
    if(x+1 < this.grid.length){
        r.push(new exports.Point(x+1, y));
        if(this.diagonal){
            if(y+1 < this.grid[0].length)
                r.push(new exports.Point(x+1, y+1, diag));
            if(y-1 >= 0)
                r.push(new exports.Point(x+1, y-1, diag));
        }
    }
    for(var xx = 0; xx < r.length; xx++){
        r[xx].closed = this.grid[r[xx].x][r[xx].y].closed;
        r[xx].visited = this.grid[r[xx].x][r[xx].y].visited;
    }
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
    var dx, dy = 0;
    if(this.hAlg === 0) //manhattan heuristics
        //this is multiple times more efficient
        return Math.abs(end.x-point.x)+Math.abs(end.y-point.y);
    else if(this.hAlg === 1){ //diagonal distance heuristics (kings movement)
        dx = Math.abs(end.x-point.x);
        dy = Math.abs(end.y-point.y);
        var D = 1.4;
        //tie breaker ensures multiple equal paths
        //are not followed - based on euclidean distance
        var tieBreaker = (dx*dx+dy*dy);
        return D*Math.max(dx, dy)*tieBreaker;
    }
};
