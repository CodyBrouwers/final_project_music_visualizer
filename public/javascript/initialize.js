// Show stats and the mini visualizer?
var DEBUG = false;
// var DEBUG = false; 

// Start with mic by default? 
var USEMIC = false;

var sound = new SoundAnalyser();

var volume, sensitivity;

var useMic = function() {
    volume = 0;
    sensitivity = 1;
    sound.setVolume(volume);
    sound.setSesitivity(sensitivity);
    sound.connectMic();
}

var useTrack = function() {
    volume = 1;
    sensitivity = 1;
    sound.setVolume(volume);
    sound.setSesitivity(sensitivity);
    sound.connectTrack('music/color.mp3');
}

if(USEMIC) {
    useMic();
} else {
    useTrack();
}


// $('#viz-canvas').append( renderer.domElement );
if(DEBUG) var debugViz = new SoundVisualizer(document.querySelector('#viz-canvas'), 120, 64);

var stats = new Stats();
stats.domElement.setAttribute('class', 'stats');
if(DEBUG) document.body.appendChild(stats.domElement);

sound.onBeat = function() {
    if(DEBUG) debugViz.onBeat();
}

var loop = function() {
    stats.begin();
    requestAnimationFrame(loop);

    sound.update();
    if(DEBUG) debugViz.draw(sound);

    stats.end();

}

loop();








