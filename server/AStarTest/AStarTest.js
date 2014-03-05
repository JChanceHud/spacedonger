
gamvas.event.addOnLoad(function() {
    gamvas.state.addState(new testState("testState"));
    gamvas.start("gameCanvas");
    gamvas.getCanvas().width = window.innerWidth;
    gamvas.getCanvas().height = window.innerHeight;
    window.onresize = function(){
        gamvas.getCanvas().width = window.innerWidth;
        gamvas.getCanvas().height = window.innerHeight;
        gamvas.state.getCurrentState().resize();
    };
});

testState = gamvas.State.extend({
    init: function(){
        gamvas.socket = io.connect(ip);
        gamvas.socket.updateInterval = 0.1;
        this.currentPosition = {x:0,y:0};
        this.currentPath = [];
        this.currentIndex = 0;
        this.moving = false;
        this.delta = {x:0,y:0};
        this.moveSpeed = 0;
        this.gameSize = {width:0,height:0};
        this.resize();
        gamvas.socket.on('size', function(size){
            this.gameSize = size;
            this.resize();
        }.bind(this));
        //create the obstacle canvas
        this.obstacles = [];
        this.updatingImageCanvas = true;
        gamvas.socket.on('update', function(data){
            this.moveSpeed = data.moveSpeed;
            this.currentPath = data.currentPath;
            this.currentPosition = data.currentPosition;
            this.currentIndex = data.currentIndex;
            this.moving = data.moving;
            if(this.currentPath.length === 0){
                this.moving = false;
                return;
            }
        }.bind(this));
        gamvas.socket.on('obstacles', function(data){
            this.obstacles = data;
            this.updateObstaclesImage();
        }.bind(this));
    },
    onMouseDown: function(button, x, y){
        var c = this.toBox(x, y);
        if(c.x < 0 || c.y < 0 || c.x > this.gameSize.width || c.y > this.gameSize.height)
            return;
        if(button === gamvas.mouse.LEFT){
            gamvas.socket.emit('newObstacle', c);
        }
        else if(button === gamvas.mouse.RIGHT){
            gamvas.socket.emit('newPos', c);
        }
    },
    updateObstaclesImage: function(){
        this.updatingImageCanvas = true;
        if(this.obstacleCanvas === undefined){
            this.obstacleCanvas = document.createElement('canvas');
            this.obstacleCanvas.width = this.gameSize.width;
            this.obstacleCanvas.height = this.gameSize.height;
            this.obstacleContext = this.obstacleCanvas.getContext('2d');
        }
        if(this.obstacles === undefined)
            this.obstacles = [];
        this.obstacleCanvas.width = this.gameSize.width;
        this.obstacleCanvas.height = this.gameSize.height;
        this.obstacleContext.fillStyle = "#000000";
        this.obstacleContext.fillRect(0,0,this.gameSize.width,this.gameSize.height);
        for(var x = 0; x < this.obstacles.length; x++){
            this.obstacleContext.fillStyle = "#FFFFFF";
            this.obstacleContext.fillRect(this.obstacles[x].x, this.obstacles[x].y, 1, 1);
        }
        this.obstacleContext.strokeStyle="#FFFFFF";
        this.obstacleContext.strokeRect(1,1,this.gameSize.width-2, this.gameSize.height-2);
        this.updatingImageCanvas = false;
    },
    resize: function(){
        this.size = {w:window.innerWidth,h:window.innerHeight};
        if(this.gameSize === undefined)
            this.gameSize = {width:0,height:0};
        this.camera.position.x = Math.floor(this.size.w/2.0 - (this.size.w-this.gameSize.width)/2.0);
        this.camera.position.y = Math.floor(this.size.h/2.0 - (this.size.h-this.gameSize.height)/2.0);
        this.updateObstaclesImage();
    },
    toBox: function(x, y){
        return {x:(x-(this.size.w-this.gameSize.width)/2.0),
            y:(y-(this.size.h-this.gameSize.height)/2.0)};
    },
    preDraw: function(t){
        //step the object by the delta value to interpolate between spaces
        if(!this.moving)
            return;
        this.currentIndex += Math.ceil(this.moveSpeed * t);
        if(this.currentIndex >= this.currentPath.length){
            this.currentPosition = this.currentPath[this.currentPath.length-1];
            this.moving = false;
            return;
        }
        this.currentPosition = this.currentPath[this.currentIndex];
    },
    draw: function(t){
        this.c.fillStyle="#000000";
        this.c.fillRect(-1*(this.size.w-this.gameSize.width)/2.0,-1*(this.size.h-this.gameSize.height)/2.0,this.size.w,this.size.h);
        if(!this.updatingImageCanvas)
            this.c.drawImage(this.obstacleCanvas, 0, 0);
        this.c.fillStyle="#FF00FF";
        this.c.fillRect(this.currentPosition.x, this.currentPosition.y, 4, 4);
        this.c.strokeStyle = "#FFFFFF";
        this.c.strokeText(gamvas.screen.getFPS(), 0, -10);
    }
});

//util functions
//
function clamp(min, max, val){
    return val<=min?min:(val>=max?max:val);
}

function loadFile(file){
    var fileRef = document.createElement('script');
    fileRef.src = file;
    document.getElementsByTagName('head')[0].appendChild(fileRef);
}
