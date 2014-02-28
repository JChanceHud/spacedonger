gamvas.config.preventKeyEvents = false;
gamvas.config.preventMouseEvents = false;
gamvas.config.reverseLayerOrder = false;
gamvas.event.addOnLoad(function() {
    gamvas.state.addState(new mouseState('testState'));
    gamvas.state.addState(new camState('camState'));
    gamvas.state.addState(new secondPhysicsState('physState'));
    // gamvas.timer.setGlobalTimeScale(0.7);
    gamvas.start('gameCanvas', true);
});
