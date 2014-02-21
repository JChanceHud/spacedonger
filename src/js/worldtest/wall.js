wall = gamvas.Actor.extend({
	create: function(name, x, y) {
		this.x = x;
		this.y = y;
		
		// set up reference to mainState
		var st = gamvas.state.getCurrentState();
		// recalculate x and y to actual pixel locations (originally grid coordinates)
		var loc = st.camera.toWorld(this.x*st.nodeSize, this.y*st.nodeSize);
		
		// call super constructor
		this._super(name, loc.x, loc.y);
		
		// set width and height of unit (probably will be a standard number, like 64x64)
		this.size = 64;
		this.hitBox = new rect(x, y, this.size, this.size);
		
		// set sprite file
		this.setFile(st.resource.getImage('../res/wall.png'));
	}
});