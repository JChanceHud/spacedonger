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
 * Class: gamvas.Image
 *
 * Description:
 *
 * A plain image with methods to move, rotate and zoom.
 *
 * Use this if you need performance and are sure that the image
 * is never needed as logic or physics element, otherwise
 * use <gamvas.Actor>
 *
 * Constructur:
 *
 * new gamvas.Image(file, x, y, cx, cy);
 *
 * Parameters:
 *
 * file - a JavaScript Image object (see <gamvas.Resource>)
 * x/y - the position of the image (optional)
 * cx/cy - the center of rotation of the image (optional)
 *
 * See:
 * <gamvas.Actor>
 */
gamvas.Image = function(file, x, y, cx, cy) {
    this.image = file;
    this.position = new gamvas.Vector2D((x)?x:0, (y)?y:0);
    this.center = new gamvas.Vector2D((cx)?cx:0, (cy)?cy:0);
    this.rotation = 0;
    this.scaleFactor = 1;
    this.scaleFactor2 = 1;
    this.cr = null;
    this.c = gamvas.getContext2D();

    /*
     * Function: setRotation
     *
     * Description:
     *
     * Set certain rotation of the image in radians
     *
     * Parameters:
     *
     * r - the rotation in radians
     *
     * See:
     *
     * <gamvas.Image.rotate>
     * http://en.wikipedia.org/wiki/Radians
     */
    this.setRotation = function(r) {
        this.rotation = r;
    };

    /*
     * Function: rotate
     *
     * Description:
     *
     * Rotate the image
     *
     * Parameters:
     *
     * r - the amount to rotate the image in radians
     *
     * See:
     *
     * <gamvas.Image.setRotation>
     * http://en.wikipedia.org/wiki/Radians
     */
    this.rotate = function(r) {
        this.rotation += r;
    };

    /*
     * Function: setPosition
     *
     * Description:
     *
     * Set the position of a image
     *
     * Parameters:
     *
     * x/y - the position of the image in pixels
     *
     * See:
     *
     * <gamvas.Image.move>
     */
    this.setPosition = function(x, y) {
        this.position.x = x;
        this.position.y = y;
    };

    /*
     * Function: move
     *
     * Description:
     *
     * Move the image
     *
     * Parameters:
     *
     * x/y - the pixels to move the image
     *
     * See:
     *
     * <gamvas.Image.setPosition>
     */
    this.move = function(x, y) {
        this.position.x += x;
        this.position.y += y;
    };

    /*
     * Function: setScale
     *
     * Description:
     *
     * Set a certain scale factor
     *
     * Parameters:
     *
     * s - the scale value (1 = no scale, < 1 = smaller, > 1 = bigger)
     *
     * See:
     *
     * <gamvas.Image.scale>
     * <gamvas.Image.setScaleXY>
     */
    this.setScale = function(s) {
        this.scaleFactor = s;
        this.scaleFactor2 = s;
    };

    /*
     * Function: scale
     *
     * Description:
     *
     * Scale the image
     *
     * Parameters:
     *
     * s - the scale factor (< 0 = shrink, > 0 = enlarge)
     *
     * See:
     *
     * <gamvas.Image.setScale>
     */
    this.scale = function(s) {
        this.scaleFactor += s;
        this.scaleFactor2 += s;
    };

    /*
     * Function: setScaleXY
     *
     * Description:
     *
     * Set a different scale for x and y axis
     *
     * Parameters:
     *
     * x - the scale of the x axis (1 = no scale, < 1 = smaller, > 1 = bigger)
     * y - the scale of the y axis (1 = no scale, < 1 = smaller, > 1 = bigger)
     *
     * See:
     *
     * <gamvas.Image.setScale>
     */
    this.setScaleXY = function(x, y) {
        this.scaleFactor = x;
        this.scaleFactor2 = y;
    };

    /*
     * Function: setCenter
     *
     * Description:
     *
     * Set the center for an Image. If you have a round object
     * for example with a size of 64 by 64 pixels and you want
     * to rotate it around the center, you would use
     * myObject.setCenter(32, 32);
     *
     * Parameters:
     *
     * x/y - the center, as seen of the upper left corner of the object
     */
    this.setCenter = function(x, y) {
        this.center.x = x;
        this.center.y = y;
    };

    /*
     * Function: setFile
     *
     * Description:
     *
     * Sets the image
     *
     * Parameters:
     * image - a JavaScript Image object
     */
    this.setFile = function(f) {
        this.image = f;
    };

    /*
     * Function: draw
     *
     * Description:
     *
     * draws the image, using its position, rotation and scale information
     */
    this.draw = function() {
        var r = this.getClipRect();
        if ( (r.x >= 0) && (r.x < this.image.width) && (r.y >= 0) && (r.y < this.image.height) && (r.x+r.width <= this.image.width) && (r.y+r.height <= this.image.height) ) {
            this.c.save();
            this.c.translate(this.position.x, this.position.y);
            this.c.rotate(this.rotation);
            this.c.scale(this.scaleFactor, this.scaleFactor2);
            this.c.drawImage(this.image, r.x, r.y, r.width, r.height, -this.center.x+r.x, -this.center.y+r.y, r.width, r.height);
            this.c.restore();
        } else {
            console.log('not drawing because of clip rect: ');
            console.log(r);
        }
    };

    /*
     * Function: setClipRect
     *
     * Sets the clipping rectangle of a image
     *
     * A clipping rectangle defines which portion of the image will
     * be drawn. It has to be inside the image and is specified by
     * its top left corner and a width and height.
     *
     * By default, a clipping rectange of x/y = 0/0 and
     * width/height = image width and height is used
     *
     * Parameters:
     *
     * rx - either a <gamvas.Rect> object or the x coordinate of the upper left corner
     * y - the y coordinate of the uppder left corner (if rx is not a <gamvas.Rect> object)
     * w - the width of the clipping rectangle (if rx is not a <gamvas.Rect> object)
     * h - the height of the clipping rectangle (if rx is not a <gamvas.Rect> object)
     *
     * See:
     *
     * <gamvas.Image.getClipRect>
     */
    this.setClipRect = function(rx, y, w, h) {
        if (rx instanceof gamvas.Rect) {
            this.cr = rx;
        } else {
            this.cr = new gamvas.Rect(rx, y, w, h);
        }
    };

    /*
     * Function: getClipRect
     *
     * Gets the clipping rectangle of a image as <gamvas.Rect>
     *
     * See:
     *
     * <gamvas.Image.setClipRect>
     * <gamvas.Rect>
     */
    this.getClipRect = function() {
        if (this.cr === null) {
            this.cr = new gamvas.Rect(0, 0, this.image.width, this.image.height);
        }
        return this.cr;
    };
};
