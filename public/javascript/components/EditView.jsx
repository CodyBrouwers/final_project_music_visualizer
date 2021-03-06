var musicInterface = Object.create(MusicInterface);
var visualizer = Object.create(WebGLVisualizer);

var EditView = React.createClass({

  getInitialState: function() {
    return { transitions: Transition.fetchAll, toggleText: 'Hide' }
  },

  handleClick: function() {
    musicInterface.currentRegion = undefined;
    window.removeEventListener('resize', visualizer.onWindowResize)
    visualizer.cancelAnimate();
    musicInterface.destroy();
    Transition._transitions = [];
    this.props.changePage('List');
  },

  updateName: function(event){
    var viz = this.props.visualization
    viz.name = event.target.value;
    Visualization.updateOne(viz);
  },

  changeToggleText: function(){
    this.state.toggleText === 'Hide' ? this.setState({toggleText: 'View Controls'}) : this.setState({toggleText: 'Hide'});
  },

  render: function(){
    var self = this;
    return (
      <div>
        <ParameterMenu visualization={this.props.visualization} />
        <div id="toggle" onClick={this.changeToggleText}>{this.state.toggleText}</div>
        <div className='viz-container'>
          <div id="header">
            <div className="header-left" onClick={self.handleClick}>
              <h1 className="logo-text">NWMP</h1>
            </div>
          </div>
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
    $('#toggle').on('click', function(){
      $('.menu-drawer').toggleClass('hidden');
    })
  },

  componentWillMount: function () {
    Transition.fetchAll(this.props.visualization.id);
   var scrollPosition = document.body.scrollTop;
    document.body.scrollTop -= scrollPosition;
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