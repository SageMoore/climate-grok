/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var _     = require("underscore");

var L = require('leaflet');
var D = require('leaflet-draw');
require('style!leaflet/dist/leaflet.css');
require('style!leaflet-draw/dist/leaflet.draw.css');
  
  // <script src="../src/edit/handler/Edit.Rectangle.js"></script>
  // <script src="../src/draw/handler/Draw.Rectangle.js"></script>
require('leaflet-draw/src/edit/handler/Edit.Rectangle.js')
require('leaflet-draw/src/draw/handler/Draw.Rectangle.js')

var Layers = {
  stamen: { 
    toner:      'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',   
    watercolor: 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png',
    attrib:     'Map data &copy;2013 OpenStreetMap contributors, Tiles &copy;2013 Stamen Design'
  },
  mapBox: {
    azavea:     'http://{s}.tiles.mapbox.com/v3/azavea.map-zbompf85/{z}/{x}/{y}.png',
    worldBlank: 'http://{s}.tiles.mapbox.com/v3/mapbox.world-blank-light/{z}/{x}/{y}.png',
    attrib:     'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">MapBox</a>'
  }
};

var getLayer = function(url,attrib) {
  return L.tileLayer(url, { maxZoom: 18, attribution: attrib });
};

var baseLayers = {

  "Azavea" :      getLayer(Layers.mapBox.azavea,Layers.mapBox.attrib),
  "Watercolor" :  getLayer(Layers.stamen.watercolor,Layers.stamen.attrib),
  "Toner" :       getLayer(Layers.stamen.toner,Layers.stamen.attrib),
  "Blank" :       getLayer(Layers.mapBox.worldBlank,Layers.mapBox.attrib)
};


var LeafletMap = React.createClass({
  map: null, 
  layer: null,

  getInitialState: function() {
    return {
    
    };
  },

  componentDidMount: function () {    
    var self = this;
    var map = L.map(this.getDOMNode());

    baseLayers['Azavea'].addTo(map);    
    map.lc = L.control.layers(baseLayers).addTo(map);
    map.setView([51.505, -0.09], 2);

    var drawnItems = new L.FeatureGroup().addTo(map);      

    var drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems
      },
        draw: {
          polygon: true,
          polyline: false,
          rectangle: true,
          circle: false,
          marker: false
      }
    });

    map.addControl(drawControl);       

    map.on('draw:created', function (e) {
      var type = e.layerType, 
          layer = e.layer;
      drawnItems.clearLayers(); // can only have one polygon for now
      drawnItems.addLayer(layer);
      
      self.props.addPolygon(layer.toGeoJSON().valueOf().geometry);
    }); 

    this.map = map;    
  },

  render: function() {          
    return (
      <div className="leafletMap" id="map" />
    );
  }
});

module.exports = LeafletMap;