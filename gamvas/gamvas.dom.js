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
 * Class: gamvas.dom
 *
 * A collection of static DOM helper and utility functions
 */
gamvas.dom = {
    /*
     * Function: getPosition
     * 
     * Gets the position of a DOM element
     *
     * Parameters:
     *    el - The DOM element
     *
     * Returns:
     *    <gamvas.Vector2D>
     *
     * Example:
     * > var el = document.getElementById('myelement');
     * > var pos = gamvas.dom.getPosition(el);
     * > alert('myelement is at position '+pos.x+','+pos.y);
     */
    getPosition: function(el) {
        var pos = [0, 0];
        gamvas.dom.getPositionRec(el, pos);
        return new gamvas.Vector2D(pos[0], pos[1]);
    },

    getPositionRec: function(el, pos) {
        pos[0] += el.offsetLeft;
        pos[1] += el.offsetTop;
        if (el.offsetParent) {
            gamvas.dom.getPosition(el.offsetParent, pos);
        }
    }
};
