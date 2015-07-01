var NewView = React.createClass({

  createNew: function () {
    var url = this.refs.url.getDOMNode().value;
    console.log(this.props.visualization);
    var streamURL = SoundCloud.loadStreamUrl(this.props.visualization, url);
    this.props.changePage('Edit'); 
    this.refs.url.getDOMNode().value = '';
  },
  
  handleClick: function() {
    this.props.changePage('List');
  },

  render: function(){
    var self = this;
    return (
      <div>
        <div className="header-left" onClick={self.handleClick}>
          <h1 className="logo-text">NWMP</h1>
        </div>
        <form htmlFor='newVisualization'>Paste your SoundCloud URL:</form>
        <input id='songURL' type='text' ref="url" placeholder="SoundCloud URL" style={{color: '#000'}} />
        <button onClick={this.createNew} style={{color: '#000'}}>Load</button>
      </div>
    )
  }

});