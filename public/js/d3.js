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

var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];
// width and height of bars and padding btw the bars
var svgWidth = 500, svgHeight = 300, barPadding = 5;
// We calculate the bar width dividing the total width of svg container with the total number of elements in our dataset
var barWidth = (svgWidth / dataset.length);

var svg = d3.select('svg')
.attr("width", svgWidth)
.attr("height", svgHeight);

var barchart = svg.selectAll("rect")
.data(dataset)
.enter()
.append("rect")
.attr("y", function(d){
    return svgHeight - d 
})
.attr("height", function(d){
    return d;
})
.attr("width", barWidth - barPadding)
.attr("transform", function (d, i){
    var translate = [barWidth * i, 0];
    return "translate("+ translate +")";
});


