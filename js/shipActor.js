// ship actor
//

shipActor = gamvas.Actor.extend({
    create: function(name, x, y){
        this.x = x;
        this.y = y;
        this._super(name, x, y);
        var state = gamvas.state.getCurrentState();
        this.setFile(state.resource.getImage('res/ship.png'), 50, 50);
        this.setScale(1);
        this.setCenter(25, 25);
        this.size = {width:50,height:50};
        this.moveSpeed = 50.0;
        this.rotationSpeed = 50.0;
        this.rotating = false;
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
            if(Math.abs(this.actor.rotationTarget - this.actor.rotation) < this.actor.rotationDelta){
                this.actor.rotating = false;
                this.actor.rotationDelta = 0;
                this.actor.setRotation(this.actor.rotationTarget);
            }
            this.actor.setRotation(this.actor.rotation+this.actor.rotationDelta);
        };
    },
    setTarget: function(x, y, t){
        var dx = x-this.position.x;
        var dy = y-this.position.y;
        var dist = Math.sqrt(dy*dy+dx*dx);
        if(dist <= 1){
            this.delta = {x:0,y:0};
            this.rotationDelta = 0;
            return;
        }
        this.target = {x:x,y:y};
        this.delta = {x:(dx)*gamvas.socket.updateInterval,y:(dy)*gamvas.socket.updateInterval};
        this.rotationTarget = absAngle(Math.atan2(dy,dx));
        this.normalizeRotation();
        var rotation = shortestRotation(this.rotation, this.rotationTarget); //-1 is left, 1 is right
        this.rotationDelta = (this.rotationTarget-this.rotation)*gamvas.socket.updateInterval;
    },
    normalizeRotation: function(){
        this.setRotation(normalizeAngle(this.rotation));
    }
});

function shortestRotation(original, target){
    return (target-original)>(original-target)?(original-target):(target-original);
}

function absAngle(angle){
    if(angle < 0)
        return normalizeAngle(convertAngle(angle));
    return normalizeAngle(angle);
}

//puts angle in the range 0 to 2PI
function normalizeAngle(angle){
    return angle-((Math.floor(angle/(2*Math.PI)))*2*Math.PI);
}

//converts angle to or from negative values
function convertAngle(angle){
    var f, n;
    if(angle < 0){
        f = Math.floor(Math.abs(angle)/Math.PI);
        n = ((f % 2)===0)?Math.PI:0;
        return (Math.PI - (Math.abs(angle) - f))+n;
    }
    else{
        f = Math.floor(angle/Math.PI);
        n = ((f % 2)===0)?0:Math.PI;
        return (-1*(Math.PI - angle))-n;
    }
}
