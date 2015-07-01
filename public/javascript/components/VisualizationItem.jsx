var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var VisualizationItem = React.createClass({

    handleClick: function(){
      this.props.changeVisualization(this.props.viz);
      this.props.changePage('Edit'); 
    },

    render: function() {
      return (
        <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionLeave={true}>
        <a className="viz" onClick={this.handleClick}>
        <img src={this.props.viz.image}
        title={this.props.viz.name}>
        </img></a>
        </ReactCSSTransitionGroup>
      )
    }

  });