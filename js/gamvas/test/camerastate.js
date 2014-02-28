camState = gamvas.State.extend({
	init: function() {
	    this.camera.setPosition(400,300);
	},

	draw: function(t) {
	    this.camera.move(10*t, 0);
	    this.camera.rotate(0.5*Math.PI*t);
	    // this.camera.zoom(-0.1*t);

	    this.c.fillStyle = 'rgba(255, 0, 0, 0.2)';
	    this.c.fillRect(10, 10, 300, 500);
	    this.c.fillRect(400, 200, 200, 200);
	    this.c.fillRect(100, 300, 600, 200);

	},

	postDraw: function(t) {
	    this.c.fillStyle = '#fff';
	    this.c.font = 'bold 20px sans-serif';
	    this.c.textAlign = 'right';
	    this.c.fillText("Fps: "+gamvas.screen.getFPS(), this.dimension.w - 20, 30);
	    this.c.fillText("Space to switch to next state", this.dimension.w - 20, 580);
	},

	onKeyUp: function(keyCode, character) {
	    if (keyCode == gamvas.key.SPACE) {
            gamvas.state.setState('physState');
	    }
	},

	onMouseMove: function(x, y) {
	    this.camera.setZoom(y/600*2);
	}
});
