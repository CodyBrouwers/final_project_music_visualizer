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
            <img id="small-edit-image" src={this.props.visualization.image} ></img>
            {this.state.displayPlay && <i className="fa fa-play fa-5" id="play" onClick={this.handleClick}></i>}
            {this.state.displayPlay === false && <i className="fa fa-pause fa-5" id="pause" onClick={this.handleClick}></i>}
            <button id="add-trans" onClick={this.addTransition}>Add Transition Point</button>
            <button id="clear-trans" onClick={this.removeAllTransitions}>Clear All Transitions</button>
          </div>
          <div id="wave"></div>
          <div id="wave-timeline"></div>
        </div>
      );
    },

    componentDidMount: function () {
      var self = this;
      musicInterface.init(visualizer);
      var transitions;

      // Loads song with path if there is one
      if (this.props.visualization.path != undefined) {
        musicInterface.loadSong(this.props.visualization.path);
      }

      $(document).ajaxComplete(function (event, xhr, settings) {

        musicInterface.waveSurfer.on('ready', function () {

          // Initializes timeline plugin and sets up regions once ready
          var timeline = Object.create(WaveSurfer.Timeline);
          timeline.init({
            wavesurfer: musicInterface.waveSurfer,
            container: "#wave-timeline"
          });

          if (settings.type === "GET") {
            transitions = Transition.getAll();           
            musicInterface.setUpRegions(transitions);
          }

        });
          musicInterface.waveSurfer.on('region-click', function (region, event) {
              musicInterface.pause();
              self.setState({displayPlay: true});
              Transition.setCurrentRegionAndTransition(self.props.visualization.id, region);
          });
          musicInterface.waveSurfer.on('region-in', function (region, event) {
              Transition.setCurrentRegionAndTransition(self.props.visualization.id, region);
          });
          musicInterface.waveSurfer.on('region-dblclick', function (region, event) {
            Transition.removeTransition(self.props.visualization.id);
          });

      });
    }
  })