// set the dimensions and margins of the graph
var width2 = 500
var height = 500


// // Small devices (landscape phones, 576px and up)
// @media (min-width: 576px) { ... }

if(wWidth < 576){
    width2 = wWidth - 10;
}

// // Medium devices (tablets, 768px and up)
// @media (min-width: 768px) { ... }
else if(wWidth < 768){
   width2 = wWidth - 10;
}


// // Large devices (desktops, 992px and up)
// @media (min-width: 992px) { ... }
else if(wWidth < 992){
    width2 = 750 - 10;
 }
// // Extra large devices (large desktops, 1200px and up)
// @media (min-width: 1200px) { ... }

else if(wWidth < 992){
    width2 = 970 - 10;
 }
 else{
     width2 = 1170 -10;
 }
 width2=width2/2;

// append the svg object to the body of the page
var svg1 = d3.select("#musicdata1")
    .append("svg")
    .attr("width", width2)
    .attr("height", height)


$.ajax({
    url: "/api/test1",
    method: "GET"

})
    .then(data => {
        // Filter a bit the data
        //data = data.filter(function(d){ return d.value = genre })


        // Color palette for genre?
        var color = d3.scaleOrdinal()
            .domain(["rock", "dance rock", "hip hop", "blues-rock", "jazz rap", "ska", "punk"])
            .range(d3.schemeDark2);

        // Size scale for genres
        var size = d3.scaleLinear()
            .domain([0, 50])
            .range([8, 150])  // circle will be between 8 and 55 px wide

        // create a tooltip
        var Tooltip = d3.select("#musicdata1")
            .append("div")
            .attr("class", "tooltip")


        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            Tooltip
                .style("opacity", 1)
        }
        var mousemove = function (d) {
   
            Tooltip
                .html('<u>' + d.genre.toUpperCase() + '</u>' + "<br>" + "No of songs" + d.number + "<br>" + "SONGS" + "<br>" + d.songs + "<br>" + "ARTISTS" + "<br>" + d.artists)
                // .style("left", (d3.mouse(this)[0] + 20) + "px")
                // .style("top", (d3.mouse(this)[1]) + "px")
                .style("left", "0px")
                .style("bottom", "0px")
    
        }
        var mouseleave = function (d) {
            // Tooltip
            //   .style("opacity", 0)
        }

        // Initialize the circle: all located at the center of the svg area
        var node = svg1.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", function (d) { return size(parseInt(d.number)) })
            .attr("cx", width2 / 2)
            .attr("cy", height / 2)
            .style("fill", function (d) { return color(d.genre) })
            .attr("stroke", "yellow")
            .style("stroke-width", 0.1)
            .on("mouseover", mouseover) // What to do when hovered
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .call(d3.drag() // call specific function when circle is dragged
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Features of the forces applied to the nodes:
        var simulation = d3.forceSimulation()
            .force("center", d3.forceCenter().x(width2 / 2).y(height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (size(parseInt(d.number)) + 3) }).iterations(1)) // Force that avoids circle overlapping

        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
            .nodes(data)
            .on("tick", function (d) {
                node
                    .attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; })
            });

        // What happens when a circle is dragged?
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(.15).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(.15).restart();
            d.fx = null;
            d.fy = null;
        }

    })

