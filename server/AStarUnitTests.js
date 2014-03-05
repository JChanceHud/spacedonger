// Annotated A* Unit Tests
//

var AStar = require('./AAStar.js');
var test = new AStar.AStarGrid(400, 400);

for(var x = 0; x < 200; x++){
    var y = 200;
    test.grid[x][y] = 1;
}

var s = new AStar.Point(0, 0);
var e = new AStar.Point(0, 300);

var path = test.findPath(s.x, s.y, e.x, e.y);

if(path.length === 0)
    console.log("failed to find path");

var newPath = test.smoothPath(path);

for(var q = 0; q < newPath.length; q++){
    console.log("X: "+newPath[q].x+" Y: "+newPath[q].y);
}
