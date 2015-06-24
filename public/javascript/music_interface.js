String.prototype.capitalize = function() {
  return this[0].toUpperCase() + this.slice(1);
}

var MusicInterface = {

  init: function(vizualizer) {
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
    visualizer.init();
    this.enableRegions();
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

  getCurrentTime: function() {
    return this.waveSurfer.getCurrentTime();
  },

  getDuration: function() {
    return this.waveSurfer.getDuration();
  },
  
  //Will need to have access to the events emitted by the region plug-in?

  // Enables Region Selection
  enableRegions: function () {
    this.waveSurfer.initRegions({
      color: this.randomColor(0.5)
    });
  },

  addTransition: function() {
    console.log(this.currentTransition)
    if (this.currentTransition) {
      var region = this.waveSurfer.addRegion({
        start: this.getCurrentTime(),
        end: this.currentTransition.end,
        drag: false,
        resize: false
      })
      this.currentRegion.update({
        end: this.getCurrentTime(),
      })
      this.currentRegion = region;
    } else {
      this.currentRegion = this.waveSurfer.addRegion({
        start: this.getCurrentTime(),
        end: this.getDuration(),
        drag: false,
        resize: false
      })
    }
  },

  setTransitions: function(transitions) {
    transitions.forEach(function(transition, index) {})
  },

  // Generates random colour for regions
  randomColor: function (alpha) {
    return 'rgba(' + [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        alpha || 1
    ] + ')';
  },
  
}

