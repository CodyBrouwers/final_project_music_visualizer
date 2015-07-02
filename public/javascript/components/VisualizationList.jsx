var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var VisualizationList = React.createClass({

  _sortOptions: ['name', 'created_at', 'updated_at'],

  getInitialState: function(){
    return (
      { 
      sortBy: this._sortOptions[0], 
      filterText: '', 
      sortMenuDisplay: false,
      displaySoundcloudModal: false 
      }
    )
  },
  
  componentDidMount: function(){
    slipHover(this.refs.container.getDOMNode());
  },

  postNewViz: function() { 
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

  displaySoundcloudModal: function() {
    this.setState({displaySoundcloudModal: true})
  },

  hideSoundcloudModal: function() {
    this.setState({displaySoundcloudModal: false})
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
    if (self.state.sortBy === "created_at" || self.state.sortBy === "updated_at") {
      items.reverse();
    }
    items = items.filter(function(viz){
      return viz.name.toLowerCase().indexOf(self.state.filterText.toLowerCase()) > -1;
    })
    items = items.map(function(viz){
      return <VisualizationItem 
        viz={viz} 
        key={ "visualization-item-" + viz.id} 
        changePage={self.props.changePage}
        changeVisualization={self.props.changeVisualization} />;
    })
    return (
      <div>
        <div id="header">
          <div className="header-left">
            <h1 className="logo-text">NWMP</h1>
          </div>
          <div className="header-right">
            <i id="search-icon" className="fa fa-search"></i>
            <SearchBar filterText={this.state.filterText} onFilterInput={this.handleFilterInput} />
            <div id="sort-feature">
              <SortMenuHeader displaySortButtons={this.displaySortButtons} />
              { this.state.sortMenuDisplay && <SortMenu sortOptions={ this._sortOptions } changeSort={ this.changeSort } /> }
            </div>
            <div id="btn-new-viz" onClick={this.displaySoundcloudModal}>
              Create New Visualization
            </div>
          </div>
        </div>
        <div id="container" ref="container">
            {items}
        </div>
        {this.state.displaySoundcloudModal && 
          <SoundcloudInput 
          visualization={this.props.visualization} 
          changeVisualization={this.props.changeVisualization}
          changePage={this.props.changePage}
          hideSoundcloudModal={this.hideSoundcloudModal} />}
      </div>
    )
  }
});

Visualization.registerChangeCallback(function () {
  React.render( < AppView />, document.getElementById('app'))
})