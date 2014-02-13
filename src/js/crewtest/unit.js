unit = gamvas.Actor.extend({
	create: function(name, x, y) {
		this.x = x;
		this.y = y;
		
		// set up reference to mainState
		var st = gamvas.state.getCurrentState();
		// recalculate x and y to actual pixel locations (originally grid coordinates)
		var loc = st.camera.toWorld(this.x*st.nodeSize, this.y*st.nodeSize);
		
		// call super constructor
		this._super(name, loc.x, loc.y);
		
		// set width and height of unit (probably will be a standard number, like 64x64)
		this.size = 64;
		this.hitBox = new rect(x, y, this.size, this.size);
		
		// set sprite file
		this.setFile(st.resource.getImage('../res/ball.png'));
        
        // instantiate actor states
        this.addState(new idleState("idle"));
        this.addState(new moveState("move"));
        this.setState("idle");
	},
	move: function(gridNode) {
		var st = gamvas.state.getCurrentState();
		
		// set old position as now empty on grid
		st.grid.setValue(this.x, this.y, 0);
		
		// updating all position references
		this.x = gridNode.position.x;
		this.y = gridNode.position.y;
		var loc = st.camera.toWorld(this.x*st.nodeSize, this.y*st.nodeSize);
		this.setPosition(loc.x, loc.y);
		// also doing the same for the hitBox
		this.hitBox.move(gridNode);
		
		// set new position as occupied on grid
		st.grid.setValue(this.x, this.y, -2);
	}
});

//
// ACTOR STATES
//

// nothing to see here - just lollygagging
idleState = gamvas.ActorState.extend();

moveState = gamvas.ActorState.extend({
	create: function(name) {
		this._super(name);
		this.counter = 0;
	},
	update: function(t) {
		// count up using 't' or delta time
		this.counter += t;
		
		// when 1/2 second has elapsed, continue
		if (this.counter >= 0.5) {
			// reset counter
			this.counter = 0;
			
			// if unit has no target, or is at destination, go back to idling
			if (!this.actor.target || this.actor.target.equals(this.actor.hitBox)) {
				this.actor.path = null;
				this.actor.target = null;
				this.actor.setState("idle");
				return;
			}
			
			// recalculate path to target
			this.path(this.actor.target);
			
			// if there's somewhere to go...
			if (this.actor.path && this.actor.path.length > 0) {
				var st = gamvas.state.getCurrentState();
				var next = this.actor.path[0];
				// if the next space in the path is not occupied, go there
				// (otherwise wait until it is)
				if (st.grid.getValue(next.position.x, next.position.y) >= 0) {
					this.actor.move(this.actor.path[0]);
				}
			}
		}
	},
	path: function(target) {
		// local variables
		var st = gamvas.state.getCurrentState();
		var unit = this.actor;
		
		// Consider doors to be passable when finding a path
		var doorValues = new Array();
		for (var i = 0; i < st.doors.length; i++) {
			doorValues[i] = st.grid.getValue(st.doors[i].x, st.doors[i].y);
			st.grid.setValue(st.doors[i].x, st.doors[i].y, 0);
		}
		
		// Consider players to be passable when finding a path
		for (var i = 0; i < st.units.length; i++) {
			st.grid.setValue(st.units[i].x, st.units[i].y, 0);
		}
				
		// if target is currently occupied, pretend it isn't so as to still make a path there
		// (might be dodgy programming but who cares)
		// otherwise just set the path as normal
		var value = st.grid.getValue(target.x, target.y);
		if (value < 0) {
			st.grid.setValue(target.x, target.y, 0);
			unit.path = st.grid.find(unit.x, unit.y, target.x, target.y);
			st.grid.setValue(target.x, target.y, value);
		} else {
			unit.path = st.grid.find(unit.x, unit.y, target.x, target.y);
		}	
		
		// Reset value of doors to their original value
		for (var i = 0; i < st.doors.length; i++) {
			st.grid.setValue(st.doors[i].x, st.doors[i].y, doorValues[i]);
		}
		
		// set unit spaces back to occupied
		for (var i = 0; i < st.units.length; i++) {
			st.grid.setValue(st.units[i].x, st.units[i].y, -2);
		}
	}
});