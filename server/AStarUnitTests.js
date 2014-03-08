// Annotated A* Unit Tests
//

var AStar = require('./AAStar.js');
var test = new AStar.AStarGrid(4000, 4000);
test.hAlg = 1;
test.diagonal = true;

generateRandomWalls(test, 0.2);
/*
generateWall(test, 10, 0, 10);
generateWall(test, 40, 10, 0);
generateWall(test, 70, 0, 10);
generateWall(test, 90, 10, 0);
*/

var s = new AStar.Point(0, 0);
var e = new AStar.Point(test.width-1, test.height-1);

var start = process.hrtime();
var path = test.findPath(s.x, s.y, e.x, e.y);
var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli

//drawPath(path, test);

if(path.length === 0)
    console.log("No possible path");
var precision = 3;
console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms"); // print message + time
console.log("Nodes explored: "+test.nodesExplored);
console.log("Iterations: "+test.iterations);

function replace(index, character, string){
    return string.substr(0, index) + character + string.substr(index+character.length);
}

/*
 * Draw the path into the console
 */
function drawPath(path, aStar){
    var grid = new Array(aStar.height);

    for(var q = 0; q < aStar.height; q++){
        var s = "";
        for(var qq = 0; qq < aStar.width; qq++){
            s = s.concat(" ");
        }
        grid[q] = s;
    }

    for(q = 0; q < path.length; q++){
        grid[path[q].y] = replace(path[q].x,
                (q===0||q===path.length-1)?"X":"0",
                grid[path[q].y]);
    }

    for(var x = 0; x < aStar.width; x++){
        for(var y = 0; y < aStar.height; y++){
            if(aStar.grid[x][y].val !== 0)
                grid[y] = replace(x, "*", grid[y]);
        }
    }

    for(q = 0; q < grid.length; q++)
        console.log(grid[q]);
}

/*
 * Generates walls at the given row (y)
 * with "lead" space at the beginning
 * and "end" space at the end
 */
function generateWall(aStar, y, lead, end){
    for(var x = lead; x < aStar.width-end; x++){
        aStar.grid[x][y] = 1;
    }
}

/*
 * Fills random spaces on the grid
 * with a given density
 */
function generateRandomWalls(aStar, density){
    for(var x = 0; x < aStar.width; x++){
        for(var y = 0; y < aStar.height; y++){
            var r = Math.random();
            aStar.grid[x][y].val = (r>1-density)?1:0;
        }
    }
}
