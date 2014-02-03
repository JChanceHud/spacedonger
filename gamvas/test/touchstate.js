myActorState = gamvas.ActorState.extend({
    onTouchDown : function(id, x, y, ev) {
        alert("Touch in ActorState");
    }
});

myActor = gamvas.Actor.extend({
    create : function(name, x, y) {
        this._super(name, x, y);
        this.addState(new myActorState('standard'));
        this.setState('standard');
    },
});

myState = gamvas.State.extend({
    init : function() {
        this.player = new myActor('player');
        this.registerInputEvents(this.player);
    }
});

gamvas.event.addOnLoad(function() {
    gamvas.state.addState(new myState('myState'));
    gamvas.start('game', true);
});
