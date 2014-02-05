gamvas.event.addOnLoad(function() {
	gamvas.state.addState(new testState('teststate'));
	gamvas.start('gameCanvas');
});

testState = gamvas.State.extend({
	draw: function(t) {
		this.c.fillStyle = '#fff';
		this.c.fillText("test text", 0, 0);
	}
});
