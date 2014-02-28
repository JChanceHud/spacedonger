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
 * Class: gamvas.AStarGrid
 *
 * Description:
 *
 * A class to simplify A* pathfinding on a 2x2 grid with a optional height field
 *
 * The single fields can have any value where negative values mean 'not walkable'
 * and positive values are interpreted debending on the path finding strategy used
 *
 * Constructor:
 *
 * new gamvas.AStarGrid(w, h, diag, withFirst, strt, dflt);
 *
 * Parameters:
 *
 * w - The width of the grid
 * h - The height of the grid
 * diag - Allow diagonal steps (optional, default: false)
 * withFirst - Include the first node of the path in the result (optional, default: true)
 * strt - The path finding strategy (see below) (optional)
 * dflt - The default value for the grid fields (optional, default: 0)
 *
 * Extends:
 *
 * <gamvas.AStarMap>
 *
 * Strategy:
 *
 * There are several strategies, how the values are interpreted.
 * They only give minor differnce in the result, but in certain
 * situations it might be necessary to use a different strategy
 *
 * gamvas.AStar.STRATEGY_AVOID_STEPS - (default) The algorithm tries to avoid height differences, so if you start in a valley, it will try to stay in the valley and run around mountains, until there is nothing left other then stepping on a mountain, once on the moutain, it tries to stay on it, until it has to go down to the valley again.
 *
 * gamvas.AStar.STRATEGY_IGNORE_STEPS - The algorithm completely ignores height information and always tries to go straight to the target
 *
 * Example:
 *
 * The following would create a grid with 50 by 50 fields.
 * As we do not set any field values, default is 0, which means
 * perfect ground to walk on, this example would result in
 * a path that represents a straight line from upper left to
 * lower right corner of the grid.
 *
 * > var pathMap = new gamvas.AStarGrid(50, 50);
 * > var result = pathMap.find(0, 0, 49, 49);
 * > for (var i = 0; i < result.length; i++) {
 * >    console.log('Step '+i+' is at 'result[i].position.x+','+result[i].position.y);
 * > }
 *
 * See:
 *
 * <gamvas.AStar>
 *
 */
gamvas.AStarGrid = gamvas.AStarMap.extend({
        create: function(w, h, diag, withFirst, strt, dflt) {
            this._super(withFirst);
            if (typeof strt == 'undefined') {
                this.strategy = 0;
            } else {
                this.strategy = strt;
            }

            this.width = w;
            this.height = h;
            this.setDefault(dflt);
            if (typeof diag != 'undefined') {
                this.useDiagonal = diag;
            } else {
                this.useDiagonal = false;
            }

            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    this.add(new gamvas.AStarGridNode(this.strategy, this.defaultValue, x, y));
                }
            }
            for (var yy = 0; yy < h; yy++) {
                for (var xx = 0; xx < w; xx++) {
                    var other = null;
                    var n = this.nodes[yy*w+xx];
                    if (xx > 0) {
                        other = this.nodes[(yy)*w+(xx-1)];
                        n.connect(other, false);
                        if (this.useDiagonal) {
                            if (yy > 0) {
                                other = this.nodes[(yy-1)*w+(xx-1)];
                                n.connect(other, false);
                            }
                            if (yy < h-1) {
                                other = this.nodes[(yy+1)*w+(xx-1)];
                                n.connect(other, false);
                            }
                        }
                    }
                    if (yy > 0) {
                        other = this.nodes[(yy-1)*w+(xx)];
                        n.connect(other, false);
                    }
                    if (yy < this.height-1) {
                        other = this.nodes[(yy+1)*w+(xx)];
                        n.connect(other, false);
                    }
                    if (xx < this.width-1) {
                        other = this.nodes[(yy)*w+(xx+1)];
                        n.connect(other, false);
                        if (this.useDiagonal) {
                            if (yy > 0) {
                                other = this.nodes[(yy-1)*w+(xx+1)];
                                n.connect(other, false);
                            }
                            if (yy < h-1) {
                                other = this.nodes[(yy+1)*w+(xx+1)];
                                n.connect(other, false);
                            }
                        }
                    }
                }
            }
        },
        setDefault: function(dflt) {
                if (dflt) {
                    this.defaultValue = dflt;
                } else {
                    this.defaultValue = 0;
                }
        },
        /*
         * Function: setValue
         *
         * Set a value val in the grid on position x, y
         *
         * Description:
         *
         * Negative values are 'not walkable' while values
         * of 0 or higher are 'walkable' where depending on the
         * strategy the positive values may be interpreted as
         * height map
         *
         * Parameters:
         *
         * x - The x position in the grid
         * y - The y position in the grid
         * val - The value, where < 0 means 'not walkable' and >= 0 means 'walkable'
         */
        setValue: function(x, y, val) {
            if ( (x < this.width) && (y < this.height) ) {
                this.nodes[y*this.width+x].setValue(val);
            }
        },
        /*
         * Function: getValue
         *
         * Get the field value of position x,y in the grid
         *
         * Parameters:
         *
         * x - The x position in the grid
         * y - The y position in the grid
         */
        getValue: function(x, y) {
            if ( (x < this.width) && (y < this.height) ) {
                return this.nodes[y*this.width+x].value;
            }
            return -1;
        },
        /*
         * Function: find
         *
         * Find a path between two positions in the grid
         *
         * Parameters:
         *
         * xs - The x position of the start field
         * ys - The y position of the start field
         * xe - The x position of the end field (aka target)
         * ye - The y position of the end field (aka target)
         *
         * Returns:
         *
         * An array of <gamvas.AStarGridNode>. If no path is
         * possible, the array has a length of 0
         */
        find: function(xs, ys, xe, ye) {
            if ( (xs instanceof gamvas.AStarNode) && (ys instanceof gamvas.AStarNode) ) {
                return this._super(xs, ys);
            }
            if ( (xs < this.width) && (ys < this.height) && (xe < this.width) && (ye < this.width) ) {
                var sn = this.nodes[ys*this.width+xs];
                var en = this.nodes[ye*this.width+xe];
                return this._super(sn, en);
            }
        }
});
