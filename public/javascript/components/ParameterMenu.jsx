var ParameterMenu = React.createClass({

    changeShape: function() {
      var self = this;
      var shape = [{
      'type': 'geometry',
      'value': event.target.value
      }];
      this.selectShape(event.target.value);
      visualizer.setParams(shape)
      this.updateTransition();
    },

    changeMatCap: function() {
      var matCap = [{
        'type': 'matcap',
        'value': (event.target.src.slice(21))
      }];
      visualizer.setParams(matCap)
      this.updateTransition()
    },

    toggleEffect: function() {
      var self = this;
      var effect = [{
        'type': 'effect',
        'value': event.target.value }];
      visualizer.setParams(effect);
      self.updateTransition();
    },

    updateTransition: function() {
      var self = this;
      if (musicInterface.regionsLoaded() && !!self.props.visualization.path) {
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
      // Change shape selection on click of new region
      var shape = params[0].value;
      this.selectShape(shape);
      this.checkEffects(params[2].value)
    },

    selectShape: function(shape) {
      if (shape === "IcosahedronGeometry") {
        this.refs.icosahedron.getDOMNode().checked = 'true';
      } else if (shape === "BoxGeometry") {
        this.refs.box.getDOMNode().checked = 'true';
      } else if (shape === "TorusKnotGeometry") {
        this.refs.torusKnot.getDOMNode().checked = 'true';
      } else if (shape === "PlaneGeometry") {
        this.refs.plane.getDOMNode().checked = 'true';
      }
    },

    checkEffects: function(effectParams) {
      var self = this;
      Object.keys(effectParams).forEach(function (effectKey) {
        document.getElementById(effectKey).checked = effectParams[effectKey];
      });
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
      var numOfMatCaps = 9;
      var matCapItems = new Array(numOfMatCaps);
      for (var i = 0; i < numOfMatCaps; i++) {
        matCapItems[i] = (<MatCapItem imgIndex={i+1} changeMatCap={this.changeMatCap} />)
      }
      var effectArr = [
        {name:"Vignette", value:"VignetteShader"},
        // {name:"Bloom", value:"BloomShader"},
        {name:"Film", value:"FilmShader"},
        {name:"Technicolor", value:"TechnicolorShader"},
        // {name:"Glitch", value:"DigitalGlitch"},
        {name:"Edge Highlights", value:"EdgeShader"},
        {name:"Alternate Edge Highlights", value:"EdgeShader2"},
        {name:"Dot Screen", value:"DotScreenShader"},
        {name:"RGB Shift", value:"RGBShiftShader"},
        {name:"Mirror", value:"MirrorShader"},
        {name:"Kaleidoscope", value:"KaleidoShader"}];
      var effectsItems = [];
      effectArr.forEach(function(effect, index) {
        effectsItems[index] = (<li><EffectCheckBox effectName={effect.name} effectValue={effect.value} toggleEffect={this.toggleEffect} /></li>)
      }, this)
      return (
        <div className="menu-drawer">
          <div className="menu">
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
            <fieldset>
              <legend>Effects</legend>
              <ul>
                {effectsItems}
              </ul>
            </fieldset>
          </div>
        </div> 
      )
    }
  });
