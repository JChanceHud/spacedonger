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
            var dx = this.actor.target.x-this.actor.position.x;
            var dy = this.actor.target.y-this.actor.position.y;
            var dist = Math.sqrt(dx*dx+dy*dy);
            if(dist <= this.actor.moveSpeed*t){
                this.actor.moving = false;
                this.actor.position = this.actor.target;
                this.actor.delta.x = 0;
                this.actor.delta.y = 0;
            }
            this.actor.position.x += this.actor.delta.x*t;
            this.actor.position.y += this.actor.delta.y*t;
        };
    },
    setTarget: function(x, y, t){
        var dx = x-this.position.x;
        var dy = y-this.position.y;
        var dist = Math.sqrt(dx*dx+dy*dy);
        this.target = {x:x,y:y};
        this.delta = {x:((dx/dist)*this.moveSpeed),y:((dy/dist)*this.moveSpeed)};
    }
});

