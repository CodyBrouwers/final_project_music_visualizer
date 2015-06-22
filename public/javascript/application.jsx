(function() {

  /** @jsx React.DOM */
  
  // var WebGLVisualization = require('./webgl-viz.jsx');
  
  var AppView = React.createClass({
    getInitialState: function () {
      return {
        page: 'List'
      }
    },
    changePage: function(page, song_path){
      this.setState({page: page, song_path: song_path});
    },

    render: function(){
      if (this.state.page === 'List'){
        return <VisualizationList key='list' changePage={this.changePage}/>;
      } else {
        return <EditView key='edit' changePage={this.changePage}/>;
      }
    }
  });

  var VisualizationItem = React.createClass({

    handleClick: function(){
      console.log('handleclick called');
      return this.props.changePage('Edit'); 
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
        return <VisualizationItem v={v} key={ "visualization-item-" + v.id} changePage={self.props.changePage} />;
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
      return this.props.changePage('List');
    },

    render: function(){
      var self = this;
      return (
        <div>
          <h1>Edit View</h1>
          <p onClick={function(){
            self.props.parent.changePage('List', null);
          }}>Back to List</p>
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
      musicInterface = startMusicInterface();
      musicInterface.animate();
      musicInterface.loadSong(this.props.parent.state.song_path);
      // console.log();
      $('.viz-container').append(musicInterface.renderer.domElement);
    } 
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
            <button data-action="backward" >Backwards</button>
            <button data-action="play">Play/Pause</button>
            <button data-action="forward">Forwards</button>
            <button data-action="toggle-mute">Mute</button>
            <button data-action="add-transition">Add Transition</button>
          </div>
          <div id="wave"></div>
          <div id="wave-timeline"></div>

          <p id="drop">Drop your file here</p>
        </div>
      );
    },
    componentDidMount: function () {
      Menu();
    }
  })

  React.render(
    <AppView />,
    document.getElementById('app')
  );

})();
