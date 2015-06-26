var ParameterMenu = React.createClass({
    changeColor: function() {
      //HACK: Write this the react way...
      var red = $('#input-red').val();
      var green = $('#input-green').val();
      var blue = $('#input-blue').val();
      var param = [{
        'type': 'color',
        'value': 'rgb('+red+','+green+','+blue+')'
      }];
      visualizer.setParams(param)
      visualizer.getParams();
      Transition.updateTransition(this.props.visualization.id);
    },
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