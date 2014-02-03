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
 * Class: gamvas.AStarGridNode
 *
 * Description:
 *
 * The node information of a <gamvas.AStarGrid> map
 */
gamvas.AStarGridNode = gamvas.AStarNode.extend({
        /*
         * Variable: position
         *
         * The position information in the grid as <gamvas.Vector2D>
         *
         * Note:
         *
         * Example:
         *
         * > var path = myAStarGrid.find(0, 0, 10, 15);
         * > if (path.length) {
         * >    console.log('First position: '+path[0].position.x+', '+path[0].position.y);
         * > }
         *
         */
        create: function(st, v, x, y, id) {
            this._super(x, y, id);
            this.strategy = st;
            this.value = v;
        },

        setValue: function(v) {
            this.value = v;
        },

        g: function(n) {
            if (this.value < 0) {
                return this.value;
            }

            if (this.strategy == 1) { // IgnoreSteps
                if (n.value < 0) {
                    return n.value;
                }
                return 0;
            }

            if (n.value < 0) {
                return n.value;
            }
            return Math.abs(this.value-n.value);
        }
});
