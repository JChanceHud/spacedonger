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
 * Class: gamvas
 *
 * Description:
 *
 * Basic functions for handling the gamvas environment: http://gamvas.com
 *
 * Gamvas is a HTML5 game development framework/engine that simplifies the task
 * of developing games. It keeps the developer away from the boring tasks and
 * allows you to concentrate on the gameplay instead of spending weeks coding
 * just to get you a useful base framework for your game.
 *
 * The framework uses upper case words for classes, lowercase words for static
 * functions. For example, see <gamvas.State> vs <gamvas.state>
 *
 * While the use of static functions won't win Gamvas a award in object
 * oriented software design, it will in certain situations improve performance
 * and reduce necessary amount of source code and therfor further speed up
 * your development process.
 *
 * At the moment Gamvas is more like a framework for developing games with the
 * HTML5 canvas element and you'll need quite a bit of JavaScript knowledge to use it, although
 * i hope that the documentation and examples make it even possible for JavaScript
 * beginners to get their dream game to life.
 *
 * Gamvas is planned to evolve into a full game engine though with native graphical editors
 * on Linux, Mac OSX and Windows. I want to make this system as useful as it can get
 * for the developers, so future features depend on the requirements. Feel free
 * to contact me with feature requests at hi@93-interactive.com
 *
 */
gamvas = {
    _layerSort: null,
    _canvas: null,
    _context2D: null,
    _world: null,
    _usePhys: false,
    _doSleep: true,
    _isFullScreen: false,
    _hasMultiTouch: (typeof document.createTouch != 'undefined'),
    _hasOrientation: (typeof window.DeviceOrientationEvent != 'undefined'),
    /*
     * Variable: baseURL
     *
     * The place there the gamvas scripts live
     * Will be filled on startup
     */
    baseURL: '',

    /*
     * Function: start
     *
     * Description:
     *
     * Starts the gamvas system
     *
     * Parameters:
     *
     * canvasID - The id of the canvas element to start gamvas on
     * usePhysics - Use physics (requires box2dweb JavaScript)
     * doSleep - If using physics, allow objects to 'fall asleep' when not active anymore
     *
     * Example:
     *
     * A typical gamvas start, add a onload handler that adds your main game state and starts
     * gamvas on the canvas with id "myCanvas" and enables physics support
     *
     * > gamvas.event.addOnLoad(function() {
     * >    gamvas.state.addState(myState);
     * >    gamvas.start('myCanvas', true);
     * > });
     */
    start: function(canvasid, usePhysics, doSleep) {
        if ( (gamvas.isSet(usePhysics)) && (usePhysics) ) {
            gamvas._usePhys = usePhysics;
            var slp = doSleep;
            if (!gamvas.isSet(doSleep)) {
                slp = true;
            }
            gamvas._doSleep = slp;
            gamvas.physics.resetWorld(0, 9.8, slp);
        }

        gamvas._canvas = document.getElementById(canvasid);
        if (!gamvas.isSet(gamvas._canvas)) {
            console.log('canvas #'+canvasid+' not found, aboring gamvas');
            return;
        }

        gamvas._canvas.oncontextmenu=function() {return false;};
        gamvas._context2D = gamvas._canvas.getContext("2d");

	if (gamvas.config.reverseLayerOrder) {
        gamvas._layerSort = function(a,b) {return (b.layer - a.layer);};
	} else {
        gamvas._layerSort = function(a,b) {return (a.layer - b.layer);};
	}

        window.requestAnimationFrame = (function(cb) {
            return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(cb){
                window.setTimeout(cb, 1000 / 60);
            };
        })();

        gamvas.state.setup();
        gamvas.event.onReady();

        window.requestAnimationFrame(gamvas.screen.redraw);
    },

    /*
     * Function: getCanvasPosition
     *
     * Description:
     *
     * Get the position in DOM of the current canvas
     *
     * Returns:
     *
     * <gamvas.Vector2D>
     *
     * See:
     *
     * <gamvas.dom.getPosition>
     */
    getCanvasPosition: function() {
        return gamvas.dom.getPosition(gamvas._canvas);
    },

    /*
     * Function: getCanvasDimension
     *
     * Description:
     *
     * Get the width and height of the canvas
     *
     * Returns:
     *
     * Object {w, h} with with and height of the canvas
     *
     * Example:
     *
     * > var d = gamvas.getCanvasDimension();
     * > alert('canvas has a width of '+d.w+' pixels');
     */
    getCanvasDimension: function() {
        return {
            w: gamvas._canvas.width,
            h: gamvas._canvas.height
        };
    },

    /*
     * Function: getCanvas
     *
     * Description:
     *
     * Get the canvas element
     *
     * Returns:
     *
     * Canvas DOM element
     */
    getCanvas: function() {
        return gamvas._canvas;
    },

    /*
     * Function: getContext2D
     *
     * Description:
     *
     * Get the 2D context object of the canvas
     *
     * Returns:
     *
     * The 2D context of the canvas
     *
     * See:
     *
     * http://dev.w3.org/html5/2dcontext/
     */
    getContext2D: function() {
        return gamvas._context2D;
    },

    /*
     * Function: isSet
     *
     * Description:
     *
     * Tests if a variable is set
     *
     * Parameters:
     *
     * v - the variable
     *
     * Returns:
     *
     * true or false
     *
     * Example:
     *
     * > var el = document.getElementById('myelement');
     * > if (!gamvas.isSet(el)) {
     * >     alert('myelement not found');
     * > }
     */
    isSet: function(v) {
        if ( (typeof v == 'undefined') || (v===null) ) return false;
        return true;
    },

    /*
     * Function: hasMultiTouch
     *
     * Test if device supports multi touch operations
     *
     * Returns:
     *
     * true or false
     */
    hasMultiTouch: function() {
        return gamvas._hasMultiTouch;
    },

    /*
     * Function: hasOrientation
     *
     * Test if browser does support device orientation (does not mean the device actually supports it, you should
     * always provide alternative controls for your game, if it does not support device orientation)
     *
     * Returns:
     *
     * true or false
     */
    hasOrientation: function() {
        return gamvas._hasOrientation;
    },

    /*
     * Function: hasFullScreen
     *
     * Test if real fullscreen more is supported
     *
     * Returns:
     *
     * true or false
     */
    hasFullScreen: function() {
        var canv = gamvas.getCanvas();
        if (canv) {
            if (canv.requestFullscreen) {
                return true;
            } else if (canv.mozRequestFullScreen) {
                return true;
            } else if (canv.webkitRequestFullscreen) {
                // webkit has problems
                // return true;
            }
        }
        return false;
    },

    /*
     * Function: isFullScreen
     *
     * Test if we are currently running in real fullscreen mode
     *
     * Returns:
     *
     * true or false
     */
    isFullScreen: function() {
        return gamvas._isFullScreen;
    },

    /*
     * Function: setFullScreen
     *
     * Set real fullscreen mode, if available
     *
     * Description:
     *
     * Real fullscreen mode as of early 2012 is not yet supported by
     * many browsers, you should ensure to only show fullscreen switches
     * on browsers that support it. See <gamvas.hasFullScreen>
     *
     * Parameters:
     *
     * yesno - A boolean, true to enter real full screen mode, false to leave
     */
    setFullScreen: function(yesno) {
        gamvas._isFullScreen = false;
        var canv = gamvas.getCanvas();
        if (canv) {
            if (canv.requestFullscreen) {
                gamvas._isFullScreen = yesno;
                if (yesno) {
                    canv.requestFullscreen();
                } else {
                    canv.cancelFullscreen();
                }
            } else if (canv.mozRequestFullScreen) {
                gamvas._isFullScreen = yesno;
                if (yesno) {
                    canv.mozRequestFullScreen();
                } else {
                    canv.mozCancelFullScreen();
                }
            } /* else if (canv.webkitRequestFullscreen) {
                // webkit has problems
                gamvas._isFullScreen = yesno;
                if (yesno) {
                    canv.webkitRequestFullscreen();
                } else {
                    canv.webkitCancelFullscreen();
                }
            } */
        }
    }
};

