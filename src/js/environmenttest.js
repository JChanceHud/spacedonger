/**********/
/* STATES */
/**********/

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
        this.units = [];
        this.units[0] = new unit("unit0", 1, 1);
        this.units[1] = new unit("unit1", 11, 1);

        // creating an array for doors
        this.doors = [];

        // creating an array for all actors (includes units, doors, walls, etc.)
        this.actors = [];
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
        for (x = 2; x < this.height-1; x+=2) {
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
            var u = this.selectedUnit;

            // set the selected unit's target to wherever the mouse is
            u.target = this.mouseSelect.clone();

            // if target is already occupied
            if (this.grid.getValue(u.target.x, u.target.y) === -1) {

                // do something (attack, heal, interact, etc.)
                u.target = null;
            } else {
                // tell unit to move
                u.setState("move");
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

/**********/
/* ACTORS */
/**********/

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

wall = gamvas.Actor.extend({
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
        this.setFile(st.resource.getImage('../res/wall.png'));
    }
});

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

/***************/
/* ACTORSTATES */
/***************/

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
        var doorValues = [];
        for (var i = 0; i < st.doors.length; i++) {
            doorValues[i] = st.grid.getValue(st.doors[i].x, st.doors[i].y);
            st.grid.setValue(st.doors[i].x, st.doors[i].y, 0);
        }

        // Consider players to be passable when finding a path
        for (i = 0; i < st.units.length; i++) {
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
        for (i = 0; i < st.doors.length; i++) {
            st.grid.setValue(st.doors[i].x, st.doors[i].y, doorValues[i]);
        }

        // set unit spaces back to occupied
        for (i = 0; i < st.units.length; i++) {
            st.grid.setValue(st.units[i].x, st.units[i].y, -2);
        }
    }
});

doorClosed = gamvas.ActorState.extend({
    create: function(name) {
        this._super(name);
        this.count = 0;
        this.opening = false;
    },
    update: function(t) {
        this.count += t;
        // update every .99 seconds
        // opening animation is set to last 1 second, so .99 seconds ensures
        // there is no flickering back to the first frame of the animation
        if (this.count >= 0.99) {
            this.count = 0;
            var st = gamvas.state.getCurrentState();

            // if this door has already been flagged to open, it will have already played
            // its animation for .99 seconds, and is ready to be 'open'
            if (this.opening) {
                this.actor.setAnimation("open");
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
    update: function(t) {
        this.count += t;
        if (this.count >= 0.99) {
            this.count = 0;
            var st = gamvas.state.getCurrentState();
            var adjacentUnit = false;

            if (this.closing === true) {
                this.actor.setAnimation("closed");
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

/*********/
/* OTHER */
/*********/

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
        } else if (r.x === undefined || r.y === undefined ||
            r.width === undefined || r.height === undefined) {
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

/*********/
/* START */
/*********/

gamvas.event.addOnLoad(function() {
    gamvas.state.addState(new mainState());
    gamvas.start("gameCanvas");
});
