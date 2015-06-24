var VisualizationList = React.createClass({

    sortOptions: ['song_name', 'created_at', 'updated_at'],

    getInitialState: function(){
      return { sortBy: this.sortOptions[0] };
    },
    
    componentDidMount: function(){
      slipHover(this.refs.container.getDOMNode());
    },

    handleClick: function() {
      this.props.changePage('Edit');
      this.props.resetVisualization();
    },

    render: function(){
      var self = this;
      var items = _.sortBy(this.props.visualizations, function(v){return v[self.state.sortBy]});
      var items = items.map(function(v){
      // TODO Move song_path up to VisualizationItem
        return <VisualizationItem 
          v={v} 
          key={ "visualization-item-" + v.id} 
          changePage={self.props.changePage} 
          changeVisualization={self.props.changeVisualization} />;
      })
      var sortButtons = _.map(self.sortOptions, function(s){
        return <div className="sort-button" onClick={function(){
          self.setState({sortBy: s});
        }}>{s}</div>;
      })
      return (
        <div>
          <h1>List View</h1>
          <button onClick={this.handleClick}>
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