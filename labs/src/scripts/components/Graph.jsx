/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var d3Chart = require('./d3Chart.js');
var d3 = require('d3');

var Graph = React.createClass({
  componentDidMount: function() {
    var el = this.getDOMNode();    
    console.log("CREATED")
    var chart = d3Chart.create(el, this.props.data);
    this.chart = chart;
    console.log("LOG CREATED", chart, this.chart);
  },

  componentDidUpdate: function() {
    var el = this.getDOMNode();
    console.log("UPDATING CHART", this.props.data);
    console.log("LOG update", this.chart);
    this.chart.update(this.props.data);    
  },

  render: function() {  
    return (
      <div />
    );
  }
});

module.exports = Graph;

