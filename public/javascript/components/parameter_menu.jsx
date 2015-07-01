var ParameterMenu = React.createClass({

    changeColorParams: function () {
      var self = this;
      var red = this.refs.red.getDOMNode().value;
      var green = this.refs.green.getDOMNode().value;
      var blue = this.refs.blue.getDOMNode().value;
      var colors = [{
        'type': 'color',
        'value': 'rgb('+red+','+green+','+blue+')'
      }];
      visualizer.setParams(colors);
      if (musicInterface.regionsLoaded() && !!this.props.visualization.path) {
        Transition.updateTransition(self.props.visualization.id);
      }
    },

    changeShape: function() {
      var self = this;
      var shape = [{
      'type': 'geometry',
      'value': event.target.value
      }];
      if (event.target.value === "SphereGeometry") {
        self.refs.sphere.getDOMNode().checked = 'true';
      } else if (event.target.value === "BoxGeometry") {
        self.refs.box.getDOMNode().checked = 'true';
      }
      visualizer.setParams(shape)
      if (musicInterface.regionsLoaded() && !!this.props.visualization.path) {
        Transition.updateTransition(self.props.visualization.id);
      }
    },

    updateAllParams: function () {
      var self = this
      var params = visualizer.getParams();

      // Change colors sliders on click of new region
      var colors = params[0].value.slice(4,-1).split(',');
      self.refs.red.getDOMNode().value = parseInt(colors[0]);
      self.refs.green.getDOMNode().value = parseInt(colors[1]);
      self.refs.blue.getDOMNode().value = parseInt(colors[2]);
      
      // Change shape selection on click of new region
      var shape = params[1].value;
      if (shape === "SphereGeometry") {
        self.refs.sphere.getDOMNode().checked = 'true';
      } else if (shape === "BoxGeometry") {
        self.refs.box.getDOMNode().checked = 'true';
      }
    },

    componentDidMount: function () {
      var self = this
      var wave = document.getElementById('wave');
      var play = document.getElementById('play');
      wave.addEventListener("click", self.updateAllParams);
      play.addEventListener("click", function () {
        musicInterface.waveSurfer.on("region-in", self.updateAllParams);
      });
    },

    render: function(){
      return (
        <div className="menu-drawer">
          <div className="menu">
            <fieldset>
              <legend>Color</legend>
              <ul className="color">
                <li>
                  <form htmlFor='input-red'>Red</form>
                  <input id='input-red' type='range' ref="red" max="255" defaultValue="240" onChange={this.changeColorParams}/>
                </li>
                <li>
                  <form htmlFor='input-green'>Green</form>
                  <input id='input-green' type='range' ref="green" max="255" defaultValue="100" onChange={this.changeColorParams}/>
                </li>
                <li>
                  <form htmlFor='input-blue'>Blue</form>
                  <input id='input-blue' type='range' ref="blue" max="255" defaultValue="30" onChange={this.changeColorParams}/>
                </li>
              </ul>
            </fieldset>
            <fieldset>
              <legend>Shape</legend>
              <ul className='shape'>
                <li>
                  <label>Sphere</label>
                  <input type="radio" ref="sphere" name="shape" value="SphereGeometry" onClick={this.changeShape}/>
                </li>
                <li>
                  <label>Cube</label>
                  <input type="radio" ref="box" name="shape" value="BoxGeometry" onClick={this.changeShape}/>
                </li>
              </ul>
            </fieldset>
          </div>
        </div> 
      )
    }
  });
