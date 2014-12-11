/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;
var LeafletMap = require('./LeafletMap.jsx');
var Graph = require('./Graph.jsx');
var Cursor = require('react-cursor').Cursor;
var d3 = require('d3');


var model = "tas-miroc5-rcp45";

var getData = function (model, polygon, callback) {
  d3.xhr("http://localhost:8088/stats/"+model+"/4/min")
    .header("Content-Type","application/json")
    .post(JSON.stringify(polygon), function(error, data) {
      callback(error, JSON.parse(data.response))
    });
}

var GraphMapApp = React.createClass({
  getInitialState: function() {
    return {
      models: []
    };
  },

  addPolygon: function(poly) {
    var self = this;

    getData(model, poly, function(err, data) {
      // var updated = self.state.models.slice();
      // updated.push(data[0]);
      // console.log("UPDATED", updated)
      self.setState({models: data})
    });
  },

  updatePolygon: function(poly) {
    //do xhr request and update state
  },

  deletePolygon: function(polgy) {
    //delete polygons from state
  },

  render: function() {
    var self = this;
    var cursor = Cursor.build(this);    
    return (    
      <div className="row">
        <div className="col-md-9">          
         <LeafletMap tmsUrl="http:/localhost:8088/tms" 
          addPolygon={self.addPolygon} /> 
        </div>
        <div className="col-md-12">
          <Graph data={this.state.models} />
        </div>
      </div>  
    );
  }
});

module.exports = GraphMapApp;