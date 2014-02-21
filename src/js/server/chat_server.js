var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket){
	socket.emit('connected', socket.id);
	socket.on('disconnect', function(arg) {
		console.log('disconnect');
	});
	socket.on('sentMessage', function (message) {
		message.id = socket.id;
		io.sockets.emit('message', message);
	});
});


