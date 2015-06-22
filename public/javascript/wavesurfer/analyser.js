
WaveSurfer.WebAudio.Data = {
  levelsCount: 16,
  levelsData: [],
  level: 0,

  init: function(analyser) {

    this.analyser = analyser //WaveSurfer.WebAudio.analyser

    var binCount = this.analyser.frequencyBinCount;
    this.levelBins = Math.floor(binCount / this.levelsCount);

    this.freqByteData = new Uint8Array(binCount); 
  },

  update: function() {
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
  }
}

WaveSurfer.util.extend(WaveSurfer, WaveSurfer.Observer);