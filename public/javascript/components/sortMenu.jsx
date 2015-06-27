var SortMenu = React.createClass ({

  render: function() {
    var self = this;
    var buttons = _.map(self.props.sortOptions, function(sortOption){
      return <div className="sort-button" onClick={function() {
        self.setState({sortBy: sortOption});
      }}>{sortOption}</div>;
    })
    return (<div>{buttons}</div>);
  } 

});