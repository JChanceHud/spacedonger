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
 * Class: gamvas.event
 *
 * Functions for event handling
 */
gamvas.event = {
    _onLoadFunctions: [],
    _onLoadRan: false,
    _onReadyFunctions: [],
    _onReadyRan: false,

    /*
     * Function: addOnLoad
     *
     * Description:
     *
     * Add a function to be called when the HTML document is loaded
     *
     * Example:
     *
     * This function is usually used for initializing gamvas like following:
     *
     * > gamvas.event.addOnLoad(function() {
     * >    gamvas.state.addState(myState);
     * >    gamvas.start('myCanvas', true);
     * > }
     */
    addOnLoad: function(fnc) {
        if (!gamvas.event._onLoadRan) {
            gamvas.event._onLoadFunctions.push(fnc);
        } else {
            fnc();
        }
    },

    /*
     * Function: addOnReady
     *
     * Description:
     *
     * Add a function to be called when gamvas is ready and right before
     * rendering the first frame.
     *
     * Example:
     *
     * > gamvas.event.addOnReady(function() {
     * >     alert('Everything is up, we're ready to roll!');
     * > }
     */
    addOnReady: function(fnc) {
        if (!gamvas.event._onReadyRan) {
            gamvas.event._onReadyFunctions.push(fnc);
        } else {
            fnc();
        }
    },

    onLoad: function() {
        gamvas.event._onLoadRan = true;
        for (var i in gamvas.event._onLoadFunctions) {
            gamvas.event._onLoadFunctions[i]();
        }
    },

    onReady: function() {
        gamvas.event._onReadyRan = true;
        for (var i in gamvas.event._onReadyFunctions) {
            gamvas.event._onReadyFunctions[i]();
        }
    },

    /*
     * Function: stopBubble
     *
     * Parameters:
     *
     * e - The event object
     *
     * Description:
     *
     * Do not transfer events to underlying elements (aka bubbling)
     *
     * Example:
     *
     * > gamvas.event.addOnReady(function() {
     * >     alert('Everything is up, we're ready to roll!');
     * > }
     */
    stopBubble: function(e) {
        var ev = (typeof e == 'undefined') ? window.event : e;
        if (ev.stopPropagation) {
            ev.stopPropagation();
        }
        if (ev.preventDefault) {
            ev.preventDefault();
        }
        if (ev.cancelBubble !== null) {
            ev.cancelBubble = true;
        }
        if (ev.returnValue) {
            ev.returnValue = false;
        }
    }
};

window.onload = gamvas.event.onLoad;
