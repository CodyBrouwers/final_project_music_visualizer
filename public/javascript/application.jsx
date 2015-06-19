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

    render: function(){
      if (this.state.page === 'List'){
        return <VisualizationList key='list' parent={this}/>;
      } else {
        return <EditView key='edit' parent={this}/>;
      }
    }
  });

  var VisualizationList = React.createClass({
    propTypes: {
      parent: React.PropTypes.any.isRequired
    },

    getInitialState: function(){
      return { visualizations: [] }
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
      var self = this;
      var items = this.state.visualizations.map(function(v){
        return <li key={ "visualization-item-" + v.id }onClick={function(){
          self.props.parent.changePage('Edit');
        }}>{v.song_name}</li>
      })
      console.log(items);
      return (
        <div>
          <h1>List View</h1>
          <div>
            {items}
          </div>
        </div>
      )
    }
  });

  var EditView = React.createClass({
    render: function(){
      var self = this;
      return (
        <div>
          <h1>Edit View</h1>
          <p onClick={function(){
            self.props.parent.changePage('List');
          }}>Back to List</p>
          <WebGLVisualizer />
          <AudioWave />
        </div>
      )
    } 
  });

  var WebGLVisualizer = React.createClass({
    render: function() {
      return (
        <div>
          <div className='viz-container'>
            <ParameterMenu />
          </div>
        </div>
      );
    },
  });

  var ParameterMenu = React.createClass({
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
                  <input id='input-red' type='number' name="red"/>
                </li>
                <li>
                  <form htmlFor='input-green'>Green</form>
                  <input id='input-green' type='number' name="green"/>
                </li>
                <li>
                  <form htmlFor='input-blue'>Blue</form>
                  <input id='input-blue' type='number' name="blue"/>
                </li>
              </ul>
            </fieldset>
            <fieldset>
              <legend>Shape</legend>
              <ul className='shape'>
                <li>
                  <label>Sphere</label>
                  <input type="radio" name="shape" value="sphere"/>
                </li>
                <li>
                  <label>Cube</label>
                  <input type="radio" name="shape" value="cube"/>
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
  })

  var AudioWave = React.createClass({
    render: function(){
      return (
        <div className="wave-container">
          <div className="controls">
            <button data-action="backward">Backwards</button>
            <button data-action="play">Play/Pause</button>
            <button data-action="forward">Forwards</button>
            <button data-action="toggle-mute">Mute</button>
          </div>
          <div id="wave"></div>
          <div id="wave-timeline"></div>

          <p id="drop">Drop your file here</p>
        </div>
      );
    },
    componentDidMount: function () {
      wavesurfer = Waveform();
      var $container = $('.viz-container');
      var viz = new VIZ.Simple($container, wavesurfer.WebAudio.Data);
      Menu();
    }
  })

  React.render(
    <AppView />,
    document.getElementById('app')
  );

})();
