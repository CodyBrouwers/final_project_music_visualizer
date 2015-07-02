var SortMenuHeader = React.createClass ({

  handleClick: function(){
    this.props.displaySortButtons();
  },

  render: function(){
    return (
    <div id="sort-header" onClick={this.handleClick} >Sort</div>
    )
  } 

});