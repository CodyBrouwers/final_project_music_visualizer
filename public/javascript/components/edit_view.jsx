var musicInterface = Object.create(MusicInterface);
var visualizer = Object.create(WebGLVisualizer);

var EditView = React.createClass({

  handleClick: function() {
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
    // var postRequest = self.postTransition(id, 0.0, visualizer.getParams())

    return (
      <div>
        <h1>Edit View</h1>
        <input type="text" defaultValue={this.props.visualization.name} onBlur={this.updateName} />
        <p onClick={this.handleClick}>
        Back to List</p>
        <h1 id="vizname">{this.props.visualization.name}</h1>
        <div className='viz-container'>
          <ParameterMenu />
        </div>
        <AudioWave visualization={this.props.visualization} postTransition={this.postTransition} />
      </div>
    )
  },

  postTransition: function(id, time, params) {
    var self = this;
    var request = $.ajax({
      type: "POST",
      url: "/visualizations/" + id + '/transitions',
      data: {'time': time, 'params': JSON.stringify(params)},
      dataType: 'json',
    });

    return request.done(function(transitions) {
      transitions.forEach(function(transition, index) {
          transition['params'] = JSON.parse(transition['params']);
        });
      // self.setState({transitions: transitions})
      musicInterface.addTransition(); 
    });
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