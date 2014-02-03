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
 * Class: gamvas.Actor
 *
 * Description:
 *
 * The actor class is the most important class in gamvas. You use it
 * for the player, ai opponents, physics objects, maybe even static objects
 * in your gameworld.
 * It forms a object that can hold animations, physical properties, states, logic
 * and can react to events like keyboard or mouse input or collisions.
 * Actors hold a default animation and a default state, so if you only need one of them,
 * you can use these, see example below.
 *
 * Constructur:
 *
 * new gamvas.Actor(name, x, y);
 *
 * Parameters:
 *
 * name - a unique name in the game world or false to let the name autogenerate
 * x/y - the position of the actors center in the world (optional)
 *
 * See:
 *
 * <gamvas.ActorState>
 * <gamvas.Class>
 * <gamvas.Image>
 *
 * Example:
 *
 * > // extend gamvas.Actor to create a new instancable actor
 * > myActor = gamvas.Actor.extend({
 * >     // the create function is the constructor
 * >     create: function(name, x, y) {
 * >         // call our super class constructor to initialize the actor
 * >         this._super(name, x, y);
 * >         // get our current state to get access to the resource handler
 * >         var st = gamvas.state.getCurrentState();
 * >         // load our animation with 64x64 pixels per frames, 10 frames
 * >         // playing with 20 frames per second
 * >         this.setFile(st.resource.getImage('anim.png'), 64, 64, 10, 20);
 * >         // get default actor state
 * >         var defState = this.myActor.getCurrentState();
 * >         // install brain, move 10 pixels per second to the right
 * >         defState.update = function(t) {
 * >             this.actor.move(10*t, 0);
 * >         };
 * >     }
 * > });
 */
