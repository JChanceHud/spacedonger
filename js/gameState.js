//gameState.js
//this will handle the main game state

gameState = gamvas.State.extend({
    init: function(){
        this.size = {w:screen.width,h:screen.height};
        this.camera.position.x = this.size.w/2.0;
        this.camera.position.y = this.size.h/2.0;
        this.pressedKeys = [];
        this.ships = [];
        this.shipIDs = {};
        gamvas.socket.on('update', function(data){
            for(var x = 0; x < data.length; x++){
                if(typeof this.shipIDs[data[x].id] == "undefined"){
                    var index = this.ships.length;
                    this.shipIDs[data[x].id] = index;
                    this.ships[index] = new shipActor(0, 0);
                    this.ships[index].id = data[x].id;
                    this.ships[index].position = data[x].position;
                }
                var s = this.ships[this.shipIDs[data[x].id]];
                var c = this.camera.toWorld(data[x].position.x, data[x].position.y);
                s.moveSpeed = data[x].moveSpeed;
                s.setTarget(c.x, c.y, 0.1);
            }
        }.bind(this));
    },
    enter: function(){
        console.log("entered state");
    },
    onKeyDown: function(keyCode, character, ev){
        if(this.pressedKeys.indexOf(keyCode) == -1)
            this.pressedKeys.push(keyCode);
    },
    onKeyUp: function(keyCode, character, ev){
        this.pressedKeys.splice(this.pressedKeys.indexOf(keyCode), 1);
    },
    onMouseDown: function(button, x, y, ev){
    },
    onMouseMove: function(x, y){
    },
    onMouseUp: function(button, x, y, ev){
        //if(button === gamvas.mouse.RIGHT){
        gamvas.socket.emit('inputReceived', {mouse:true,id:gamvas.socket.id,mouseX:x,mouseY:y});
        //}
    },
    preDraw: function(t){
    },
    draw: function(t){
        this.c.fillStyle="#000000";
        this.c.fillRect(0,0,this.size.w, this.size.h);
        for(var x = 0; x < this.ships.length; x++){
            this.ships[x].draw();
        }
    },
    postDraw: function(t){

    }
});
