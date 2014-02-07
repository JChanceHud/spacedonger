var io = require('socket.io').listen(8080);

var broadcastObj = {};
var newBroadcastObj = new Array();

var lastUpdate = 0;

io.sockets.on('connection', function (socket){
	socket.emit('connected', socket.id);
	socket.on('updatePosition', function (position) {
		broadcastObj[socket.id] = position;
		var time = new Date().getTime();
		if(time-lastUpdate > 33){
			lastUpdate = time;
			io.sockets.emit('update', broadcastObj);
		}
	});
});

io.sockets.on('disconnect', function (socket){
	broadcastObj[socket.id] = null;
});

