// Annotated A* Unit Tests
//

var AStar = require('./AAStar.js');
var test = new AStar.AStarGrid(200, 100);
test.hAlg = 0;
test.diagonal = true;

//generateWall(test);
generateRandomWalls(test, 0.15);

var s = new AStar.Point(0, 0);
var e = new AStar.Point(test.width-1, test.height-1);

var start = process.hrtime();
var path = test.findPath(s.x, s.y, e.x, e.y);
var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli

//for(var q = 0; q < newPath.length; q++){
    //console.log("X: "+newPath[q].x+" Y: "+newPath[q].y);
//}

var grid = new Array(test.height);

for(var q = 0; q < test.height; q++){
    var s = "";
    for(var qq = 0; qq < test.width; qq++){
        s = s.concat(" ");
    }
    grid[q] = s;
}

for(q = 0; q < path.length; q++){
    grid[path[q].y] = replace(path[q].x,
            (q===0||q===path.length-1)?"X":"0",
            grid[path[q].y]);
}

for(q = 0; q < test.width; q++){
    for(var qq = 0; qq < test.height; qq++){
        if(test.grid[q][qq].val !== 0)
            grid[qq] = replace(q, "*", grid[qq]);
    }
}

for(q = 0; q < grid.length; q++)
    console.log(grid[q]);

if(path.length === 0)
    console.log("No possible path");
var precision = 3;
console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms"); // print message + time
console.log("Nodes explored: "+test.nodesExplored);
console.log("Iterations: "+test.iterations);

function replace(index, character, string){
    return string.substr(0, index) + character + string.substr(index+character.length);
}

function generateWall(aStar){
    for(var x = 0; x < 20; x++){
        var y = 70;
        aStar.grid[x][y] = 1;
    }
}

function generateRandomWalls(aStar, density){
    for(var x = 0; x < aStar.width; x++){
        for(var y = 0; y < aStar.height; y++){
            var r = Math.random();
            aStar.grid[x][y].val = (r>1-density)?1:0;
        }
    }
}
