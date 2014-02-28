mainState = gamvas.State.extend({
    init: function() {
        this.playerBall = new ball("player", 0, 0);
        this.otherBalls = [];
    },
    onMouseMove: function(x, y) {
        var worldMouse = this.camera.toWorld(x, y);
        this.playerBall.position.x =
            worldMouse.x - this.playerBall.width/2;
        this.playerBall.position.y =
            worldMouse.y - this.playerBall.height/2;
    },
    draw: function(t) {
        for (var i = 0; i < this.otherBalls.length; i++) {
            this.otherBalls[i].draw(t);
        }
        this.playerBall.draw(t);
    }
});

ball = gamvas.Actor.extend({
    create: function(name, x, y) {
        this._super(name, x, y);

        this.width = 128; // manually entered based on sprite size
        this.height = 128; // maybe there's a built in way to find size of .png file?

        var st = gamvas.state.getCurrentState();
        //this.setFile(st.resource.getImage('../res/ball.png'));
        this.setFile(st.resource.getImage('../res/sprite.png')); // Dedicated to jchancehud

        var defState = this.getCurrentState();
        defState.update = function(t) {
            // update logic here
        };
    }
});

gamvas.event.addOnLoad(function(){
    var main = new mainState();
    gamvas.state.addState(main);

    gamvas.start("gameCanvas");

    main.otherBalls[0] = new ball("other1", 100, 100);
    main.otherBalls[1] = new ball("other2", -200, -240);
});

