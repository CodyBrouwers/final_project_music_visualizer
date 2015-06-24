var AppView = React.createClass({
    getInitialState: function () {
      return {
        page: 'List',
        visualizations: []
      }
    },
    changePage: function(page){
      this.setState({page: page});
    },
    changeVisualization: function(visualization){
      this.setState({visualization: visualization});
    },

    resetVisualization: function () {
      this.setState({visualization: null});
    },

    componentWillMount: function(){
      $.ajax({
        type: "GET",
        url: "/visualizations",
        dataType: 'json',
        success: function(visualizations) {
          this.setState({visualizations: visualizations})
        }.bind(this)
      });
    },

    render: function(){
      if (this.state.page === 'List'){
        return <VisualizationList 
          visualizations={this.state.visualizations}
          key='list' changePage={this.changePage}
          changeVisualization={this.changeVisualization}
          resetVisualization={this.resetVisualization} />;
      } else {
        return <EditView 
          key='edit'
          changePage={this.changePage} 
          visualization={this.state.visualization}/>;
      }
    }
  });
