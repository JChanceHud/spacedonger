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
 * Class: gamvas.Animation
 *
 * Description:
 *
 * Class for animated sprites
 *
 * The image for the animation is a JavaScript Image object, that holds
 * all the frames with a certain width in one image.
 *
 * For example, if you have a animation with 10 frames sized 64x64, you
 * could make a image of 640x64 and put the 10 images side by side, or
 * you could make 2 rows with 5 images on each and make a 320x128 image.
 *
 * Constructor:
 *
 * new gamvas.Animation(name, [image], [frameWidth], [frameHeight], [numberOfFrames], [fps]);
 *
 * Parameters:
 *
 * name - A unique identifier as name
 * image - A Image object that holds the frames of the animation (optional)
 * framwWidth - The width of a single frame (optional)
 * frameHeight - The height of a single frame (optional)
 * numberOfFrames - The number of frames the animation has (optional)
 * fps - The speed of the animation in frames per second (optional)
 */
gamvas.Animation = gamvas.Class.extend({
    create: function(name, image, frameWidth, frameHeight, numberOfFrames, fps) {
        /*
         * Variable: name
         *
         * The name of the animation.
         * Must be unique within all animations of a actor
         */
        this.name = name;
        this.sprite = (image) ? image : null;

        /*
         * Variable: width
         *
         * The width of a single frame in pixels
         */
        this.width = (frameWidth) ? frameWidth : 0;

        /*
         * Variable: height
         *
         * The height of a single frame in pixels
         */
        this.height = (frameHeight) ? frameHeight : 0;

        /*
         * Variable: numberOfFrames
         *
         * The the frame count of the animation
         */
        this.numberOfFrames = (numberOfFrames) ? numberOfFrames : 0;

        /*
         * Variable: currentFrame
         *
         * The index of the current frame
         */
        this.currentFrame = 0;
        this.currentFrameTime = 0;
        this.fDur = (fps) ? 1/fps : 0.1;
        this.c = gamvas.getContext2D();
        this.frameList = [];

        /*
         * Variable: position
         *
         * The current position as <gamvas.Vector2D>
         */
        this.position = new gamvas.Vector2D();

        /*
         * Variable: center
         *
         * The center of rotation of the animation
         */
        this.center = new gamvas.Vector2D();

        /*
         * Variable: rotation
         *
         * The rotation in radians
         */
        this.rotation = 0;

        /*
         * Variable: scaleFactor
         *
         * The scale factor (1 = not scaled, < 1 = smaller, > 1 = bigger)
         */
        this.scaleFactor = 1;
        this.scaleFactor2 = 1;
    },

    /*
     * Function: setFile
     *
     * Description:
     *
     * Sets a image as source of a animation
     *
     * Parameters:
     * image - a JavaScript Image object holding the frames
     * frameWidth - the with of a single frame
     * frameHeight - the height of a single frame
     * numberOfFrames - the number of frames of the animation
     * fps - the speed of the animation in fps
     */
    setFile: function(image, frameWidth, frameHeight, numberOfFrames, fps) {
        this.sprite = image;
        this.width = (frameWidth) ? frameWidth : this.sprite.width;
        this.height = (frameHeight) ? frameHeight : this.sprite.height;
        this.numberOfFrames = (numberOfFrames) ? numberOfFrames : 1;
        this.currentFrame = 0;
        this.currentFrameTime = 0;
        this.setFPS((fps) ? fps : 1);
        this.needInit = false;
        if ( (typeof this.width == 'undefined') || (this.width === 0) ) {
            this.needInit = true;
        }
    },

    /*
     * Function: setFPS
     *
     * Description:
     *
     * Set the speed of the animation in frames per second
     *
     * Parameters:
     *
     * fps - The animation speed in frames per second
     */
    setFPS: function(fps) {
        this.fDur = 1/fps;
    },

    /*
     * Function: setRotation
     *
     * Description:
     *
     * Set certain rotation of the animation in radians
     *
     * Parameters:
     *
     * r - the rotation in radians
     *
     * See:
     *
     * <gamvas.Animation.rotate>
     * http://en.wikipedia.org/wiki/Radians
     */
    setRotation: function(r) {
        this.rotation = r;
    },

    /*
     * Function: rotate
     *
     * Description:
     *
     * Rotate the animation
     *
     * Parameters:
     *
     * r - the amount to rotate the animation in radians
     *
     * See:
     *
     * <gamvas.Animation.setRotation>
     * http://en.wikipedia.org/wiki/Radians
     */
    rotate: function(r) {
        this.rotation += r;
    },

    /*
     * Function: setPosition
     *
     * Description:
     *
     * Set the position of a animation
     *
     * Parameters:
     *
     * x/y - the position of the animation in pixels
     *
     * See:
     *
     * <gamvas.Animation.move>
     */
    setPosition: function(x, y) {
        this.position.x = x;
        this.position.y = y;
    },

    /*
     * Function: move
     *
     * Description:
     *
     * Move the animation
     *
     * Parameters:
     *
     * x/y - the pixels to move the animation
     *
     * See:
     *
     * <gamvas.Animation.setPosition>
     */
    move: function(x, y) {
        this.position.x += x;
        this.position.y += y;
    },

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
     * <gamvas.Animation.scale>
     * <gamvas.Animation.setScaleXY>
     */
    setScale: function(s) {
        this.scaleFactor = s;
        this.scaleFactor2 = s;
    },

    /*
     * Function: scale
     *
     * Description:
     *
     * Scale the animation
     *
     * Parameters:
     *
     * s - the scale factor (< 0 = shrink, > 0 = enlarge)
     *
     * See:
     *
     * <gamvas.Animation.setScale>
     */
    scale: function(s) {
        this.scaleFactor += s;
        this.scaleFactor2 += s;
    },

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
     * <gamvas.Animation.setScale>
     */
    setScaleXY: function(x, y) {
        this.scaleFactor = x;
        this.scaleFactor2 = y;
    },

    /*
     * Function: setCenter
     *
     * Description:
     *
     * Set the center for an Animation. If you have a round object
     * for example with a size of 64 by 64 pixels and you want
     * to rotate it around the center, you would use
     * myObject.setCenter(32, 32);
     *
     * Parameters:
     *
     * x/y - the center, as seen of the upper left corner of the object
     */
    setCenter: function(x, y) {
        this.center.x = x;
        this.center.y = y;
    },

    /*
     * Function: draw
     *
     * Description:
     *
     * Draw the animation according to its position, rotation and scale settings
     *
     * Parameters:
     *
     * t - the time since last redraw
     *
     */
    draw: function(t) {
        this.drawFixed(t, this.c, this.position.x, this.position.y, -this.center.x, -this.center.y, this.rotation);
    },

    drawFixed: function(t, c, x, y, offX, offY, rot, scale) {
        if (this.needInit) {
            if ( (typeof this.sprite.width == 'undefined') || (this.sprite.width === 0) ) {
                return;
            }
            this.width = this.sprite.width;
            this.height = this.sprite.height;
            this.needInit = false;
        }
        this.currentFrameTime += t;
        if (this.currentFrameTime > this.fDur) {
            while (this.currentFrameTime > this.fDur) {
                this.currentFrameTime -= this.fDur;
            }
            this.currentFrame++;
            if (this.currentFrame >= this.numberOfFrames) {
                this.currentFrame = 0;
            }
        }
        this.drawFrame(c, this.currentFrame, x, y, offX, offY, rot, scale);
    },

    drawFrame: function(c, fn, x, y, offX, offY, rot, scale) {
        if (!gamvas.isSet(this.sprite)) return;

        if (this.frameList.length > 0) {
            fn = this.frameList[fn];
        }

        var px = this._frameX(fn)*this.width;
        var py = this._frameY(fn)*this.height;
        var tRot = this.rotation;
        var tOffX = -this.center.x;
        var tOffY = -this.center.y;
        var tScale = this.scaleFactor;
        if (gamvas.isSet(offX)) {
            tOffX = offX;
        }
        if (gamvas.isSet(offY)) {
            tOffY = offY;
        }
        if (gamvas.isSet(rot)) {
            tRot = rot;
        }
        if (gamvas.isSet(scale)) {
            tScale = scale;
        }
        c.save();
        c.translate(x, y);
        c.rotate(rot);
        c.scale(tScale, tScale);
        c.drawImage(this.sprite, px, py, this.width, this.height, -tOffX, -tOffY, this.width, this.height);
        c.restore();
    },

    _frameX: function(fn) {
        if (this.height === 0) return 0;
        var imagesX = this.sprite.width/this.width;
        return fn%imagesX;
    },

    _frameY: function(fn) {
        if (this.width === 0) return 0;

        var imagesX = this.sprite.width/this.width;
        return Math.floor(fn/imagesX);
    },

    /*
     * Function: setFrameList
     *
     * Description:
     *
     * Allows to set a list of frames that are considdered to be the animation
     *
     * Immagine a animation of a jumping ball, where on the first frame (0) it
     * is squashed as it hits the ground, then jumps up, slows down and falls
     * back down where it is squased again.
     *
     * You would want to play the ground hitting frames fast, while you would
     * want to play the slow down frames a bit slower, so assuming your animation
     * had 5 frames, you would simple repeat * them, by setting a framelist of
     * setFrameList([0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 2, 2, 1]);
     *
     * Parameters:
     *
     * fl - a array of frame indexes for the animation
     */
    setFrameList: function(fl) {
        this.frameList = fl;
        this.numberOfFrames = fl.length;
    }
});
