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
    },
    draw: function(t){
        var state = gamvas.state.getCurrentState();
    }
});

mainShipActorState = gamvas.ActorState.extend({
    init: function(){
    }
});
