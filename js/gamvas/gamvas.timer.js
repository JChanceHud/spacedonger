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
 * Class: gamvas.timer
 *
 * Functions to get information about timing. Mostly for internal use.
 */
gamvas.timer = {
    _date: new Date(),
    _ts: 1,

    /*
     * Function: getSeconds
     *
     * Description:
     *
     * Get the seconds since gamvas was started.
     */
    getSeconds: function() {
        return gamvas.timer.getMilliseconds() / 1000.0;
    },

    /*
     * Function: getMilliseconds
     *
     * Description:
     *
     * Get the milliseconds since gamvas was started.
     */
    getMilliseconds: function() {
        var d = new Date();
        return (d.getTime() - gamvas.timer._date.getTime())*gamvas.timer._ts;
    },

    /*
     * Function: setGlobalTimeScale
     *
     * Description:
     *
     * Scale the global time. Use it to achieve slow motion or fast forward effects.
     * Time scale must be >= 0
     *
     * Note:
     *
     * Does also 'scale' the frames per second value returned by <gamvas.screen.getFPS>.
     * So if you set a global time scale of 0.5, <gamvas.screen.getFPS> will return 120
     * when actually running on 60 fps
     *
     * Parameters:
     *
     * s - time scale factor (1 = normal, < 1 = slower, > 1 = faster)
     */
    setGlobalTimeScale: function(s) {
        gamvas.timer._ts = s;
    },

    /*
     * Function: getGlobalTimeScale
     *
     * Description:
     *
     * Returns the global timescale
     *
     * See:
     *
     * <gamvas.timer.setGlobalTimeScale>
     */
    getGlobalTimeScale: function() {
        return gamvas.timer._ts;
    }
};
