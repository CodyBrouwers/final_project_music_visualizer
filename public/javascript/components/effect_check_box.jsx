var EffectCheckBox = React.createClass({
  render: function() {
    return (
      <div>
        <input type="checkbox" name="effect" id={this.props.effectValue} value={this.props.effectValue} onChange={this.props.toggleEffect} />
        <label>{this.props.effectName}</label>
      </div>
    );
  }
});