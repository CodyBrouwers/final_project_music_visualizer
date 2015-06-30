var AppView = React.createClass({
    getInitialState: function () {
      return {
        page: 'List',
        visualization: null
      }
    },

    changePage: function(page){
      this.setState({page: page});
    },

    changeVisualization: function(visualization){
      this.setState({visualization: visualization});
    },

    componentWillMount: function(){
      Visualization.fetchAll();
    },

    render: function(){

      if (this.state.page === 'List'){
        return <VisualizationList 
          key='list' 
          changePage={this.changePage}
          changeVisualization={this.changeVisualization} />;
      } else {
        return <EditView 
          key='edit'
          changePage={this.changePage} 
          visualization={this.state.visualization}/>;
      }
    }
  });
