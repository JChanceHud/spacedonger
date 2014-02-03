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
 * Class: gamvas.config
 *
 * Several userconfigurable variables
 */
gamvas.config = {
    /*
     * Variable: preventKeyEvents
     *
     * Capture the whole documents key events?
     *
     * If true, every key event on the page will be handled by gamvas.
     * This disables scrolling with cursor keys and other keyboard shortcuts.
     * When false, only keys that are explicitly handled by the running game
     * are not given to the browser, everything else is put through
     *
     * Default:
     * false
     */
	preventKeyEvents: false,

    /*
     * Variable: preventMouseEvents
     *
     * Capture the whole documents mouse events?
     *
     * If true, every mouse event on the page will be handled by gamvas.
	 * You can not select input fields, or click on the scrollbar.
	 * When false, only if the event handler like for example <gamvas.actor.onKeyDown>
	 * returns false, the mouse event will not be put through to the browser.
     *
     * Default:
     * false
     */
	preventMouseEvents: false,

    /*
     * Variable: worldPerState
     *
     * Use one physics world per game state?
     *
     * If true, every game state will have its own physics world,
     * compared to one physics world for the full game.
     *
     * Default:
     * true
     */
	worldPerState: true,

	/*
	 * Variable: reverseLayerOrder
	 *
	 * Reverse layer sorting
	 *
	 * The first versions of gamvas had a error, detected by forum user bogdanaslt, where the value of <gamvas.actor.layer>
	 * was the wrong way, so a background layer had to have a higher layer value then a foreground object to be rendered
	 * below the foreground object.
	 *
	 * If you have used layers before introduction of this fix (0.8.3), you have to options, rearrange your code to
	 * work with the correct layering (as in layer 0 = background, layer 1 = before background, or you have to set this
	 * variable to true *BEFORE* starting gamvas to use the old - wrong - sorting.
	 *
	 * Default:
	 * false
	 */
	reverseLayerOrder: false
};
