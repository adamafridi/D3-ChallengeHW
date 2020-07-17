// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };
  
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Initial Params
  // This should be where the data is coming in from the flask?
  var chosenXAxis = "poverty";
  var chosenYAxis = "healthcare";
  

  

  // Retrieve data from the CSV file and execute everything below
  d3.csv("./assets/data/data.csv").then(function(data,err){

   if (err) throw err;
   plotFoodInsecurityAxes(data);   
  }).catch(function(error) {
    console.log(error);
    });

