var VisualizationItem = React.createClass({

    handleClick: function(){
      this.props.changeVisualization(this.props.v);
      this.props.changePage('Edit'); 
    },

    render: function() {
      return <a className="viz" onClick={this.handleClick}>
        <img src="http://static.guim.co.uk/sys-images/Guardian/Pix/pictures/2014/4/11/1397210130748/Spring-Lamb.-Image-shot-2-011.jpg"  title={this.props.v.song_name}>
        </img></a>
    }

  });