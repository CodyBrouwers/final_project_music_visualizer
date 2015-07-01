var SoundcloudInput = React.createClass({

  createNew: function () {
    console.log(this.props)
    var url = this.refs.url.getDOMNode().value;
    var streamURL = SoundCloud.loadStreamUrl(this.props.visualization, url);
    this.props.changePage('Edit');
    this.refs.url.getDOMNode().value = '';
  },
  
  render: function(){
    var self = this;
    return (
      <div className="soundcloud-modal">
        <i id="soundcloud-close" className="fa fa-times fa-2" onClick={this.props.hideSoundcloudModal}></i>
        <p>Enter any SoundCloud URL below:</p>
        <input id='songURL' type='text' ref="url" placeholder="SoundCloud URL" />
        <div id="soundcloud-load" onClick={this.createNew}>Load</div>
      </div>
    )
  }

});

// <form htmlFor='newVisualization'>Please Paste any SoundCloud URL:</form>

