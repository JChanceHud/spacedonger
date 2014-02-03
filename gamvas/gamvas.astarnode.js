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
 * Class: gamvas.AStarNode
 *
 * Description:
 *
 * A base class for pathfinding nodes. You can override it with your own
 * g() and h() functions
 *
 * Constructor:
 *
 * new gamvas.AStarNode(x, y, id);
 *
 * Parameters:
 *
 * x, y - The position of the way point
 * id - A unique id for this node within the pathfinding system (optional, default: autogenerated)
 */
gamvas.AStarNode = gamvas.Class.extend({
    /*
     * Variable: connected
     *
     * A array holding the connected <gamvas.AStarNode> elements
     */
    /* Variable: position
     *
     * A <gamvas.Vector2D> holding the position of the node
     */
    create: function(x, y, id) {
        this.connected = new Array();
        this.position = new gamvas.Vector2D(x, y);
        (id) ? this.id = id : this.id = this.position.x+'_'+this.position.y;
    },
    /* Function: g
     *
     * The path cost function, should return a value that represents
     * how hard it is to reach the current node
     *
     * Parameters:
     *
     * n - The node we are coming from
     *
     * Returns:
     *
     * Negative values - Current node can not be reached from node n
     * Positive values - Representing the costs reaching the current node from node n
     *
     * Example:
     *
     * > gamvas.AStarGridNode = gamvas.AStarNode.extend({
     * >    create: function(x, y, id) {
     * >       this._super(x, y, id);
     * >    },
     * >    g: function(n) {
     * >       // get height difference
     * >       var diff = Math.abs(this.position.y-n.position.y);
     * >       if (diff > 10) {
     * >          return -1; // we can not step over 10 in height
     * >       }
     * >       // give it some weight so the higher the differnce, the more unlikely it is, the path will walk over it
     * >       return diff * diff;
     * >    }
     * > });
     */
    g: function(n) {
        return 1;
    },
    /* Function: h
     *
     * The heuristic estimate
     *
     * Parameters:
     *
     * n - The node we are coming from
     * t - The target of the current path find
     *
     * Returns:
     *
     * The estimated cost to the path target
     *
     * Example:
     *
     * This is the standard implementation, which returns the distance
     * to the target.
     *
     * If you have more information, like for example number of opponents
     * between target and current position, you could return a higher value
     * if too many opponants are between target and current position, so
     * the algorithm will try to avoid running directly through hordes of
     * monsters.
     *
     * > gamvas.AStarGridNode = gamvas.AStarNode.extend({
     * >    create: function(x, y, id) {
     * >       this._super(x, y, id);
     * >    },
     * >    h: function(n, t) {
     * >       var dif = this.position.difference(t.position);
     * >       return dif.length();
     * >    }
     * > });
     */
    h: function(n, t) {
        var dif = this.position.difference(t.position);
        return dif.length();
    },
    /*
     * Function: connect
     *
     * Connect two nodes
     *
     * Parameters:
     *
     * n - The node to connect to
     * auto - true/false if automatically set up a bidirectional connection (optional, default: true)
     */
    connect: function(n, auto) {
        this.connected.push(n);
        if ( (auto) || (typeof auto == 'undefined') ) {
            n.connect(this, false);
        }
    }
});

