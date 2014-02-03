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
if ( (typeof Box2D != 'undefined') && (typeof Box2D.Dynamics.b2ContactListener != 'undefined') ) {
    gamvas.physics.ContactListener = Box2D.Dynamics.b2ContactListener;

    gamvas.physics.ContactListener.prototype.BeginContact = function(c) {
        var uda = c.GetFixtureA().GetBody().GetUserData();
        var udb = c.GetFixtureB().GetBody().GetUserData();
        if ( (uda.type == 'actor') && (udb.type == 'actor' ) ) {
            uda.data.onCollisionEnter(udb.data, c);
            udb.data.onCollisionEnter(uda.data, c);
        }
    };

    gamvas.physics.ContactListener.prototype.EndContact = function(c) {
        var uda = c.GetFixtureA().GetBody().GetUserData();
        var udb = c.GetFixtureB().GetBody().GetUserData();
        if ( (uda.type == 'actor') && (udb.type == 'actor' ) ) {
            uda.data.onCollisionLeave(udb.data, c);
            udb.data.onCollisionLeave(uda.data, c);
        }
    };

    gamvas.physics.ContactListener.prototype.PreSolve = function(c, om) {
        var uda = c.GetFixtureA().GetBody().GetUserData();
        var udb = c.GetFixtureB().GetBody().GetUserData();
        if ( (uda.type == 'actor') && (udb.type == 'actor' ) ) {
            if ( (!uda.data.doCollide(udb.data, c, om)) || (!udb.data.doCollide(uda.data, c, om))) {
                c.SetEnabled(false);
            }
        }
    };

    gamvas.physics.ContactListener.prototype.PostSolve = function(c, imp) {
        var uda = c.GetFixtureA().GetBody().GetUserData();
        var udb = c.GetFixtureB().GetBody().GetUserData();
        if ( (uda.type == 'actor') && (udb.type == 'actor' ) ) {
            var ni = imp.normalImpulses[0];
            var ti = imp.tangentImpulses[0];
            uda.data.onCollision(udb.data, ni, ti, c);
            udb.data.onCollision(uda.data, ni, ti, c);
        }
    };
}
