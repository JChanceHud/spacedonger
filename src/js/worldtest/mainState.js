mainState = gamvas.State.extend({
	init: function() {
		this.size = gamvas.getCanvasDimension();
	
		// setting size of grid squares to 64 -- match this to sprite size
		this.nodeSize = 64;
		
		// instantiating the highlighted square that follows the mouse cursor
		this.mouseHighlight = new rect(0, 0, this.nodeSize, this.nodeSize);
		this.mouseSelect = new rect(0, 0, this.nodeSize, this.nodeSize);
			
		// creating an array for units, and create some test units
		this.units = new Array();
		this.units[0] = new unit("unit0", 1, 1);
		
		// creating an array for doors
		this.doors = new Array();
		
		// creating an array for all actors (includes units, doors, walls, etc.)
		this.actors = new Array();
		this.actors[0] = this.units[0];
		
		this.width = 10;
		this.height = 13;
		this.grid = new gamvas.AStarGrid(this.height, this.width, false, false,
			gamvas.AStar.STRATEGY_IGNORE_STEPS, 0);
		
		// create the environment
		this.loadEnvironment("../res/map.txt", this);
	},
	loadEnvironment: function(filePath, mainState) {
		var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
		var rawSrc;
		reader.open("get", filePath, true);
		reader.onreadystatechange = function() {
			if (reader.readyState === 4) {
				rawSrc = reader.responseText;
			}
		};
		reader.onload = function() {
			if (reader.readyState == 4) {
				mainState.createEnvironment(rawSrc.split("\n"));
			}
		}
		reader.send(null);
	},
	createEnvironment: function(srcLines) {
		var numWalls = 0;
		var numDoors = 0;
		var numActors = this.actors.length;
		
		for (var row = 0; row < srcLines.length; row++) {
			var line = srcLines[row];
			for (var col = 0; col < line.length; col++) {
				var letter = line.substring(col, col+1);
				var objID = parseInt(letter);
				switch (objID) {
				case 0: break;
				case 1: this.actors[numActors++] =
					new wall("wall" + numWalls++, col, row);
					break;
				case 2: this.doors[numDoors] = new door("door" + numDoors, col, row);
					this.actors[numActors++] = this.doors[numDoors++];
					break;
				}
			}
		}
				
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
	onMouseMove: function(x, y) {
		// every time mouse moved, recalculate which grid square is highlighted
		screenX = Math.floor(x / this.nodeSize);
		screenY = Math.floor(y / this.nodeSize);
		x = Math.floor(x / this.nodeSize) + (this.camera.position.x / this.nodeSize);
		y = Math.floor(y / this.nodeSize) + (this.camera.position.y / this.nodeSize);
		this.mouseHighlight = new rect(screenX, screenY, this.nodeSize, this.nodeSize);
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
			unit.targetHighlight = this.mouseHighlight.clone();
			
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
	onKeyUp: function(keyCode, character, ev) {
		var dx = dy = 0;
		switch (keyCode) {
		case gamvas.key.LEFT:
			dx = -this.nodeSize;
			break;
		case gamvas.key.RIGHT:
			dx = this.nodeSize;
			break;
		case gamvas.key.UP:
			dy = -this.nodeSize;
			break;
		case gamvas.key.DOWN:
			dy = this.nodeSize;
			break;
		}
		this.camera.move(dx, dy);
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
				this.selectedUnit.hitBoxHighlight.loc.x + 1,
				this.selectedUnit.hitBoxHighlight.loc.y + 1,
				this.nodeSize - 2,
				this.nodeSize - 2
			);	
			
			// draw blue square at selected unit's target square
			if (this.selectedUnit.target) {
				this.c.strokeStyle = 'rgb(0, 0, 200)';
				this.c.strokeRect(
					this.selectedUnit.targetHighlight.loc.x + 1,
					this.selectedUnit.targetHighlight.loc.y + 1,
					this.nodeSize - 2,
					this.nodeSize -2
				);	
			}
		}
	
		// draw grey square around mouse position
		this.c.strokeStyle = 'rgb(209, 209, 209)';
		this.c.strokeRect(
			this.mouseHighlight.loc.x + 1,
			this.mouseHighlight.loc.y + 1,
			this.nodeSize - 2,
			this.nodeSize - 2
		);
		
	}
});