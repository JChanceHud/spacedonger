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
gamvas.Particle = function(emitter, lifetime) {
    this.e = emitter;
    this.lt = lifetime;

    this.anim = null;
    this.position = new gamvas.Vector2D();
    this.velocity = new gamvas.Vector2D();
    this.life = 0;
    this.rotation = 0;
    this.scale = 1;
    this.rotVel = 0;
    this.dmp = 0;
    this.rotDmp = 0;

    this.update = function(t, gravx, gravy) {
        if (this.rotVel > 0) {
            this.rotVel -= this.rotDmp*t;
            if (this.rotVel <= 0) {
                this.rotDemp = 0;
                this.rotVel = 0;
            }
        } else if (this.rotVel < 0) {
            this.rotVel += this.rotDmp*t;
            if (this.rotVel >= 0) {
                this.rotDemp = 0;
                this.rotVel = 0;
            }
        }
        this.rotation += this.rotVel*t;

        if ( (this.dmp > 0) && (this.velocity.quickLength() > 0) ) {
            this.velocity.x *= 1.0-this.dmp*t;
            if (this.velocity.x === 0) {
                this.velocity.x = 0;
                this.velocity.y = 0;
            } else {
                this.velocity.y *= 1.0-this.dmp*t;
            }
        }
        this.velocity.x += this.e.gravity.x*t;
        this.velocity.y += this.e.gravity.y*t;
        this.position.x += this.velocity.x*t;
        this.position.y += this.velocity.y*t;

        if (this.anim !== null) {
            this.anim.setPosition(this.position.x, this.position.y);
        }
    };

    this.getLife = function() {
        return this.life/this.lt;
    };
};
