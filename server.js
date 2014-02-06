var io = require('socket.io').listen(8080);

var broadcastObj = {};

io.sockets.on('connection', function (socket){
	socket.emit('connected', socket.id);
	socket.on('updatePosition', function (position) {
		broadcastObj[socket.id] = position;
		broadcastPositions();
	});
});

function broadcastPositions(){
	io.sockets.volatile.emit('update', broadcastObj);
}

io.sockets.on('disconnect', function (socket){
	
});

