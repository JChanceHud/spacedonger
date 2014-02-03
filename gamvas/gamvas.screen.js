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
 * Class: gamvas.screen
 *
 * Functions with info about the screen
 */
gamvas.screen = {
    /*
     * Variable: frameLimit
     *
     * Description:
     *
     * Sets the maximum of rendertime in seconds until a frame is skipped. To prevent hickups
     * on performance bottlenecks. So if you want to ensure a minimur of 30 frames per second
     * you would set it to 1/30 = 0.033, but it is not recommended to set this value to
     * low or your game will not work on slower systems.
     *
     * Default:
     *
     * 0.1
     */
    frameLimit: 0.1,
    _pause: false,
    _redrawHandlers: [],
    _lastFrameTime: -1,
    _lastFrameLength: 0,
    _lastFPSCheck: 0,
    _lastFPS: 0,
    _fpsCounter: 0,

    redraw: function() {
        window.requestAnimationFrame(gamvas.screen.redraw);
        if (gamvas.screen._pause) {
            return;
        }
        var ms = gamvas.timer.getMilliseconds();
        if (gamvas.screen._lastFPSCheck < ms) {
            gamvas.screen._lastFPS = gamvas.screen._fpsCounter+1;
            gamvas.screen._fpsCounter = 0;
            gamvas.screen._lastFPSCheck = ms+1000;
        } else {
            gamvas.screen._fpsCounter++;
        }

        var frameSecs = 0;
        if (gamvas.screen._lastFrameTime>-1) {
            var lt = gamvas.screen._lastFrameTime;
            gamvas.screen._lastFrameTime = ms/1000;
            gamvas.screen._lastFrameLength = gamvas.screen._lastFrameTime-lt;
            if (gamvas.screen._lastFrameLength > gamvas.screen.frameLimit) {
                gamvas.screen._lastFrameLength = gamvas.screen.frameLimit;
            }
        } else {
            gamvas.screen._lastFrameTime = 0;
        }
        // draw states
        gamvas.state.update(gamvas.screen._lastFrameLength);

        // draw handlers, if available
        for (var i in gamvas.screen._redrawHandlers) {
            (gamvas.screen._redrawHandlers[i])(gamvas.screen._lastFrameLength);
        }
    },

    /*
     * Function: getLastFrameLength
     *
     * Description:
     *
     * Returns the time elapsed since the last call to render a frame.
     */
    getLastFrameLength: function() {
        return gamvas.screen._lastFrameLength;
    },

    /*
     * Function: getFPS
     *
     * Description:
     *
     * Returns the current frames per second. Browsers try to run
     * your game at 60 FPS. If your game runs significantly slower
     * you should try to enhance the performance.
     *
     * Example:
     *
     * > console.log(gamvas.screen.getFPS());
     */
    getFPS: function() {
        return gamvas.screen._lastFPS;
    },

    setRedrawHandler: function(fnc) {
        gamvas.screen._redrawHandlers['_default'] = fnc;
    },

    unsetRedrawHandler: function() {
        delete gamvas.screen._redrawHandlers['_default'];
    },

    addRedrawHandler: function(id, fnc) {
        gamvas.screen._redrawHandlers[id] = fnc;
    },

    removeRedrawHandler: function(id) {
        delete gamvas.screen._redrawHandlers[id];
    },

    pause: function() {
        gamvas.screen._pause = true;
    },

    resume: function() {
        var ms = gamvas.timer.getMilliseconds();
        gamvas.screen._lastFrameTime = (ms/1000)-gamvas.screen.frameLimit;
        gamvas.screen._lastFrameLength = gamvas.screen.frameLimit;
        gamvas.screen._pause = false;
    }
};

window.onblur = gamvas.screen.pause;
window.onfocus = gamvas.screen.resume;
