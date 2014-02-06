var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket){
	socket.emit('connected', socket.id);
	socket.on('updatePosition', function (position) {
		socket.position = position;
		broadcastPositions();
	});
});

function broadcastPositions(){
	var broadcastArr = new Array();
	for (var x in io.sockets.sockets){
		broadcastArr.push(new PositionObject(io.sockets.sockets[x].id, io.sockets.sockets[x].position));
	}
	io.sockets.volatile.emit('update', broadcastArr);
}

function PositionObject(id, position){
	this.id = id;
	this.position = position;
}

io.sockets.on('disconnect', function (socket){
	
});

