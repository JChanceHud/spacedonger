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

loadScript("../js/worldtest/rect.js",
	loadScript("../js/worldtest/wall.js",
		loadScript("../js/worldtest/door.js",
			loadScript("../js/worldtest/unit.js",
				loadScript("../js/worldtest/mainState.js",
					start
				)
			)
		)
	)
);