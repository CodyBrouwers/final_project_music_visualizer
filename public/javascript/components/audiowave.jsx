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

    setCurrentRegionAndTransition: function(region) {
      var transitions = this.props.transitions
      musicInterface.currentRegion = region;
      for (var i = 0; i < transitions.length; i++) {
        var transition = transitions[i];
        if (transition.id === musicInterface.currentRegion.id) {
          visualizer.setParams(transition.params);
          console.log(transition.params);
          break;
        }
      }
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
      var self = this;
      musicInterface.init(visualizer);

      // Initializes timeline plugin and plays once ready
      musicInterface.waveSurfer.on('ready', function () {
        var timeline = Object.create(WaveSurfer.Timeline);

        timeline.init({
          wavesurfer: musicInterface.waveSurfer,
          container: "#wave-timeline"
        });

        musicInterface.waveSurfer.on(
          'region-click',
          function (region, event) {
            self.setCurrentRegionAndTransition(region);
          }
        );

        musicInterface.waveSurfer.on('region-dblclick', function (region, e) {
          //This will need more work, but for now just reset completely?
          region.remove();
        });

        musicInterface.waveSurfer.on(
          'region-in', 
          function (region, event) {
            self.setCurrentRegionAndTransition(region);
          }
        );

        // TODO - Load JSON data in when ready
        // loadRegions(JSON.parse(localStorage.transitions));
      });
    }
  })