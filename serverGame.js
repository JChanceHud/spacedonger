// serverGame.js
//

var loopRate = 100.0; //100 ms

exports.Game = function(clients, io){
    //clients is an array of client sockets
    this.io = io;
    this.ships = []; //handles the controllable ships
    this.shipIDs = [];
    this.size = {width:1000,height:1000};
    var clientCount = clients.length;
    this.clients = clients;
    for(x = 0; x < this.clients.length; x++){
        this.clients[x].on('inputReceived', inputReceivedFunction().bind(this));
        this.ships[x] = new Ship(this.clients[x].id);
        console.log("client id: "+this.clients[x].id);
        //this.ships[x].position.x = x*(this.size.width/clientCount);
        //this.ships[x].position.y = (this.size.height/2.0);
        this.ships[x].position.x = 100+(x+1)*100; //random positions to just move them more toward the center of the screen
        this.ships[x].position.y = 150;
        this.shipIDs[this.clients[x].id] = x;
    }
    this.lastFrame = 0;
};

exports.Game.prototype.startGame = function(){
    console.log("start game");
    this.startGameLoop();
};

exports.Game.prototype.startGameLoop = function(){
    setInterval(this.update.bind(this), loopRate);
};

exports.Game.prototype.update = function(){
    var t = 0.1;
    for(var x = 0; x < this.ships.length; x++){
        if(this.ships[x].moving){
            var ship = this.ships[x];
            var dx = ship.target.x-ship.position.x;
            var dy = ship.target.y-ship.position.y;
            var dist = Math.sqrt(dx*dx+dy*dy);
            if(dist <= ship.moveSpeed*t){
                ship.position.x = ship.target.x;
                ship.position.y = ship.target.y;
                ship.moving = false;
            }
            else{
                //calculate the change in position
                var deltaX = (dx/dist)*ship.moveSpeed*t;
                var deltaY = (dy/dist)*ship.moveSpeed*t;
                this.ships[x].position.x += deltaX;
                this.ships[x].position.y += deltaY;
            }
        }
    }
    this.io.sockets.emit('update', this.ships);
};

function Ship(clientID){
    this.size = {width:50,height:50};
    this.target = {x:0,y:0};
    this.moving = false;
    this.nextMoveSpace = {x:0,y:0};
    this.position = {x:0,y:0};
    this.id = clientID;
    this.moveSpeed = 150;
}

function inputReceivedFunction(){
    return function(data){
        console.log("input recieved+"+data.id);
        var ship = this.ships[this.shipIDs[data.id]];
        if(data.mouse){
            ship.target.x = data.mouseX;
            ship.target.y = data.mouseY;
            ship.moving = true;
        }
        if(data.stop)
            ship.moving = false;
    };
}
