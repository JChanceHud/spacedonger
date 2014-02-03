myEmitter = gamvas.ParticleEmitter.extend({
	onParticleEnd: function(pos, rot, sc, vel) {
	}
});

mouseState = gamvas.State.extend({
	init: function() {
        var teststate = gamvas.state.getState('camState');
        if (teststate) {
            console.log("found camState");
        } else {
            console.log("did not find camState");
        }
        gamvas.physics.pixelsPerMeter = 64;
		this.remove = 0;
		this.playerName = "unnamed";
		this.img = new gamvas.Image(this.resource.getImage('example.png'), 0, 0, 320, 320);
		this.img.setClipRect(160, 160, 320, 320);
		this.img.position.x = 260;
		this.img.position.y = 260;
		gamvas.physics.resetWorld();
		this.camera.setPosition(400,300);
		this.emitter = new myEmitter('emitter', 320, 200, new gamvas.Image(this.resource.getImage('triangle.png'), 0, 0, 32, 60));
		this.emitter.setAnimation(new gamvas.Animation('particles', this.resource.getImage('example.png'), 64, 64, 100, 60));
		this.emitter.partRate = 30;
		this.emitter.setAlphaTable([ [0.0, 0.1], [0.1, 0.5], [0.95, 0.8], [1.0, 0.0] ]);
		this.emitter.setScaleTable([ [0.0, 0.0], [1.0, 1.0] ]);
		// this.emitter.setSpeedScaleTable([ [0, 0.0, 0.0], [20, 0.9, 0.1], [150, 0.1, 2.9] ]);
		this.emitter.gravity.y = 0;
		this.emitter.animLifeTime = true;
		this.emitter.partAlign = true;
		this.emitter.partAlignSize = 50;
		this.emitter.rotRange = 2*Math.PI;
		this.emitter.partRotRange = 2*Math.PI;
		this.emitter.partSpeed = 150;
		this.emitter.partDamp = 0.3;
		this.emitter.partSpeedRange = 10;
		this.emitter.partScale = 0.7;
		this.emitter.partScaleRange = 0.5;
		this.emitter.partRotVel = 0;
		this.emitter.setRotation(0.5*Math.PI);
		// this.emitter.partRotVelRange = 0.25*Math.PI;
		// this.emitter.partDamp = 0.7;
		this.actor = new gamvas.Actor('numberCounter');
		this.actor.center.x = 32;
		this.actor.center.y = 32;
		this.actor.setFile(this.resource.getImage('example.png'), 64, 64);
		this.actor.setFrameList([0, 1, 2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 4, 4, 4, 3, 3, 2, 1]);
		this.actor.setFPS(30);
		this.actor.addAnimation(new gamvas.Animation('faster', this.resource.getImage('example.png'), 64, 64, 100, 50));
		var s1 = this.actor.getCurrentState();
		s1.enter = function() {
			this.actor.setAnimation('default');
		};
		var s2 = gamvas.ActorState.extend({
			enter: function() {
				this.actor.setAnimation('faster');
			}
		});
		this.actor.addState(new s2('faster'));

		this.ground = new gamvas.Actor('ground');
		this.ground.setFile(this.resource.getImage('example.png'), 64, 64, 100, 50);
		this.ground.bodyRect(100, 500, 500, 64, Box2D.Dynamics.b2Body.b2_staticBody);
		// handle center special because graphic does not match
		// rectangle and is only temporary
		this.ground.center.x = 0;
		this.ground.center.y = 32;
		this.ground.setRotation(0.3);

		this.ground2 = new gamvas.Actor('ground2');
		this.ground2.setFile(this.resource.getImage('example.png'), 64, 64, 100, 50);
		this.ground2.bodyRect(450, 500, 500, 64, Box2D.Dynamics.b2Body.b2_staticBody);
		// handle center special because graphic does not match
		// rectangle and is only temporary
		this.ground2.center.x = 0;
		this.ground2.center.y = 32;
		this.ground2.setRotation(-0.3);

		this.physActor = new gamvas.Actor('physBall');
		this.physActor.setFile(this.resource.getImage('example.png'), 64, 64, 100, 10);
		this.physActor.restitution = 0.6;
		this.physActor.bodyCircle(40, 0, 32);
		this.physActor.setFixedRotation(true);
		// this.physActor.bodyCircle(150, 0, 32);
		this.physActor.setRotation(3.14);

		var state = new gamvas.ActorState('standard');
		state.onCollision = function(a, ni) {
			console.log('outch! '+a.name+' hit me with force '+ni);
		};
		state.doCollide = function(a) {
			if (a.name == 'physBall2') {
				return false;
			}
			return true;
		};
		this.physActor.addState(state, true);

		this.physActor2 = new gamvas.Actor('physBall2');
		this.physActor2.setFile(this.resource.getImage('triangle.png'));
		this.physActor2.bodyPolygon(150, 0, [[32,0], [64,64], [0,64]], 32, 32);
		this.physActor2.setRotation(-0.2);

		this.physActor2.onMouseMove = function(x, y) {
			// console.log("mouse move "+x+"/"+y);
			var s = gamvas.state.getCurrentState();
			var rp = s.camera.toWorld(x, y);
			// console.log(rp.x+','+rp.y);
		};

		this.physActor.layer = 2;
		this.physActor2.layer = 0;
		this.addActor(this.physActor);
		this.addActor(this.physActor2);
		this.registerInputEvents(this.physActor2);

		this.testSound = this.addSound("intro.wav");
	},

		enter: function() {
            gamvas.physics.pixelsPerMeter = 64;
			this.physActor.resetForces(150, 0, 3.14);
			this.physActor2.resetForces(150, 0, -0.2);
		},

		leave: function() {
			console.log('removing');
			this.removeActor('physBall2');
		},

		draw: function(t) {
			var mp = gamvas.mouse.getPosition();

			this.c.fillStyle = '#fff';
			this.c.font = 'bold 20px sans-serif';
			this.c.textAlign = 'right';
			this.c.fillText("Fps: "+gamvas.screen.getFPS(), this.dimension.w - 20, 30);
			// console.log(this.resource.done()+'/'+this.resource.status()+' '+this.resource._toLoad+'/'+this.resource._loaded);
			if (this.resource.done()) {
				this.actor.setPosition(mp.x, mp.y);
				this.actor.rotate(0.5*Math.PI*t);
				this.actor.draw(t);
				// this.physActor.draw(t);
				// this.physActor2.draw(t);
				this.ground.draw(t);
				this.ground2.draw(t);
				gamvas.physics.drawDebug();
			} else {
				this.c.fillStyle = '#fff';
				this.c.fillText("loading "+this.resource.status(), 640, 20);
			}

			this.c.fillStyle = '#fff';
			if (gamvas.mouse.isPressed(gamvas.mouse.LEFT)) {
				this.c.fillText("Left mouse button is pressed", this.dimension.w - 20, 80);
			} else {
				this.c.fillText("Left mouse button is not pressed", this.dimension.w - 20, 80);
			}
			if (gamvas.mouse.isPressed(gamvas.mouse.MIDDLE)) {
				this.c.fillText("Middle mouse button is pressed", this.dimension.w - 20, 100);
			} else {
				this.c.fillText("Middle mouse button is not pressed", this.dimension.w - 20, 100);
			}
			if (gamvas.mouse.isPressed(gamvas.mouse.RIGHT)) {
				this.c.fillText("Right mouse button is pressed", this.dimension.w - 20, 120);
			} else {
				this.c.fillText("Right mouse button is not pressed", this.dimension.w - 20, 120);
			}
			this.c.fillText("Space to switch to next state "+this.playerName, this.dimension.w - 20, 580);
			/* this.emitter.draw(t);
			   this.emitter.rotate(0.1*Math.PI*t); */
			/* this.img.draw(t);
			   this.img.rotate(1.0*t);
			   var r = this.img.getClipRect();
			   this.img.setClipRect(r.x+(10*t), r.y, r.width, r.height); */
		},

		onKeyUp: function(keyCode, character) {
			if (keyCode == gamvas.key.SPACE) {
				gamvas.state.setState('camState');
			} else if (keyCode == gamvas.key.N) {
				var d = document.getElementById('dialog');
				d.style.display = 'block';
			} else if (keyCode == gamvas.key.UP) {
				this.actor.setState('faster');
			} else if (keyCode == gamvas.key.DOWN) {
				this.actor.setState('default');
			} else if (keyCode == gamvas.key.RIGHT) {
				// this.testSound.play();
				this.actor.setState('default');
			}
		},

		onMouseDown: function(button, mx, my) {
			/* switch (this.remove) {
			   case 1:
			   console.log('rem physball2');
			   this.removeActor('physBall');
			   break;
			   default:
			   console.log('rem physball');
			   this.removeActor('physBall2');
			   break;
			   }
			   this.remove++; */

			return gamvas.mouse.exitEvent();
		},

        onTouchMove: function(id, x, y) {
            console.log(id+': '+x+', '+y);
        },

		playerNameButtonPressed: function() {
			var n = document.getElementById('playername');
			this.playerName = n.value;
			var d = document.getElementById('dialog');
			d.style.display = 'none';
		}
});

/* myBalls = function(myName, myX, myY, st) {
   gamvas.Actor(myName, myX, myY);

   this.setFile(st.resource.getImage('example.png'), 64, 64, 100, 10);
   this.restitution = 0.6;
   this.bodyCircle(myX, myY, 32);
   this.setRotation(3.14);

   var state = new gamvas.ActorState('standard');
   state.onCollision = function(a, ni) {
   console.log('outch! '+a.name+' hit me ('+this.actor.name+') with force '+ni);
   };
   state.doCollide = function(a) {
   if (a.name == 'physBall2') {
   return false;
   }
   return true;
   };
   this.addState(state, true);
   };
   myBalls.prototype = new gamvas.Actor; */

