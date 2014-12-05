'use strict';

var d3 = require('d3');
var d3Chart = {};

/**
{
"time": "2023-09-16T00:00:00.000Z",
"value": {
  "mean": 8.525773048400879,
  "min": 8.463381220641583,
  "max": 8.603095170341346
}
*/
d3Chart.create = function (el, dataSet) {

    var margin = { top: 20, right: 80, bottom: 30, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format.iso.parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("linear")
        .x(function(d) {
            return x(d.date);
        })
        .y(function(d) {
            return y(d.temperature);
        });

    var voronoi = d3.geom.voronoi()
        .x(function(d) {
            return x(d.date);
        })
        .y(function(d) {
            return y(d.temperature);
        })
        .clipExtent([
            [-margin.left, -margin.top],
            [width + margin.right, height + margin.bottom]
        ]);

    var area = d3.svg.area()
        .interpolate("linear")
        .x(function(d) { return x(d.date); })
        .y0(function(d) { return y(d.low); })
        .y1(function(d) { return y(d.high); });

    var mouseover = function(d) {    
        d3.select('svg').classed("in", true);
        var selectedCity = d3.selectAll('.city-' + d.model)
            .classed("hover", true);
    };

    var mouseout = function(d) {
        d3.select('svg').classed("in", false);
        var allCities = d3.selectAll('.city')
            .classed("hover", false);
    };

    var makeVoronoi = function(d, models) {
        d3.select(el).selectAll('.voronoi').remove();

        var voronoiGroup = d3.select(el)
            .select('svg').append("g")
            .attr("class", "voronoi");

        voronoiGroup.selectAll("path")
            .data(voronoi(d3.nest()
                .key(function(d) { return d.model, d.time, y(d.temperature); })
                .rollup(function(v) { return v[0]; })
                .entries(d3.merge(models.map(function(d) { return d.values; })))
                .map(function(d) { return d.values; })))
            .enter().append("path")
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            .datum(function(d) {
                return d.point;
            })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);
    };

    var svg = d3.select(el)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(dataSet.map(function(d) { return d.model; }));
    var data = dataSet[0].data; // our data has at least one model
    data.forEach(function(d) { d.time = parseDate(d.time); });
        
    x.domain(d3.extent(data, function(d) { return d.time; }));

    var models = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                var ret = {
                    date: d.time,
                    temperature: +d.value.mean,
                    low: +d.value.min,
                    high: +d.value.max,
                    x: x(d.time),
                    model: name
                };
                return ret;
            })
        };
    });

    // y.domain([
    //     d3.min(models, function(c) { return d3.min(c.values, function(v) { return v.low; }); }),
    //     d3.max(models, function(c) { return d3.max(c.values, function(v) { return v.high; }); })
    // ]);

    y.domain([
        0,
        30
    ]);

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

    var poly = svg.selectAll(".poly")
        .data(models, function(d) { return d.name; })
        .enter().append("g")
        .attr("class", "poly");

    poly.append("path")
        .attr("class", function(d) { return "area city city-" + d.name; })
        .attr("d", function(d) {            
            return area(d.values);
        })
        .style("fill", function(d) { return color(d.name); });

        var indline = svg.selectAll(".indline")
            .data(models, function(d) { return d.name; })
            .enter().append("g")
            .attr("class", "indline");

        indline.append("path")
            .attr("class", function(d) { return "line city city-" + d.name; })
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return color(d.name); });

    makeVoronoi(data, models);

    return this;

}

d3Chart.update = function (el, data) {
    return 0;
}

module.exports = d3Chart;