gamvas.Actor = gamvas.Class.extend({
    create: function(name, x, y) {
        /*
         * Variable: name
         *
         * The name of the actor
         */
        this.name = (name) ? name : 'unnamed_'+this.objectID();

        /*
         * Variable: position
         *
         * A <gamvas.Vector2D> object with the position information
         *
         * See:
         *
         * <gamvas.actor.setPosition>
         * <gamvas.actor.move>
         */
        this.position = new gamvas.Vector2D((x)?x:0, (y)?y:0);

        /*
         * Variable: center
         *
         * A <gamvas.Vector2D> object with the center offset of the actor
         *
         * See:
         *
         * <gamvas.actor.setCenter>
         */
        this.center = new gamvas.Vector2D(0, 0);
        this.animations = [];

        /*
         * Variable: currentAnimation
         *
         * The name of the current animation
         */
        this.currentAnimation = null;

        /*
         * Variable: rotation
         *
         * The rotation of the actor
         *
         * See:
         *
         * <gamvas.actor.setRotation>
         * <gamvas.actor.rotate>
         */
        this.rotation = 0;

        /*
         * Variable: scaleFactor
         *
         * The scale factor of the object
         *
         * Note:
         *
         * Scaling actors does not work with physics. Well... scaling does, but
         * the physics collision box will not be scaled.
         */
        this.scaleFactor = 1;

        /*
         * Variable: density
         *
         * The physical property of density.
         * In case of impact, objects with higher density will push objects
         * with lower density away more.
         *
         * Default:
         * 1.0
         */
        this.density = 1.0;

        /*
         * Variable: friction
         *
         * The physical property of friction
         * Defines the friction of objects. A ice ground would have a very
         * low friction, maybe 0.1 or less, while a rubber ground would have
         * a high value, close to 1.0. So if you would push a ball over these
         * grounds, on the low friction ice ground, the ball might slip over
         * where as on the high friction rubber ground it would immediately start
         * to roll.
         *
         * Default:
         * 0.5
         */
        this.friction = 0.5;

        /*
         * Variable: resitution
         *
         * The physical property of resitution (bounce).
         * Defines how bouncy a object is. A value of 1.0 means, that
         * if falling to the ground, the object would jump exactly as
         * high up as it fell down, wile smaller values will give a
         * more natural bouncyness where with every bounce, it would
         * bounce less, until it stops bouncing.
         *
         * Default:
         * 0.3
         */
        this.restitution = 0.3;

        /*
         * Variable: type
         *
         * Allows you to set types to your physics objects to identify
         * them. You could for example use "player", "wall", "opponent",
         * "tree" to identify what type of object you are colliding
         * and react accordingly.
         *
         * Default:
         * empty string
         */
        this.type = "";

        /*
         * Variable: layer
         *
         * Integer value used for z-sorting on automatic draw through <gamvas.State.addActor>
	 *
	 * Note:
	 *
	 * Versions prior 0.8.3 used the layer value in the wrong direction, if you have used
	 * gamvas before this version, see <gamvas.config.reverseLayerOrder>
         *
         * Default:
         * 0
         */
        this.layer = 0;

        /*
         * Variable: usePhysics
         *
         * Delivers true/false if this object has physics enabled.
         * This is meant to be read only, it will be set automatically
         * when creating a physics body.
         *
         * See:
         *
         * <gamvas.Actor.createBody>
         * <gamvas.Actor.bodyRect>
         * <gamvas.Actor.bodyCircle>
         * <gamvas.Actor.bodyPolygon>
         */
        this.usePhysics = false;
        this._isActive = true;

        /*
         * Variable: body
         *
         * The Box2D b2Body, if physics is enabled
         */
        this.body = null;
        this.bodyDef = null;

        /*
         * Variable: fixture
         *
         * The Box2D b2Fixture, if physics is enabled
         */
        this.fixture = null;
        this.fixtureDef = null;

        this.states = [];
        this.currentState = null;

        this.addState(new gamvas.ActorState('default'));
        this.currentState = 'default';

        this.addAnimation(new gamvas.Animation('default'));
        this.currentAnimation = 'default';
        this.init();
    },

    /*
     * Function: init
     *
     * Description
     *
     * Overwrite with code to get executed on actor initialisation
     */
    init: function() {
    },

    /*
     * Function: addState
     *
     * Description:
     *
     * Adds a actor state
     *
     * Parameters:
     *
     * state - a <gamvas.ActorState> object
     * activate - if true, immediately switch to the new state (optional)
     *
     * Example:
     *
     * > myRunningState = gamvas.ActorState.extend({
     * >     update: function(t) {
     * >          this.actor.move(100*t, 0);
     * >     },
     * >     onKeyUp: function(keyCode) {
     * >         if ( (keyCode == gamvas.key.RIGHT) || (keyCode = gamvas.key.LEFT) ) {
     * >             this.actor.setState('walking');
     * >         }
     * >     }
     * > });
     * > myActor = gamvas.Actor.extend({
     * >     create: function(name, x, y) {
     * >         this._super(name, x, y);
     * >         this.addState(new myRunningState('running'));
     * >     }
     * > });
     */
    addState: function(state, activate) {
         this.states[state.name] = state;
         this.states[state.name].actor = this;
         if ( (gamvas.isSet(activate)) && (activate) ) {
             this.setState(state.name);
         }
    },

    /*
     * Function: addAnimation
     *
     * Description:
     *
     * Adds a animation
     *
     * Parameters:
     *
     * anim - a <gamvas.Animation> object
     *
     * Example:
     *
     * > myActor = gamvas.Actor.extend({
     * >     create: function(name, x, y) {
     * >         this._super(name, x, ,y);
     * >         this.addAnimation(
     * >             new gamvas.Animation('running', this.resource.getImage('playerRun.png'), 64, 64, 12, 20)
     * >         );
     * >     }
     * > });
     */
    addAnimation: function(anim) {
        this.animations[anim.name] = anim;
    },

    /*
     * Function: createBody
     *
     * Description:
     *
     * Create a Box2D b2Body object for the actor.
     * This is the most flexible way to create a body, but you
     * have to do the Box2D stuff quite low level
     *
     * Note:
     *
     * This is the low level function to add physics to your object.
     * Unless you are required to for some reason, you would normally
     * not use this function directly, but use <gamvas.Actor.bodyRect>,
     * <gamvas.Actor.bodyCircle> or <gamvas.Actor.bodyPolygon>
     *
     * Parameters:
     *
     * type - the Box2D body type (dynamic/static/...)
     * shape - the Box2D shape for collision detection
     *
     * Types:
     *
     * gamvas.physics.DYNAMIC - A body that moves, collides, etc (<gamvas.physics.DYNAMIC>)
     * gamvas.physics.STATIC - A body that does not move, like ground, walls, etc (<gamvas.physics.STATIC>)
     * gamvas.physics.KINEMATIC - A body that does move, but under player or AI controll (<gamvas.physics.KINEMATIC>)
     *
     * See:
     *
     * <gamvas.Actor.bodyRect>
     * <gamvas.Actor.bodyPolygon>
     * <gamvas.Actor.bodyCircle>
     *
     * Example:
     *
     * > myPlayer = gamvas.Actor.extend({
     * >     create: function(name, x ,y) {
     * >         this._super(name, x, y);
     * >         // create a polygon shape
     * >         var shape = new Box2D.Collision.Shapes.b2PolygonShape;
     * >         // create a box shape with 200 by 100 pixels
     * >         // NOTE: For demonstration only, use gamvas.Actor.bodyRect for this scenario
     * >         shape.SetAsBox(gamvas.physics.toWorld(200), gamvas.physics.toWorld(100));
     * >         // now finally create the body, adds the actor to physics simulation automatically
     * >         this.createBody(gamvas.physics.DYNAMIC, shape);
     * >     }
     * > });
     */
    createBody: function(type, shape) {
        this.bodyDef = new Box2D.Dynamics.b2BodyDef;
        this.bodyDef.type = type;
        this.fixtureDef = new Box2D.Dynamics.b2FixtureDef;
        this.fixtureDef.density = this.density;
        this.fixtureDef.friction = this.friction;
        this.fixtureDef.restitution = this.restitution;
        this.fixtureDef.shape = shape;
        this.body = gamvas.physics.getWorld().CreateBody(this.bodyDef);
        this.body.SetUserData(new gamvas.physics.UserData('actor', this));
        this.fixture = this.body.CreateFixture(this.fixtureDef);
        this.usePhysics = true;
    },

    /*
     * Function: bodyRect
     *
     * Description:
     *
     * make the actor a physics object with a rectangular body shape
     *
     * Parameters:
     *
     * x/y - the position of the body in the physics world
     * width/height - the half dimension of the rectangle, in pixels
     * type - the Box2D body type (See <gamvas.Actor.createBody>) (optional)
     *
     * See:
     * <gamvas.Actor.createBody>
     * <gamvas.Actor.bodyPolygon>
     * <gamvas.Actor.bodyCircle>
     */
    bodyRect: function(x, y, width, height, type) {
        if (!gamvas.isSet(type)) {
            type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        }
        var hw = width/2;
        var hh = height/2;
        var s = new Box2D.Collision.Shapes.b2PolygonShape;
        s.SetAsBox(gamvas.physics.toWorld(hw), gamvas.physics.toWorld(hh));
        this.createBody(type, s);
        this.center.x = hw;
        this.center.y = hh;
        this.setPosition(x, y);
    },

    /*
     * Function: bodyCircle
     *
     * Description:
     *
     * make the actor a physics object with a circle as body shape
     *
     * Parameters:
     *
     * x/y - the position of the body in the physics world
     * radius - the radius of the circle in pixels
     * type - the Box2D body type (See <gamvas.Actor.createBody>) (optional)
     *
     * See:
     * <gamvas.Actor.createBody>
     * <gamvas.Actor.bodyRect>
     * <gamvas.Actor.bodyPolygon>
     */
    bodyCircle: function(x, y, radius, type) {
        if (!gamvas.isSet(type)) {
            type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        }
        var s = new Box2D.Collision.Shapes.b2CircleShape(gamvas.physics.toWorld(radius));
        this.createBody(type, s);
        this.center.x = radius;
        this.center.y = radius;
        this.setPosition(x, y);
    },

    /*
     * Function: bodyPolygon
     *
     * Description:
     *
     * make the actor a physics object with a non rectangular polygon shape
     * If you just need a rectangle, there is a shortcut: <gamvas.actor.bodyRect>
     *
     * Note:
     *
     * Although Box2D documentation requires a counter clock wise (CCW) polygon, gamvas does
     * require you to secify a clock wise polygon, as in the gamvas worl, the y axis
     * represents screen pixels and therefor runs down, whereas Box2D world represents
     * a real life world, where positive values on the y axis run up.
     *
     * Important:
     *
     * Box2D does not collide concave polygons (as in curving inward, like a skateboard
     * ramp), make sure your polygons are convex (as in curving outward, like a hexagon).
     *
     * Parameters:
     *
     * x/y - the position of the body in the physics world
     * polys - a array holding arrays of the pixel coordinates of the vertices
     * cx/cy - the center of the polygon object (optional)
     * type - the Box2D body type (See <gamvas.Actor.createBody>) (optional)
     *
     * See:
     * <gamvas.Actor.createBody>
     * <gamvas.Actor.bodyRect>
     * <gamvas.Actor.bodyCircle>
     *
     * Example:
     *
     * Create a triangle object with a image of the size 64 by 64 pixels with the center in the middle, at screen position 200, 50
     *
     * > this.bodyPolygon(200, 50, [ [32, 0], [64, 64], [0, 64] ], 32, 32);
     */
    bodyPolygon: function(x, y, polys, cx, cy, type) {
        if (!gamvas.isSet(type)) {
            type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        }
        var s = new Box2D.Collision.Shapes.b2PolygonShape;
        var v = [];
        for (var i = 0; i < polys.length; i++) {
            if ( (polys[i].length>1) ) {
                v.push(new Box2D.Common.Math.b2Vec2(gamvas.physics.toWorld(polys[i][0]-cx), gamvas.physics.toWorld(polys[i][1]-cy)));
            }
        }

        s.SetAsArray(v, v.length);
        this.createBody(type, s);
        this.setCenter(cx, cy);
        this.setPosition(x, y);
    },

    updatePhysics: function() {
        var pos = this.body.GetPosition();
        this.position.x = pos.x * gamvas.physics.pixelsPerMeter;
        this.position.y = pos.y * gamvas.physics.pixelsPerMeter;
        this.rotation = this.body.GetAngle();
    },

    /*
     * Function: resetForces
     *
     * Description:
     *
     * Resets all physical forces on the actor
     *
     * When called without parameter, it just stops rotation and movement.
     * With the optional parameters, you can fully reset the actor to
     * its starting position/rotation
     *
     * Parameters:
     * x/y - The position to set the actor to (optional)
     * r - The rotation to set the actor to (in radians)
     */
    resetForces: function(x, y, r) {
        this.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0, 0));
        this.body.SetAngularVelocity(0);
        if ( (typeof x != 'undefined') && (typeof y != 'undefined') ) {
            this.setPosition(x, y);
            if (typeof r != 'undefined') {
                this.setRotation(r);
            }
        }
        this.body.SetAwake(true);
    },

    /*
     * Function: setBullet
     *
     * Description:
     *
     * Defines if a actor is a physics 'bullet'.
     *
     * A bullet gets increased precision (but slower) collision
     * calculation. Immagine a bullet flying towards a thin piece
     * of metal. In real world, that bullet would hit the metal,
     * no matter what, because the real world is not running in
     * frames per second. The physics simulation on the other
     * hand does, therefor, if the bullet moves very fast, the
     * bullet actually skips through the air, because it traveled
     * a certain amount since the last frame redraw. This can
     * lead to very fast moving objects falling through walles
     * that they would collide when they would move slower, because
     * they skiped a distance larger then this colliding objects
     * width.
     *
     * By setting a actor to a bullet, you can ensure that it always
     * collides, even if it skips that part because of the frame
     * based simulation.
     *
     * Note:
     *
     * This is a expensive operation, only use it on important objects
     * (like e.b. the players spaceship) and only if necessary because
     * your objects falls through stuff that it should collide with
     *
     * Parameters:
     *
     * b - true/false
     *
     * Default:
     *
     * false
     */
    setBullet: function(b) {
        this.body.SetBullet(b);
    },

    /*
     * Function: setSensor
     *
     * Defines if a actor is a physics sensor or not
     *
     * Sensors do recognize collisions, but are not influenced by
     * the collision forces, so will continue moving as there would
     * not be a collision, but there is one.
     *
     * You would use sensors to trigger events, like open a door
     * if the player stands right before it.
     *
     * Parameters:
     *
     * b - true/false
     *
     * Default:
     *
     * false
     */
    setSensor: function(b) {
        this.fixture.SetSensor(b);
    },

    /*
     * Function: setAwake
     *
     * Description:
     *
     * Allows you to wake (or sleep) a actor in the physics simulation
     *
     * Sleeping actors are not considered in the simulation, until
     * something hits them. Then they are automatically switched awake.
     *
     * Parameters:
     *
     * b - true/false
     */
    setAwake: function(b) {
        this.body.SetAwake(b);
    },

    /*
     * Function: setFixedRotation
     *
     * Description:
     *
     * Object does not rotate, when under physics controll
     *
     * Parameters:
     *
     * b - true/false
     *
     * Default:
     *
     * false
     */
    setFixedRotation: function(b) {
        this.body.SetFixedRotation(b);
    },

    /*
     * Function: setName
     *
     * Description:
     *
     * Set the actor name
     *
     * Parameters:
     *
     * name - the actors name, must be unique in the game world
     */
    setName: function(name) {
        this.name = name;
    },

    /*
     * Function: setRotation
     *
     * Description:
     *
     * Set certain rotation of the actor in radians
     *
     * Parameters:
     *
     * r - the rotation in radians
     *
     * See:
     *
     * <gamvas.Actor.rotate>
     * http://en.wikipedia.org/wiki/Radians
     */
    setRotation: function(r) {
        if (this.usePhysics) {
            this.body.SetAngle(r);
        } else {
            this.rotation = r;
        }
    },

    /*
     * Function: rotate
     *
     * Description:
     *
     * Rotate the actor
     *
     * Parameters:
     *
     * r - the amount to rotate the actor in radians
     *
     * See:
     *
     * <gamvas.Actor.setRotation>
     * http://en.wikipedia.org/wiki/Radians
     */
    rotate: function(r) {
        if (this.usePhysics) {
            this.body.SetAngle(this.body.GetAngle()+r);
        } else {
            this.rotation += r;
        }
    },

    /*
     * Function: setPosition
     *
     * Description:
     *
     * Set the position of a actor
     *
     * Parameters:
     *
     * x/y - the position of the actor in pixels
     *
     * See:
     *
     * <gamvas.Actor.move>
     */
    setPosition: function(x, y) {
        if (this.usePhysics) {
            this.body.SetPosition(new Box2D.Common.Math.b2Vec2(x/gamvas.physics.pixelsPerMeter, y/gamvas.physics.pixelsPerMeter));
        } else {
            this.position.x = x;
            this.position.y = y;
        }
    },

    /*
     * Function: move
     *
     * Description:
     *
     * Move the actor
     *
     * Parameters:
     *
     * x/y - the pixels to move the actor
     *
     * See:
     *
     * <gamvas.Actor.setPosition>
     */
    move: function(x, y) {
        if (this.usePhysics) {
            var p = this.body.GetPosition();
            this.body.SetPosition(new Box2D.Common.Math.b2Vec2(p.x+(x/gamvas.physics.pixelsPerMeter), p.y+(y/gamvas.physics.pixelsPerMeter)));
        } else {
            this.position.x += x;
            this.position.y += y;
        }
    },

    /*
     * Function: setScale
     *
     * Description:
     *
     * Set a certain scale factor
     *
     * Note:
     *
     * Do not use scale for objects under physics controll
     * it will work for the image, but not for the collision
     * object
     *
     * Parameters:
     *
     * s - the scale value (1 = no scale, < 1 = smaller, > 1 = bigger)
     *
     * See:
     *
     * <gamvas.Actor.scale>
     */
    setScale: function(s) {
        this.scaleFactor = s;
    },

    /*
     * Function: scale
     *
     * Description:
     *
     * Scale a object
     *
     * Note:
     *
     * Do not use scale for objects under physics controll
     * it will work for the image, but not for the collision
     * object
     *
     * Parameters:
     *
     * s - the scale factor (< 0 = shrink, > 0 = enlarge)
     *
     * See:
     *
     * <gamvas.Actor.setScale>
     */
    scale: function(s) {
        this.scaleFactor += s;
    },

    /*
     * Function: setLinearDamping
     *
     * Description:
     *
     * Sets the linear damping of the physics object.
     *
     * This means, the higher the value, the more will
     * the object be slowed down while simply 'rolling along'
     */
    setLinearDamping: function(d) {
        this.body.SetLinearDamping(d);
    },

    /*
     * Function: setAngularDamping
     *
     * Description:
     *
     * Sets the angular damping of the physics object.
     *
     * A angular damping slows down the rotation of a object
     * over time while no other forces are having impact on it
     */
    setAngularDamping: function(d) {
        this.body.SetAngularDamping(d);
    },

    /*
     * Function: setCenter
     *
     * Description:
     *
     * Set the center for an actor. If you have a round object
     * for example with a size of 64 by 64 pixels and you want
     * to rotate it around the center, you would use
     * myObject.setCenter(32, 32);
     *
     * Parameters:
     *
     * x/y - the center, as seen of the upper left corner of the object
     */
    setCenter: function(x, y) {
        this.center.x = x;
        this.center.y = y;
    },

    /*
     * Function: getCurrentAnimation
     *
     * Description:
     *
     * Get the current <gamvas.Animation> object that is playing
     *
     * Returns:
     *
     * <gamvas.Animation>
     */
    getCurrentAnimation: function() {
        return this.animations[this.currentAnimation];
    },

    /*
     * Function: getCurrentState
     *
     * Description:
     *
     * Get the current <gamvas.ActorState> the actor is in
     *
     * Returns:
     *
     * <gamvas.ActorState>
     */
    getCurrentState: function() {
        return this.states[this.currentState];
    },

    /*
     * Function: setFile
     *
     * Description:
     *
     * Sets a image file for the current animation
     *
     * Parameters:
     *
     * file - a JavaScript Image object holding the animation in tiles
     * frameWidth - the width of a single frame tile of the animation
     * frameHeight - the height of a single frame tile of the animation
     * numberOfFrames - the number of frames in the animation
     * fps - the speed of the animation in frames per second
     *
     * Example:
     *
     * > myActor = gamvas.Actor.extend({
     * >     create: function(name, x, y) {
     * >         this._super(name, x,, y);
     * >         var st = gamvas.state.getCurrentState();
     * >         this.setFile(st.resource.getImage('anim.png'), 64, 64, 10, 20);
     * >     }
     * > });
     */
    setFile: function(file, frameWidth, frameHeight, numberOfFrames, fps) {
        this.getCurrentAnimation().setFile(file, frameWidth, frameHeight, numberOfFrames, fps);
    },

    /*
     * Function: preDraw
     *
     * Description:
     *
     * Gets called after screen clear and before camera handling.
     *
     * Parameters:
     *
     * t - the time since last redraw
     *
     * See:
     *
     * <gamvas.ActorState.update>
     */
    preDraw: function(t) {
        var s = this.getCurrentState();
        if (s) {
            s.preDraw(t);
        }
    },

    /*
     * Function: draw
     *
     * Description:
     *
     * Gets called when the actor is drawn. Usually you would not
     * overwrite this function with your logic, use the <gamvas.ActorState.update>
     * function of either the default state or a custom <gamvas.ActorState>
     *
     * Parameters:
     *
     * t - the time since last redraw
     *
     * See:
     *
     * <gamvas.ActorState.update>
     */
    draw: function(t) {
        var s = this.getCurrentState();
        if (s) {
            s.update(t);
            s.draw(t);
        }
    },

    /*
     * Function: postDraw
     *
     * Description:
     *
     * Gets called after camera handling.
     *
     * Parameters:
     *
     * t - the time since last redraw
     *
     * See:
     *
     * <gamvas.ActorState.update>
     */
    postDraw: function(t) {
        var s = this.getCurrentState();
        if (s) {
            s.postDraw(t);
        }
    },

    /*
     * Function: isActive
     *
     * Description:
     *
     * Check if the actor is active
     *
     * See:
     *
     * <gamvas.Actor.setActive>
     */
    isActive: function() {
        return this._isActive;
    },

    /*
     * Function: setActive
     *
     * Description:
     *
     * Enable or disable the actor for automatic drawing (if in states actors list)
     *
     * See:
     *
     * <gamvas.State.addActor>
     */
    setActive: function(yesno) {
        this._isActive = yesno;
    },

    /*
     * Function: setState
     *
     * Description:
     *
     * Switch the actor to a certain <gamvas.ActorState>
     *
     * Parameters:
     *
     * stateName - the name of the <gamvas.ActorState>
     *
     * See:
     *
     * <gamvas.ActorState>
     */
    setState: function(stateName) {
        if (gamvas.isSet(this.states[stateName])) {
            if (this.currentState !== null) {
                var cur = this.getCurrentState();
                if (cur) {
                    cur.leave();
                }
            }

            var st = this.states[stateName];
            if (!st._isInitialized) {
                st.init();
                st._isInitialized = true;
            }
            st.enter();
            this.currentState = stateName;
        }
    },

    /*
     * Function: setAnimation
     *
     * Description:
     *
     * Switch the actor to a certain <gamvas.Animation>
     *
     * Parameters:
     *
     * a - the name of the <gamvas.Animation>
     *
     * See:
     *
     * <gamvas.Animation>
     */
    setAnimation: function(a) {
        if (gamvas.isSet(this.animations[a])) {
            this.currentAnimation = a;
        }
    },

    onCollision: function(a, ni, ti, c) {
        var cur = this.getCurrentState();
        if (cur) {
            cur.onCollision(a, ni, ti, c);
        }
    },

    onCollisionEnter: function(a, c) {
        var cur = this.getCurrentState();
        if (cur) {
            cur.onCollisionEnter(a, c);
        }
    },

    onCollisionLeave: function(a, c) {
        var cur = this.getCurrentState();
        if (cur) {
            cur.onCollisionLeave(a, c);
        }
    },

    doCollide: function(a, c, om) {
        var cur = this.getCurrentState();
        if (cur) {
            return cur.doCollide(a, c, om);
        }
        return true;
    },

    onKeyDown: function(keyCode, character, ev) {
        var cur = this.getCurrentState();
        if (cur) {
            return cur.onKeyDown(keyCode, character, ev);
        }
        return false;
    },

    onKeyUp: function(keyCode, character, ev) {
        var cur = this.getCurrentState();
        if (cur) {
            return cur.onKeyUp(keyCode, character, ev);
        }
        return false;
    },

    onMouseDown: function(button, x, y, ev) {
        var cur = this.getCurrentState();
        if (cur) {
            return cur.onMouseDown(button, x, y, ev);
        }
        return false;
    },

    onMouseUp: function(button, x, y, ev) {
        var cur = this.getCurrentState();
        if (cur) {
            return cur.onMouseUp(button, x, y, ev);
        }
        return false;
    },

    onMouseMove: function(x, y, ev) {
        var cur = this.getCurrentState();
        if (cur) {
            return cur.onMouseMove(x, y, ev);
        }
        return false;
    },

    onTouchDown: function(id, x, y, ev) {
        var cur = this.getCurrentState();
        if (cur) {
            return cur.onTouchDown(id, x, y, ev);
        }
        return gamvas.mouse.exitEvent();
    },

    onTouchUp: function(id, x, y, ev) {
        var cur = this.getCurrentState();
        if (cur) {
            return cur.onTouchUp(id, x, y, ev);
        }
        return gamvas.mouse.exitEvent();
    },

    onTouchMove: function(id, x, y, ev) {
        var cur = this.getCurrentState();
        if (cur) {
            return cur.onTouchMove(id, x, y, ev);
        }
        return gamvas.mouse.exitEvent();
    },

    /*
     * Function: setFPS
     *
     * Sets the frames per seconds of the current animation
     *
     * See:
     *
     * <gamvas.Animation.setFPS> for more information
     */
    setFPS: function(fps) {
        this.getCurrentAnimation().setFPS(fps);
    },

    /*
     * Function: setFrameList
     *
     * Sets the list of frames of the current animation
     *
     * See:
     *
     * <gamvas.Animation.setFrameList> for more information
     */
    setFrameList: function(fl) {
        this.getCurrentAnimation().setFrameList(fl);
    },

    /*
     * Function: setGroupIndex
     *
     * Description:
     *
     * Set the Box2D filter group index
     *
     * All members of a negative group never collide, or of a positive group
     * always collide
     *
     * Parameters:
     *
     * g - The group index, negative or positive values disable or enable collision
     *
     * Example:
     *
     * Set 4 objects group index, so ncol1 and ncol2 never collide with each other
     * but all other objects collide with everything
     *
     * > this.ncol1.setGroupIndex(-1);
     * > this.ncol2.setGroupIndex(-1);
     * > this.col1.setGroupIndex(1);
     * > this.col2.setGroupIndex(1);
     */
    setGroupIndex: function(g) {
        var fd = null;
        for (f = this.body.GetFixtureList(); f; f = f.m_next) {
            fd = f.GetFilterData();
            fd.groupIndex = g;
            f.SetFilterData(fd);
        }
    },

    /*
     * Function: setCategoryBits
     *
     * Description:
     *
     * Sets the Box2D category bits
     *
     * You can have up to 16 categories for your physics objects
     * like for example player, monster, coins and together with
     * <gamvas.actor.setMaskBits> you can specify which category
     * can collide with which
     *
     * Parameters:
     *
     * b - a bitfield which category the current object belongs
     *
     * See:
     *
     * <gamvas.actor.setMaskBits>
     */
    setCategoryBits: function(b) {
        var fd = null;
        for (f = this.body.GetFixtureList(); f; f = f.m_next) {
            fd = f.GetFilterData();
            fd.categoryBits = b;
            f.SetFilterData(fd);
        }
    },

    /*
     * Function: setMaskBits
     *
     * Description:
     *
     * Sets the Box2D mask bits
     *
     * You can have up to 16 categories for your physics objects.
     * With the mask bits you specify with which category to collide
     * with, whereas 1 means collide, and 0 means ignore collision.
     *
     * Parameters:
     *
     * b - a bitfield which categories to collide with
     *
     * See:
     *
     * <gamvas.actor.setCategoryBits>
     */
    setMaskBits: function(b) {
        var fd = null;
        for (f = this.body.GetFixtureList(); f; f = f.m_next) {
            fd = f.GetFilterData();
            fd.maskBits = b;
            f.SetFilterData(fd);
        }
    },

    getBox2DVectorFromValue: function(t, v) {
        var tpv = null;
        if (v instanceof Box2D.Common.Math.b2Vec2) {
            tpv = v;
        } else if (v instanceof gamvas.Vector2D) {
            tpv = new Box2D.Common.Math.b2Vec2(v.x, v.y);
        } else {
            tpv = t.body.GetWorldCenter();
        }
        return tpv;
    },

    /*
     * Function: addRevoluteJoint
     *
     * Description:
     *
     * Add a Box2D revolute joint between this actor and another
     *
     * Revolute joints are hinge like joints, you can limit their
     * angle and use them as motors.
     *
     * Parameters:
     *
     * t - the target actor
     * tp - the target position, either as b2Vec2D or <gamvas.Vector2D> (optional)
     * params - a list of joint parameters, see below (optional)
     * 
     * Joint Parameters:
     *
     * For detailed description see Box2D manual on http://box2d.org/manual.html
     *
     * lowerAngle - angle in radians
     * upperAngle - angle in radians
     * enableLimit - true/false
     * maxMotorTorque - maximum torque value
     * motorSpeed - current motor speed
     * enableMotor - true/false
     */
    addRevoluteJoint: function(t, tp, params) {
        var jd = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
        var tpv = this.getBox2DVectorFromValue(t, tp);
        jd.Initialize(this.body, t.body, tpv);
        if (gamvas.isSet(params)) {
            for (var i in params) {
                switch (i) {
                case 'upperAngle':
                    jd.upperAngle = params[i];
                    break;
                case 'lowerAngle':
                    jd.lowerAngle = params[i];
                    break;
                case 'enableLimit':
                    jd.enableLimit = params[i];
                    break;
                case 'maxMotorTorque':
                    jd.maxMotorTorque = params[i];
                    break;
                case 'motorSpeed':
                    jd.motorSpeed = params[i];
                    break;
                case 'enableMotor':
                    jd.enableMotor = params[i];
                    break;
                default:
                    break;
                }
            }
        }
        return new gamvas.physics.getWorld().CreateJoint(jd);
    },

    /*
     * Function: addPrismaticJoint
     *
     * Description:
     *
     * Add a Box2D prismatic joint between this actor and another
     *
     * Prismatic joints are joints movable along a axis, similar
     * to springs
     *
     * Parameters:
     *
     * t - the target actor
     * tp - the target position, either as b2Vec2D or <gamvas.Vector2D> (optional)
     * tv - the target vector, aka the direction of the joint, either as b2Vec2D or <gamvas.Vector2D> (optional)
     * params - a list of joint parameters, see below (optional)
     * 
     * Joint Parameters:
     *
     * For detailed description see Box2D manual on http://box2d.org/manual.html
     *
     * upperTranslation - the upper translation limit
     * lowerTranslation - the lower translation limit
     * enableLimit - true/false
     * maxMotorForce - the maximum motor force
     * motorSpeed - the current motor speed
     * enableMotor - true/false
     *
     * Note:
     *
     * upperTranslation and lowerTranslation should allow the value zero
     * between them, because the joint will start with zero. For example:
     * upperTranslation = -0.2 lowerTranslation = 0.3
     */
    addPrismaticJoint: function(t, tp, tv, params) {
        var jd = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
        var tpv = this.getBox2DVectorFromValue(t, tp);
        var tvv = this.getBox2DVectorFromValue(t, tv);
        jd.Initialize(this.body, t.body, tpv, tvv);
        if (gamvas.isSet(params)) {
            for (var i in params) {
                switch (i) {
                case 'upperTranslation':
                    jd.upperTranslation = params[i];
                    break;
                case 'lowerTranslation':
                    jd.lowerTranslation = params[i];
                    break;
                case 'enableLimit':
                    jd.enableLimit = params[i];
                    break;
                case 'maxMotorForce':
                    jd.maxMotorForce = params[i];
                    break;
                case 'motorSpeed':
                    jd.motorSpeed = params[i];
                    break;
                case 'enableMotor':
                    jd.enableMotor = params[i];
                    break;
                default:
                    break;
                }
            }
        }
        return new gamvas.physics.getWorld().CreateJoint(jd);
    }
});
