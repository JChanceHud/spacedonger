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
 * Class: gamvas.state
 *
 * Helper functions for state management
 */
gamvas.state = {
    _states: [],
    _currentState: null,
    _firstState: true,

    /*
     * Function: addState
     *
     * Description:
     *
     * Add a state to the state system
     *
     * Parameters:
     *
     * state - a <gamvas.State> object
     *
     * Example:
     *
     * > var myState = gamvas.State.extend({
     * >     init: {
     * >         console.log('state '+this.name+' initialized');
     * >     }
     * > });
     * > gamvas.state.addState(new myState('mystate'));
     */
    addState: function(state) {
        gamvas.state._states[state.name] = state;
        if ( (gamvas._usePhys) && (state.world === null) ) {
            var oldState = gamvas.state._currentState;
            gamvas.state._currentState = state.name;
            gamvas.physics.resetWorld(0, 9.8, gamvas._doSleep);
            gamvas.state._currentState = oldState;
        }
        if (gamvas.state._currentState === null) {
            gamvas.state._currentState = state.name;
        }
    },

    /*
     * Function: setState
     *
     * Description:
     *
     * switch to a new state
     *
     * Parameters:
     *
     * stateName - the name of the state to switch to
     */
    setState: function(stateName) {
        if (gamvas.isSet(gamvas.state._states[stateName])) {
            if ( (!gamvas.state._firstState) && (gamvas.state._currentState !== null) ) {
                var cur = gamvas.state.getCurrentState();
                if (cur) {
                    cur.leave();
                }
            } else {
		    gamvas.state._firstState = false;
	    }

            var st = gamvas.state._states[stateName];
            gamvas.state._currentState = stateName;
            if (!st._isInitialized) {
                st.init();
                st._isInitialized = true;
            }
            st.enter();
        }
    },

    /*
     * Function: getState
     *
     * Get a certain state
     *
     * Parameters:
     *
     * name - Name of the state to get
     *
     * Returns:
     *
     * The <gamvas.State> or false if state is not existing
     *
     * Example:
     *
     * > var mainState = gamvas.state.getState('main');
     * > if (mainState) {
     * >    console.log("found state main");
     * > }
     */
    getState: function(name) {
        if (typeof gamvas.state._states[name] != 'undefined') {
            return gamvas.state._states[name];
        }
        return false;
    },

    /*
     * Function: getCurrentState
     *
     * Description:
     *
     * Get the current state
     *
     * Example:
     *
     * > var cs = gamvas.state.getCurrentState();
     * > console.log("current state is: " + cs.name);
     */
    getCurrentState: function() {
        if (gamvas.state._currentState !== null) {
            var cur = gamvas.state._states[gamvas.state._currentState];
            return cur;
        }
        return false;
    },

    update: function(t) {
        var cur = gamvas.state.getCurrentState();
        if (cur) {
            cur.resource.cache = false;
            var ready = cur.resource.done();
            var world = null;
            if ( (gamvas._usePhys) && (ready) ) {
                world = gamvas.physics.getWorld();
                if (world !== null) {
                    world.Step(t, gamvas.physics.velocityIterations, gamvas.physics.positionIterations);
                    var allBd = world.GetBodyList();
                    var i = null;
                    var b = null;
                    var a = null;
                    for (i = world.m_bodyList; i; i = i.m_next) {
                        a = i.GetUserData();
                        if (a !== null) {
                            if (a.type == 'actor') {
                                a.data.updatePhysics();
                            }
                        }
                    }
                }
            }

            var allActors = cur.getActors();
            if (ready) {
                cur.update(t);
            }

            if (cur.autoClear) {
                cur.clearScreen();
            }
            if (ready) {
                for (var n = 0; n < allActors.length; n++) {
                    if (allActors[n].isActive()) {
                        allActors[n].preDraw(t);
                    }
                }
                cur.preDraw(t);
            }
            var useCam = !cur.disableCamera;
            if (useCam) cur.camera.start();
            if (ready) {
                for (var n2 = 0; n2 < allActors.length; n2++) {
                    if (allActors[n2].isActive()) {
                        allActors[n2].draw(t);
                    }
                }
                cur.draw(t);
            }
            if (useCam) cur.camera.stop();
            if (ready) {
                for (var n3 = 0; n3 < allActors.length; n3++) {
                    if (allActors[n3].isActive()) {
                        allActors[n3].postDraw(t);
                    }
                }
                cur.postDraw(t);
            } else {
                cur.loading(t);
	    }
            // if ( (gamvas._usePhys) && (world) ) {
	    	// why did i call this?
                // world.ClearForces();
            // }
	    cur.cleanUp();
        }
    },

    getCharCode: function(ev) {
        var charCode = 0;
        if (typeof ev.which == 'undefined') {
            charCode = ev.keyCode;
        } else {
            charCode = ev.which;
        }
        return String.fromCharCode(charCode).toLowerCase();
    },

    onKeyDown: function(ev) {
        gamvas.key.setPressed(ev.keyCode, true);
        var cur = gamvas.state.getCurrentState();
        var charCode = gamvas.state.getCharCode(ev);
        if (cur) {
            for (var i in cur.eventActors) {
                cur.eventActors[i].onKeyDown(ev.keyCode, charCode, ev);
            }
            var ret = cur.onKeyDown(ev.keyCode, charCode, ev);
            if (!ret) {
                ev.preventDefault();
            }
            return ret;
        }
        if (!gamvas.key.exitEvent()) {
            ev.preventDefault();
        }
        return gamvas.key.exitEvent();
    },

    onKeyUp: function(ev) {
        gamvas.key.setPressed(ev.keyCode, false);
        var cur = gamvas.state.getCurrentState();
        var charCode = gamvas.state.getCharCode(ev);
        if (cur) {
            for (var i in cur.eventActors) {
                cur.eventActors[i].onKeyUp(ev.keyCode, charCode, ev);
            }
            var ret = cur.onKeyUp(ev.keyCode, charCode, ev);
            if (!ret) {
                ev.preventDefault();
            }
            return ret;
        }
        if (!gamvas.key.exitEvent()) {
            ev.preventDefault();
        }
        return gamvas.key.exitEvent();
    },

    onMouseDown: function(ev) {
        gamvas.mouse.setPressed(ev.button, true);
        var cur = gamvas.state.getCurrentState();
        var dim = gamvas.getCanvasDimension();
        var isFS = gamvas.isFullScreen();
        if (cur) {
            var pos = gamvas.mouse.getPosition();
            if (isFS) {
                pos.x = pos.x/screen.width*dim.w;
                pos.y = pos.y/screen.height*dim.h;
            }
            for (var i in cur.eventActors) {
                cur.eventActors[i].onMouseDown(ev.button, pos.x, pos.y, ev);
            }
            var res = cur.onMouseDown(ev.button, pos.x, pos.y, ev);
            ev.returnValue = res;
            if (!res) {
                ev.preventDefault();
            }
            return res;
        }
        var ret = gamvas.mouse.exitEvent();
        ev.returnValue=ret;
        if (!ret) {
            ev.preventDefault();
        }
        return ret;
    },

    onMouseUp: function(ev) {
        gamvas.mouse.setPressed(ev.button, false);
        var cur = gamvas.state.getCurrentState();
        var dim = gamvas.getCanvasDimension();
        var isFS = gamvas.isFullScreen();
        if (cur) {
            var pos = gamvas.mouse.getPosition();
            if (isFS) {
                pos.x = pos.x/screen.width*dim.w;
                pos.y = pos.y/screen.height*dim.h;
            }
            for (var i in cur.eventActors) {
                cur.eventActors[i].onMouseUp(ev.button, pos.x, pos.y, ev);
            }
            var res = cur.onMouseUp(ev.button, pos.x, pos.y, ev);
            ev.returnValue= res;
            if (!res) {
                ev.preventDefault();
            }
            return res;
        }
        var ret = gamvas.mouse.exitEvent();
        ev.returnValue=ret;
        if (!ret) {
            ev.preventDefault();
        }
        return ret;
    },

    onMouseMove: function(ev) {
        gamvas.mouse.setPosition(ev.pageX, ev.pageY);
        var cur = gamvas.state.getCurrentState();
        var dim = gamvas.getCanvasDimension();
        var isFS = gamvas.isFullScreen();
        if (cur) {
            var pos = gamvas.mouse.getPosition();
            if (isFS) {
                pos.x = pos.x/screen.width*dim.w;
                pos.y = pos.y/screen.height*dim.h;
            }
            for (var i in cur.eventActors) {
                cur.eventActors[i].onMouseMove(pos.x, pos.y, ev);
            }
            var res = cur.onMouseMove(pos.x, pos.y, ev);
            ev.returnValue=res;
            if (!res) {
                ev.preventDefault();
            }
            return res;
        }
        var ret = gamvas.mouse.exitEvent();
        ev.returnValue=ret;
        if (!ret) {
            ev.preventDefault();
        }
        return ret;
    },

    _maxTouches: 11,
    _touchMap: [false, false, false, false, false, false, false, false, false, false, false],

    _getTouchNum: function(id) {
        for (var i = 0; i < gamvas.state._maxTouches; i++) {
            if (gamvas.state._touchMap[i] === id) {
                return i;
            }
        }
        for (var i = 0; i < gamvas.state._maxTouches; i++) {
            if (gamvas.state._touchMap[i] === false) {
                gamvas.state._touchMap[i] = id;
                return i;
            }
        }
        return 0;
    },

    _removeTouch: function(id) {
        for (var i = 0; i < gamvas.state._maxTouches; i++) {
            if (gamvas.state._touchMap[i] == id) {
                gamvas.state._touchMap[i] = false;
                return;
            }
        }
    },

    onTouchDown: function(ev) {
        gamvas.event.stopBubble(ev);
        var cur = gamvas.state.getCurrentState();
        var dim = gamvas.getCanvasDimension();
        var isFS = gamvas.isFullScreen();
        if (cur) {
            var cpos = gamvas.getCanvasPosition();
            for (var n = 0; n < ev.changedTouches.length; n++) {
                var id = gamvas.state._getTouchNum(ev.changedTouches[n].identifier);
                var posx = ev.changedTouches[n].pageX-cpos.x;
                var posy = ev.changedTouches[n].pageY-cpos.y;
                if (isFS) {
                    posx = posx/screen.width*dim.w;
                    posy = posy/screen.height*dim.h;
                }
                for (var i in cur.eventActors) {
                    cur.eventActors[i].onTouchDown(id, posx, posy, ev);
                }
                cur.onTouchDown(id, posx, posy, ev);
            }
        }
        return false;
    },

    onTouchUp: function(ev) {
        gamvas.event.stopBubble(ev);
        var cur = gamvas.state.getCurrentState();
        var dim = gamvas.getCanvasDimension();
        var isFS = gamvas.isFullScreen();
        if (cur) {
            var cpos = gamvas.getCanvasPosition();
            for (var n = 0; n < ev.changedTouches.length; n++) {
                var ident = ev.changedTouches[n].identifier;
                var id = gamvas.state._getTouchNum(ident);
                var posx = ev.changedTouches[n].pageX-cpos.x;
                var posy = ev.changedTouches[n].pageY-cpos.y;
                if (isFS) {
                    posx = posx/screen.width*dim.w;
                    posy = posy/screen.height*dim.h;
                }
                for (var i in cur.eventActors) {
                    cur.eventActors[i].onTouchUp(id, posx, posy, ev);
                }
                cur.onTouchUp(id, posx, posy, ev);
                gamvas.state._removeTouch(ident);
            }
        }
        return false;
    },

    onTouchMove: function(ev) {
        gamvas.event.stopBubble(ev);
        var cur = gamvas.state.getCurrentState();
        var dim = gamvas.getCanvasDimension();
        var isFS = gamvas.isFullScreen();
        if (cur) {
            var cpos = gamvas.getCanvasPosition();
            for (var n = 0; n < ev.changedTouches.length; n++) {
                var id = gamvas.state._getTouchNum(ev.changedTouches[n].identifier);
                var posx = ev.changedTouches[n].pageX-cpos.x;
                var posy = ev.changedTouches[n].pageY-cpos.y;
                if (isFS) {
                    posx = posx/screen.width*dim.w;
                    posy = posy/screen.height*dim.h;
                }
                for (var i in cur.eventActors) {
                    cur.eventActors[i].onTouchMove(id, posx, posy, ev);
                }
                cur.onTouchMove(id, posx, posy, ev);
            }
        }
        return false;
    },

    onOrientation: function(ev) {
        gamvas.event.stopBubble(ev);
        var cur = gamvas.state.getCurrentState();
        cur.onOrientation(ev.alpha, ev.beta, ev.gamma);
        return false;
    },


    setup: function() {
        var canv = gamvas.getCanvas();
        canv.addEventListener('mousedown', gamvas.state.onMouseDown, false);
        canv.addEventListener('mouseup', gamvas.state.onMouseUp, false);
        canv.addEventListener('mousemove', gamvas.state.onMouseMove, false);
        if (gamvas.hasMultiTouch()) {
            canv.addEventListener("touchstart", gamvas.state.onTouchDown, false);
            canv.addEventListener("touchmove", gamvas.state.onTouchMove, false);
            canv.addEventListener("touchend", gamvas.state.onTouchUp, false);
            canv.addEventListener("touchcancel", gamvas.state.onTouchUp, false);
        }
        if (gamvas.hasOrientation()) {
            window.addEventListener("deviceorientation", gamvas.state.onOrientation, false);
        }
        if (gamvas.state._currentState !== null) {
            var n = 0;
            for (var i in gamvas.state._states) {
                gamvas.state._states[i]._setup();
                if (n === 0) {
                    gamvas.state.setState(i);
                }
                n++;
            }
        }
    }
};

document.addEventListener('keydown', gamvas.state.onKeyDown, false);
document.addEventListener('keyup', gamvas.state.onKeyUp, false);
