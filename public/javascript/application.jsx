
$(document).ready(function() {

  /** @jsx React.DOM */

  var visualizations = [{name: 'Andrew', id: 5}, {name: 'Raf', id: 6}];


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
          <p onClick={function(){
            self.props.parent.changePage('List');
          }}>Back to List</p>
          <ParameterMenu />
        </div>
        )
      } 
  });

  var ParameterMenu = React.createClass({
    render: function(){
      return (
        <div className="menu">
          <div className="close">- hide options</div>
          <p>Color</p>
          <ul className="color">
              <li>
                <form for='input-red'>Red</form>
                <input id='input-red' type='number' name="red"/>
              </li>
              <li>
                <form for='input-green'>Green</form>
                <input id='input-green' type='number' name="green"/>
              </li>
              <li>
                <form for='input-blue'>Blue</form>
                <input id='input-blue' type='number' name="blue"/>
              </li>
          </ul>
          <ul className='shape'>
            <li>
              <label>Sphere</label>
              <input type="radio" name="shape" value="sphere"/>
            </li>
            <li>
              <label>Cube</label>
              <input type="radio" name="shape" value="cube"/>
            </li>
          </ul>
          <p>Source</p>
          <ul>
              <li className="track">Track</li>
          </ul>
        </div> 
      )
    }
  })

  
  React.render(
    <AppView />,
    document.getElementById('app')
  );

});
