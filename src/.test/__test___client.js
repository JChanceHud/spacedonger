window.onload = function()
{
	setup();
};

function setup(){
	window.socket = io.connect(ip);
	window.socket.on('connected', function (id) {
		console.log("connected");
		window.socket.id = id;
	});
	window.addEventListener("beforeunload", function(e){
		window.socket.emit("disconnect", null);
	}, false);
	window.socket.on('message', function (obj) {
		var chatlist = document.getElementById("chatlist");
		if(obj.message == "/clear"){
			if(obj.id === window.socket.id)
				chatlist.innerHTML = "";
		}
		else
			chatlist.innerHTML = chatlist.innerHTML+obj.id+": "+obj.message+'<br />';
	});
}

function sendMessage(form){
	var obj = new Object();
	var message = form.message.value;
	obj.message = message;
	window.socket.emit("sentMessage", obj);
	form.message.value = "";
}

