var ParameterMenu = React.createClass({

    changeColorParams: function () {
      var self = this;
      var red = this.refs.red.getDOMNode().value
      var green = this.refs.green.getDOMNode().value
      var blue = this.refs.blue.getDOMNode().value
      var colors = [{
        'type': 'color',
        'value': 'rgb('+red+','+green+','+blue+')'
      }];
      var old = visualizer.getParams();
      visualizer.setParams(colors);
      waitForRegions();
      function waitForRegions() {
        if (!musicInterface.regionsLoaded()) {
          setTimeout(waitForRegions, 100);
        } else {
          Transition.updateTransition(self.props.visualization.id);
        }
      }
      // this.updateColorParams;
    },
    
    // updateColorParams: function () {
    //   var v = visualizer.getParams();
    //   var r = this.refs.red.getDOMNode().value;
    //   r = 0;
    //   console.log(v);
    // },

    changeShape: function() {
      var param = [{
      'type': 'geometry',
      'value': event.target.value
      }];
      visualizer.setParams(param)
      Transition.updateTransition(this.props.visualization.id);
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
                  <input id='input-red' type='range' ref="red" max="255" defaultValue='240'  onChange={this.changeColorParams}/>
                </li>
                <li>
                  <form htmlFor='input-green'>Green</form>
                  <input id='input-green' type='range' ref="green" max="255" defaultValue='100' onChange={this.changeColorParams}/>
                </li>
                <li>
                  <form htmlFor='input-blue'>Blue</form>
                  <input id='input-blue' type='range' ref="blue" max="255" defaultValue='30' onChange={this.changeColorParams}/>
                </li>
              </ul>
            </fieldset>
            <fieldset>
              <legend>Shape</legend>
              <ul className='shape'>
                <li>
                  <label>Sphere</label>
                  <input type="radio" name="shape" value="SphereGeometry" onClick={this.changeShape}/>
                </li>
                <li>
                  <label>Cube</label>
                  <input type="radio" name="shape" value="BoxGeometry" onClick={this.changeShape}/>
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
