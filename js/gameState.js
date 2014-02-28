//gameState.js
//this will handle the main game state

gameState = gamvas.State.extend({
    init: function(){
        this.size = {w:screen.width,h:screen.height};
        this.camera.position.x = this.size.w/2.0;
        this.camera.position.y = this.size.h/2.0;
        this.pressedKeys = [];
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

    },
    preDraw: function(t){

    },
    draw: function(t){
        this.c.fillStyle="#FF99FF";
        this.c.fillRect(0,0,this.size.w, this.size.h);
    },
    postDraw: function(t){

    }
});
