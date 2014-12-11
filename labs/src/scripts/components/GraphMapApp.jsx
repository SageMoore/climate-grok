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
      var updated = self.state.models.slice();     // shallow copy;
      data[0].model = poly.properties.name; //replace model name with feature name
      updated.push(data[0])
      self.setState({models: updated})
    });
  },

  updatePolygon: function(poly) {
    var self = this;
    
    alert("updating: " + poly.properties.name);
    getData(model, poly, function(err, data) {
      var updated = self.state.models.slice();     // shallow copy;
      var name = poly.properties.name;

      updated = _.reject(updated, function(model) { return model.name == name }); 
      data[0].model = poly.properties.name; // replace model name with feature name
      updated.push(data[0])
      
      self.setState({models: updated})
    });
  },

  deletePolygon: function(polgy) {
    //delete polygons from state
  },

  render: function() {
    var self = this;
    var cursor = Cursor.build(this);    
    return (    
      <div className="row">
        <div className="col-md-5">          
         <LeafletMap tmsUrl="http:/localhost:8088/tms" 
          addPolygon={self.addPolygon} 
          updatePolygon={self.updatePolygon} /> 
        </div>
        <div className="col-md-7">
          <Graph data={this.state.models} />
        </div>
      </div>  
    );
  }
});

module.exports = GraphMapApp;