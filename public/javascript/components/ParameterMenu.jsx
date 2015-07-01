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
      if (event.target.value === "IcosahedronGeometry") {
        self.refs.icosahedron.getDOMNode().checked = 'true';
      } else if (event.target.value === "BoxGeometry") {
        self.refs.box.getDOMNode().checked = 'true';
      } else if (event.target.value === "TorusKnotGeometry") {
        self.refs.torusKnot.getDOMNode().checked = 'true';
      } else if (event.target.value === "PlaneGeometry") {
        self.refs.plane.getDOMNode().checked = 'true';
      }
      visualizer.setParams(shape)
      if (musicInterface.regionsLoaded() && !!this.props.visualization.path) {
        Transition.updateTransition(self.props.visualization.id);
      }
    },

    changeMatCap: function() {
      var self = this;
      var matCap = [{
        'type': 'matcap',
        'value': (event.target.src.slice(21))
      }];
      visualizer.setParams(matCap)
      console.log(visualizer.material.uniforms.tMatCap.value)
      if (musicInterface.regionsLoaded() && !!this.props.visualization.path) {
        Transition.updateTransition(self.props.visualization.id);
      }
    },

    updateAllParams: function (parameters) {

      var self = this
      var params;
      // Checks if parameters are passed in, in which case it will load initial region and transition
      if (parameters) {
        params = parameters;
      } else {
        params = visualizer.getParams();
      }
      // Change colors sliders on click of new region
      var colors = params[0].value.slice(4,-1).split(',');
      self.refs.red.getDOMNode().value = parseInt(colors[0]);
      self.refs.green.getDOMNode().value = parseInt(colors[1]);
      self.refs.blue.getDOMNode().value = parseInt(colors[2]);
      
      // Change shape selection on click of new region
      var shape = params[1].value;
      if (shape === "IcosahedronGeometry") {
        self.refs.icosahedron.getDOMNode().checked = 'true';
      } else if (shape === "BoxGeometry") {
        self.refs.box.getDOMNode().checked = 'true';
      } else if (shape === "TorusKnotGeometry") {
        self.refs.torusKnot.getDOMNode().checked = 'true';
      } else if (shape === "PlaneGeometry") {
        self.refs.plane.getDOMNode().checked = 'true';
      }
    },

    componentDidMount: function () {
      var self = this

      $(document).ajaxComplete(function (event, xhr, settings) {
        if (!$.isEmptyObject(self.refs) && settings.type === "GET") {
          var transitions = Transition.getAll();
          var firstParams = transitions[0].params;
          self.updateAllParams(firstParams);
        }
      });

      var wave = document.getElementById('wave');
      var play = document.getElementById('play');
      wave.addEventListener("click", function () {
        self.updateAllParams()
      });
      play.addEventListener("click", function () {
        musicInterface.waveSurfer.on("region-in", function () {
          self.updateAllParams();
        });
      });

    },

    render: function(){
      numOfMatCaps = 9;
      matCapItems = new Array(numOfMatCaps);
      for (var i = 0; i < numOfMatCaps; i++) {
        matCapItems[i] = (<MatCapItem imgIndex={i+1} changeMatCap={this.changeMatCap} />)
      }
      return (
        <div className="menu-drawer">
          <div className="menu">
            <fieldset>
              <legend>Color</legend>
              <ul className="color">
                <li>
                  <form htmlFor='input-red'>Red</form>
                  <input id='input-red' type='range' ref="red" max="255" defaultValue="0" onChange={this.changeColorParams}/>
                </li>
                <li>
                  <form htmlFor='input-green'>Green</form>
                  <input id='input-green' type='range' ref="green" max="255" defaultValue="0" onChange={this.changeColorParams}/>
                </li>
                <li>
                  <form htmlFor='input-blue'>Blue</form>
                  <input id='input-blue' type='range' ref="blue" max="255" defaultValue="0" onChange={this.changeColorParams}/>
                </li>
              </ul>
            </fieldset>
            <fieldset>
              <legend>Shape</legend>
              <ul className='shape'>
                <li>
                  <label>Torus Knot</label>
                  <input type="radio" ref="torusKnot" name="shape" value="TorusKnotGeometry" onClick={this.changeShape}/>
                </li>
                <li>
                  <label>Not Sphere?</label>
                  <input type="radio" ref="icosahedron" name="shape" value="IcosahedronGeometry" onClick={this.changeShape}/>
                </li>
                <li>
                  <label>Cube</label>
                  <input type="radio" ref="box" name="shape" value="BoxGeometry" onClick={this.changeShape}/>
                </li>
                <li>
                  <label>Plane</label>
                  <input type="radio" ref="plane" name="shape" value="PlaneGeometry" onClick={this.changeShape}/>
                </li>
                
              </ul>
            </fieldset>
            <fieldset>
              <legend>Material</legend>
              {matCapItems}
            </fieldset>
          </div>
        </div> 
      )
    }
  });
