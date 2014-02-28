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
 * Class: gamvas.AStarMap
 *
 * Description:
 *
 * A flexible 3D node based A* pathfinding system
 *
 * For a simpler to use 2D grid based system, have a look at <gamvas.AStarGrid>
 *
 * Constructor:
 *
 * new gamvas.AStarMap(withFirst);
 *
 * Parameters:
 *
 * withFirst - include the first element of a path when searching (optional, default: true)
 * Example:
 *
 * Create a new path finding system and add two nodes that are
 * connected to each other.
 *
 * > var pathFind = new gamvas.AStarMap();
 * > // create nodes
 * > var n1 = new AStarNode(10, 2);
 * > var n2 = new AStarNode(100, 50);
 * > // set connection between nodes
 * > n1.connect(n2);
 * > // add the nodes to the system
 * > pathFind.add(n1);
 * > pathFind.add(n2);
 * > // find the path between two points in space
 * > var path = pathFind.find(5, 1, 120, 40);
 */
gamvas.AStarInfo = function(n, sW, tW, pI) {
    this.node = n;
    this.sw = sW;
    this.tw = tW;
    this.pi = pI;
};

gamvas.AStarMap = gamvas.Class.extend({
    create: function(withFirst) {
        this.nodes = new Array();
        this.returnFirst = true;

        if (typeof withFirst != 'undefined') {
            this.returnFirst = withFirst;
        }
    },
    includeFirstNode: function(withFirst) {
        this.returnFirst = withFirst;
    },

    /*
     * Function: add
     *
     * Add a <gamvas.AStarNode> to the node system
     *
     * Note:
     *
     * Keep in mind, that by just adding it, it is not connected
     * to anything. See <gamvas.AStarNode.connect>
     */
    add: function(n) {
        if (n instanceof gamvas.AStarNode) {
            this.nodes.push(n);
        }
    },

    /*
     * Function: find
     *
     * Find a path between two points in 2D space, or two <gamvas.AStarNode> elements
     *
     * Parameters:
     *
     * This function has two alternative ways to use it
     *
     * A) by specifying points in 2D space:
     *
     * map.find(x1, y1, x2, y2);
     *
     * B) by specifying nodes:
     *
     * map.find(node1, node2);
     *
     * Example:
     *
     * > var pathFind = new gamvas.AStarMap();
     * > // create nodes
     * > var n1 = new AStarNode(10, 2);
     * > var n2 = new AStarNode(100, 50);
     * > var n3 = new AStarNode(250, 25);
     * > // set connection between nodes
     * > n1.connect(n2);
     * > n2.connect(n3);
     * > // add the nodes to the system
     * > pathFind.add(n1);
     * > pathFind.add(n2);
     * > pathFind.add(n3);
     * > // find the path using the nodes instead of using 3d coordinates
     * > var path = pathFind.find(n1, n3);
     */
    find: function(nxs, nys, xe, ye) {
        var ret = [];
        var sn = null;
        var en = null;
        if ( (nxs instanceof gamvas.AStarNode) && (nys instanceof gamvas.AStarNode) ) {
            sn = nxs;
            en = nys;
        } else {
            sn = this.getNearest(nxs, nys);
            en = this.getNearest(xe, ye);
            if ( (!(sn instanceof gamvas.AStarNode)) || (!(en instanceof gamvas.AStarNode)) ) {
                return [];
            }
        }
        var ol = [new gamvas.AStarInfo(sn, 0, 0, null)];
        var yol = [];
        var cl = [];
        var found = false;

        var curr = null;
        while ( (!found) && (ol.length) ) {
            curr = ol.shift();
            if (curr.node === en) {
                found = true;
                continue;
            }
            for (var c = 0; c < curr.node.connected.length; c++) {
                var tn = curr.node.connected[c];
                var tnoid = tn.objectID();
                if ( (!yol[tnoid]) && (!cl[tnoid]) ) {
                    var gv = curr.node.g(tn);
                    if (gv < 0) {
                        continue;
                    }
                    var hv = curr.node.h(tn, en);
                    var nWeight = curr.sw+gv+hv;
                    var ins = false;
                    for (var oi = 0; oi < ol.length && ins === false; oi++) {
                        if (ol[oi].sw+ol[oi].tw > nWeight) {
                            ol.splice(oi, 0, new gamvas.AStarInfo(tn, curr.sw+gv, hv, curr));
                            yol[tnoid] = true;
                            ins = true;
                        }
                    }
                    if (!ins) {
                        ol.push(new gamvas.AStarInfo(tn, curr.sw+gv, hv, curr));
                        yol[tnoid] = true;
                    }
                }
            }
            cl[curr.node.objectID()] = true;
        }

        if (found) {
            while (curr.pi !== null) {
                ret.unshift(curr.node);
                curr = curr.pi;
            }
            if (this.returnFirst) {
                ret.unshift(curr.node);
            }
        }

        return ret;
    },

    getNearest: function(nx, y) {
        var pos = null;
        if (nx instanceof gamvas.AStarNode) {
            pos = new gamvas.AStarNode(nx.position.x, nx.position.y);
        } else {
            pos = new gamvas.AStarNode(nx, y);
        }
        var nearestID = -1;
        var maxDist = Infinity;
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].id != pos.id) {
                var d = pos.position.quickDistance(this.nodes[i].position);
                if (d < maxDist) {
                    maxDist = d;
                    nearestID = i;
                }
            }
        }
        if (nearestID >= 0) {
            return this.nodes[nearestID];
        }
        return null;
    }
});
