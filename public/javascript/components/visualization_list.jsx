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

  render: function(){
    var self = this;
    var items = _.sortBy(Visualization._visualizations, function(viz){return viz[self.state.sortBy]});
    var items = items.map(function(viz){
      return <VisualizationItem 
        viz={viz} 
        key={ "visualization-item-" + viz.id} 
        changePage={self.props.changePage} 
        changeVisualization={self.props.changeVisualization} />;
    })

    var sortButtons = _.map(self._sortOptions, function(sortOption){
      return <div className="sort-button" onClick={function(){
        self.setState({sortBy: sortOption});
      }}>{sortOption}</div>;
    })
    return (
      <div>
        <h1>List View</h1>
        <button onClick={this.postNewViz}>
          New Visual
        </button>
        {sortButtons}
        <div id="container" ref="container">
          {items}
        </div>
      </div>
    )
  }
});

//To Do: Should this be here or elsewhere?
Visualization.registerChangeCallback(function () {
  React.render( < AppView />, document.getElementById('app'))
})