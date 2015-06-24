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
    $.ajax({  
      type: "GET",
      url: "/visualizations/" + id + '/transitions',
      dataType: 'json',
      success: function(transitions) {
        if (!(transitions.length === 0)) {
          transitions.forEach(function(transition, index) {
            transition['params'] = JSON.parse(transition['params']);
          });
          this.setState({transitions: transitions})
          musicInterface.setVisualizerParams(transitions[transitions.length-1]['params'])
        } else {
          this.postTransition(id, 0.0, musicInterface.getVisualizerParams())
        }
      }.bind(this)
    });
  },

  postTransition: function(id, time, params) {
    $.ajax({
      type: "POST",
      url: "/visualizations/" + id + '/transitions',
      data: {'time': time, 'params': JSON.stringify(params)},
      dataType: 'json',
      success: function(transitions) {
        this.setState({transitions: transitions})
      }.bind(this)
    });
  },

  componentDidMount: function() {
    //TODO think of a better way of seperating this so that the timeline
    //is initiated at the right time.
    $('.viz-container').append(musicInterface.renderer.domElement);
    musicInterface.animate();
    if (this.props.visualization.path != null) {
      musicInterface.loadSong(this.props.visualization.path);
      this.getTransitions(this.props.visualization.id)
    }
  } 
});