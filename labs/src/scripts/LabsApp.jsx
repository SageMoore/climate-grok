/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;
var d3 = require('d3');
var d3Chart = require('./components/d3Chart.js');
var _ = require('underscore');
var GraphMapApp = require('./components/GraphMapApp');

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;


//;
// var polygon = {
//   "type": "Polygon",
//   "coordinates": [
//     [
//       [1,5],
//       [1,7
//       ],
//       [2.8515625,7],
//       [2.8515625,5],
//       [1,5]
//     ]
//   ]
// }

// var p2 = {
//   "type": "Polygon",
//   "coordinates": [[[5.9559111595,45.8179931641],[5.9559111595,47.808380127],[10.4920501709,47.808380127],[10.4920501709,45.8179931641],[5.9559111595,45.8179931641]]]
// }

// var m1;
// var chart;
// d3.xhr("http://localhost:8088/stats/"+model+"/4/min")
//   .header("Content-Type","application/json")
//   .post(JSON.stringify(p2), function(error, data) {
//     m1 =JSON.parse(data.response)
//     chart = d3Chart.create('.graph-philadelphia', m1);

//     d3.xhr("http://localhost:8088/stats/"+model+"/4/min")
//       .header("Content-Type","application/json")
//       .post(JSON.stringify(polygon), function(error, data) {    
          
          
//           var m = JSON.parse(data.response);
//           m[0].model = "fuck";
//           m.push(m1[0]);
//           console.log(m);
//           chart.update(m);
//       });  

//   });  



React.renderComponent(<GraphMapApp />, document.body);

module.exports = {};