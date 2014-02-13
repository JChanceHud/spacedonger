mainState = gamvas.State.extend({
	init: function() {
		this.size = gamvas.getCanvasDimension();
	
		// setting size of grid squares to 64 -- match this to sprite size
		this.nodeSize = 64;
		
		// instantiating the highlighted square that follows the mouse cursor
		this.mouseSelect = new rect(0, 0, this.nodeSize, this.nodeSize);
		
		// setting up pathfinding grid
		this.width = 10;
		this.height = 13;
		this.grid = new gamvas.AStarGrid(this.height, this.width, false, false,
			gamvas.AStar.STRATEGY_IGNORE_STEPS, 0);
			
		// creating an array for units, and create some test units
		this.units = new Array();
		this.units[0] = new unit("unit0", 1, 1);
		this.units[1] = new unit("unit1", 11, 1);
		
		// creating an array for doors
		this.doors = new Array();
		
		// creating an array for all actors (includes units, doors, walls, etc.)
		this.actors = new Array();
		this.actors[0] = this.units[0];
		this.actors[1] = this.units[1];
		
		// create the environment
		this.createEnvironment();
		
		// adding all actors to the state
		for (var i = 0; i < this.actors.length; i++) {
			this.addActor(this.actors[i]);
			
			// make the actors unpassable on the grid
			var value = -1; // value defaults to impassable object (i.e. wall)
			if (this.units.indexOf(this.actors[i]) !== -1) {
				value = -2; // if actor is a unit, assign -2;
			} else if (this.doors.indexOf(this.actors[i]) !== -1) {
				value = -3; // if actor is a door, assign -3;
			}
			this.grid.setValue(this.actors[i].x, this.actors[i].y, value);
		}
	},
	createEnvironment: function() {
		var numWalls = 0;
		var numDoors = 0;
		var numActors = this.actors.length;
		
		// the code below is for creating an environment specific to this test
		
		// create walls all around the edges of the grid
		for (var x = 0; x < this.height; x++) {
			for (var y = 0; y < this.width; y++) {
				if (x === 0 || x === this.height-1) {
					this.actors[numActors++] = 
						new wall("wall" + numWalls++, x, y);
				} 
				if (y === 0 || y === this.width-1) {
					this.actors[numActors++] =
						new wall("wall" + numWalls++, x, y);
				}
			}
		}
		
		// create walls in columns throughout the area
		// put a door alternating at the top and bottom of the columns
		var shiftUp = true;
		for (var x = 2; x < this.height-1; x+=2) {
			for (var y = 1; y < this.width-1; y++) {
				if ((shiftUp && y !== this.width-2) || (!shiftUp && y !== 1)) {
					this.actors[numActors++] =
						new wall("wall" + numWalls++, x, y);
				} else {
					this.doors[numDoors] = new door("door" + numDoors, x, y, 3*Math.PI/2);
					this.actors[numActors++] = this.doors[numDoors++];
				}
			}
			shiftUp = !shiftUp;
		}
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
				if (unit && this.mouseSelect.equals(unit.hitBox)) {
					this.selectedUnit = unit;
					break;
				}
			}
		} else if (button === gamvas.mouse.RIGHT && this.selectedUnit) {
			var unit = this.selectedUnit;
		
			// set the selected unit's target to wherever the mouse is
			unit.target = this.mouseSelect.clone();
			
			// if target is already occupied
			if (this.grid.getValue(unit.target.x, unit.target.y) === -1) {
			
				// do something (attack, heal, interact, etc.)
				unit.target = null;
			} else {
				// tell unit to move
				unit.setState("move");
			}
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