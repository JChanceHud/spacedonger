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
 * Class: gamvas.Camera
 *
 * Description:
 *
 * The camera class.
 *
 * Note:
 *
 * Every <gamvas.State> has a default camera, which you can access with
 * this.camera
 *
 * Constructor:
 *
 * new gamvas.Camera([x], [y], [rot], [zoom]);
 *
 * Parameters:
 *
 * x/y - The position of the cameras center (optional)
 * rot - The rotation of the camera in radians (optional)
 * zoom - The zoom factor of the camera (optional)
 */
gamvas.Camera = function(x, y, rot, zoom) {
    /*
     * Variable: position
     *
     * Description:
     *
     * A <gamvas.Vector2D> object that holds the position of the camera. It is recommended to use it only for reading.
     */
    this.position = new gamvas.Vector2D( (x) ? x : 0, (y) ? y : 0);

    /*
     * Variable: rotation
     *
     * Description:
     *
     * The rotation of the camera in radians. It is recommended to use it only for reading.
     */
    this.rotation = (rot) ? rot : 0;

    /*
     * Variable: zoomFactor
     *
     * Description:
     *
     * The zoom factor of the camera. It is recommended to use it only for reading.
     */
    this.zoomFactor = (zoom) ? zoom : 1;
};

/*
 * Function: setPosition
 *
 * Description:
 *
 * Set the position of the camera to absolute values.
 *
 * Parameters:
 *
 * x - The new x position of the cameras center
 * y - The new y position of the cameras center
 */
gamvas.Camera.prototype.setPosition = function(x, y) {
    this.position.x = x;
    this.position.y = y;
};

/*
 * Function: move
 *
 * Description:
 *
 * Move the camera, relative to its current position.
 *
 * Parameters:
 *
 * x - The amount of pixels to move along the horizontal axis
 * y - The amount of pixels to move along the vertical axis
 */
gamvas.Camera.prototype.move = function(x, y) {
    this.position.x += x;
    this.position.y += y;
};

/*
 * Function: setRotation
 *
 * Description:
 *
 * Set the rotation to a specific degree in radians
 *
 * Parameters:
 *
 * r - rotation in radians
 */
gamvas.Camera.prototype.setRotation = function(r) {
    this.rotation = r;
};

/*
 * Function: rotate
 *
 * Description:
 *
 * Rotate the camera for r radians
 *
 * Parameters:
 *
 * r - rotation in radians
 */
gamvas.Camera.prototype.rotate = function(r) {
    this.rotation += r;
};

/*
 * Function: setZoom
 *
 * Description:
 *
 * Set a specific zoom level to the camera.
 *
 * Parameters:
 *
 * z - the zoom level, as 1 = original size, < 1 = zoom out, > 1 = zoom in
 */
gamvas.Camera.prototype.setZoom = function(z) {
    this.zoomFactor = z;
};

/*
 * Function: zoom
 *
 * Description:
 *
 * Zoom the camera
 *
 * Parameters:
 *
 * z - the change of zoom, relative to its current zoom
 */
gamvas.Camera.prototype.zoom = function(z) {
    this.zoomFactor += z;
};

/*
 * Function: start
 *
 * Description:
 *
 * Start the camera. Needs to be called before every drawing operation that should
 * be in the influence of the camera (e.g. your game actors)
 *
 * See:
 *
 * <gamvas.Camera.stop>
 *
 * Example:
 *
 * > this.camera.start();
 * > // draw everything under camera influence
 * > this.drawGameObjects();
 * > this.camera.stop();
 * > // draw everything not under camera influence (e.g. Score, Health, ...)
 * > this.drawHUD();
 */
gamvas.Camera.prototype.start = function() {
    var d = gamvas.getCanvasDimension();
    var c = gamvas.getContext2D();
    var centerX = d.w/(this.zoomFactor*2);
    var centerY = d.h/(this.zoomFactor*2);
    c.save();
    c.scale(this.zoomFactor, this.zoomFactor);
    c.translate(centerX, centerY);
    c.rotate(this.rotation);
    c.translate(-this.position.x, -this.position.y);
};

/*
 * Function: stop
 *
 * Description:
 *
 * Stop the camera, everything drawn from now on will not be under
 * the influence of the camera. You usually do this before drawing
 * player score and health.
 *
 * See:
 *
 * <gamvas.Camera.start>
 */
gamvas.Camera.prototype.stop = function() {
    var c = gamvas.getContext2D();
    c.restore();
};

/*
 * Function: toWorld
 *
 * Description:
 *
 * Convert screen coordinates to world coordinates. For example if you have a
 * rotated camera and the user clicks on the screen, use this function
 * to check which position the click on the rotated camera is in the unrotated
 * world.
 *
 * Returns:
 *
 * <gamvas.Vector2D>
 *
 * See:
 *
 * <gamvas.Camera.toScreen>
 */
gamvas.Camera.prototype.toWorld = function(x, y) {
    var d = gamvas.getCanvasDimension();
    var ret = new gamvas.Vector2D((x-d.w/2)/this.zoomFactor, (y-d.h/2)/this.zoomFactor).rotate(-this.rotation);
    ret.x+=this.position.x;
    ret.y+=this.position.y;
    return ret;
};

/*
 * Function: toScreen
 *
 * Description:
 *
 * Convert world coordinates to screen coordinates. If you have
 * a object in your world and your camera has moved 3 screen aside,
 * this function gets you the actual screen position of the object.
 *
 * Returns:
 *
 * <gamvas.Vector2D>
 * 
 * See:
 *
 * <gamvas.Camera.toWorld>
 */
gamvas.Camera.prototype.toScreen = function(x, y) {
    /* var d = gamvas.getCanvasDimension();
    var ret = new gamvas.Vector2D(x-this.position.x, y-this.position.y).rotate(this.rotation);
    ret.x = x*this.zoomFactor+d.w/2;
    ret.y = y*this.zoomFactor+d.h/2; */

    var d = gamvas.getCanvasDimension();
    var ret = new gamvas.Vector2D(x-this.position.x, y-this.position.y).rotate(this.rotation);
    ret.x = ret.x*this.zoomFactor+d.w/2;
    ret.y = ret.y*this.zoomFactor+d.h/2;

    return ret;
};
