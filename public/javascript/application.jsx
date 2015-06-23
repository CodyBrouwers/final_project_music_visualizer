(function() {

  /** @jsx React.DOM */
  
  // var WebGLVisualization = require('./webgl-viz.jsx');
  
  var AppView = React.createClass({
    getInitialState: function () {
      return {
        page: 'List'
      }
    },
    changePage: function(page){
      this.setState({page: page});
    },
    changePath: function(path){
      this.setState({path: path});
    },

    render: function(){
      if (this.state.page === 'List'){
        return <VisualizationList key='list' changePage={this.changePage} changePath={this.changePath}/>;
      } else {
        return <EditView key='edit' changePage={this.changePage} path={this.state.path}/>;
      }
    }
  });

  var VisualizationItem = React.createClass({

    handleClick: function(){
      this.props.changePath(this.props.song_path);
      this.props.changePage('Edit'); 
    },

    render: function() {
      return <div className="viz" onClick={this.handleClick}>
        <img src="http://static.guim.co.uk/sys-images/Guardian/Pix/pictures/2014/4/11/1397210130748/Spring-Lamb.-Image-shot-2-011.jpg"  title={this.props.v.song_name}>
        </img></div>
    }

  });

  var VisualizationList = React.createClass({

    sortOptions: ['song_name', 'created_at', 'updated_at'],

    getInitialState: function(){
      return { visualizations: [], sortBy: this.sortOptions[0] };
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

    componentDidMount: function(){
      slipHover(this.refs.container.getDOMNode());
    },

    render: function(){
      var self = this;
      var items = _.sortBy(self.state.visualizations, function(v){return v[self.state.sortBy]});
      var items = items.map(function(v){
      // TODO Move song_path up to VisualizationItem
        return <VisualizationItem v={v} song_path={v.song_path} key={ "visualization-item-" + v.id} changePage={self.props.changePage} changePath={self.props.changePath} />;
      })
      var sortButtons = _.map(self.sortOptions, function(s){
        return <div className="sort-button" onClick={function(){
          self.setState({sortBy: s});
        }}>{s}</div>;
      })
      return (
        <div>
          <h1>List View</h1>
          <button onClick={function(){
            self.props.parent.changePage('Edit', 'visualizations/new');
          }}>New Visual</button>
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
      musicInterface = Object.create(MusicInterface);
      var self = this;
      return (
        <div>
          <h1>Edit View</h1>
          <p onClick={this.handleClick}>
          Back to List</p>
          <div>
            <div className='viz-container'>
              <ParameterMenu />
            </div>
          </div>
          <AudioWave />
        </div>
      )
    },
    componentDidMount: function() {
      $('.viz-container').append(musicInterface.renderer.domElement);
      musicInterface.animate();
      musicInterface.loadSong(this.props.path);
      // Initializes timeline plugin and plays once ready
      musicInterface.on('ready', function () {
        var timeline = Object.create(WaveSurfer.Timeline);

        timeline.init({
          WaveSurfer: musicInterface.waveSurfer,
          container: "#wave-timeline"
        });
      });
    } 
  });

  var ParameterMenu = React.createClass({
    changeColor: function() {
      //TODO: Write this the react way...
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
    playPause: function() {
      musicInterface.playPause();
    },
    toggleMute: function() {
      musicInterface.toggleMute();
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
