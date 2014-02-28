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
 * Class: gamvas.key
 *
 * Keyboard utilities and defines.
 *
 * The defines are listed without further description, should be pretty self explanatory.
 */
gamvas.key = {
    /* Variable: BACKSPACE */
    BACKSPACE: 8,
    /* Variable: TAB */
    TAB: 9,
    /* Variable: RETURN */
    RETURN: 13,
    /* Variable: SHIFT */
    SHIFT: 16,
    /* Variable: CTRL */
    CTRL: 17,
    /* Variable: ALT */
    ALT: 18,
    /* Variable: PAUSE */
    PAUSE: 19,
    /* Variable: BREAK */
    BREAK: 19,
    /* Variable: CAPSLOCK */
    CAPSLOCK: 20,
    /* Variable: ESCAPE */
    ESCAPE: 27,
    /* Variable: SPACE */
    SPACE: 32,
    /* Variable: PAGE_UP */
    PAGE_UP: 33,
    /* Variable: PAGE_DOWN */
    PAGE_DOWN: 34,
    /* Variable: END */
    END: 35,
    /* Variable: HOME */
    HOME: 36,
    /* Variable: LEFT */
    LEFT: 37,
    /* Variable: UP */
    UP: 38,
    /* Variable: RIGHT */
    RIGHT: 39,
    /* Variable: DOWN */
    DOWN: 40,
    /* Variable: INSERT */
    INSERT: 45,
    /* Variable: DELETE */
    DELETE: 46,
    /* Variable: NUM_0 */
    NUM_0: 48,
    /* Variable: NUM_1 */
    NUM_1: 49,
    /* Variable: NUM_2 */
    NUM_2: 50,
    /* Variable: NUM_3 */
    NUM_3: 51,
    /* Variable: NUM_4 */
    NUM_4: 52,
    /* Variable: NUM_5 */
    NUM_5: 53,
    /* Variable: NUM_6 */
    NUM_6: 54,
    /* Variable: NUM_7 */
    NUM_7: 55,
    /* Variable: NUM_8 */
    NUM_8: 56,
    /* Variable: NUM_9 */
    NUM_9: 57,
    /* Variable: A */
    A: 65,
    /* Variable: B */
    B: 66,
    /* Variable: C */
    C: 67,
    /* Variable: D */
    D: 68,
    /* Variable: E */
    E: 69,
    /* Variable: F */
    F: 70,
    /* Variable: G */
    G: 71,
    /* Variable: H */
    H: 72,
    /* Variable: I */
    I: 73,
    /* Variable: J */
    J: 74,
    /* Variable: K */
    K: 75,
    /* Variable: L */
    L: 76,
    /* Variable: M */
    M: 77,
    /* Variable: N */
    N: 78,
    /* Variable: O */
    O: 79,
    /* Variable: P */
    P: 80,
    /* Variable: Q */
    Q: 81,
    /* Variable: R */
    R: 82,
    /* Variable: S */
    S: 83,
    /* Variable: T */
    T: 84,
    /* Variable: U */
    U: 85,
    /* Variable: V */
    V: 86,
    /* Variable: W */
    W: 87,
    /* Variable: X */
    X: 88,
    /* Variable: Y */
    Y: 89,
    /* Variable: Z */
    Z: 90,
    /* Variable: WIN_LEFT */
    WIN_LEFT: 91,
    /* Variable: WIN_RIGHT */
    WIN_RIGHT: 92,
    /* Variable: SELECT */
    SELECT: 93,
    /* Variable: NUMPAD_0 */
    NUMPAD_0: 96,
    /* Variable: NUMPAD_1 */
    NUMPAD_1: 97,
    /* Variable: NUMPAD_2 */
    NUMPAD_2: 98,
    /* Variable: NUMPAD_3 */
    NUMPAD_3: 99,
    /* Variable: NUMPAD_4 */
    NUMPAD_4: 100,
    /* Variable: NUMPAD_5 */
    NUMPAD_5: 101,
    /* Variable: NUMPAD_6 */
    NUMPAD_6: 102,
    /* Variable: NUMPAD_7 */
    NUMPAD_7: 103,
    /* Variable: NUMPAD_8 */
    NUMPAD_8: 104,
    /* Variable: NUMPAD_9 */
    NUMPAD_9: 105,
    /* Variable: NUMPAD_MULTIPLY */
    NUMPAD_MULTIPLY: 106,
    /* Variable: NUMPAD_ADD */
    NUMPAD_ADD: 107,
    /* Variable: NUMPAD_SUBTRACT */
    NUMPAD_SUBTRACT: 109,
    /* Variable: NUMPAD_DECIMALPOINT */
    NUMPAD_DECIMALPOINT: 110,
    /* Variable: NUMPAD_DIVIDE */
    NUMPAD_DIVIDE: 111,
    /* Variable: F1 */
    F1: 112,
    /* Variable: F2 */
    F2: 113,
    /* Variable: F3 */
    F3: 114,
    /* Variable: F4 */
    F4: 115,
    /* Variable: F5 */
    F5: 116,
    /* Variable: F6 */
    F6: 117,
    /* Variable: F7 */
    F7: 118,
    /* Variable: F8 */
    F8: 119,
    /* Variable: F9 */
    F9: 120,
    /* Variable: F10 */
    F10: 121,
    /* Variable: F11 */
    F11: 122,
    /* Variable: F12 */
    F12: 123,
    /* Variable: NUMLOCK */
    NUMLOCK: 144,
    /* Variable: SCROLLLOCK */
    SCROLLLOCK: 145,
    /* Variable: SEMICOLON */
    SEMICOLON: 186,
    /* Variable: EQUAL */
    EQUAL: 187,
    /* Variable: COMMA */
    COMMA: 188,
    /* Variable: DASH */
    DASH: 189,
    /* Variable: PERIOD */
    PERIOD: 190,
    /* Variable: SLASH */
    SLASH: 191,
    /* Variable: BRACKET_OPEN */
    BRACKET_OPEN: 219,
    /* Variable: BACKSLASH */
    BACKSLASH: 220,
    /* Variable: BRACKET_CLOSE */
    BRACKET_CLOSE: 221,
    /* Variable: SINGLE_QUOTE */
    SINGLE_QUOTE: 222,

    _pressedMap: [],

    /*
     * Function: isPressed
     *
     * Description:
     *
     * Check if a key is pressed
     *
     * Parameters:
     * 
     * k - key to check
     *
     * Returns:
     *
     * true or false
     *
     * Example:
     *
     * > if (gamvas.key.isPressed(gamvas.key.Q)) {
     * >    this.quit = true;
     * > }
     */
    isPressed: function(k) {
        if (!gamvas.isSet(gamvas.key._pressedMap[k])) {
            return false;
        }
        return gamvas.key._pressedMap[k];
    },

    setPressed: function(k, v) {
        gamvas.key._pressedMap[k] = v;
    },

    /*
     * Function: exitEvent
     *
     * Description:
     *
     * return from a unhandled keypress on onKey* functions
     *
     * See:
     *
     * <gamvas.State.onKeyDown>
     * <gamvas.State.onKeyUp>
     *
     */
    exitEvent: function() {
	    if (gamvas.config.preventKeyEvents) {
		    return false;
	    }
	    return true;
    }
};
