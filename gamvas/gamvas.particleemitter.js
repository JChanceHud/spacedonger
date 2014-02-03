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
 * Class: gamvas.ParticleEmitter
 *
 * Description:
 *
 * A particle emitter
 *
 * The particle emitter allows you to achive many special
 * effects like smoke, fire, rain and similar.
 * It can emitt images or animations.
 *
 * The emitter extends the <gamvas.Actor> class and can
 * therefor be added with <gamvas.State.addActor> for
 * automatic drawing
 *
 * Contructor:
 *
 * new gamvas.ParticleEmitter(name, x, y, img, anim);
 *
 * Parameters:
 *
 * name - a unique name
 * x/y - the position of the emitter
 * img - a <gamvas.Image> or <gamvas.Animation> instance
 * anim - true/false, if img is a <gamvas.Animation> instead of <gamvas.Image>
 *
 * Note:
 *
 * The emitter provides a number of function named set{value} with a corresponding
 * set{value}Range function. The range specifies a range of possible values
 * around the non range value. This allows you to bring variance in the particle
 * emission and therefor realism.
 *
 * For example, you could use emitter.setParticleSpeed(150); with
 * emitter.setParticleSpeedRange(50); This would end up with the particles being
 * generated with speeds between 125 to 175 pixels per second.
 *
 * Example:
 *
 * > myEmitter = gamvas.ParticleEmitter.extend({
 * >     onParticleEnd: function(pos, rot, scale, vel) {
 * >         concole.log('rest in peace, particle at '+pos.x+','+pos.y);
 * >     }
 * > });
 * >
 * > myState = gamvas.State.extend({
 * >    init: function() {
 * >       var em = new myEmitter('smoke', 0, 0, new gamvas.Image(this.resource.getImage('smoke.png')));
 * >       em.setParticleRate(20);
 * >       em.setRotationRange(Math.PI*0.1); 
 * >       this.addActor(em);
 * >    },
 * > });
 */
