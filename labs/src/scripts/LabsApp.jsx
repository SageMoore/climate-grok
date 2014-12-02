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

//load bootstrap and insert a <style> tag
require("bootstrap-sass-loader");
require("bootstrap-sass!../../bootstrap-sass.config.js");

d3.json('temp.json', function (error, data) {
    d3Chart.create('.link1', data);
})

d3.json('temp2.json', function (error, data) {
    d3Chart.create('.link2', data);
})


module.exports = {};