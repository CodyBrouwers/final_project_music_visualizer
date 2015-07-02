var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var SoundcloudInput = React.createClass({

  createNew: function () {
    var newViz = Visualization.createOne();
    this.props.changeVisualization(newViz);
    var url = this.refs.url.getDOMNode().value;
    var streamURL = SoundCloud.loadStreamUrl(newViz, url);
    this.props.changePage('Edit');
    this.refs.url.getDOMNode().value = '';
  },
  
  render: function(){
    var self = this;
    return (
      <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionLeave={true}>
      <div className="soundcloud-modal">
        <i id="soundcloud-close" className="fa fa-times fa-2" onClick={this.props.hideSoundcloudModal}></i>
        <p>Please enter a SoundCloud URL to begin:</p>
        <input id='songURL' type='text' ref="url" placeholder="SoundCloud URL" />
        <div id="soundcloud-load" onClick={this.createNew}>Load</div>
      </div>
      </ReactCSSTransitionGroup>
    )
  }

});
