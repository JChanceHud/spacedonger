door = gamvas.Actor.extend({
	create: function(name, x, y, rotation) {
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
		
		// set up two states: open and closed
		// set up animations for opening, closing, as well as opened and closed
		this.addState(new doorClosed("closed"));
		this.addAnimation(new gamvas.Animation(
			"closed",
			st.resource.getImage("../res/door-closed.png"),
			64, 64,
			1, 10
		));
		this.addAnimation(new gamvas.Animation(
			"opening",
			st.resource.getImage("../res/door-open-anim.png"),
			64, 64,
			5, 5
		));
		this.addAnimation(new gamvas.Animation(
			"closing",
			st.resource.getImage("../res/door-close-anim.png"),
			64, 64,
			5, 5
		));
		this.addState(new doorOpen("open"));
		this.addAnimation(new gamvas.Animation(
			"open",
			st.resource.getImage("../res/door-open.png"),
			64, 64,
			1, 10
		));
		this.setState("closed");
		this.setAnimation("closed");
	}
});

//
// ACTOR STATES
//

doorClosed = gamvas.ActorState.extend({
	create: function(name) {
		this._super(name);
		this.count = 0;
		this.opening = false;
	},
	leave: function() {
		this.actor.setAnimation("open");
	},
	update: function(t) {
		this.count += t;
		// update every .99 seconds
		// opening animation is set to last 1 second, so .99 seconds ensures
		// there is no flickering back to the first frame of the animation
		if (this.count >= .99) {
			this.count = 0;
			var st = gamvas.state.getCurrentState();
			
			// if this door has already been flagged to open, it will have already played
			// its animation for .99 seconds, and is ready to be 'open'
			if (this.opening) {
				this.actor.setState("open");
				this.opening = false;
				// set the door as passable on the grid
				st.grid.setValue(this.actor.x, this.actor.y, 0);
				return;
			}
			
			// check all adjacent spaces to this door
			for (var x = this.actor.x - 1; x <= this.actor.x + 1; x++) {
				for (var y = this.actor.y - 1; y <= this.actor.y + 1; y++) {
					// don't check spaces off the grid
					if (x >= 0 && y >= 0) {
						// if an adjacent space contains a unit, start opening the door
						if (st.grid.getValue(x, y) === -2) {
							this.actor.setAnimation("opening");
							this.opening = true;
							return;
						}
					}
				}
			}
		}
	}
});

doorOpen = gamvas.ActorState.extend({
	create: function(name) {
		this._super(name);
		this.count = 0;
		this.closing = false;
	},
	leave: function() {
		this.actor.setAnimation("closed");
	},
	update: function(t) {
		this.count += t;
		if (this.count >= .99) {
			this.count = 0;
			var st = gamvas.state.getCurrentState();
			var adjacentUnit = false;
			
			if (this.closing === true) {
				this.actor.setState("closed");
				this.closing = false;
				return;
			}
			
			// check all adjacent spaces for any adjacent units
			for (var x = this.actor.x - 1; x <= this.actor.x + 1; x++) {
				for (var y = this.actor.y - 1; y <= this.actor.y + 1; y++) {
					if (x >= 0 && y >= 0) {
						if (st.grid.getValue(x, y) === -2) {
							adjacentUnit = true;
							break;
						}
					}
				}
			}
			
			// if no adjacent units exist, start closing the door
			if (adjacentUnit === false) {
				this.actor.setAnimation("closing");
				this.closing = true;
				st.grid.setValue(this.actor.x, this.actor.y, -3);
				return;
			}
		}
	}
});