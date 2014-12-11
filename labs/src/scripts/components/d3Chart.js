'use strict';

var d3 = require('d3');
var _ = require('underscore');
var d3Chart = {};
   
d3Chart.create = function (el, dataSet) {    
    var parseDate = d3.time.format.iso.parse;

    var margin = { top: 20, right: 80, bottom: 30, left: 50 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select(el)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)        
        .orient("left");

    var line = d3.svg.line()
        .interpolate("linear")
        .x(function(d) { return x(parseDate(d.time)); })
        .y(function(d) { return y(d.mean); });

    var area = d3.svg.area()
        .interpolate("linear")
        .x(function(d) { return x(parseDate(d.date)); })
        .y0(function(d) { return y(d.min); })
        .y1(function(d) { return y(d.max); });

    var color = d3.scale.category10();
    color.domain(_.pluck(dataSet, 'model'));          

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temperature (ºC)");        
    
    var update = function (data) {  
        console.log("Update Graph", data)
        
        x.domain([
            d3.min(data, function (model) { return d3.min(model.data, function(d) { return parseDate(d.time) }) }),            
            d3.max(data, function (model) { return d3.max(model.data, function(d) { return parseDate(d.time) }) })            
        ])
        y.domain([
            d3.min(data, function (model) { return d3.min( _.pluck(model.data, 'mean') ) }),
            d3.max(data, function (model) { return d3.max( _.pluck(model.data, 'mean') ) })
        ]);

        yAxis.scale(y);
        xAxis.scale(x);

        svg.select(".y.axis")
            .transition()
            .call(yAxis)

        svg.select(".x.axis")
            .transition()
            .call(xAxis)

        var binding = svg.selectAll("path.line")
            .data(data, function(d) {return d.model})   

        binding    
            .transition()
            .attr("d", function(d) { return line(d.data); }) 
                    
        binding.enter() 
            .append("path")             
            .attr("class", function(d) { return "line city city-" + d.model; })                    
            .attr("d", function(d) { return line(d.data); })
            .style("stroke", function(d) { return color(d.model); })  

        binding.exit().remove();          
    }

    update(dataSet)

    return {
        update: update
    }
}

module.exports = d3Chart;

