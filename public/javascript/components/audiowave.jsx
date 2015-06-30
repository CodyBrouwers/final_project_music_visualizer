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
    loadSong: function () {
      console.log("Beore: ", this.props.visualization);
      var url = this.refs.url.getDOMNode().value;

      var streamURL = SoundCloud.loadStreamUrl(this.props.visualization, url);
      
      // this.props.visualization.path = streamURL;
      // console.log(this.props.visualization.path);
      // console.log("AFter: ", this.props.visualization);
      // Visualization.updateOne(this.props.visualization);
      
    },

    render: function(){
      return (
        <div className="wave-container">
          <div className="controls">
            <button onClick={this.updateTransition}>Update</button>
            <button onClick={this.backward}>Backwards</button>
            <button id="play" onClick={this.playPause}>Play/Pause</button>
            <button onClick={this.forward}>Forwards</button>
            <button onClick={this.toggleMute}>Mute</button>
            <button onClick={this.addTransition}>Add Transition</button>
          </div>
          <div id="wave"></div>
          <div id="wave-timeline"></div>

          <form htmlFor='songURL'>Paste your SoundCloud URL here</form>
          <input id='songURL' type='text' ref="url" style={{color: '#000'}} />
          <button onClick={this.loadSong}>Load</button>
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
          region.remove();
        });

      });
    }
  })