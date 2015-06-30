var musicInterface = Object.create(MusicInterface);
var visualizer = Object.create(WebGLVisualizer);

var EditView = React.createClass({

  getInitialState: function() {
    return { transitions: Transition.fetchAll }
  },

  handleClick: function() {
    this.props.changePage('List');
    musicInterface.destroy();
  },

  updateName: function(event){
    var viz = this.props.visualization
    viz.name = event.target.value;
    Visualization.updateOne(viz);
  },

  render: function(){
    var self = this;
    return (
      <div>
        <div className='viz-container'>
        <div id="header">
          <div className="header-left" onClick={self.handleClick}>
            <h1 className="logo-text">NWMP</h1>
          </div>
        </div>
          <ParameterMenu visualization={this.props.visualization} />
          <h1 id="vizname">{this.props.visualization.name}</h1>
          <AudioWave visualization={this.props.visualization} />
        </div>
      </div>
    )
  },

  componentDidMount: function() {
    var self = this;
    $('.viz-container').append(visualizer.renderer.domElement);
    visualizer.animate();
    Transition.fetchAll(self.props.visualization.id);
  } 

});

Transition.registerChangeCallback(function () {
  React.render( < AppView />, document.getElementById('app'))
});

// input of song name:

// <input 
//           type="text" 
//           defaultValue={this.props.visualization.name} 
//           onBlur={this.updateName} />