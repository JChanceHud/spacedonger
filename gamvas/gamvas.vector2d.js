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
 * Class: gamvas.Vector2D
 *
 * Description:
 *
 * A 2D vector class
 *
 * Constructor:
 *
 * new gamvas.Vector2D(x, y);
 *
 * Parameters:
 *
 * x - The x part of the vector (optional)
 * y - The y part of the vector (optional)
 */
gamvas.Vector2D = function(x, y) {
    /*
     * Variable: x
     *
     * Description:
     *
     * The x direction of the vector, also used as coordinate value for some functions.
     */
    (x) ? this.x = x : this.x = 0;

    /*
     * Variable: y
     *
     * Description:
     *
     * The y direction of the vector, also used as coordinate value for some functions.
     */
    (y) ? this.y = y : this.y = 0;
};

/*
 * Function: length
 *
 * Description:
 *
 * Return the length of the vector in pixels.
 * This calculates the correct length of a vector which
 * uses sqrt() and therefor is slow. If you just want
 * compare two vectors, see <gamvas.Vector2D.quickLength>
 *
 * See:
 * <gamvas.Vector2D.quickLength>
 */
gamvas.Vector2D.prototype.length = function() {
    return Math.sqrt(this.x*this.x+this.y*this.y);
};

/*
 * Function: quickLength
 *
 * Description:
 *
 * Returns the non sqrt() length of the vector, which is faster
 * to calculate as it's real length. Use it if you want to compare
 * to vectors in length. If you need the actual length of the vector,
 * use the slower <gamvas.Vector2D.length>
 *
 * See:
 * <gamvas.Vector2D.length>
 */
gamvas.Vector2D.prototype.quickLength = function() {
    return this.x*this.x+this.y*this.y;
};

/*
 * Function: normalized
 *
 * Description:
 *
 * Returns the normalized vector of a vector. The normalized
 * vector is the vector with length of 1.
 *
 * Returns:
 *
 * <gamvas.Vector2D>
 */
gamvas.Vector2D.prototype.normalized = function() {
    var ret = new gamvas.Vector2D();
    var l = this.length();
    ret.x = this.x/l;
    ret.y = this.y/l;
    return ret;
};

/*
 * Function: rotate
 *
 * Description:
 *
 * Returns a new vector with the current vector rotated a certain angle. The angle is in radians.
 *
 * Parameters:
 *
 * r - Rotation in radians
 *
 * Returns:
 *
 * <gamvas.Vector2D>
 *
 * See:
 *
 * http://en.wikipedia.org/wiki/Radians
 */
gamvas.Vector2D.prototype.rotate = function(r) {
    var ret = new gamvas.Vector2D();
    var s = Math.sin(r);
    var c = Math.cos(r);
    ret.x = c*this.x-s*this.y;
    ret.y = s*this.x+c*this.y;
    return ret;
};

/*
 * Function: subtract
 *
 * Returns a new vector subtracting vector v from current vector
 *
 * Example:
 *
 * > var vec1 = new gamvas.Vector2D(1, 1);
 * > var vec2 = new gamvas.Vector2D(2, 2);
 * > var subtracted = vec1.subtract(vec2);
 */
gamvas.Vector2D.prototype.subtract = function(v) {
    var ret = new gamvas.Vector2D(this.x, this.y);
    ret.x -= v.x;
    ret.y -= v.y;
    return ret;
};

/*
 * Function: add
 *
 * Returns a new vector adding vector v to the current vector
 *
 * Example:
 *
 * > var vec1 = new gamvas.Vector2D(1, 1);
 * > var vec2 = new gamvas.Vector2D(2, 2);
 * > var added = vec1.add(vec2);
 */
gamvas.Vector2D.prototype.add = function(v) {
    var ret = new gamvas.Vector2D(this.x, this.y);
    ret.x += v.x;
    ret.y += v.y;
    return ret;
};

/*
 * Function: difference
 *
 * Returns a new vector holding the difference between vector v and the current vector
 *
 * Example:
 *
 * > var vec1 = new gamvas.Vector2D(1, 1);
 * > var vec2 = new gamvas.Vector2D(2, 2);
 * > var diff = vec1.difference(vec2);
 */
gamvas.Vector2D.prototype.difference = function(v) {
    return new gamvas.Vector2D(v.x-this.x, v.y-this.y);
};

/*
 * Function: copy
 *
 * Returns a copy of the vector
 *
 * Example:
 *
 * > var vec1 = new gamvas.Vector2D(1, 1);
 * > var vec2 = vec1.copy();
 * > vec2.x += 1;
 * > console.log(vec1.x); // will be 1
 * > console.log(vec2.x); // will be 2
 */
gamvas.Vector2D.prototype.copy = function() {
    return new gamvas.Vector2D(this.x, this.y);
};

/*
 * Function: distance
 *
 * Returns the distance between the current vector and vector v
 *
 * Description:
 *
 * This uses the sqrt() function which might be too slow, if you
 * just need to compare several distances, see <gamvas.Vector2D.quickDistance>
 * for a faster version
 *
 * Example:
 *
 * > var vec1 = new gamvas.Vector2D(1, 1);
 * > var vec2 = new gamvas.Vector2D(2, 3);
 * > console.log('The vectors are '+vec1.distance(vec2)+' units away');
 */
gamvas.Vector2D.prototype.distance = function(v) {
    var d = this.difference(v);
    return d.length();
};

/*
 * Function: quickDistance
 *
 * Returns a comparable distance between the current vector and vector v
 *
 * Description:
 *
 * This is faster then testing the distance with <gamvas.Vector2D.distance>
 * but does not give the actual distance, only a comparable value
 *
 * Example:
 *
 * > var vec1 = new gamvas.Vector2D(1, 1);
 * > var vec2 = new gamvas.Vector2D(2, 3);
 * > var vec3 = new gamvas.Vector2D(3, 4);
 * > var distv1v2 = vec1.quickDistance(vec2);
 * > var distv1v3 = vec1.quickDistance(vec3);
 * > if (distv1v2 > distv1v3) {
 * >    console.log('vector 1 is closer to vector 2');
 * > } else {
 * >    console.log('vector 1 is closer to vector 3');
 * > }
 */
gamvas.Vector2D.prototype.quickDistance = function(v) {
    var d = this.difference(v);
    return d.quickLength();
};
