String.prototype.capitalize = function() {
  return this[0].toUpperCase() + this.slice(1);
}
var counter = 0;

var MusicInterface = {

  init: function(vizualizer) {
  //Need to initialize waveSurfer web-audio context
    this.waveSurfer = Object.create(WaveSurfer);
    // Waveform options
    var options = {
      container: document.querySelector("#wave"),
      waveColor: 'violet',
      progressColor: '#FFFFFF',
      cursorColor: 'navy',
      scrollParent: true,
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
    this.analyser.fftSize = 1024;
  },
  
  //Should define our own data properties? 
  initData: function() {
    this.levelsCount = 16;
    this.levelsData = [];
    this.level = 0;

    var binCount = this.analyser.frequencyBinCount;
    this.levelBins = Math.floor(binCount / this.levelsCount);
    this.freqByteData = new Uint8Array(binCount);
    this.oldFreqData = new Uint8Array(binCount);
    this.analyser.getByteFrequencyData(this.oldFreqData);
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

  getTimeData: function() {
    var dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  },

  getByteData: function() {
    var length = this.freqByteData.length;
    if (this.waveSurfer.backend.isPaused()) return (new Uint8Array(12 * length));
    var dataColor = new Uint8Array(12 * length);
    for (var i = 0; i < length; i++) {
      
      var freqDataPoint = this.freqByteData[length - i]
      this.oldFreqData[length - i] = Math.max(this.oldFreqData[length - i]-10, freqDataPoint);
      
      dataColor[ i * 3 ]     = this.oldFreqData[length - i];
      dataColor[ i * 3 + 1 ] = dataColor[ i * 3 ];  
      dataColor[ i * 3 + 2 ] = dataColor[ i * 3 ];
    }
    for (var j = length; j < length * 2; j++) {
      dataColor[ j * 3 ]     = this.oldFreqData[j - length];
      dataColor[ j * 3 + 1 ] = dataColor[ j * 3 ];
      dataColor[ j * 3 + 2 ] = dataColor[ j * 3 ];
    }
    for (var i = length * 2; i < length * 3; i++) {
      dataColor[ i * 3 ]     = this.oldFreqData[3 * length - i];
      dataColor[ i * 3 + 1 ] = dataColor[ i * 3 ];  
      dataColor[ i * 3 + 2 ] = dataColor[ i * 3 ];
    }
    for (var j = length * 3; j < length * 4; j++) {
      dataColor[ j * 3 ]     = this.oldFreqData[j - 3*length];
      dataColor[ j * 3 + 1 ] = dataColor[ j * 3 ];
      dataColor[ j * 3 + 2 ] = dataColor[ j * 3 ];
    }
    var newDataColor = new Uint8Array(dataColor.length)
    for (var m = 3; m < dataColor.length - 3; m++) {
      newDataColor[m] = Math.floor(dataColor[m-3] + dataColor[m-2] + dataColor[m-1] + dataColor[m] + dataColor[m+1] + dataColor[m+2] + dataColor[m+3])/7
    }
    return newDataColor;
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
        color: color,
        drag:false,
        resize: false
      })
  },

  addInitialRegion: function (transition) {
    return this.waveSurfer.addRegion({
        id: transition.id,
        start: transition.time,
        end: this.getDuration(),
        color: "rgba(0,255,227,0.3)",
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
        this.currentRegion.end,
        this.randomColor()
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
    var region;
    var color;
    transitions.sort(function(a,b) {
      return a.time - b.time;
    });
    if (transitions.length === 1) {
      this.currentRegion = this.addInitialRegion(transitions[0]);
    } else {
      this.currentRegion = this.addOneRegion(
        transitions[0].id,
        transitions[0].time,
        transitions[1].time,
        "rgba(0,255,227,0.3)"
      );
      for (var index = 1; index < transitions.length - 1; index++) {
        if (index % 2 === 1) {
          color = "rgba(105,31,114,0.3)";
        } else {
          color = "rgba(0,255,227,0.3)";
        }
        this.addOneRegion(
          transitions[index].id,
          transitions[index].time,
          transitions[index+1].time,
          color
        );
      }
      if (color === "rgba(0,255,227,0.3)") {
        color = "rgba(105,31,114,0.3)";
      } else {
        color = "rgba(0,255,227,0.3)";
      }
      this.addOneRegion(
        transitions[index].id,
        transitions[index].time,
        this.getDuration(),
        color
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
  randomColor: function () {
    return 'rgba(' + [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        0.3
    ] + ')';
  },
  
}

