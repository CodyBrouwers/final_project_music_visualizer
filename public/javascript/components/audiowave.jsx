var AudioWave = React.createClass({
    //Playback
    backward: function() {
      musicInterface.skipBackward();
    },
    forward: function() {
      musicInterface.skipForward();
    },
    playPause: function() {;
      musicInterface.playPause();
    },
    toggleMute: function() {
      musicInterface.toggleMute();
    },
    addTransition: function () {
      Transition.addTransition(this.props.visualization.id);
    },
    updateTransition: function() {
      Transition.updateTransition(this.props.visualization.id);
    },

    //Removed the drage and drop component: <p id="drop">Drop your file here</p>
    render: function(){
      return (
        <div className="wave-container">
          <div className="controls">
            <button onClick={this.backward}>Backwards</button>
            <button id="play" onClick={this.playPause}>Play/Pause</button>
            <button onClick={this.forward}>Forwards</button>
            <button onClick={this.toggleMute}>Mute</button>
            <button onClick={this.addTransition}>Add Transition</button>
          </div>
          <div id="wave"></div>
          <div id="wave-timeline"></div>

          
        </div>
      );
    },

    componentDidMount: function () {
      var self = this;
      musicInterface.init(visualizer);

      // Loads song with path if there is one
      if (this.props.visualization.path != undefined) {
        musicInterface.loadSong(this.props.visualization.path);  
      }

      // Initializes timeline plugin and plays once ready
      musicInterface.waveSurfer.on('ready', function () {
        var timeline = Object.create(WaveSurfer.Timeline);

        timeline.init({
          wavesurfer: musicInterface.waveSurfer,
          container: "#wave-timeline"
        });
        
        musicInterface.waveSurfer.on('region-click', function (region, event) {
            musicInterface.pause();
            Transition.setCurrentRegionAndTransition(self.props.visualization.id, region);
          }
        );

        musicInterface.waveSurfer.on('region-in', function (region, event) {
            Transition.setCurrentRegionAndTransition(self.props.visualization.id, region);
          }
        );

        musicInterface.waveSurfer.on('region-dblclick', function (region, event) {
          //This will need more work, but for now just reset completely?
          region.remove();
        });

      });
    }
  })