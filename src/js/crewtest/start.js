var start = function() {
	gamvas.event.addOnLoad(function() {
		gamvas.state.addState(new mainState());
		gamvas.start("gameCanvas");
	});
}

var loadScript = function(url, callback) {
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;
	
	script.onreadystatechange = callback;
	script.onload = callback;
	
	head.appendChild(script);
}

loadScript("../js/crewtest/mainState.js", null);
loadScript("../js/crewtest/rect.js", null);
loadScript("../js/crewtest/unit.js", null);
loadScript("../js/crewtest/wall.js", null);
loadScript("../js/crewtest/door.js", start);