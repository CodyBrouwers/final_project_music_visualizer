var MatCapItem = React.createClass({
  render: function() {
    return (<img className='matcap' src={'img/matcap/matcap' + this.props.imgIndex + '.jpg'} onClick={this.props.changeMatCap}></img>);
  }
});