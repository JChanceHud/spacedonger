// main.js
//

gamvas.event.addOnLoad(function() {
    //here we can load a main menu or something else if necesary
    gamvas.socket = io.connect(ip);
    gamvas.socket.updateInterval = 0.1;
    gamvas.state.addState(new lobbyState("lobbyState"));
    gamvas.state.addState(new gameState("gameState"));
    gamvas.start("gameCanvas");
    gamvas.getCanvas().width = window.innerWidth;
    gamvas.getCanvas().height = window.innerHeight;
    window.onresize = function(){
        gamvas.getCanvas().width = window.innerWidth;
        gamvas.getCanvas().height = window.innerHeight;
    };
});

function loadFile(file){
    var fileRef = document.createElement('script');
    fileRef.src = file;
    document.getElementsByTagName('head')[0].appendChild(fileRef);
}

