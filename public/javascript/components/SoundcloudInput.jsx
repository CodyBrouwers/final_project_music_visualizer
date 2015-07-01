var SoundcloudInput = React.createClass({

  createNew: function () {
    var url = this.refs.url.getDOMNode().value;
    var streamURL = SoundCloud.loadStreamUrl(this.props.visualization, url);
    this.props.changePage('Edit'); 
    this.refs.url.getDOMNode().value = '';
  },
  
  render: function(){
    var self = this;
    return (
      <div className="soundcloud-input">
        <form htmlFor='newVisualization'>Please Paste any SoundCloud URL:</form>
        <input id='songURL' type='text' ref="url" placeholder="SoundCloud URL" style={{color: '#000'}} />
        <button onClick={this.createNew} style={{color: '#000'}}>Load</button>
      </div>
    )
  }

});

