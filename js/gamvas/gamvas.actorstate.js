/**
 * Copyright (C) 2012 Heiko Irrgang <hi@93i.de>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*
 * Class: gamvas.ActorState
 *
 * Description:
 *
 * A class for actor states
 *
 * ActorState is the brain of a actor. Every actor has a default
 * ActorState, that you can use for your logic by using
 * <gamvas.Actor.getCurrentState> or you could add own states for
 * different situations, for example a
 * soldier ai could have states like patrol, detect, follow, fight
 *
 * Constructor:
 *
 * new gamvas.ActorState(name)
 *
 * Parameters:
 *
 * name - a unique state name within the actor
 */
gamvas.ActorState = gamvas.Class.extend({
	create: function(name) {
	    this._isInitialized = false;

	    /*
	     * Variable: name
	     *
	     * The name of the actor state
	     */
	    this.name = name;

	    /*
	     * Variable: actor
	     *
	     * The actor the state is assigned to, or null if not assigned
	     */
	    this.actor = null;
	},

	/*
	 * Function: init
	 *
	 * Description:
	 *
	 * Gets called once on state initialization.
	 * Overwrite with code that needs to be done one, like resource loading.
	 */
	init: function() {
	},

	/*
	 * Function: enter
	 *
	 * Description:
	 *
	 * Gets called when the state is entered.
	 */
	enter: function() {
	},

	/*
	 * Function: leave
	 *
	 * Description:
	 *
	 * Gets called when the state is left.
	 */
	leave: function() {
	},

	/*
	 * Function: preDraw
	 *
	 * Description:
	 *
	 * Gets called after screen clear and before camera handling.
	 * Use this for example for static background elements that do not move with the camera.
	 *
	 * Parameters:
	 *
	 * t - the time since last redraw
	 */
	preDraw: function(t) {
	},

	/*
	 * Function: draw
	 *
	 * Description:
	 *
	 * Gets called when the state should draw.
	 * In most cases you would not overwrite this function.
	 * If you put logic like ai in a actor, overwrite the
	 * update function.
	 *
	 * Parameters:
	 *
	 * t - the time since last redraw
	 *
	 * See:
	 *
	 * <gamvas.ActorState.update>
	 */
	draw: function(t) {
	    var anim = this.actor.getCurrentAnimation();
	    anim.drawFixed(t, gamvas.getContext2D(), this.actor.position.x, this.actor.position.y, this.actor.center.x, this.actor.center.y, this.actor.rotation, this.actor.scaleFactor);
	},

	/*
	 * Function: postDraw
	 *
	 * Description:
	 *
	 * Gets called after camera handling.
	 * Use this to render static things in the screen forground, like score or health.
	 *
	 * Parameters:
	 *
	 * t - the time since last redraw
	 */
	postDraw: function(t) {
	},

	/*
	 * Function: update
	 *
	 * Description:
	 *
	 * Update the ai.
	 * Overwrite with things your actor should do on a per frame basis.
	 *
	 * Parameters:
	 *
	 * t - the time since last redraw
	 */
	update: function(t) {
	},

	/*
	 * Function: onKeyDown
	 *
	 * Description:
	 *
	 * A key on the keyboard was pressed
	 *
	 * Note:
	 *
	 * Requires the actor to be registered with <gamvas.State.registerInputEvents>
	 *
	 * Parameters:
	 *
	 * keyCode - The keycode of the key (e.g. gamvas.key.RETURN)
	 * character - The actual character (e.g. 'a')
	 * ev - The JavaScript event object
	 *
	 * See:
	 *
	 * <gamvas.State.registerInputEvents>
	 * <gamvas.ActorState.onKeyUp>
	 *
	 * Example:
	 *
	 * > myActorState = gamvas.ActorState.extend({
	 * >     onKeyDown: function(keyCode) {
	 * >         if (keyCode == gamvas.key.SPACE) {
	 * >             this.firePlayerGun();
	 * >         }
	 * >     },
	 * >     firePlayerGun() {
	 * >         console.log('BAZOING!');
	 * >     }
	 * > });
	 */
	onKeyDown: function(keyCode, character, ev) {
	},

	/*
	 * Function: onKeyUp
	 *
	 * Description:
	 *
	 * A key on the keyboard was released
	 *
	 * Parameters:
	 *
	 * keyCode - The keycode of the key (e.g. gamvas.key.RETURN)
	 * character - The actual character (e.g. 'a')
	 * ev - The JavaScript event object
	 *
	 * See:
	 *
	 * <gamvas.ActorState.onKeyDown>
	 */
	onKeyUp: function(keyCode, character, ev) {
	},

	/*
	 * Function: onMouseDown
	 *
	 * Description:
	 *
	 * A mouse button was pressed
	 *
	 * Parameters:
	 *
	 * button - The mouse button that was pressed (e.g. gamvas.mouse.LEFT)
	 * x/y - The position on the screen the mousepointer was while pressed
	 * ev - The JavaScript event object
	 *
	 * See:
	 *
	 * <gamvas.mouse>
	 */
	onMouseDown: function(button, x, y, ev) {
	},

	/*
	 * Function: onMouseUp
	 *
	 * Description:
	 *
	 * A mouse button was released
	 *
	 * Parameters:
	 *
	 * button - The mouse button that was released (e.g. gamvas.mouse.LEFT)
	 * x/y - The position on the screen the mousepointer was while released
	 * ev - The JavaScript event object
	 *
	 * See:
	 *
	 * <gamvas.mouse>
	 */
	onMouseUp: function(button, x, y, ev) {
	},

	/*
	 * Function: onMouseMove
	 *
	 * Description:
	 *
	 * The mouse was moved
	 *
	 * Parameters:
	 *
	 * x/y - The position where the mousecursor was
	 * ev - The JavaScript event object
	 *
	 * Example:
	 *
	 * > myActorState = gamvas.ActorState.extend({
	 * >     onMouseMove: function(x, y) {
	 * >        this.followPosition(x, y);
	 * >     }
	 * > });
	 */
	onMouseMove: function(x, y, ev) {
	},

    /*
     * Function: onTouchDown
     *
     * A finger starts touching the display
     *
     * Description:
     *
     * The id is a integer representing the finger used. Starts with 0
     * next finger would be 1, if the first finger would be removed from
     * the display and another finger will be added, the new finger would
     * become id 0 again, as id 0 was not used anymore, when the new finger
     * was added
     *
     * Parameters:
     *
     * id - A unique integer to identify certain fingers
     * x/y - The screen position, where the finger was put down
     * ev - The JavaScript event object
     */
    onTouchDown: function(id, x, y, ev) {
        return gamvas.mouse.exitEvent();
    },

    /*
     * Function: onTouchUp
     *
     * A finger stopped touching the display
     *
     * Parameters:
     *
     * id - A unique integer to identify certain fingers
     * x/y - The screen position, where the finger was put down
     * ev - The JavaScript event object
     */
    onTouchUp: function(id, x, y, ev) {
        return gamvas.mouse.exitEvent();
    },

    /*
     * Function: onTouchMove
     *
     * A finger is sliding over the surface
     *
     * Parameters:
     *
     * id - A unique integer to identify certain fingers
     * x/y - The screen position, where the finger was put down
     * ev - The JavaScript event object
     */
    onTouchMove: function(id, x, y, ev) {
        return gamvas.mouse.exitEvent();
    },

	/*
	 * Function: onCollision
	 *
	 * Description:
	 *
	 * The actor starts a collision with another actor
	 *
	 * Parameters:
	 *
	 * a - the colliding actor
	 * ni - the normal impulse (aka how hard did we hit)
	 * ti - the tangent impulse (how much rotational force did we get out of the collision)
	 * c - a b2Contact object holding low level information about the contact
	 *
	 * See:
	 * <gamvas.actorstate.onCollisionEnter>
	 * <gamvas.actorstate.onCollisionLeave>
	 *
	 * Example:
	 *
	 * > spaceShipFlying = gamvas.ActorState.extend({
	 * >     onCollision: function(a, ni) {
	 * >         if ( (a.type == "asteroid") && (ni > 15) ) {
	 * >             console.log("here is your captain speaking, we got hit hard by a asteroid... abandon ship!");
	 * >         }
	 * >     }
	 * > });
	 */
	onCollision: function(a, ni, ti, c) {
	},

	/*
	 * Function: onCollisionEnter
	 *
	 * Description:
	 *
	 * The actor starts a collision with another actor
	 *
	 * Parameters:
	 *
	 * a - the colliding actor
	 * c - a b2Contact object holding low level information about the contact
	 *
	 * See:
	 * <gamvas.actorstate.onCollisionEnter>
	 *
	 * Example:
	 *
	 * > myActorState = gamvas.ActorState.extend({
	 * >     onCollisionEnter: function(a) {
	 * >         console.log("i got hit by "+a.name);
	 * >     }
	 * > });
	 */
	onCollisionEnter: function(a, c) {
	},

	/*
	 * Function: onCollisionLeave
	 *
	 * Description:
	 *
	 * The actor leaves a collision with another actor
	 *
	 * Parameters:
	 *
	 * a - the colliding actor
	 * c - a b2Contact object holding low level information about the contact
	 *
	 * See:
	 * <gamvas.actorstate.onCollisionEnter>
	 */
	onCollisionLeave: function(a, c) {
	},

	/*
	 * Function: doCollide
	 *
	 * Description:
	 *
	 * This function is called to check of two objects should collide.
	 * If one of the two objects returns false, the collision between
	 * the two objects will be ignored.
	 *
	 * This is a important function for creating jump and run games.
	 * On collision with so called cloud objects - which are typical
	 * jump and run objects that you can for example jump through from
	 * below but not fall down when standing on them, you would check
	 * if you jump upwards, then disable the collision, or if you fall
	 * downwards and are positioned above the colliding object, you
	 * would enable the collision.
	 *
	 * Parameters:
	 *
	 * a - the colliding actor
	 * c - a b2Contact object holding low level information about the contact
	 * om - the old b2Manifold object holding information about the collision points
	 *
	 * See:
	 * <gamvas.actorstate.onCollisionEnter>
	 *
	 * Example:
	 *
	 * Do not collide with ghost objects
	 *
	 * > myActorState = gamvas.ActorState.extend({
	 * >     doCollide: function(opponent) {
	 * >         if (opponent.type == "ghost") {
	 * >             return false;
	 * >         }
	 * >         return true;
	 * >     }
	 * > });
	 */
	doCollide: function(a, c, om) {
	    return true;
	}
});
