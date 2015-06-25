var musicInterface = Object.create(MusicInterface);
var visualizer = Object.create(WebGLVisualizer);


var EditView = React.createClass({

  getInitialState: function() {
    return { transitions: [] }
  },

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
    return (
      <div>
        <h1>Edit View</h1>
        <input 
          type="text" 
          defaultValue={this.props.visualization.name} 
          onBlur={this.updateName} />
        <p onClick={this.handleClick}>
        Back to List</p>
        <div className='viz-container'>
          <ParameterMenu 
          postTransition={this.postTransition} 
          transitions={this.state.transitions} />
        </div>
        <AudioWave 
          visualization={this.props.visualization} 
          postTransition={this.postTransition} 
          transitions={this.state.transitions} />
      </div>
    )
  },

  getTransitions: function(id) {
    var self = this;
    var request = $.ajax({  
      type: "GET",
      url: "/visualizations/" + id + '/transitions',
      dataType: 'json',
    }).done(function(transitions) {
      if (transitions.length !== 0) {
        transitions.forEach(function(transition, index) {
          transition['params'] = JSON.parse(transition['params']);
        });
        self.setState({transitions: transitions})
        visualizer.setParams(transitions[0]['params']);
        musicInterface.setTransitions(transitions);
      } else {
        self.postTransition(id, 0.0, visualizer.getParams())
      }
    });
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
      self.setState({transitions: transitions})
      musicInterface.addTransition(transitions[transitions.length-1]); 
    });
  },

  componentDidMount: function() {
    //TODO think of a better way of seperating this so that the timeline
    //is initiated at the right time.
    var self = this;
    $('.viz-container').append(visualizer.renderer.domElement);
    visualizer.animate();
    if (this.props.visualization.path != undefined) {
      musicInterface.loadSong(this.props.visualization.path);
      musicInterface.waveSurfer.on('ready', function() {
        self.getTransitions(self.props.visualization.id)
      });
    }
  } 
});