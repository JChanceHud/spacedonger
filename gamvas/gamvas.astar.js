/**
 * Copyright (C) 2013 Heiko Irrgang <hi@93i.de>
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
 * Class: gamvas.AStar
 *
 * gamvas.AStar specific defines, variables and functions
 */
gamvas.AStar = {
    /*
     * Define: gamvas.AStar.STRATEGY_AVOID_STEPS
     *
     * Avoid height steps in a <gamvas.AStarArray>
     *
     * Description:
     *
     * The AI tries to avoid height differences when finding a path in <gamvas.AStarArray>.
     * If it is walking through a valley, it avoids mountains until it has no other chance,
     * once it 'climbed' a mountain, it will try to stay on that mountain, until it is forced
     * to continue in the valleys... and so on...
     */
    STRATEGY_AVOID_STEPS: 0,

    /*
     * Define: gamvas.AStar.STRATEGY_IGNORE_STEPS
     *
     * Ignore height steps in a <gamvas.AStarArray>
     *
     * Description:
     *
     * The AI ignores height differences in a <gamvas.AStarArray> pathfinding
     * map and just walks over height differences as if they weren't there.
     */
    STRATEGY_IGNORE_STEPS: 1
};
