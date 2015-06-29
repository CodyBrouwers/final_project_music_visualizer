var SortMenuHeader = React.createClass ({

  handleClick: function(){
    this.props.displaySortButtons();
  },

  render: function(){
    return (
    <p id="sort-header" onClick={this.handleClick} >sort</p>
    )
  } 

});