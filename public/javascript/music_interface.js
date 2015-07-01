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
      progressColor: '#00FFE3',
      cursorColor: 'navy',
      scrollParent: false,
      height: '55'
    };

    // Initializes with above options
    this.waveSurfer.init(options);
    this.grabAnalyser();
    this.initData();
    visualizer.init();
    this.enableRegions();
    this.duration = this.waveSurfer.getDuration();
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
    this.currentRegion = undefined;
    this.waveSurfer.destroy();
  },

  //Need to have access to all the playback functions from waveSurfer.js
  playPause: function() {
    this.waveSurfer.playPause();
  },

  pause: function () {
    if (!this.waveSurfer.backend.isPaused()) {
      this.waveSurfer.pause();  
    }
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

  loadSong: function(path) {
    this.waveSurfer.load(path);
  },

  loadBlob: function(file) {
    this.waveSurfer.loadBlob(file);
  },

  getCurrentTime: function() {
    return this.waveSurfer.getCurrentTime();
  },

  getDuration: function() {
    var time = this.waveSurfer.backend.getDuration();
    return time;
  },

  // Enables Region Selection
  enableRegions: function () {
    this.waveSurfer.initRegions();
  },

  addOneRegion: function(id, start, end, color) {
    var myEnd = end ? end : this.getDuration();
    return this.waveSurfer.addRegion({
        id: id,
        start: start,
        end: myEnd,
        color: this.randomColor(0.5),
        drag:false,
        resize: false
      })
  },

  addInitialRegion: function (transition) {
    return this.waveSurfer.addRegion({
        id: transition.id,
        start: 0,
        end: this.getDuration(),
        color: this.randomColor(0.2),
        drag: false,
        resize: false
    })
  },

  removeRegion: function (region) {
    region.remove();
  },

  removeAllRegions: function () {
    this.waveSurfer.clearRegions();
  },

  addRegion: function(transition) {
    if (this.currentRegion) {
      var region = this.addOneRegion(
        transition.id,
        this.getCurrentTime(),
        this.currentRegion.end
      );
      this.currentRegion = this.currentRegion.update({
        start: this.currentRegion.start,
        end: this.getCurrentTime()
      });
      this.currentRegion = region;
    } else {
      this.currentRegion = this.addOneRegion(
        transition.id,
        this.getCurrentTime(),
        this.getDuration()
      );
    }
  },

  setUpRegions: function(transitions) {
    //Shouldn't really be in this object...
    var region;
    transitions.sort(function(a,b) {
      return a.time - b.time;
    });
    if (transitions.length === 0 ) {
      // this.currentRegion = this.addInitialRegion();
    } else if (transitions.length === 1) {
      this.currentRegion = this.addOneRegion(
        transitions[0].id,
        transitions[0].time,
        this.getDuration()
      );
    } else {
      this.currentRegion = this.addOneRegion(
        transitions[0].id,
        transitions[0].time,
        transitions[1].time
      );
      for (var index = 1; index < transitions.length - 1; index++) {
        this.addOneRegion(
          transitions[index].id,
          transitions[index].time,
          transitions[index+1].time
        );
      }
      this.addOneRegion(
        transitions[index].id,
        transitions[index].time,
        this.getDuration()
      );
    }
  },

  regionsLoaded: function () {
    if (this.currentRegion) {
      return true;
    }
  },

  getCurrentRegion: function () {
    return this.currentRegion;
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

