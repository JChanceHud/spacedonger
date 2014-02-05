mainState = gamvas.State.extend({
	init: function() {
		this.size = gamvas.getCanvasDimension();
	
		// setting size of grid squares to 64 -- match this to sprite size
		this.nodeSize = 64;
		
		// instantiating the highlighted square that follows the mouse cursor
		this.mouseSelect = new rect(0, 0, this.nodeSize, this.nodeSize);
			
		// creating units for testing purposes
		this.units = new Array();
		this.units[0] = new unit("unit0", 1, 1);
		this.units[1] = new unit("unit1", 5, 7);
		
		// adding all units to the state
		for (var i = 0; i < this.units.length; i++) {
			this.addActor(this.units[i]);
		}
		
		// set up pathfinding grid
		this.grid = new gamvas.AStarGrid(20, 20, false, false,
			gamvas.AStar.STRATEGY_IGNORE_STEPS, 0);
		
	},
	onMouseMove: function(x, y) {
		// every time mouse moved, recalculate which grid square is highlighted
		x = Math.floor(x / this.nodeSize);
		y = Math.floor(y / this.nodeSize);
		this.mouseSelect = new rect(x, y, this.nodeSize, this.nodeSize);
	},
	onMouseUp: function(button, x, y, ev) {
		if (button === gamvas.mouse.LEFT) {
			// set selected unit to null unless another unit is clicked
			this.selectedUnit = null;
			for (var i = 0; i < this.units.length; i++) {
				var unit = this.units[i];
				if (this.mouseSelect.equals(unit.hitBox)) {
					this.selectedUnit = unit;
					break;
				}
			}
		} else if (button === gamvas.mouse.RIGHT && this.selectedUnit) {
			// set the selected unit's target to wherever the mouse is
			this.selectedUnit.target = this.mouseSelect.clone();
			
			// find a path to that target
			this.selectedUnit.path = this.grid.find(
				this.selectedUnit.x,
				this.selectedUnit.y,
				this.selectedUnit.target.x,
				this.selectedUnit.target.y
			);
			// start at the first step in the path
			this.selectedUnit.pathStep = 0;
			
			// tell unit to move
			this.selectedUnit.setState("move");
		}
	},
	draw: function(t) {
		// instruction text
		this.c.fillStyle = 'rgb(255, 255, 255)';
		this.c.font = 'bold 20px sans-serif';
		this.c.textAlign = 'center';
		this.c.fillText("Left-click to select unit, right-click to move selected unit", 0, -280);
	
		// draw green square around selected unit
		if (this.selectedUnit) {
			this.c.strokeStyle = 'rgb(0, 200, 0)';
			this.c.strokeRect(
				this.selectedUnit.hitBox.loc.x + 1,
				this.selectedUnit.hitBox.loc.y + 1,
				this.selectedUnit.hitBox.width - 2,
				this.selectedUnit.hitBox.height -2
			);	
			
			// draw blue square at selected unit's target square
			if (this.selectedUnit.target) {
				this.c.strokeStyle = 'rgb(0, 0, 200)';
				this.c.strokeRect(
					this.selectedUnit.target.loc.x + 1,
					this.selectedUnit.target.loc.y + 1,
					this.selectedUnit.target.width - 2,
					this.selectedUnit.target.height -2
				);	
			}
		}
	
		// draw grey square around mouse position
		this.c.strokeStyle = 'rgb(209, 209, 209)';
		this.c.strokeRect(
			this.mouseSelect.loc.x + 1,
			this.mouseSelect.loc.y + 1,
			this.nodeSize - 2,
			this.nodeSize - 2
		);
	}
});

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
		
		// updating all position references
		this.x = gridNode.position.x;
		this.y = gridNode.position.y;
		var loc = st.camera.toWorld(this.x*st.nodeSize, this.y*st.nodeSize);
		this.setPosition(loc.x, loc.y);
		// also doing the same for the hitBox
		this.hitBox.move(gridNode);
	}
});

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
			
			var path = this.actor.path;
			var step = this.actor.pathStep;
			
			// if unit has already reached destination, set target to null and idle
			if (step >= path.length) {
				this.actor.target = null;
				this.actor.setState("idle");
				return;
			}
			
			// move to the next step in the path
			this.actor.move(path[step]);
			this.actor.pathStep++;
		}
	}
});

// couldn't figure out how to override gamvas.Rect, so I made my own
// however gamvas.Rect only has x, y, width & height, so no harm not using it
// this could probably be in its own .js file
function rect(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	var st = gamvas.state.getCurrentState();
	this.loc = st.camera.toWorld(this.x*st.nodeSize, this.y*st.nodeSize);
	
	this.move = move;
	function move(gridNode) {
		var st = gamvas.state.getCurrentState();
		this.x = gridNode.position.x;
		this.y = gridNode.position.y;
		this.loc = st.camera.toWorld(this.x*st.nodeSize, this.y*st.nodeSize);
	}
	
	this.equals = equals;
	function equals(r) {
		if (this === r) {
			return true;
		} else if (!r) {
			return false;
		} else if (!r.x || !r.y || !r.width || !r.height) {
			return false;
		}
		return (this.x === r.x && this.y === r.y &&
			this.width === r.width && this.height === r.height);
	}
	
	this.clone = clone;
	function clone() {
		return new rect(this.x, this.y, this.width, this.height);
	}
}

gamvas.event.addOnLoad(function() {
	gamvas.state.addState(new mainState());
	gamvas.start("gameCanvas");
});