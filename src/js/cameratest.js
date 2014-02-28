// Created by Chance Hudson
// jchancehud@gmail.com
//
//
//Move with the arrow keys
//Zoom in and out with + and -
//Rotate with , and .

gamvas.event.addOnLoad(function() {
    gamvas.state.addState(new mainState());
    gamvas.start("gameCanvas");
});

mainState = gamvas.State.extend({
    init: function(){
        this.size = gamvas.getCanvasDimension();
        this.world = new World(5, 200, 200);
        this.world.generateRandomTileColors();
        this.world.draw(this);
        this.camera.position.x = this.size.w/2.0; //set the camera so that we can draw with 0,0 at the upper left corner
        this.camera.position.y = this.size.h/2.0;
        this.camera.moveVelocity = 150.0; //how many pixels to move per second
        this.camera.zoomRate = 1.0;
        this.camera.rotationRate = 8.0;
        this.pressedKeys = [];
    },
    onKeyDown: function(keyCode, character, ev){
        // arrow key up is 38
        // down is 40
        // left is 37
        // right is 39
        // minus is 189
        // equal is 187
        //console.log(keyCode);
        if(this.pressedKeys.indexOf(keyCode) == -1){
            this.pressedKeys.push(keyCode);
        }
    },
    onKeyUp: function(keyCode, character, ev){
        //remove all instances of keycode that might be in the array
        this.pressedKeys.splice(this.pressedKeys.indexOf(keyCode), 1);
    },
    preDraw: function(t){
        //move the camera if necessary
        var cameraDeltaX = 0;
        var cameraDeltaY = 0;
        var newCameraZoom = this.camera.zoomFactor;
        var delta = this.camera.moveVelocity*t;
        var zoomDelta = this.camera.zoomRate*t;
        var rotationDelta = 0;
        if(this.pressedKeys.indexOf(38) != -1) //up key
            cameraDeltaY -= delta;
        if(this.pressedKeys.indexOf(40) != -1) //down key
            cameraDeltaY += delta;
        if(this.pressedKeys.indexOf(37) != -1) //left key
            cameraDeltaX -= delta;
        if(this.pressedKeys.indexOf(39) != -1) //right key
            cameraDeltaX += delta;
        if(this.pressedKeys.indexOf(189) != -1) //minus
            newCameraZoom -= zoomDelta;
        if(this.pressedKeys.indexOf(187) != -1) //plus/equal
            newCameraZoom += zoomDelta;
        if(this.pressedKeys.indexOf(188) != -1) //comma
            rotationDelta -= this.camera.rotationRate*t;
        if(this.pressedKeys.indexOf(190) != -1) //period
            rotationDelta += this.camera.rotationRate*t;
        this.camera.move(cameraDeltaX, cameraDeltaY);
        this.camera.setZoom(clamp(newCameraZoom, 0.01, 25));
        this.camera.rotate(rotationDelta); //the rotation fucks up the movement
    },
    draw: function(t){
        this.c.fillStyle = "#FFF1FF";
        this.c.drawImage(this.world.renderCanvas, 0, 0); //draw the prerendered world
    },
    postDraw: function(t){
        this.c.fillStyle = "#FFFFFF";
        this.c.font = "15px Arial";
        this.c.fillText("Camera pos: "+this.camera.position.x+", "+this.camera.position.y+"  Zoom: "+this.camera.zoomFactor+"  Framerate: "+1.0/t, 2, 15);
    },
    isRectVisible: function(x, y, w, h){
        var screen1 = this.camera.toScreen(x+w, y+h);
        var screen2 = this.camera.toScreen(x, y);
        if(screen1.x < 0 || screen1.y < 0)
            return false;
        if(screen2.x > this.size.w || screen2.y > this.size.h)
            return false;
        return true;
    }
});

//function to load other files

function loadScript(url, callback)
{
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    head.appendChild(script);
}

function clamp(val, min, max){ //clamp a value
    return (val<min)?min:((val>max)?max:val);
}
