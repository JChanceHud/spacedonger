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
 * Class: gamvas.Resource
 *
 * Description:
 *
 * Class for resource handling, aka loading images and other game data
 *
 * Constructor:
 *
 * new gamvas.Resource();
 */
gamvas.Resource = function() {
    this._finished = true;
    this.cache = false;
    this._images = [];
    this._sounds = [];
    this.ret = 0;
    this._toLoad = 0;
    this._loaded = 0;
};

/*
 * Function: getImage
 *
 * Description:
 *
 * Load a image from url
 *
 * Parameters:
 *
 * url - The image url
 *
 * Returns:
 *
 * A javascript image object, that might be not fully loaded yet
 *
 * Example:
 *
 * > myState = gamvas.State.extend({
 * >     init: function() {
 * >         this.img = this.resource.getImage('myImage.png');
 * >     },
 * >     draw: function(t) {
 * >         if (this.resource.done()) { // everything loaded?
 * >             // do something with this.img
 * >         } else { // data is still loading
 * >             // print current loading status in percent
 * >             this.c.fillText("Loading... "+(100*this.resource.status())+"%", 10, 10);
 * >         }
 * >     }
 * > });
 */
gamvas.Resource.prototype.getImage = function(url) {
    this._finished = false;
    this._toLoad++;
    var img = new Image();
    img.src = url;
    this._images.push(img);
    return img;
};

/*
 * Function: getSound
 *
 * Description:
 *
 * Load a sound/music file from url
 *
 * Parameters:
 *
 * url - The audio file url
 *
 * Returns:
 *
 * A javascript Audio object, that might be not fully loaded yet
 *
 * Example:
 *
 * > myState = gamvas.State.extend({
 * >     create: function(name) {
 * >         this._super(name);
 * >         this.snd = this.resource.getSound('pling.wav');
 * >     },
 * >     draw: function(t) {
 * >         if (this.resource.done()) { // everything loaded?
 * >              // play the sound
 * >              gamvas.sound.play(this.snd);
 * >         } else { // data is still loading
 * >             // print current loading status in percent
 * >             this.c.fillText("Loading... "+(100*this.resource.status())+"%", 10, 10);
 * >         }
 * >     }
 * > });
 */
gamvas.Resource.prototype.getSound = function(url) {
    this._finished = false;
    this._toLoad++;
    var snd = new Audio();
    snd.src = url;
    snd.loop = false;
    this._sounds.push(snd);
    return snd;
};

gamvas.Resource.prototype._calculate = function() {
    if (this.cache) {
        return this._loaded;
    }
    var incomplete = false;
    var newimages = [];
    for (var i = 0; i < this._images.length; i++) {
        if (this._images[i].complete) {
            this._loaded++;
        } else {
            newimages.push(this._images[i]);
            incomplete = true;
        }
    }
    delete this._images;
    this._images = newimages;

    var newsounds = [];
    for (var i = 0; i < this._sounds.length; i++) {
        switch (this._sounds[i].readyState) {
            case HTMLMediaElement.HAVE_CURRENT_DATA:
            case HTMLMediaElement.HAVE_FUTURE_DATA:
            case HTMLMediaElement.HAVE_ENOUGH_DATA:
                this._loaded++;
                break;
            default:
                newsounds.push(this._sounds[i]);
                incomplete = true;
                break;
        }
    }
    delete this._sounds;
    this._sounds = newsounds;

    if (incomplete == false) {
        this._finished = true;
    }
    this.cache = true;
};

/*
 * Function: status
 *
 * Description:
 *
 * Get the status of all loading resources
 *
 * Returns:
 *
 * A value between 0 and 1 depending on how much of the resources are loaded
 *
 * See:
 * <gamvas.Resource.getImage>
 */
gamvas.Resource.prototype.status = function() {
    if (this._finished) return 1.0;
    if (this._toLoad === 0) return 1.0;
    this._calculate();
    return this._loaded/this._toLoad;
};

/*
 * Function: done
 *
 * Description:
 *
 * Are all resources loaded?
 *
 * Returns:
 *
 * true or false
 *
 * See:
 * <gamvas.Resource.getImage>
 */
gamvas.Resource.prototype.done = function() {
    if (this._finished) {
        return true;
    }
    this._calculate();
    return this._finished;
};
