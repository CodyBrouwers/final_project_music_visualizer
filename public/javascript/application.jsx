(function() {

  /** @jsx React.DOM */

  var musicInterface = Object.create(MusicInterface);
  
  var AppView = React.createClass({
    getInitialState: function () {
      return {
        page: 'List',
        visualizations: []
      }
    },
    changePage: function(page){
      this.setState({page: page});
    },
    changeVisualization: function(visualization){
      this.setState({visualization: visualization});
    },

    componentWillMount: function(){
      $.ajax({
        type: "GET",
        url: "/visualizations",
        dataType: 'json',
        success: function(visualizations) {
          this.setState({visualizations: visualizations})
        }.bind(this)
      });
    },

    render: function(){
      if (this.state.page === 'List'){
        return <VisualizationList key='list' changePage={this.changePage} changeVisualization={this.changeVisualization}/>;
      } else {
        return <EditView key='edit' changePage={this.changePage} visualization={this.state.visualization}/>;
      }
    }
  });

  var VisualizationItem = React.createClass({

    handleClick: function(){
      this.props.changeVisualization(this.props.v);
      this.props.changePage('Edit'); 
    },

    render: function() {
      return <a className="viz" onClick={this.handleClick}>
        <img src="http://static.guim.co.uk/sys-images/Guardian/Pix/pictures/2014/4/11/1397210130748/Spring-Lamb.-Image-shot-2-011.jpg"  title={this.props.v.song_name}>
        </img></a>
    }

  });

  var VisualizationList = React.createClass({

    sortOptions: ['song_name', 'created_at', 'updated_at'],

    getInitialState: function(){
      return { sortBy: this.sortOptions[0] };
    },
    
    componentDidMount: function(){
      slipHover(this.refs.container.getDOMNode());
    },

    handleClick: function() {
      self.props.changePage('Edit');
    },

    render: function(){
      var self = this;
      var items = _.sortBy(this.props.visualizations, function(v){return v[self.state.sortBy]});
      var items = items.map(function(v){
      // TODO Move song_path up to VisualizationItem
        return <VisualizationItem 
          v={v} 
          key={ "visualization-item-" + v.id} 
          changePage={self.props.changePage} 
          changeVisualization={self.props.changeVisualization} />;
      })
      var sortButtons = _.map(self.sortOptions, function(s){
        return <div className="sort-button" onClick={function(){
          self.setState({sortBy: s});
        }}>{s}</div>;
      })
      return (
        <div>
          <h1>List View</h1>
          <button onClick={this.handleClick}>
            New Visual
            </button>
          {sortButtons}
          <div id="container" ref="container">
            {items}
          </div>
        </div>
      )
    }
  });

  var EditView = React.createClass({

    handleClick: function(){
      musicInterface.destroy();
      this.props.changePage('List');
    },

    render: function(){
      var self = this;
      return (
        <div>
          <h1>Edit View</h1>
          <p onClick={this.handleClick}>
          Back to List</p>
          <div className='viz-container'>
            <ParameterMenu />
          </div>
          <AudioWave visualization={this.props.visualization} postTransition={this.postTransition} />
        </div>
      )
    },

    getTransitions: function(id) {
      $.ajax({  
        type: "GET",
        url: "/visualizations/" + id + '/transitions',
        dataType: 'json',
        success: function(transitions) {
          if (!(transitions.length === 0)) {
            console.log(transitions.constructor)
            this.setState({transitions: transitions})
            // musicInterface.setVisualizerParams[transitions[0]['params']]
          } else {
            this.postTransition(id, 0.0, {})
          }
        }.bind(this)
      });
    },

    postTransition: function(id, time, params) {
      $.ajax({
        type: "POST",
        url: "/visualizations/" + id + '/transitions',
        data: {'time': time, 'params': params},
        dataType: 'json',
        success: function(transitions) {
          this.setState({transitions: transitions})
        }.bind(this)
      });
    },

    componentDidMount: function() {
      //TODO think of a better way of seperating this so that the timeline
      //is initiated at the right time.
      $('.viz-container').append(musicInterface.renderer.domElement);
      musicInterface.animate();
      musicInterface.loadSong(this.props.visualization.song_path);
      this.getTransitions(this.props.visualization.id)
      // Initializes timeline plugin and plays once ready
      musicInterface.waveSurfer.on('ready', function () {
        var timeline = Object.create(WaveSurfer.Timeline);

        timeline.init({
          wavesurfer: musicInterface.waveSurfer,
          container: "#wave-timeline"
        });
      });
    } 
  });

  var ParameterMenu = React.createClass({
    changeColor: function() {
      //HACK: Write this the react way...
      var red = $('#input-red').val();
      var green = $('#input-green').val();
      var blue = $('#input-blue').val();
      var param = [{
        'type': 'color',
        'value': [red, green, blue]
      }];
      musicInterface.setVisualizerParams(param)
    },
    changeShape: function() {
      var param = [{
      'type': 'geometry',
      'value': event.target.value
      }];
      musicInterface.setVisualizerParams(param)
    },
    render: function(){
      return (
        <div>
          <div className="close">- hide options</div>
          <div className="menu-button">+ show options</div>
          <div className="menu">
            <fieldset>
              <legend>Color</legend>
              <ul className="color">
                <li>
                  <form htmlFor='input-red'>Red</form>
                  <input id='input-red' type='number' name="red" val='240' onChange={this.changeColor}/>
                </li>
                <li>
                  <form htmlFor='input-green'>Green</form>
                  <input id='input-green' type='number' name="green" val='100' onChange={this.changeColor}/>
                </li>
                <li>
                  <form htmlFor='input-blue'>Blue</form>
                  <input id='input-blue' type='number' name="blue" val='30' onChange={this.changeColor}/>
                </li>
              </ul>
            </fieldset>
            <fieldset>
              <legend>Shape</legend>
              <ul className='shape'>
                <li>
                  <label>Sphere</label>
                  <input type="radio" name="shape" value="sphere" onClick={this.changeShape}/>
                </li>
                <li>
                  <label>Cube</label>
                  <input type="radio" name="shape" value="cube" onClick={this.changeShape}/>
                </li>
              </ul>
            </fieldset>
            <p>Source</p>
            <ul>
                <li className="track">Track</li>
            </ul>
          </div>
        </div> 
      )
    }
  });

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
      this.props.postTransition(this.props.visualization.id);
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
      musicInterface.init();
    }
  })

  React.render(
    <AppView />,
    document.getElementById('app')
  );

})();
