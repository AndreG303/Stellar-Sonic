// d3.select();
// d3.selectAll();

// d3.select('h1').style('color', 'red')
//     .attr('class', 'heading')
//     .text('new h1');

// d3.select('body').append('p').text('first paragraph');
// d3.select('body').append('p').text('second paragraph');
// d3.select('body').append('p').text('third paragraph');

// d3.selectAll('p').style('color', 'blue');

// var dataset = [Blew, Flux, Pin, Soon, Veil];

// var dataset = [1,2,3,4,5];
// d3.select('body')
//     .selectAll('p')
//     .data(dataset)
// .enter()//take data elements one by one 
// .append('p')//appends paragraph for each data element 
// .text('D3 is awesome!');
// .text(function(d){return d; });

// var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];
// // width and height of bars and padding btw the bars
// var svgWidth = 500, svgHeight = 300, barPadding = 5;
// // We calculate the bar width dividing the total width of svg container with the total number of elements in our dataset
// var barWidth = (svgWidth / dataset.length);

// var svg = d3.select('svg')
//     .attr("width", svgWidth)
//     .attr("height", svgHeight);

// var barchart = svg.selectAll("circle")
//     .data(dataset)
//     .enter()
//     .append("circle")
//     .attr("cy", function (d) {
//         return svgHeight - d
//     })
//     .attr("r", function (d) {
//         return d / 5;
//     })
//     .attr("fill", "blue")
//     //.attr("width", barWidth - barPadding)
//     .attr("cx", function (d, i) {
//         return barWidth * i;
//         //var translate = [barWidth * i, 0];
//         //return "translate(" + translate + ")";
//     });

// var text = svg.selectAll("text")
//     .data(dataset)
//     .enter()
//     .append("text")
//     .text(function (d) {
//         return d;
//     })
//     .attr("y", function (d, i) {
//         return svgHeight - d - 2;
//     })
//     .attr("x", function (d, i) {
//         return barWidth * i;
//     })

// set the dimensions and margins of the graph
var width = 460
var height = 460

// append the svg object to the body of the page
var svg = d3.select("#musicdata")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

// Read data

$.ajax({
    url:"/api/test",
    method:"GET"

})
.then( data => {
// Filter a bit the data
   //data = data.filter(function(d){ return d.value = genre })
  

  // Color palette for genre?
  var color = d3.scaleOrdinal()
    .domain(["rock", "jazz rap", "hip hop", "salsa", "post-grunge","ska"])
    .range(d3.schemeAccent);

  // Size scale for genres
  var size = d3.scaleLinear()
    .domain([0, 50])
    .range([7,55])  // circle will be between 7 and 55 px wide

  // create a tooltip
  var Tooltip = d3.select("#musicdata")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    //$.ajax( ... something ..).then( data => {
      //  ... tooltip stuff here ...
    //})
    Tooltip
      .html('<u>' + d.number + '</u>' + "<br>" + d.genre + " ")
      .style("left", (d3.mouse(this)[0]+20) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    // Tooltip
    //   .style("opacity", 0)
  }

  // Initialize the circle: all located at the center of the svg area
  var node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "node")
      .attr("r", function(d){ return size(parseInt(d.number))})
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", function(d){ return color(d.genre)})
      .style("fill-opacity", 0.8)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(d3.drag() // call specific function when circle is dragged
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));

  // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(parseInt(d.number))+3) }).iterations(1)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
      });

  // What happens when a circle is dragged?
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

})


