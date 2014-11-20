/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Input = require("react-bootstrap/Input");
var _     = require("underscore");
var $ = require('jquery');

var Bands = React.createClass({
  componentDidMount: function() {
  },
  
  getInitialState: function() {
    var layer = this.props.entry.layer;
    $.get(this.props.url + "/catalog/" + layer.name + "/" + layer.zoom + "/bands", 
      function(result) {
        console.log(result)
        if (this.isMounted()) { this.setState(result) }
      }.bind(this)
    );

    return { };
  },

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

    var options = _.map(this.state.time, function(time) {    
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