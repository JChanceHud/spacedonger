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
 * Class: gamvas.mouse
 *
 * Description:
 *
 * Information and functions for the mouse.
 *
 * PLEASE NOTE:
 *
 * There are browsers that are not able to handle
 * middle and right mouse buttons without problems.
 *
 * Middle and rigth mouse button is successfully tested on current versions of:
 *
 * * Chrome
 * * Firefox
 * * xxxterm
 */
gamvas.mouse = {
    /*
     * Variable: LEFT
     *
     * Description:
     *
     * Defines the left mouse button
     */
    LEFT: 0,

    /*
     * Variable: MIDDLE
     *
     * Description:
     *
     * Defines the middle mouse button
     */
    MIDDLE: 1,

    /*
     * Variable: RIGHT
     *
     * Description:
     *
     * Defines the right mouse button
     */
    RIGHT: 2,

    _pressedMap: [],
    _mouseX: 0,
    _mouseY: 0,

    /*
     * Function: isPressed
     *
     * Description:
     *
     * Check if a mouse button is pressed
     *
     * Returns:
     *
     * true/false
     *
     * Example:
     *
     * > if (gamvas.mouse.isPressed(gamvas.mouse.LEFT)) {
     * >     alert('you have found your left mouse button');
     * > }
     */
    isPressed: function(k) {
        if (!gamvas.isSet(gamvas.key._pressedMap[k])) {
            return false;
        }
        return gamvas.key._pressedMap[k];
    },

    setPosition: function(x, y) {
        gamvas.mouse._mouseX = x;
        gamvas.mouse._mouseY = y;
    },

    /*
     * Function: getX
     *
     * Description:
     *
     * Returns the x position of the mouse over the canvas.
     */
    getX: function(ev) {
        if (ev) {
            gamvas.mouse.setPosition(ev.pageX, ev.pageY);
        }
        var cp = gamvas.getCanvasPosition();
        return gamvas.mouse._mouseX-cp.x;
    },

    /*
     * Function: getY
     *
     * Description:
     *
     * Returns the y position of the mouse over the canvas.
     */
    getY: function(ev) {
        if (ev) {
            gamvas.mouse.setPosition(ev.pageX, ev.pageY);
        }
        var cp = gamvas.getCanvasPosition();
        return gamvas.mouse._mouseY-cp.y;
    },

    /*
     * Function: getPosition
     *
     * Description:
     *
     * Returns the position of the mouse as gamvas.Vector2D
     *
     * Note:
     *
     * The position is relative to the canvas, so 0/0 is the upper left
     * corner and canvaswidth/canvasheight is the lower right corner.
     *
     * To convert the canvas mouse position the the current states world
     * use <gamvas.camera.toWorld> from this.camera of the current state
     *
     * Returns:
     *
     * <gamvas.Vector2D>
     */
    getPosition: function(ev) {
        if (ev) {
            gamvas.mouse.setPosition(ev.pageX, ev.pageY);
        }

        var cp = gamvas.getCanvasPosition();
        return new gamvas.Vector2D(gamvas.mouse._mouseX-cp.x, gamvas.mouse._mouseY-cp.y);
    },

    setPressed: function(k, v) {
        gamvas.key._pressedMap[k] = v;
    },

    /*
     * Function: exitEvent
     *
     * Description:
     *
     * return from a unhandled mouseevent on onMouse* functions
     *
     * See:
     *
     * <gamvas.State.onMouseDown>
     * <gamvas.State.onMouseUp>
     * <gamvas.State.onMouseMove>
     *
     */
    exitEvent: function() {
	    if (gamvas.config.preventMouseEvents) {
		    return false;
	    }
	    return true;
    }
};
