var SortMenu = React.createClass ({

  render: function(){
    var self = this;
    console.log(self.props.sortOptions);  
    var buttons = _.map(self.props.sortOptions, function(sortOption){
      return 
      <div className="sort-button" onClick={function(){
        self.setState({sortBy: sortOption});
      }}>{sortOption}</div>;
    })
    return buttons;
  } 

});