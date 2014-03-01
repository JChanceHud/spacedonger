
lobbyState = gamvas.State.extend({
    init: function(){
        this.name = "lobbyState";
        this.size = {w:screen.width,h:screen.height};
        this.camera.position.x = this.size.w/2.0;
        this.camera.position.y = this.size.h/2.0;
        this.ready = false;
        this.readyCount = 0;
        this.clientCount = 0;
        gamvas.socket.on('connected', function(data){
            console.log('connected');
            this.clientCount = data.clientCount;
        });
        gamvas.socket.on('gameStarting', function(data){
            gamvas.state.setState(gamvas.state.getState("gameState"));
        });
        gamvas.socket.on('readyUpdate', function(data){
            console.log("readyupdate");
            this.readyCount = data.readyCount;
            this.clientCount = data.clientCount;
        }.bind(this));
    },
    onMouseUp: function(button, x, y, ev){
        this.ready = !this.ready;
        gamvas.socket.emit('ready', this.ready);
    },
    draw: function(t){
        this.c.fillStyle = "#000000";
        this.c.fillRect(0,0,this.size.w,this.size.h);
        this.c.font = "30px Arial";
        this.c.fillStyle = this.ready?"#00FF00":"#FF0000";
        drawCenteredText(this.c, this.ready?"Ready":"Not Ready", this.size.w/2.0, this.size.h/2.0);
        this.c.fillStyle = "#FFFFFF";
        drawCenteredText(this.c, "Number of ready players: "+this.readyCount, this.size.w/2.0, this.size.h/2.0 + 30.0);
        drawCenteredText(this.c, "Number of connected players: "+this.clientCount, this.size.w/2.0, this.size.h/2.0 + 60.0);
    }
});

function drawCenteredText(context, text, x, y){
    var size = context.measureText(text);
    var cx = x-(size.width/2.0);
    context.fillText(text, cx, y);
}
