// ship actor
//

shipActor = gamvas.Actor.extend({
    create: function(name, x, y){
        this.x = x;
        this.y = y;
        this._super(name, x, y);
        var state = gamvas.state.getCurrentState();
        this.setFile(state.resource.getImage('res/ship.png'), 200, 200);
        this.setScale(0.25);
        this.size = {width:50,height:50};
        this.moveSpeed = 50.0;
        this.delta = {x:0,y:0};
        this.getCurrentState().update = function(t){
            if(typeof t == "undefined")
                t = 1.0/60.0;
            var dx = Math.abs(this.actor.target.x-this.actor.position.x);
            var dy = Math.abs(this.actor.target.y-this.actor.position.y);
            if(dx <= Math.abs(this.actor.delta.x) && dy <= Math.abs(this.actor.delta.y)){
                this.actor.moving = false;
                this.actor.position = this.actor.target;
                this.actor.delta.x = 0;
                this.actor.delta.y = 0;
            }
            this.actor.position.x += this.actor.delta.x;
            this.actor.position.y += this.actor.delta.y;
        };
    },
    setTarget: function(x, y, t){
        var dx = x-this.position.x;
        var dy = y-this.position.y;
        this.target = {x:x,y:y};
        this.delta = {x:(dx)*gamvas.socket.updateInterval,y:(dy)*gamvas.socket.updateInterval};
    }
});

