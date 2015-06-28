var SearchBar = React.createClass ({

  handleChange: function(){
    this.props.onFilterInput(
      this.refs.filterText.getDOMNode().value
      );
  },

  render: function(){
    console.log(this.props.filterText);
    return (
      <div>
        <input id="search-bar" ref="filterText" value={this.props.filterText} onChange={this.handleChange} type="search" placeholder="Search by Song Name" />
       </div>
    )
  }
    
    

});