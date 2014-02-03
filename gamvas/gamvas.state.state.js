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
 * Class: gamvas.State
 *
 * Description:
 *
 * Game state class, overwrite for own states
 *
 * Constructor:
 *
 * new gamvas.State(name);
 *
 * Parameters:
 *
 * name - a unique identifier as name
 *
 * Example:
 *
 * A hello world state
 *
 * > myState = gamvas.State.extend({
 * >     draw: function(t) {
 * >         this.c.fillText("Hello World!", 10, 10);
 * >     }
 * > });
 */
gamvas.State = gamvas.Class.extend({
        create: function(name) {
            this._isInitialized = false;
            this._pixelPerMeter = 64;
            this._removeQueue = [];

            /*
             * Variable: disableCamera
             *
             * Description:
             *
             * By default a state provides a full environment for game development.
             * This includes a default camera under this.camera.
             *
             * If you do not want this behaviour, because you need custom camera
             * code, setting disableCamera to true will disable the default camera.
             *
             * Default:
             *
             * false
             */
            this.disableCamera = false;

            /*
             * Variable: name
             *
             * Description:
             *
             * The name of the state, must be unique within all states
             */
            this.name = name;

            /*
             * Variable: autoClear
             *
             * Description:
             *
             * If set to true, the screen will automatically cleared before drawing
             * functions are called.
             *
             * Default:
             *
             * true
             *
             * See:
             *
             * <gamvas.State.clearColor>
             */
            this.autoClear = true;

            /*
             * Variable: clearColor
             *
             * Description:
             *
             * The color to clear the screen, if <gamvas.State.autoClear> is enabled.
             * It is a string in css color notation.
             *
             * Default:
             *
             * '#000000'
             */
            this.clearColor = '#000000';
            this.actors = [];
            this.eventActors = [];
            this._afiles = [];
            this._doSleep = true;
            this._world = null;

            /*
             * Variable: resource
             *
             * a <gamvas.Resource> instance, to allow easy file loading
             *
             * Example:
             *
             * > var image = this.resource.getImage('myImage.png');
             */
            this.resource = null;

            /*
             * Variable: canvas
             *
             * The DOM element of the canvas the game is running on.
             */
            this.canvas = null;

            /*
             * Variable: c
             *
             * a HTML5 2D context of the canvas the game is running on.
             * Use this to have low level access to the canvas 2D context.
             *
             * Example:
             *
             * > myState = gamvas.State.extend({
             * >     draw: function(t) {
             * >         this.c.fillText("Score: "+this.score, 10, 10);
             * >     }
             * > });
             */
            this.c = null;

            /*
             * Variable: dimension
             *
             * a object holding the canvas dimension in {w, h}
             *
             * Example:
             *
             * > console.log("Canvas width/height: "+this.dimension.w+"/"+this.dimension.h);
             */
            this.dimension = null;

            /*
             * Variable: camera
             *
             * a <gamvas.Camera> instance, to modify camera.
             *
             * Example:
             *
             * > myState = gamvas.State.extend({
             * >     draw: function(t) {
             * >         this.actor.draw(t);
             * >         // rotate 90 degrees per second (in radians 90 degrees is 0.5*PI)
             * >         this.camera.rotate(0.5*Math.PI*t);
             * >     }
             * > });
             */
            this.camera = null;
        },
        _setup: function() {
            this.resource = new gamvas.Resource();
            this.canvas = gamvas.getCanvas();
            this.c = gamvas.getContext2D();
            this.dimension = gamvas.getCanvasDimension();
            this.camera = new gamvas.Camera();
        },

        /*
         * Function: init
         *
         * Description:
         *
         * The init function is called only once per state to initialize it.
         *
         * Overwrite this function to do things like loading images and sounds
         * that are necessary for this state
         */
        init: function() {
        },

        /*
         * Function: enter
         *
         * Description:
         *
         * The enter function is called when the state is entered.
         *
         * Overwrite this function with code that should run when
         * the state is entered, which can be at the beginning of the
         * game or when the system switches between two states.
         *
         * See:
         *
         * <gamvas.State.leave>
         */
        enter: function() {
        },

        /*
         * Function: leave
         *
         * Description:
         *
         * The enter function is called when the state is left.
         *
         * Overwrite this function with code that should run when
         * the state is left and a other state will be called
         * after this.
         *
         * See:
         *
         * <gamvas.State.enter>
         */
        leave: function() {
        },

        /*
         * Function: clearScreen
         *
         * Description:
         *
         * Clears the screen.
         * This is usually called automatically
         * unless you deactivate automatic screen clearing with <gamvas.State.autoClear>
         */
        clearScreen: function() {
            this.c.fillStyle = this.clearColor;
            this.c.fillRect(0, 0, this.dimension.w, this.dimension.h);
        },

        /*
         * Function: preDraw
         *
         * Description:
         *
         * This function is called before camera is applied.
         * Overwrite it to
         * draw things after screen clear and before zoom/rotation/move of camera
         * is applied.
         *
         * Parameters:
         *
         * t - the time elapsed since the last frame
         *
         */
        preDraw: function(t) {
        },

        /*
         * Function: draw
         *
         * Description:
         *
         * Overwrite this function to draw your game objects.
         * All objects drawn in the draw function are drawn under camera
         * influence, means the are drawn moved, scaled and rotated on the
         * screen, depending on how the settings of this.camera are.
         *
         * Parameters:
         *
         * t - the time elapsed since the last frame
         *
         * Example:
         *
         * Draw a actor moving 20 pixels per second along the x axis
         *
         * > myState = gamvas.State.extend({
         * >     draw: function(t) {
         * >         this.myActor.draw(t);
         * >         this.myActor.move(20*t, 0);
         * >     }
         * > });
         */
        draw: function(t) {
        },

        /*
         * Function: postDraw
         *
         * Description:
         *
         * This function is called after camera is applied.
         * Overwrite it to
         * draw things that are not under camera influence, like score or HUD elements.
         *
         * Parameters:
         *
         * t - the time elapsed since the last frame
         *
         * Example:
         *
         * > myState = gamvas.State.extend({
         * >     postDraw: function(t) {
         * >         this.c.fillText("Score: "+this.score, 10, 470);
         * >     }
         * > });
         */
        postDraw: function(t) {
        },

        /*
         * Function: loading
         *
         * Description:
         *
         * Overwrite for a custom loading screen
         *
         * Parameters:
         *
         * t - the time elapsed since the last frame
         *
         * See:
         *
         * <gamvas.Resource.status>
         *
         * Example:
         *
         * > myState = gamvas.State.extend({
         * >    loading: function(t) {
         * >       this.c.fillText("Loading: "+(100*this.resource.status())+"%", 10, 10);
         * >    }
         * > });
         */
        loading: function(t) {
            var d = gamvas.getCanvasDimension();
            var tp = (d.h/2)-5;
            var w = parseInt(d.w*0.7, 10);
            var off = parseInt((d.w-w)/2, 10);
            this.c.lineWidth = 2;
            this.c.fillStyle = '#ffffff';
            this.c.strokeStyle = '#ffffff';
            this.c.strokeRect(off+2, tp, w, 10);
            this.c.fillRect(off+4, tp+2, (w-2)*this.resource.status(), 6);
        },

        /*
         * Function: onKeyDown
         *
         * Description:
         *
         * A key on the keyboard was pressed
         *
         * Parameters:
         *
         * keyCode - The keycode of the key (e.g. gamvas.key.RETURN)
         * character - The actual character (e.g. 'a')
         * ev - The JavaScript event object
         *
         * Returns:
         *
         * true or false, depending if it handled the event or not
         *
         * See:
         *
         * <gamvas.key.exitEvent>
         * <gamvas.State.onKeyUp>
         *
         * Example:
         *
         * > myState = gamvas.State.extend({
         * >     onKeyDown: function(keyCode) {
         * >         if (keyCode == gamvas.key.SPACE) {
         * >             this.firePlayerGun();
         * >         }
         * >         return gamvas.key.exitEvent();
         * >     }
         * > });
         */
        onKeyDown: function(keyCode, character, ev) {
		return gamvas.key.exitEvent();
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
         * Returns:
         *
         * true or false, depending if it handled the event or not
         *
         * See:
         *
         * <gamvas.key.exitEvent>
         * <gamvas.State.onKeyDown>
         */
        onKeyUp: function(keyCode, character, ev) {
		return gamvas.key.exitEvent();
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
         * Returns:
         *
         * true or false, depending if it handled the event or not
         *
         * See:
         *
         * <gamvas.mouse.exitEvent>
         * <gamvas.mouse>
         */
        onMouseDown: function(button, x, y, ev) {
            return gamvas.mouse.exitEvent();
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
         * Returns:
         *
         * true or false, depending if it handled the event or not
         *
         * See:
         *
         * <gamvas.mouse.exitEvent>
         * <gamvas.mouse>
         */
        onMouseUp: function(button, x, y, ev) {
            return gamvas.mouse.exitEvent();
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
         * Returns:
         *
         * true or false, depending if it handled the event or not
         *
         * See:
         *
         * <gamvas.mouse.exitEvent>
         *
         * Example:
         *
         * > myState = gamvas.State.extend({
         * >     onMouseMove: function(x, y) {
         * >         this.mousePointerImage.setPosition(x, y);
         * >         return gamvas.mouse.exitEvent();
         * >     }
         * > });
         */
        onMouseMove: function(x, y, ev) {
            return gamvas.mouse.exitEvent();
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
         * Function: onOrientation
         *
         * The device was tilted
         *
         * Description:
         *
         * If you lay the device flat to the ground, the default values are:
         * alpha 180, beta 0, gamma 0. The values are measured in degrees.
         *
         * Parameters:
         *
         * alpha - The rotation as if you would hold your device as a steering wheel in front of you
         * beta - The rotation if you tilt the device away from you/towards you
         * gamma - The rotation if you tilt the device to the side
         */
        onOrientation: function(alpha, beta, gamma) {
            return false;
        },

        /*
         * Function: addActor
         *
         * Description:
         *
         * Add a <gamvas.Actor> to the state.
         * Actors added to a state are drawn automatically.
         *
         * Parameters:
         *
         * act - a <gamvas.Actor> object
         *
         * Example:
         *
         * > myState = gamvas.State.extend({
         * >     init: function() {
         * >         this.myActor = new gamvas.Actor('myactor', 10, 20);
         * >         this.addActor(this.myActor);
         * >     },
         * >     draw: function(t) {
         * >         // i dont need to draw this.myActor, it draws automatically
         * >     }
         * > });
         */
        addActor: function(act) {
            this.actors[act.name] = act;
        },

        /*
         * Function: removeActor
         *
         * Description:
         *
         * Removes a <gamvas.Actor> from the state.
         * 
         * To prevent issues with physics engine or user input, this adds the
         * actor to a remove queue which is processed after all physics calculation
         * and drawing operations of the current state. For immediate removal,
         * see <cleanUp> .
         *
         * Parameters:
         *
         * act - a <gamvas.Actor> object or a string with the actor name
         *
         * See:
         *
         * <gamvas.State.cleanUp>
         */
        removeActor: function(act) {
            this._removeQueue.push(act);
        },

        /*
         * Function: registerInputEvents
         *
         * Description:
         *
         * Send keyboard/mouse events to <gamvas.Actor> onKeyDown and similar functions
         *
         * Parameters:
         *
         * act - a <gamvas.Actor> object
         *
         * Example:
         *
         * > // default a actor state for the logic
         * > myActorState = gamvas.ActorState.extend({
         * >     onKeyDown: function(keyCode) {
         * >         if (keyCode = gamvas.key.SPACE) {
         * >             this.fireGun()
         * >         }
         * >     },
         * >     fireGun: function() {
         * >         console.log(this.actor.name + ' shoots');
         * >     }
         * > });
         * >
         * > // define a actor
         * > myActor = gamvas.Actor.extend({
         * >     create: function(name, x, y) {
         * >         this._super(name, x, y);
         * >         this.addState(new myActorState('standard'));
         * >         this.setState('standard');
         * >     },
         * > });
         * >
         * > // now in our game state, create the actor and
         * > // register it for receiving input events
         * > myState = gamvas.State.extend({
         * >     init: function() {
         * >         this.player = new myActor('player');
         * >         this.registerInputEvents(this.player);
         * >     }
         * > });
         */
        registerInputEvents: function(act) {
            this.eventActors[act.name] = act;
        },

        /*
         * Function: addSound
         *
         * Description:
         *
         * Add a <gamvas.Sound> to the state.
         *
         * Parameters:
         *
         * snd - either a url to the sound file, or a <gamvas.Sound> object
         *
         * Returns:
         *
         * A <gamvas.Sound> object
         *
         * Example:
         *
         * > myState = gamvas.State.extend({
         * >     init: function() {
         * >         this.shotSound = this.addSound("shotsound.wav");
         * >     },
         * >     myState.onKeyDown = function(keyCode, character) {
         * >         if (keyCode == gamvas.key.SPACE) {
         * >             this.shotSound.play();
         * >         }
         * >     }
         * > });
         */
        addSound: function(snd) {
            var s = null;
            if (typeof snd == 'string') {
                s=new gamvas.Sound(this.resource.getSound(snd));
            } else {
                s=snd;
            }
            this._afiles[s.url] = s;
            return s;
        },

        update: function(t) {
            var ts = gamvas.timer.getGlobalTimeScale();
            for (var i in this._afiles) {
                this._afiles[i].setRate(ts);
            }
        },

        /*
         * Function: getActors
         *
         * Description:
         *
         * returns all the actors added with <gamvas.State.addActor> as array, sorted by their <gamvas.Actor.layer>
         *
         * Note:
         *
         * sorting is expensive, try to avoid this function by processing
         * <gamvas.State.actors> directly or cache the result
         */
        getActors: function() {
            var sorted = [];
            for (var i in this.actors) {
                sorted.push(this.actors[i]);
            }
            sorted.sort(gamvas._layerSort);
            return sorted;
        },

        /*
         * Function: cleanUp
         *
         * Description:
         *
         * Internal function that is called on the end of the state processing
         * to remove all actors added to the remove queue via <gamvas.State.removeActor>.
         *
         * Note:
         *
         * This function is called automatically. It prevents overlapping with physics
         * and event processing. There is one special occasion where you may need to
         * call this function manually, as reported by forum user Bart113: If you replace
         * a actor, you would call <gamvas.State.removeActor> followed by
         * <gamvas.State.cleanUp> followed by <gamvas.State.addActor>. Only removing
         * an actor without adding one with the same name may lead to a crash.
         */
        cleanUp: function() {
            if (this._removeQueue.length < 1) {
                return;
            }

            var world = gamvas.physics.getWorld();
            var removeNames = [];
            for (var i in this._removeQueue) {
                var toremove = null;
                if (typeof this._removeQueue[i] == 'string') {
                    toremove = this._removeQueue[i];
                } else {
                    toremove = this._removeQueue[i].name;
                }
                removeNames.push(toremove);
            }
            var newActors = [];
            var deleteObj = [];
            for (var i in this.actors) {
                if (removeNames.indexOf(i) != -1) {
                    if (this.actors[i].usePhysics) {
                        world.DestroyBody(this.actors[i].body);
                        this.actors[i].body = null;
                    }
                    deleteObj.push(this.actors[i]);
                } else {
                    newActors[i] = this.actors[i];
                }
            }
            this.actors = newActors;

            var newEventActors = [];
            for (var i in this.eventActors) {
                if (removeNames.indexOf(i) != -1) {
                    if ( (this.eventActors[i].usePhysics) && (this.eventActors[i].body !== null) ) {
                        world.DestroyBody(this.eventActors[i].body);
                    }
                    if (deleteObj.indexOf(this.eventActors[i]) < 0) {
                        delete(this.eventActors[i]);
                    }
                } else {
                    newEventActors[i] = this.eventActors[i];
                }
            }
            this.eventActors = newEventActors;

            for (var i in deleteObj) {
                delete deleteObj[i];
            }
            this._removeQueue = [];
        }
});
