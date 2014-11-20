/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Table = require("react-bootstrap/Table");
var Bands = require('./Bands.jsx');
var _     = require("underscore");
              



var Catalog = React.createClass({
  handleSelectLayer: function(entry) {
    this.props.active.set(
      {
        'entry': entry,
        'band': {}         
      } 
    );
  },

  render: function () {
    var self = this;
 
    var layerList = _.map(this.props.catalog, function(entry) {  
      console.log(entry);  
      return (        
        <tr>
          <td><a onClick={_.partial(self.handleSelectLayer, entry)}>{ entry.layer.name }</a></td>
          <td>{entry.layer.zoom}</td>
          <td><Bands entry={entry} url={self.props.url} active={self.props.active} /></td>
        </tr>);
    });

    return (
    <Table responsive>
      <thead>
        <tr> <th>Layer</th> <th>Zoom</th><th>Band</th></tr>
      </thead>
      <tbody> {layerList} </tbody>
    </Table>);
  }
});

module.exports = Catalog;