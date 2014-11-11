/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Input = require("react-bootstrap/Input");
var _     = require("underscore");

var Bands = React.createClass({
   handleSelect: function(event) {
    var time = event.target.selectedOptions[0].value;
    this.props.active.set(
      {
        'entry': this.props.entry, 
        'band': {
          'time': time
        } 
      } 
    );
  },
  render: function () {
    var options = _.map(this.props.bands.time, function(time) {    
      return <option value={time}>{time}</option>;        
    });

    return (
      <select onChange={this.handleSelect}>
        {options}
      </select>
    );
  }
});

module.exports = Bands;