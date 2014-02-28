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
 * Class: gamvas.physics
 *
 * Physics functions
 */
gamvas.physics = {
    /* Define: DYNAMIC
     *
     * define for a dynamic body
     *
     * Dynamic bodies are the objects that are under influence of forces
     */
    DYNAMIC: (typeof Box2D == 'undefined') ? null : Box2D.Dynamics.b2Body.b2_dynamicBody,

    /* Define: STATIC
     *
     * define for a static body
     *
     * Static bodies are the objects that do never move, like walls or ground objects
     */
    STATIC: (typeof Box2D == 'undefined') ? null : Box2D.Dynamics.b2Body.b2_staticBody,

    /* Define: KINEMATIC
     *
     * define for a kinematic body
     *
     * Kinematic bodies are objects that move, but not by physics engine, but by either
     * player input or AI
     */
    KINEMATIC: (typeof Box2D == 'undefined') ? null : Box2D.Dynamics.b2Body.b2_kinematicBody,

    /*
     * Variable: pixelsPerMeter
     *
     * Description:
     *
     * Sets the pixels per meter ratio.
     * The physics engine calculates in meters, so if for example you have
     * a car that is 4 meters long, then you set a bounding box with the
     * with of '4' for the physics engine, ofcourse a car with 4 pixels
     * in size would be only hard so see on the screen, so you can set
     * a pixels per meter ratio. Default is 64, so the image for your
     * 4 meter long car would have to be 256 pixels in with.
     *
     * Default:
     *
     * 64
     */
    pixelsPerMeter: 64,

    /*
     * Variable: velocityIterations
     *
     * Description:
     *
     * Sets the Box2D velocity iteration steps
     *
     * Default:
     *
     * 10
     *
     * See:
     *
     * http://box2d.org/manual.html
     */
    velocityIterations: 10,

    /*
     * Variable: positionIterations
     *
     * Description:
     *
     * Sets the Box2D position iteration steps
     *
     * Default:
     *
     * 8
     *
     * See:
     *
     * http://box2d.org/manual.html
     */
    positionIterations: 8,

    /*
     * Variable: debugAlpha
     *
     * Description:
     *
     * The alpha of physics debug information
     *
     * Default:
     *
     * 0.3
     */
    debugAlpha: 0.3,
    /*
     * Variable: debugStrokeWidth
     *
     * Description:
     *
     * The stroke width if you draw physics debug information
     *
     * Default:
     *
     * 2
     */
    debugStrokeWidth: 2,

    /*
     * Function: toScreen
     *
     * Description:
     *
     * Calculates a physics coordinate or size to the screen coordinate or size
     *
     * Parameters:
     *
     * v - the physics value
     *
     * Examples:
     *
     * > var physPos = myActor.body.GetPosition();
     * > var screenX = gamvas.physics.toScreen(physPos.x);
     */
    toScreen: function(v) {
        return v*gamvas.physics.pixelsPerMeter;
    },

    /*
     * Function: toWorld
     *
     * Description:
     *
     * Calculates a screen coordinate or size to a coordinate or size in the physics world
     *
     * Parameters:
     *
     * v - the screen value
     *
     * Examples:
     *
     * > var startPos = new gamvas.Vector2D(640, 480);
     * > myActor.body.SetPosition(
     * >    new Box2D.Common.Math.b2Vec2(
     * >       gamvas.physics.toWorld(startPos.x),
     * >       gamvas.physics.toWorld(startPos.y)
     * >    )
     * > );
     */
    toWorld: function(v) {
        return v/gamvas.physics.pixelsPerMeter;
    },

    _debugDrawer: null,
    /*
     * Function: drawDebug
     *
     * Description:
     *
     * Draw the physics debug information. Should be used after all objects are drawn.
     * This is a reduced debug
     * information with simpler handling then the Box2D version, you
     * still can use the Box2D way though.
     *
     * Example:
     *
     * > myState = gamvas.State.extend({
     * >     draw: function(t) {
     * >         this.drawAllObjects(t);
     * >         gamvas.physics.drawDebug();
     * >     }
     * > });
     */
    drawDebug: function() {
        if (this._debugDrawer === null) {
            this._debugDrawer = new Box2D.Dynamics.b2DebugDraw();
            this._debugDrawer.SetSprite(gamvas.getContext2D());
            this._debugDrawer.SetDrawScale(gamvas.physics.pixelsPerMeter);
            this._debugDrawer.SetFillAlpha(gamvas.physics.debugAlpha);
            this._debugDrawer.SetLineThickness(gamvas.physics.debugStrokeWidth);
            this._debugDrawer.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
            this._debugDrawer.m_sprite.graphics.clear = function() {};
            gamvas.physics.getWorld().SetDebugDraw(this._debugDrawer);
        }
        var c = gamvas.getContext2D();
        c.save();
        this.getWorld().DrawDebugData();
        c.restore();
    },

    /*
     * Function: setGravity
     *
     * Description:
     *
     * Sets the physics worlds gravity to a <gamvas.Vector2D>
     *
     * Example:
     *
     * myState = gamvas.State.extend({
     *     draw: function(t) {
     *         // ajust gravity to camera rotation
     *         var rot = this.camera.rotation;
     *         var vec = new gamvas.Vector2D(0. 9.8);
     *         gamvas.physics.setGravity(vec.rotate(-r));
     *     }
     * });
     */
    setGravity: function(vec) {
        var world = gamvas.physics.getWorld();
        if (gamvas.isSet(world)) {
            world.SetGravity(new Box2D.Common.Math.b2Vec2(vec.x, vec.y));
        }
    },

    /*
     * Function: resetWorld
     *
     * Description:
     *
     * Resets the physics world
     *
     * Parameters:
     *
     * gravx - the gravity in x direction (meters per second) (optional, default 0)
     * gravy - the gravity in y direction (meters per second) (optional, default 9.8)
     * slp - enable sleeping (optional, default true)
     * listener - a Box2D.Dynamics.b2ContactListener (optional)
     *
     * When sleeping is enabled, objects that have not moved for a while fall into a
     * sleep state so they are not simulated until a collider hits them.
     *
     * If no listener is specified (recommende) a default listener is installed, that
     * handles the actor collision. Usually this should be enough for almost any
     * purpose, but if you are a total Box2D guru, you might use a own listener
     *
     *
     * Note:
     *
     * Box2D and Gamvas differ in how the y coordinte is handled. While Box2D
     * tries to resemble real world sitation where a positive y coordinte would
     * go upward, gamvas is a 2D raster graphics game engine, where a positive y
     * coordinate would go downward.
     *
     * This leaves two special things that you should know.
     *
     * A) While in real world, gravity is roughly -9.8 (negative) meters per second, in gamvas
     * the default gravity is +9.8 (positive) to make objects fall down
     *
     * B) While Box2D asks you to use counter clock wise (CCW) polygons, in gamvas
     * you have to specify clock wise polygons
     *
     * Example:
     *
     * Start with a new empty world with default settings
     *
     * > gamvas.resetWorld();
     */
    resetWorld: function(gravx, gravy, slp, listener) {
        var doSleep = ( (gamvas.isSet(slp)) && (slp) ) ? true : slp;
        var gx = (gamvas.isSet(gravx)) ? gravx : 0;
        var gy = (gamvas.isSet(gravy)) ? gravy : 9.8;
        if (gamvas.config.worldPerState) {
            var cs = gamvas.state.getCurrentState();
            cs._doSleep = doSleep;
            cs._world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(gx, gy), doSleep);
        } else {
            gamvas._doSleep = doSleep;
            gamvas._world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(gx, gy), doSleep);
        }
        this._debugDrawer = null;
        var l = (gamvas.isSet(listener)) ? listener : new gamvas.physics.ContactListener();
        var w = gamvas.physics.getWorld();
        w.SetContactListener(l);
    },

    /*
     * Function: getWorld
     *
     * Description:
     *
     * Get the Box2D world object
     *
     * Returns:
     *
     * The Box2D world object
     *
     * See:
     *
     * https://code.google.com/p/box2dweb/
     *
     * http://www.box2d.org/
     */
    getWorld: function() {
        if (gamvas.config.worldPerState) {
            var cs = gamvas.state.getCurrentState();
            return cs._world;
        } else {
            return gamvas._world;
        }
    }
};
