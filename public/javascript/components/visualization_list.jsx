var VisualizationList = React.createClass({

  _sortOptions: ['name', 'created_at', 'updated_at'],

  getInitialState: function(){
    return { sortBy: this._sortOptions[0] }
  },
  
  componentDidMount: function(){
    slipHover(this.refs.container.getDOMNode());
  },

  postNewViz: function() {
    // TODO create new viz object
    // add it to visualizations
    // store it to the database
    // change pages
    var newViz = Visualization.createOne();
    this.props.changePage('Edit');
    this.props.changeVisualization(newViz);
  },

// TODO: Add back in sort into return {sortButtons}
 
  render: function(){
    var self = this;
    var items = _.sortBy(Visualization.getAll(), function(viz){return viz[self.state.sortBy]});
    var items = items.map(function(viz){
      return <VisualizationItem 
        viz={viz} 
        key={ "visualization-item-" + viz.id} 
        changePage={self.props.changePage}
        url = "http://lorempixel.com/250/250/fashion"
        changeVisualization={self.props.changeVisualization} />;
    })

    var sortButtons = _.map(self._sortOptions, function(sortOption){
      return <div className="sort-button" onClick={function(){
        self.setState({sortBy: sortOption});
      }}>{sortOption}</div>;
    })
    return (
      <div>
        <div id="header">
          <h1 id="logo-text">NWMP</h1>
            <div id="btn-new-viz" onClick={this.postNewViz}>
              Create New Visualization
            </div>
        </div>
        <div id="container" ref="container">
          {items}
        </div>
      </div>
    )
  }
});

Visualization.registerChangeCallback(function () {
  React.render( < AppView />, document.getElementById('app'))
})