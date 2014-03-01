var io = require('socket.io').listen(8080);

var gameIsRunning = false;

io.sockets.on('connection', function (socket){
    socket.ready = false;
    socket.emit('connected', socket.id);
    socket.on('ready', function(arg){
        console.log(socket.id+" is ready");
        socket.ready = arg;
        var readyToStartGame = true;
        if(io.sockets.clients().length < 2)
            readyToStartGame = false;
        for(var x = 0; x < io.sockets.clients().length; x++){
            if(io.sockets.clients()[x].ready === false){
                readyToStartGame = false;
                break;
            }
        }
        sendReadyUpdate();
        //if(readyToStartGame)
        //    startGame();
    });
    socket.on('disconnect', function(arg) {
        sendReadyUpdate(true);
        console.log('disconnect');
        setTimeout(function(){sendReadyUpdate();},500);
    });
    sendReadyUpdate();
});

function sendReadyUpdate(disconnect){
    //use count modifier to account for disconnects and connects
    //before the server updates the connected array
    var c = io.sockets.clients();
    var r = 0;
    for(var x = 0; x < c.length; x++){
        if(c[x].ready === true)
            r++;
    }
    var count = c.length-((typeof disconnect === "undefined")?0:1);
    io.sockets.emit('readyUpdate', {clientCount:count,readyCount:r});
}

function startGame(){
    if(gameIsRunning)
        return;
    var GameModule = require('./serverGame.js');
    var game = new GameModule.Game(io.sockets.sockets);
    game.startGame();
    gameIsRunning = true;
}