var tmpScr = document.getElementsByTagName('script');
gamvas.baseURL = tmpScr[tmpScr.length - 1].src.replace(/\\/g, '/').replace(/\/[^\/]*$/, '');

document.addEventListener('fullscreenchange', function(e) {
    var canv = gamvas.getCanvas();
    if (canv) {
        if (document.fullScreen) {
            gamvas._isFullScreen = true;
            console.log(screen.width+'x'+screen.height);
            canv.style.width=screen.width+'px';
            canv.style.height=screen.height+'px';
        } else {
            gamvas._isFullScreen = false;
            canv.style.width=canv.width+'px';
            canv.style.height=canv.height+'px';
        }
    }
}, false);
document.addEventListener('mozfullscreenchange', function(e) {
    var canv = gamvas.getCanvas();
    if (canv) {
        if (document.mozFullScreen) {
            gamvas._isFullScreen = true;
        } else {
            gamvas._isFullScreen = false;
        }
    }
}, false);
/* disabled, technical problems
document.addEventListener('webkitfullscreenchange', function(e) {
    var canv = gamvas.getCanvas();
    if (canv) {
        if (document.webkitIsFullScreen) {
            gamvas._isFullScreen = true;
            console.log(screen.width+'x'+screen.height+' '+window.innerWidth);
            canv.style.width=screen.width+'px';
            canv.style.height=screen.height+'px';
        } else {
            gamvas._isFullScreen = false;
            canv.style.width=canv.width+'px';
            canv.style.height=canv.height+'px';
        }
    }
}, false); */