gamvas.ParticleEmitter = gamvas.Actor.extend({
    create: function(name, x, y, img, anim) {
        this._super(name, x, y);
        this._emit = 0;
        this.limit = 0;
        /*
         * Variable: name
         *
         * The name of the particle emitter
         */
        /*
         * Variable: lifetime
         *
         * The time the emitter is running
         */
        this.lifeTime = 0;
        /*
         * Variable: emitted
         *
         * The amount of emitted particles
         */
        this.emitted = 0;
        this.isAnim = (anim) ? anim : false;
        this.animLifeTime = true;
        this.f = (img) ? img : null;
        this.particles = [];
        this.partRate = 10;
        this.partRateRange = 0;
        this.rotRange = Math.PI*0.002;
        this.partAlign = false;
        this.partRot = 0;
        this.partRotRange = 0;
        this.partRotVel = 0;
        this.partRotVelRange = 0;
        this.partScale = 1.0;
        this.partScaleRange = 0;
        this.partSpeed = 20;
        this.partSpeedRange = 0;
        this.partLifeTime = 5;
        this.partLifeTimeRange = 0;
        this.partDamp = 0;
        this.partDampRange = 0;
        this.partRotDamp = 0;
        this.partRotDampRange = 0;
        this.positionRange = new gamvas.Vector2D();
        this.gravity = new gamvas.Vector2D();
        this.st = [ [0.0, 1.0], [1.0, 1.0] ];
        this.spstx = [ [0.0, 1.0], [1000.0, 1.0] ];
        this.spsty = [ [0.0, 1.0], [1000.0, 1.0] ];
        this.at = [ [0.0, 1.0], [1.0, 1.0] ];
        /*
         * Variable: position
         *
         * A <gamvas.Vector2D> object with the position information
         *
         * See:
         *
         * <gamvas.ParticleEmitter.setPosition>
         * <gamvas.ParticleEmitter.move>
         */
        /*
         * Variable: center
         *
         * A <gamvas.Vector2D> object with the center offset of the particle emitter
         *
         * See:
         *
         * <gamvas.ParticleEmitter.setCenter>
         */
        /*
         * Variable: rotation
         *
         * The rotation of the particle emitter
         *
         * See:
         *
         * <gamvas.ParticleEmitter.setRotation>
         * <gamvas.ParticleEmitter.rotate>
         */
        /*
         * Variable: scaleFactor
         *
         * The scale factor of the object
         */
    },

    /*
     * Function: setImage
     *
     * Description:
     *
     * Set a <gamvas.Image> as Particle
     */
    setImage: function(img) {
        this.isAnim = false;
        this.f = img;
    },

    /*
     * Function: setAnimation
     *
     * Description:
     *
     * Set a <gamvas.Animation> as Particle
     */
    setAnimation: function(anim) {
        this.isAnim = true;
        this.f = anim;
    },

    /*
     * Function: setAnimationLifeTime
     *
     * Description:
     *
     * Set if the animation should be played once for the lifetime
     *
     * If set to true, the Animation plays once from start to end
     * until the particle dies, otherwise the animation plays with
     * whatever it has set as FPS
     *
     * Paramters:
     *
     * yesno - true/false, true = play once over lifetime, false = play as specified by FPS
     */
    setAnimationLifeTime: function(yesno) {
        this.animLifeTime = yesno;
    },

    /*
     * Function: setRotation
     *
     * Description:
     *
     * Set the rotation of the nozzle
     *
     * Parameters:
     *
     * r - the rotation in radians
     */
    /*
     * Function: setRotationRange
     *
     * Description:
     *
     * Set the angle around rotation how particles are emitted from the nozzle
     *
     * Parameters:
     *
     * r - the range around the center (half plus, half minus)
     */
    setRotationRange: function(r) {
        this.rotRange = r;
    },

    /*
     * Function: setParticleRate
     *
     * Description:
     *
     * Set the rate the particles are emitted
     *
     * Parameters:
     *
     * r - the rate in particles per second
     */
    setParticleRate: function(r) {
        this.partRate = r;
    },

    /*
     * Function: getParticleRate
     *
     * Description:
     *
     * Get the current particle emission rate
     */
    getParticleRate: function() {
        return this.partRate;
    },

    /*
     * Function: setParticleRateRange
     *
     * Description:
     *
     * Set the rate range particles are emitted
     *
     * Parameters:
     *
     * r - the range around the center (half plus, half minus)
     */
    setParticleRateRange: function(r) {
        this.partRateRange = r;
    },

    /*
     * Function: setParticleLimit
     *
     * Description:
     *
     * Set the maximum number of particles that will be emitted
     *
     * Parameters:
     *
     * l - the particle limit
     */
    setParticleLimit: function(l) {
        this.limit = l;
    },

    /*
     * Function: alignParticleToPath
     *
     * Description:
     *
     * If true, align particle orientation along their movement
     *
     * Parameters:
     *
     * yesno - true/false if to set the particle orientation along its path
     */
    alignParticleToPath: function(yesno) {
        this.partAlign = yesno;
    },

    /*
     * Function: setParticleRotation
     *
     * Description:
     *
     * Set the particles starting rotation
     *
     * Parameters:
     *
     * r - the rotation in radians
     */
    setParticleRotation: function(r) {
        this.partRot = r;
    },

    /*
     * Function: setParticleRotationRange
     *
     * Description:
     *
     * Set the range around particles starting rotation
     *
     * Parameters:
     *
     * r - the range of variance around the particles rotation
     */
    setParticleRotationRange: function(r) {
        this.partRotRange = r;
    },

    /*
     * Function: setParticleRotationVelocity
     *
     * Description:
     *
     * The rotational velocity of created particles
     *
     * Defines how much they continue to rotate while moving
     *
     * Parameters:
     *
     * r - the rotational velocity in radians per second
     */
    setParticleRotationVelocity: function(r) {
        this.partRotVel = r;
    },

    /*
     * Function: setParticleRotationVelocityRange
     *
     * Description:
     *
     * The range of the rotational velocity
     *
     * Parameters:
     *
     * r - the range around the rotational velocity in radians per second
     */
    setParticleRotationVelocityRange: function(r) {
        this.partRotVelRange = r;
    },

    /*
     * Function: setParticleScale
     *
     * Description:
     *
     * Set the scale of newly created particles
     *
     * Parameters:
     *
     * s - the scale factor (1 = original, < 1 = smaller, > 1 = bigger)
     */
    setParticleScale: function(s) {
        this.partScale = s;
    },

    /*
     * Function: setParticleScaleRange
     *
     * Description:
     *
     * Set the range of scale
     *
     * Parameters:
     *
     * s - the range around the scale factor
     */
    setParticleScaleRange: function(s) {
        this.partScaleRange = s;
    },

    /*
     * Function: setParticleSpeed
     *
     * Description:
     *
     * Set the initial speed of created particles
     *
     * Parameters:
     *
     * s - the speed in pixels per second
     */
    setParticleSpeed: function(s) {
        this.partSpeed = s;
    },

    /*
     * Function: setParticleSpeedRange
     *
     * Description:
     *
     * Set the range around the initial speed of created particles
     *
     * Parameters:
     *
     * s - the range around the speed in pixels per second
     */
    setParticleSpeedRange: function(s) {
        this.partSpeedRange = s;
    },
 
    /*
     * Function: setParticleLifeTime
     *
     * Description:
     *
     * Set the lifetime of new particles
     *
     * Parameters:
     *
     * l - the lifetime in seconds
     */
    setParticleLifeTime: function(l) {
        this.partLifeTime = l;
    },

    /*
     * Function: setParticleLifeTimeRange
     *
     * Description:
     *
     * Set the range around the lifetime of new particles
     *
     * Parameters:
     *
     * l - the range around the lifetime in seconds
     */
    setParticleLifeTimeRange: function(l) {
        this.partLifeTimeRange = l;
    },

    /*
     * Function: setParticleVelocityDamping
     *
     * Description:
     *
     * Set how much the velocity is slowed down over time
     *
     * Parameters:
     *
     * v - the damping value, between 0 (none) and 1 (immediate stop)
     */
    setParticleVelocityDamping: function(v) {
        this.partDamp = v;
    },

    /*
     * Function: setParticleVelocityDampingRange
     *
     * Description:
     *
     * Set the range around velocity damping
     *
     * Parameters:
     *
     * v - the velocity damping range
     */
    setParticleVelocityDampingRange: function(v) {
        this.partDampRange = v;
    },

    /*
     * Function: setParticleRotationDamping
     *
     * Description:
     *
     * Set how much the rotation is slowed down over time
     *
     * Parameters:
     *
     * r - the damping value, between 0 (none) and 1 (immediate stop)
     */
    setParticleRotationDamping: function(r) {
        this.partRotDamp = r;
    },

    /*
     * Function: setParticleRotationDampingRange
     *
     * Description:
     *
     * Set range around the rotation damping
     *
     * Parameters:
     *
     * r - the range around the rotation damping
     */
    setParticleRotationDampingRange: function(r) {
        this.partRotDampRange = r;
    },

    /*
     * Function: setParticleStartPositionRange
     *
     * Description:
     *
     * Sets the area where particles are created
     *
     * By default every particle is created exactly at the position of
     * the particle emitter, by setting a start position range, you
     * can define a rectangle where the particles are created
     *
     * Parameters:
     *
     * s - the starting position range as <gamvas.Vector2D>
     */
    setParticleStartPositionRange: function(s) {
        this.positionRange = s;
    },

    /*
     * Function: setGravity
     *
     * Description:
     *
     * Set the gravity that affects the particle emitter
     *
     * Parameters:
     *
     * s - the gravity in pixels per second as <gamvas.Vector2D>
     *
     * Note:
     *
     * Gravity is in pixels per second, other then in real life, if
     * you want your particles to fall down, you specify a positive
     * Y value
     */
    setGravity: function(g) {
        this.gravity = g;
    },

    /*
     * Function: setScaleTable
     *
     * Description:
     *
     * Set the scale over lifetime
     *
     * Parameters:
     *
     * scaleTable - a array with scale factors over the particles lifetime
     *
     * The array has to be made the following way:
     *
     * It has a index (first value) between 0 and 1 where 0 is when the particle is created
     * and 1 is when it is destroyed. You can add values between them feely,
     * but you have to ensure, that there is a 0 and 1 index.
     *
     * The following would be a table that scales from 0 to original size
     * at the half, and then back to 0 at end:
     *
     * > [ [0, 0], [0.5, 1], [1, 0] ]
     *
     * See:
     *
     * <gamvas.ParticleEmitter.setSpeedScaleTable>
     */
    setScaleTable: function(scaleTable) {
        this.st = scaleTable;
    },

    /*
     * Function: setAlphaTable
     *
     * Description:
     *
     * Set the alpha (transparency) over lifetime
     *
     * Parameters:
     *
     * alphaTable - a array with alpha values over the particles lifetime
     *
     * The array has to be made the following way:
     *
     * It has a index (first value) between 0 and 1 where 0 is when the particle is created
     * and 1 is when it is destroyed. You can add values between them feely,
     * but you have to ensure, that there is a 0 and 1 index.
     *
     * The following would be a table that alpha from 0 to original size, then
     * quite early it gets full opacity, and then fades out slowly to the end:
     *
     * > [ [0, 0], [0.1, 1], [1, 0] ]
     */
    setAlphaTable: function(alphaTable) {
        this.at = alphaTable;
    },

    /*
     * Function: setSpeedScaleTable
     *
     * Description:
     *
     * Set the scale depending on particle speed
     *
     * Parameters:
     *
     * spdScaleTable - a array with scale factors for x/y depending on particle speed
     *
     * The array has to be made the following way:
     *
     * It has a index (first value) which is the speed of the particle in pixels per second,
     * you should have at least a speed of 0 and some speed bigger then 0
     *
     * Following the index, there are two values representing the x and y scale factor where
     * 1 is original size, smaller then 1 is smaller and higher then 1 is bigger
     *
     * The following would be a table that scales the particle very small when it is slow, then
     * when moving at medium speed, it scales it to original size, wen moving fast it streches
     * it by reducing the x scale and significantly increasing the y scale.
     *
     * > [ [0, 0.1, 0.1], [30, 1, 1], [100, 0.2, 3] ]
     *
     * Note:
     *
     * This is usually used with <gamvas.ParticleEmitter.alignParticleToPath>, as x and y are regarding to the particles original orientation
     *
     * See:
     *
     * <gamvas.ParticleEmitter.setScaleTable>
     */
    setSpeedScaleTable: function(spdScaleTable) {
        this.spstx = [];
        this.spsty = [];
        for (var i in spdScaleTable) {
            this.spstx.push([spdScaleTable[i][0], spdScaleTable[i][1]]);
            this.spsty.push([spdScaleTable[i][0], spdScaleTable[i][2]]);
        }
    },

    /*
     * Function: draw
     *
     * Description:
     *
     * Draw the particle emitter
     *
     * Paramters:
     *
     * t - the time since last redraw in seconds
     *
     * Note:
     *
     * Particle emitter extends <gamvas.Actor> and therefor can be added
     * via <gamvas.State.addActor> for automatic drawing
     */
    draw: function(t) {
    	this.lifeTime+=t;
        if ( (this.limit === 0) || (this.emitted < this.limit) ) {
            this._emit += t*this.getRandomValue(this.partRate, this.partRateRange);
            if (this._emit > 1) {
                var e = Math.floor(this._emit);
                this._emit -= e;
                for (var i = 0; i < e; i++) {
                    var newp = new gamvas.Particle(this, this.getRandomValue(this.partLifeTime, this.partLifeTimeRange));
                    if (this.isAnim) {
                        newp.anim = new gamvas.Animation(this.name+this.emitted, this.f.sprite, this.f.width, this.f.height, this.f.numberOfFrames);
                        newp.anim.setCenter(this.f.center.x, this.f.center.y);
                        newp.anim.fDur = this.f.fDur;
                    }
                    newp.rotation = this.getRandomValue(this.partRot, this.partRotRange);
                    newp.rotVel = this.getRandomValue(this.partRotVel, this.partRotVelRange);
                    newp.dmp = this.getRandomValue(this.partDamp, this.partDampRange);
                    newp.scale = this.getRandomValue(this.partScale, this.partScaleRange);
                    newp.rotDmp = this.getRandomValue(this.partRotDamp, this.partRotDampRange);
                    newp.position.x = this.getRandomValue(this.position.x, this.positionRange.x);
                    newp.position.y = this.getRandomValue(this.position.y, this.positionRange.y);
                    var r = new gamvas.Vector2D(0, this.getRandomValue(this.partSpeed, this.partSpeedRange));
                    newp.velocity = r.rotate(this.getRandomValue(this.rotation, this.rotRange));
                    this.particles.push(newp);
                    if (this.limit > 0) {
                        this.emitted++;
                        if (this.emitted >= this.limit) {
                            break;
                        }
                    }
                }
            }
        }
        var newparts = [];
        for (var pi = 0; pi < this.particles.length; pi++) {
            var p = this.particles[pi];
            p.life += t;
            if (p.life <= p.lt) {
                p.update(t);
                if (!this.isAnim) {
                    this.f.setPosition(p.position.x, p.position.y);
                }
                var sv = this.getTableValue(this.st, p.getLife());
                if (this.partAlign) {
                    var l = p.velocity.length();
                    var nsx = this.getTableValue(this.spstx, l);
                    var nsy = this.getTableValue(this.spsty, l);
                    if (this.isAnim) {
                        p.anim.setScaleXY(nsx*sv, nsy*sv);
                        p.anim.setRotation(Math.atan2(p.velocity.y, p.velocity.x)+0.5*Math.PI);
                    } else {
                        this.f.setScaleXY(nsx*sv, nsy*sv);
                        this.f.setRotation(Math.atan2(p.velocity.y, p.velocity.x)+0.5*Math.PI);
                    }
                } else {
                    if (this.isAnim) {
                        p.anim.setScale(p.scale*sv);
                        p.anim.setRotation(p.rotation);
                    } else {
                        this.f.setScale(p.scale*sv);
                        this.f.setRotation(p.rotation);
                    }
                }
                this.f.c.globalAlpha = this.getTableValue(this.at, p.getLife());
                if (this.isAnim) {
                    if (this.animLifeTime) {
                        var rest = p.lt-p.life;
                        var restfr = p.anim.numberOfFrames*(1-(p.life/p.lt));
                        p.anim.fDur = rest/restfr;
                        p.anim.draw(t);
                    } else {
                        p.anim.draw(t);
                    }
                } else {
                    this.f.draw(t);
                }

                newparts.push(p);
            } else {
		this.onParticleEnd(p.position, p.rotation, p.scale, p.velocity);
                delete p;
            }
        }
        this.particles = newparts;
        this.f.c.globalAlpha = 1.0;
    },

    getRandomValue: function(base, range) {
        return base+((Math.random()-0.5)*2)*range;
    },

    getTableValue: function(tbl, pos) {
        var last = 0;
        var current = 0;
        var fnd = false;
        for (var i in tbl) {
            if (tbl[i][0] < pos) {
                last = i;
            } else {
                fnd = true;
                current = i;
                break;
            }
        }

        // value too high, get highest
        if (tbl[tbl.length-1][0]<=pos) {
            return tbl[tbl.length-1][1];
        }

        // value not found at all
        if (!fnd) {
            return 1.0;
        }
        var offs = pos-tbl[last][0];
        var rng = tbl[current][0]-tbl[last][0];
        var fct = offs/rng;
        if (tbl[current][1]>tbl[last][1]) {
            var amt = tbl[current][1]-tbl[last][1];
            return tbl[last][1]+amt*fct;
        }
        var amt2 = tbl[last][1]-tbl[current][1];
        return tbl[current][1]+amt2*(1.0-fct);
    },

    /*
     * Function: reset
     *
     * Description:
     *
     * Reset the particle emitter
     *
     * Parameters:
     *
     * kill - true/false if old particles should be destroyed (optional)
     *
     */
    reset: function(kill) {
        this._emit = 0;
        this.lifeTime = 0;
        this.emitted = 0;
        if ( (gamvas.isSet(kill)) && (kill) ) {
            this.particles = [];
        }
    },

    /*
     * Function: onParticleEnd
     *
     * Description:
     *
     * Overwrite this function to do something everytime a particle is removed
     *
     * Parameters:
     *
     * pos - the position of the destroyed particle as <gamvas.Vector2D>
     * rot - the rotation in radians
     * scale - the scale of the particle
     * vel - the velocity of the particle as <gamvas.Vector2D>
     */
    onParticleEnd: function(pos, rot, scale, vel) {
    }

    /*
     * Function: setRotation
     *
     * Description:
     *
     * Set certain rotation of the particle emitter in radians
     *
     * Parameters:
     *
     * r - the rotation in radians
     *
     * See:
     *
     * <gamvas.ParticleEmitter.rotate>
     * http://en.wikipedia.org/wiki/Radians
     */
    /*
     * Function: rotate
     *
     * Description:
     *
     * Rotate the particle emitter
     *
     * Parameters:
     *
     * r - the amount to rotate the particle emitter in radians
     *
     * See:
     *
     * <gamvas.ParticleEmitter.setRotation>
     * http://en.wikipedia.org/wiki/Radians
     */
    /*
     * Function: setPosition
     *
     * Description:
     *
     * Set the position of a particle emitter
     *
     * Parameters:
     *
     * x/y - the position of the particle emitter in pixels
     *
     * See:
     *
     * <gamvas.ParticleEmitter.move>
     */
    /*
     * Function: move
     *
     * Description:
     *
     * Move the particle emitter
     *
     * Parameters:
     *
     * x/y - the pixels to move the particle emitter
     *
     * See:
     *
     * <gamvas.ParticleEmitter.setPosition>
     */
    /*
     * Function: setScale
     *
     * Description:
     *
     * Set a certain scale factor
     *
     * Parameters:
     *
     * s - the scale value (1 = no scale, < 1 = smaller, > 1 = bigger)
     *
     * See:
     *
     * <gamvas.ParticleEmitter.scale>
     */
    /*
     * Function: scale
     *
     * Description:
     *
     * Scale a object
     *
     * Note:
     *
     * Parameters:
     *
     * s - the scale factor (< 0 = shrink, > 0 = enlarge)
     *
     * See:
     *
     * <gamvas.ParticleEmitter.setScale>
     */
});
