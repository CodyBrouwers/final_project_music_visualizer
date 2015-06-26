var VisualizationItem = React.createClass({

    handleClick: function(){
      this.props.changeVisualization(this.props.viz);
      this.props.changePage('Edit'); 
    },

    render: function() {
      return <a className="viz" onClick={this.handleClick}>
        <img src={this.props.url}
        title={this.props.viz.name}>
        </img></a>
    }

  });