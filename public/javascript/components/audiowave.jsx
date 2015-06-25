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

    addTransition: function() {
      var time = musicInterface.getCurrentTime();
      this.props.postTransition(this.props.visualization.id, time, visualizer.getParams());
    },

    render: function(){
      return (
        <div className="wave-container">
          <div className="controls">
            <button onClick={this.backward}>Backwards</button>
            <button onClick={this.playPause}>Play/Pause</button>
            <button onClick={this.forward}>Forwards</button>
            <button onClick={this.toggleMute}>Mute</button>
            <button onClick={this.addTransition}>Add Transition</button>
          </div>
          <div id="wave"></div>
          <div id="wave-timeline"></div>

          <p id="drop">Drop your file here</p>
        </div>
      );
    },
    componentDidMount: function () {
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

        musicInterface.waveSurfer.on('region-click', function (region, e) {
          // Play on click, loop on shift click
          e.shiftKey ? region.playLoop() : region.play();
        });

        musicInterface.waveSurfer.on('region-dblclick', function (region, e) {
          region.remove();
        });

        // TODO - Load JSON data in when ready
        // loadRegions(JSON.parse(localStorage.transitions));
      });
    }
  })