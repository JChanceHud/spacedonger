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
 * Class: gamvas.Sound
 *
 * Description:
 *
 * A class for sound and music files.
 *
 * Constructur:
 *
 * new gamvas.Actor(file);
 *
 * Parameters:
 *
 * file - a JavaScript Audio class
 *
 * See:
 *
 * <gamvas.State.addSound>
 *
 * Example:
 *
 * > myState = gamvas.State.extend({
 * >     init: function() {
 * >         this.sound = this.addSound("introsound.wav");
 * >     },
 * >     onKeyDown: function() {
 * >         this.sound.play();
 * >     }
 * > });
 */
gamvas.Sound = function(file) {
    this._file = file;
};

/*
 * Function: play
 *
 * Description:
 *
 * Play the sound once, restarts the sound automatically
 *
 * See:
 * <gamvas.Sound.stop>
 * <gamvas.Sound.resume>
 */
gamvas.Sound.prototype.play = function() {
    if (this.isReady()) {
        this._file.currentTime = 0;
        this._file.play();
    }
};

/*
 * Function: loop
 *
 * Description:
 *
 * Play the sound looping (e.g. for background music)
 *
 * See:
 * <gamvas.Sound.stop>
 */
gamvas.Sound.prototype.loop = function() {
    if (this.isReady()) {
        this._file.currentTime = 0;
        this._file.loop = true;
        this._file.play();
    }
};

/*
 * Function: stop
 *
 * Description:
 *
 * Stops a playing sound
 *
 * See:
 * <gamvas.Sound.resume>
 */
gamvas.Sound.prototype.stop = function() {
    if (this.isReady()) {
        this._file.pause();
    }
};

/*
 * Function: resume
 *
 * Description:
 *
 * Resumes a stopped sound, without rewinding it
 *
 * See:
 * <gamvas.Sound.stop>
 * <gamvas.Sound.play>
 */
gamvas.Sound.prototype.resume = function() {
    if (this.isReady()) {
        this._file.play();
    }
};

/*
 * Function: setRate
 *
 * Description:
 *
 * Set the playback speed of the sound
 *
 * Parameters:
 *
 * r - the new speed (1 = normal, < 1 = faster, > 2 = slower)
 *
 * Note:
 *
 * Playback quality on none standard speeds differs drastically between browsers
 */
gamvas.Sound.prototype.setRate = function(r) {
    this._file.playbackRate = r;
};

/*
 * Function: setVolume
 *
 * Description:
 *
 * Set the volume of the sound
 *
 * Parameters:
 *
 * v - the new volume between 0 and 1
 */
gamvas.Sound.prototype.setVolume = function(v) {
    this._file.volume = v;
};

/*
 * Function: mute
 *
 * Description:
 *
 * Mute the sound
 */
gamvas.Sound.prototype.mute = function() {
    this._file.muted = true;
};

/*
 * Function: unmute
 *
 * Description:
 *
 * Unmute the sound
 */
gamvas.Sound.prototype.unmute = function() {
    this._file.muted = false;
};

/*
 * Function: isReady
 *
 * Description:
 *
 * Test if the sound is ready to play
 *
 * Returns:
 *
 * true/false
 */
gamvas.Sound.prototype.isReady = function() {
    switch (this._file.readyState) {
        case HTMLMediaElement.HAVE_CURRENT_DATA:
        case HTMLMediaElement.HAVE_FUTURE_DATA:
        case HTMLMediaElement.HAVE_ENOUGH_DATA:
            return true;
            break;
        default:
            return false;
    }
};
