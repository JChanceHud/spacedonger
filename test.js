gamvas.event.addOnLoad(function() {
	gamvas.state.addState(new testState('teststate'));
	gamvas.start('gameCanvas');
});

testState = gamvas.State.extend({
	init: function () {
		this.socket = io.connect('http://localhost:8080');
		this.socket.on('connected', function (id) {
			this.socketID = id;
		});
		var p = new Array();
		this.players = p;
		this.socket.on('update', function (updateArr) {
			if(updateArr.length-1 != p.length){
				if(updateArr.length-1 > p.length){
					for(var x=p.length; x<updateArr.length-1; x++){
						p.push(new testActor('player', 0,0));
					}
				}
				else{
					p.splice(updateArr.length-1, p.length-updateArr.length-1);
				}
			}
			var c = 0;
			for(var x in updateArr){
				if(updateArr[x].id != this.socketID){
					p[c].position = updateArr[x].position;
					c++;
				}
			}
		});
		
		this.mainActor = new testActor('main', 0,0);
	},
	onMouseMove: function (x, y) {
		var worldMouse = this.camera.toWorld(x,y);
		this.mainActor.position = new gamvas.Vector2D(worldMouse.x-this.mainActor.width/2.0, worldMouse.y-this.mainActor.height/2.0);
		this.socket.emit('updatePosition',this.mainActor.position); 
	},
	draw: function(t) {
		for(var x in this.players){
			this.players[x].draw(t);
		}
		this.mainActor.draw(t);
	}
});

testActor = gamvas.Actor.extend({
	create: function (name, x, y) {
		this._super(name, x, y);
		var st = gamvas.state.getCurrentState();
		this.width = 128;
		this.height = 128;
		this.setFile(st.resource.getImage('res/sprite.png'), 128,128,1,1);
	}
});
