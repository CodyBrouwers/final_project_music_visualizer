var VisualizationList = React.createClass({

  _sortOptions: ['song_name', 'created_at', 'updated_at'],

  getInitialState: function(){
    return { sortBy: this._sortOptions[0] }
  },
  
  componentDidMount: function(){
    slipHover(this.refs.container.getDOMNode());
  },

  handleClick: function() {
    this.props.changePage('Edit');
    this.props.resetVisualization();
  },

  postNewViz: function() {
    // TODO create new viz object
    // add it to visualizations
    // store it to the database
    // change pages
    var viz={id: Math.floor(10000 * Math.random()), song_name: 'new song'};
    this.props.addVisualization(viz);
    this.props.changePage('Edit');
    this.props.resetVisualization();
    $.ajax({
      type: "POST",
      url: "/visualizations/new",
      dataType: 'json',
      success: function() {
        console.log('posted');
      },
      error: function() {
        alert('error saving new viz');
      }  
    });
  },

  render: function(){
    var self = this;
    var items = _.sortBy(Visualization._visualizations, function(viz){return viz[self.state.sortBy]});
    console.log('Items:', items);
    var items = items.map(function(viz){
      return <VisualizationItem 
        viz={viz} 
        key={ "visualization-item-" + viz.id} 
        changePage={self.props.changePage} 
        changeVisualization={self.props.changeVisualization} />;
    })

    var sortButtons = _.map(self.sortOptions, function(sortOption){
      return <div className="sort-button" onClick={function(){
        self.setState({sortBy: sortOption});
      }}>{s}</div>;
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