//gameState.js
//this will handle the main game state

gameState = gamvas.State.extend({
    init: function(){
        this.name = "gameState";
        this.size = {w:screen.width,h:screen.height};
        this.camera.position.x = this.size.w/2.0;
        this.camera.position.y = this.size.h/2.0;
        this.pressedKeys = [];
        this.ship = new shipActor("mainactor", 200, 200);
        gamvas.socket.on('update', function(data){
            
        });
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
    onMouseUp: function(button, x, y, ev){
        if(button === gamvas.mouse.RIGHT){
            //begin pathing
        }
    },
    preDraw: function(t){

    },
    draw: function(t){
        this.c.fillStyle="#000000";
        this.c.fillRect(0,0,this.size.w, this.size.h);
        this.ship.draw();
    },
    postDraw: function(t){

    }
});
