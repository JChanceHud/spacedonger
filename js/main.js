// main.js
//

gamvas.event.addOnLoad(function() {
    //here we can load a main menu or something else if necesary
    gamvas.socket = io.connect(ip);
    gamvas.state.addState(new gameState());
    gamvas.state.addState(new lobbyState());
    gamvas.state.setState(gamvas.state.getState("lobbyState"));
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

