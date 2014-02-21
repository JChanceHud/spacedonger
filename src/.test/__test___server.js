var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket){
	socket.emit('connected', socket.id);
	socket.on('disconnect', function(arg) {
		console.log('disconnect');
	});
	/*
	socket.on('receivedMessage', function(data){
		//do something with data
		//emit another message to all sockets
		io.sockets.emit('response', response);
	});
	*/
});


