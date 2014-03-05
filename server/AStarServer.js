var io = require('socket.io').listen(8080);
io.set('log level', 1);
var AStar = require('./AAStar.js');
var size = {width:600,height:500};
var astar = new AStar.AStarGrid(size.width, size.height);

var currentPos = {x:0,y:0};
var currentEnd = {x:0,y:0};
var currentPath = [];
var loopRate = 0.1;
var currentIndex = 0;
var moveSpeed = 10; //nodes per second - for now a node can be considered a pixel
var moving = false;

var obstacles = [];
for(var x = 0; x < 400; x++){
    obstacles[x] = {x:x,y:200};
    astar.grid[x][200] = 1;
}

setInterval(update, loopRate);
io.sockets.on('connection', function(socket){
    socket.emit('size', size);
    sendObstacles();
    socket.on('newPos', function(point){
        currentEnd = {x:Math.floor(point.x),y:Math.floor(point.y)};
        currentPath = astar.findPath(currentPos.x, currentPos.y, currentEnd.x, currentEnd.y);
        newPath();
    });
    socket.on('newObstacle', function(point){
        point.x = Math.floor(point.x);
        point.y = Math.floor(point.y);
        astar.grid[point.x][point.y].val = 1;
        obstacles.push(point);
        if(currentPath !== null){
            currentPath = astar.findPath(currentPos.x, currentPos.y, currentEnd.x, currentEnd.y);
            newPath();
        }
        sendObstacles();
    });
});

function newPath(){
    currentIndex = 0;
    moving = true;
}

function update(){
    if(currentIndex + 1 >= currentPath.length){
        //done moving
        moving = false;
        sendPosition();
        return;
    }
    currentIndex += loopRate*moveSpeed;
    if(currentIndex >= currentPath.length && moving){
        moving = false;
        currentPos = currentPath[currentPath.length-1];
        currentPath = [];
        sendPosition();
        return;
    }
    if(moving)
        currentPos = currentPath[currentIndex];
    sendPosition();
}

function sendPosition(){
    var prunedPath = [];
    for(var x = 0; x < loopRate*moveSpeed; x++){
        if(currentIndex+x >= currentPath.length)
            break;
        prunedPath.push(currentPath[currentIndex+x]);
    }
    io.sockets.emit('update', {currentPosition:currentPos,moving:moving,currentIndex:0,currentPath:prunedPath,moveSpeed:moveSpeed});
}

function sendObstacles(){
    io.sockets.emit('obstacles', obstacles);
}
