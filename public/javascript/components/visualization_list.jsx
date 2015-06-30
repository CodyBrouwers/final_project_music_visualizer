var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var VisualizationList = React.createClass({

  _sortOptions: ['name', 'created_at', 'updated_at'],

  getInitialState: function(){
    return (
      { 
      sortBy: this._sortOptions[0], 
      filterText: '', 
      sortMenuDisplay: false 
      }
    )
  },
  
  componentDidMount: function(){
    slipHover(this.refs.container.getDOMNode());
  },

  postNewViz: function() {
    var newViz = Visualization.createOne();
    SoundCloud.init;
    SoundCloud.loadStreamUrl('https://soundcloud.com/iameklo/eklo-lets-go-home-original-mix');
    this.props.changePage('Edit');
    this.props.changeVisualization(newViz);
  },

  changeSort: function (sortOption) {
    this.setState({sortBy: sortOption});
  },

  displaySortButtons: function() {
    if (this.state.sortMenuDisplay === false) {
      this.setState({sortMenuDisplay: true});
    } else {
      this.setState({sortMenuDisplay: false});
    }
  },

  handleFilterInput: function(filterText){
    console.log("handleFilterInput: ", filterText);
    this.setState({
      filterText: filterText
    });
  },

// TODO: Add back in sort into return {sortButtons}
 
  render: function(){
    var props = this.props;
    var self = this;
    var items = _.sortBy(Visualization.getAll(), function(viz){return viz[self.state.sortBy]});
    items = items.filter(function(viz){
      return viz.name.toLowerCase().indexOf(self.state.filterText.toLowerCase()) > -1;
    })
    items = items.map(function(viz){
      return <VisualizationItem 
        viz={viz} 
        key={ "visualization-item-" + viz.id} 
        changePage={self.props.changePage}
        url = "http://lorempixel.com/250/250/fashion"
        changeVisualization={self.props.changeVisualization} />;
    })
    return (
      <div>
        <div id="header">
          <h1 className="logo-text">NWMP</h1>
          <i id="search-icon" className="fa fa-search"></i>
          <i id="sort-icon" className="fa fa-sort"></i>
          <SearchBar filterText={this.state.filterText} onFilterInput={this.handleFilterInput} />
          <SortMenuHeader displaySortButtons={this.displaySortButtons} />
          { this.state.sortMenuDisplay && <SortMenu sortOptions={ this._sortOptions } changeSort={ this.changeSort } /> }
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