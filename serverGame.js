// serverGame.js
//

exports.Game = function(clients){
    this.ships = [];
    this.size = {width:1000,height:1000};
    var clientCount = Object.keys(clients).length;
    this.clients = new Array(clientCount);
    for(var x = 0; x < clientCount; x++){
        this.clients[x] = clients[Object.keys(clients)[x]];
    }
    for(x = 0; x < this.clients.length; x++){
        this.ships[x] = new Ship(this.clients[x].id);
        console.log("client id: "+this.clients[x].id);
        this.ships[x].position.x = x*(this.size.width/clientCount);
        this.ships[x].position.y = (this.size.height/2.0);
    }
};

exports.Game.prototype.startGame = function(){
    console.log("start game");
};

function Ship(clientID){
    this.size = {width:100,height:100};
    this.position = {x:0,y:0};
    this.clientID = clientID;
}
