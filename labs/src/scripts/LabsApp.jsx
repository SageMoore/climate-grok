/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;
var d3 = require('d3');
var d3Chart = require('./components/d3Chart.js');

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

var dataURL = 'http://lh:8080/stats/max/microc5-rcp45/2?xmin=-13193016.062816&ymin=3088377.007329&xmax=-8453323.832114&ymax=5722687.564266';
d3.json(dataURL, function (error, data) {
    d3Chart.create('.graph', data);
})

module.exports = {};