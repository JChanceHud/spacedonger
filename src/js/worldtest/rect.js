// couldn't figure out how to override gamvas.Rect, so I made my own
// however gamvas.Rect only has x, y, width & height, so no harm not using it
function rect(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	var st = gamvas.state.getCurrentState();
	this.loc = st.camera.toWorld(this.x*st.nodeSize, this.y*st.nodeSize);
	
	this.move = move;
	function move(gridNode) {
		var st = gamvas.state.getCurrentState();
		this.x = gridNode.position.x;
		this.y = gridNode.position.y;
		this.loc = st.camera.toWorld(this.x*st.nodeSize, this.y*st.nodeSize);
	}
	
	this.equals = equals;
	function equals(r) {
		if (this === r) {
			return true;
		} else if (!r) {
			return false;
		} else if (r.x === undefined || r.y === undefined ||
			r.width === undefined || r.height === undefined) {
			return false;
		}
		return (this.x === r.x && this.y === r.y &&
			this.width === r.width && this.height === r.height);
	}
	
	this.clone = clone;
	function clone() {
		return new rect(this.x, this.y, this.width, this.height);
	}
}