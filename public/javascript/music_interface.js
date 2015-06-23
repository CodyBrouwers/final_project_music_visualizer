String.prototype.capitalize = function() {
  return this[0].toUpperCase() + this.slice(1);
}

var MusicInterface = {

  init: function() {
  //Need to initialize waveSurfer web-audio context
    this.waveSurfer = Object.create(WaveSurfer);
    // Waveform options
    var options = {
      container: document.querySelector("#wave"),
      waveColor: 'violet',
      progressColor: 'purple',
      cursorColor: 'navy',
      scrollParent: false
    };

    // Initializes with above options
    this.waveSurfer.init(options);
    this.grabAnalyser();
    this.initData();
    this.initVisualizer();
  },
  
  grabAnalyser: function() {
    //Need to have access to the analyser from webaudio.
    this.analyser = this.waveSurfer.backend.analyser;
  },
  
  //Should define our own data properties? 
  initData: function() {
    this.levelsCount = 16;
    this.levelsData = [];
    this.level = 0;

    var binCount = this.analyser.frequencyBinCount;
    this.levelBins = Math.floor(binCount / this.levelsCount);
    this.freqByteData = new Uint8Array(binCount);
  },

  updateData: function() {
    this.analyser.getByteFrequencyData(this.freqByteData); //<-- bar chart

    var total = 0;
    for(var i = 0; i < this.levelsCount; i++) {
      
      var totalForBin = 0;
      for(var j = 0; j < this.levelBins; j++) {
        totalForBin += this.freqByteData[(i * this.levelBins) + j];
      }

      var t = totalForBin / this.levelBins / 256;
      this.levelsData[i] = t;
      total += t;
    }
    this.level = total / this.levelsCount;
  },

  //Need to be able to add handler function for an event...
  on: function(event, fn) {
    this.waveSurfer.Observer.on(event, fn);
  },

  //Remove all nodes and stuff
  destroy: function() {
    this.waveSurfer.destroy();
  },

  //Need to have access to all the playback functions from waveSurfer.js
  playPause: function() {
    this.waveSurfer.playPause();
  },

  skipBackward: function() {
    this.waveSurfer.skipBackward();
  },

  skipForward: function () {
    this.waveSurfer.skipForward();
  },

  toggleMute: function () {
    this.waveSurfer.toggleMute();
  },

  //TODO: Need to have access to loading and drag/dropping of files
  loadSong: function(path) {
    this.waveSurfer.load(path);
  },

  loadBlob: function(file) {
    this.waveSurfer.loadBlob(file);
  },

  initTimeLine: function() {
    // this.timeLine =
  },

  getCurrentTime: function(){
    return this.waveSurfer.getCurrentTime();
  },
  
  //Will need to have access to the events emitted by the region plug-in?
  
  //Need to have access to visualizer and it's parameters
  initVisualizer: function() {

    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 1000;

    var red = 240;
    var green = 50;
    var blue = 10;
    var myColor = new THREE.Color('rgb(' + red + ',' + green + ',' + blue + ')');
    this.geometry = new THREE.BoxGeometry( 200, 200, 200 );
    this.material = new THREE.MeshPhongMaterial( { color: myColor } );

    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.scene.add( this.mesh );

    this.hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x80CC99, 1.0);
    this.scene.add( this.hemiLight );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    //TODO: remove this shiiit (don't use jQuery)
    $('#input-red').val(red);
    $('#input-green').val(green);
    $('#input-blue').val(blue);

  },

  animate: function(frame) {

    requestAnimationFrame(this.animate.bind(this));

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;

    var scale = 1 + this.level;
    this.mesh.scale.x = scale;
    this.mesh.scale.y = scale;
    this.mesh.scale.z = scale;

    this.updateData();
    this.renderer.render(this.scene, this.camera);
  },

  setVisualizerParams: function(params) {
    //params is supposed to be an array of hashes following
    //the format of {type:..., value:...} that we can iterate
    //through and set parameters automatically.
    params.forEach(function(param, index) {
      this['set' + param['type'].capitalize()](param['value']);
    }, this);
  },

  setColor: function(params) {
    this.mesh.material.color = new THREE.Color('rgb(' + params[0] + ',' + params[1] + ',' + params[2] + ')');
  },

  setGeometry: function(shape) {
    if (shape === 'sphere') {
      this.mesh.geometry = new THREE.SphereGeometry( 200, 30, 30 );
    }
    else {
      this.mesh.geometry = new THREE.BoxGeometry( 200, 200, 200 );
    }
  }
}

