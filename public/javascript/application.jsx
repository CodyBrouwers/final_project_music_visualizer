(function() {

  var visualizations = [{name: 'Andrew', id: 5}, {name: 'Raf', id: 6}];
  
  // var WebGLVisualization = require('./webgl-viz.jsx');
  
  var AppView = React.createClass({
    getInitialState: function () {
      return {
        page: 'List'
      }
    },
    changePage: function(page){
      this.setState({page: page});
    },
    render: function(){
      if (this.state.page === 'List'){
        return <ListView parent={this}/>;
      } else {
        return <EditView parent ={this}/>;
      }
    }
  });

  var ListView = React.createClass({
    render: function(){
      var self = this;
      var items = visualizations.map(function(v){
        return <li onClick={function(){
          self.props.parent.changePage('Edit');
        }}>{v.name}</li>
      })
      return (
        <div>
          <h1>List View</h1>
          <div>
            {items}
          </div>
        </div>
        )
      } 
  });

  var EditView = React.createClass({
    render: function(){
      var self = this;
      return (
        <div>
          <h1>Edit View</h1>
          <WebGLVisualizer />
          <p onClick={function(){
            self.props.parent.changePage('List');
          }}>Back to List</p>
        </div>
        )
      } 
  });

  var WebGLVisualizer = React.createClass({
    render: function() {
      return (
        <div className='viz-container'></div>
      );
    },
    componentDidMount: function() {
      var container = $('.viz-container');
      var viz = new VIZ.Simple(container, sound);
    }
  });
  
  React.render(
    <AppView />,
    document.getElementById('app')
  );

})();
