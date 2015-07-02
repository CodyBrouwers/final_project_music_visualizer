
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var SortMenu = React.createClass ({

  render: function(){
    var self = this;
    var buttons = _.map(self.props.sortOptions, function(sortOption){
      return <div className="sort-button" onClick={function(){
        self.props.changeSort(sortOption);
        self.props.displaySortButtons();
      }}>{sortOption}</div>;
    })
    return (
      <ReactCSSTransitionGroup transitionName="sortslide" transitionAppear={true} transitionLeave={true}>
        <div className="sort-menu">{buttons}</div>
      </ReactCSSTransitionGroup>
      );
  } 

});