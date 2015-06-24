var musicInterface = Object.create(MusicInterface);
var visualizer = Object.create(WebGLVisualizer);


var EditView = React.createClass({

  handleClick: function() {
    musicInterface.destroy();
    this.props.changePage('List');
  },

  render: function(){
    var self = this;
    return (
      <div>
        <h1>Edit View</h1>
        <p onClick={this.handleClick}>
        Back to List</p>
        <div className='viz-container'>
          <ParameterMenu />
        </div>
        <AudioWave visualization={this.props.visualization} postTransition={this.postTransition} />
      </div>
    )
  },

  getTransitions: function(id) {
    var request = $.ajax({  
      type: "GET",
      url: "/visualizations/" + id + '/transitions',
      dataType: 'json',
    });

    request.done(function(transitions) {
      if (transitions.length !== 0) {
        transitions.forEach(function(transition, index) {
          transition['params'] = JSON.parse(transition['params']);
        });
        this.setState({transitions: transitions})
        console.log(transitions[transitions.length-1]['params']);
        visualizer.setParams(transitions[transitions.length-1]['params'])
      } else {
        this.postTransition(id, 0.0, visualizer.getParams()).done(
          )
        this.setState({transitions: transitions})
        musicInterface.currentTransition = this.state.transitions;
      }
    }).bind(this)
  },

  postTransition: function(id, time, params) {
    console.log(params);
    var request = $.ajax({
      type: "POST",
      url: "/visualizations/" + id + '/transitions',
      data: {'time': time, 'params': JSON.stringify(params)},
      dataType: 'json',
    });

    request.done(function(transitions) {
      this.setState({transitions: transitions})
    }).bind(this);
  },

  componentDidMount: function() {
    //TODO think of a better way of seperating this so that the timeline
    //is initiated at the right time.
    $('.viz-container').append(visualizer.renderer.domElement);
    visualizer.animate();
    if (this.props.visualization != undefined) {
      musicInterface.loadSong(this.props.visualization.song_path);
      this.getTransitions(this.props.visualization.id)
    }
  } 
});