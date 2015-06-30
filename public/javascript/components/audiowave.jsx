var AudioWave = React.createClass({

  getInitialState: function(){
    return (
      { 
      displayPlay: true
      }
    )
  },

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
    removeAllTransitions: function() {
      Transition.removeAllTransitions(this.props.visualization.id);
    },
    loadSong: function () {
      var url = this.refs.url.getDOMNode().value;
      var streamURL = SoundCloud.loadStreamUrl(this.props.visualization, url);
      this.refs.url.getDOMNode().value = '';
    },

    playButtonToggle: function() {
      if (this.state.displayPlay === true) {
        this.setState({displayPlay: false});
      } else {
        this.setState({displayPlay: true});
      }
    },

    handleClick: function (){
      this.playPause();
      this.playButtonToggle();
    },

    render: function(){
      return (
        <div className="wave-container">
          <div className="controls">
            {this.state.displayPlay && <i className="fa fa-play fa-5" id="play" onClick={this.handleClick}></i>}
            {this.state.displayPlay === false && <i className="fa fa-pause fa-5" id="pause" onClick={this.handleClick}></i>}
            <button onClick={this.addTransition}>Add Transition Point</button>
            <button onClick={this.removeAllTransitions}>Clear All Transitions</button>
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
          Transition.removeTransition(self.props.visualization.id);
        });

      });
    }
  })