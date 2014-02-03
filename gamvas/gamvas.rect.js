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
 * Class: gamvas.Rect
 *
 * Holds position and width information of a rectangle
 *
 * Constructor:
 *
 * new gamvas.Rect(x, y, w, h);
 *
 * Parameters:
 *
 * x/y - top left upper corner of the rectangle (optional)
 * w/h - the width and height of the rectangle (optional)
 */
gamvas.Rect = function(x, y, w, h) {
    /*
     * Variable: x
     *
     * The x position of the upper left corner of the rectangle
     */
    this.x = (x) ? x : 0;

    /*
     * Variable: y
     *
     * The y position of the upper left corner of the rectangle
     */
    this.y = (y) ? y : 0;

    /*
     * Variable: width
     *
     * The width of the rectangle
     */
    this.width = (w) ? w : 0;

    /*
     * Variable: height
     *
     * The height of the rectangle
     */
    this.height = (h) ? h : 0;
};
