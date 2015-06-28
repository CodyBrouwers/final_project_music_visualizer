var musicInterface = Object.create(MusicInterface);
var visualizer = Object.create(WebGLVisualizer);

var EditView = React.createClass({

  getInitialState: function() {
    return { transitions: Transition.fetchAll }
  },

  handleClick: function() {
    visualizer.cancelAnimate();
    musicInterface.destroy();
    this.props.changePage('List');
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
        <h1>Edit View</h1>
        <input 
          type="text" 
          defaultValue={this.props.visualization.name} 
          onBlur={this.updateName} />
        <p onClick={this.handleClick}>
        Back to List</p>
        <h1 id="vizname">{this.props.visualization.name}</h1>
        <div className='viz-container'>
          <ParameterMenu visualization={this.props.visualization} />
        </div>
        <AudioWave visualization={this.props.visualization} />
      </div>
    )
  },

  componentDidMount: function() {
    var self = this;
    $('.viz-container').append(visualizer.renderer.domElement);
    id = visualizer.animate();
    Transition.fetchAll(self.props.visualization.id);
  }

});

Transition.registerChangeCallback(function () {
  React.render( < AppView />, document.getElementById('app'))
});