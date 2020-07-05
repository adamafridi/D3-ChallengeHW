// @TODO: YOUR CODE HERE!
//what is our canvas
var svgWidth = 960;
var svgHeight = 500;

//dimensions of graph
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

// Append an SVG group
//this flips the chart
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
//from the data.csv file
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
//function pulls entire set of data. finds domain and range using a function. gives 20% on each side
// declaring render xScale function, haven't called function yet
function xScale(data) {
  // create scales
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d[chosenXAxis]) * 0.8,
      d3.max(data, (d) => d[chosenXAxis]) * 1.2,
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
//- declaring render Axes function, haven't called function yet. makes x axis scales change
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition().duration(1000).call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles - makes x axis circles change when you click on differnt x axis
function renderCircles(circlesGroup, newXScale) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cx", (d) => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  var label;
  //default is poverty
  if (chosenXAxis === "poverty") {
    label = "Poverty:";
  } else {
    label = "Age";
  }
  //offset helps with positioning
  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([0, 0])
    .html(function (d) {
      return `${d.abbr}<br>${label} ${d[chosenXAxis]}`;
    });

  circlesGroup.call(toolTip);

  circlesGroup
    .on("mouseover", function (data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below. read our data in.
//err is old D3, .catch does this.
d3.csv("./assets/data/data.csv")
  .then(function (Data, err) {
    if (err) throw err;

    // parse data. getting data passed into callback function. make sure all data is numeric
    Data.forEach(function (data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.smokes = +data.smokes;
    });

    // xLinearScale function above csv import - call in with Xscale. functions can referene chosenXaxis as it sits globally

    var xLinearScale = xScale(Data);

    // Create y scale function (left axis). domain is 0 to 24(max) needs to be updated with more data
    var yLinearScale = d3
      .scaleLinear()
      .domain([0, d3.max(Data, (d) => d.healthcare)])
      .range([height, 0]);

    // Create initial axis functions (bottom = x and left = y)
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup
      .append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    chartGroup.append("g").call(leftAxis);

    // append and initial circles
    var circlesGroup = chartGroup
      .selectAll("circle")
      .data(Data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("cy", (d) => yLinearScale(d.healthcare))
      .attr("r", 20)
      .attr("fill", "orange")
      .attr("opacity", ".5");

    // Create group for two x-axis labels
    var labelsGroup = chartGroup
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var PovertyLabel = labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("Poverty");

    var AgeLabel = labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age");

    // append y axis
    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("value", "smokes") // value to grab for event listener
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Smokes");

    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("value", "healthcare") // value to grab for event listener
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Lack of Healthcare");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener. we get either poverty or age x values depending on click event
    labelsGroup.selectAll("text").on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(Data);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text - tweaking css
        if (chosenXAxis === "Poverty") {
          AgeLabel.classed("active", true).classed("inactive", false);
          PovertyLabel.classed("active", false).classed("inactive", true);
        } else {
          AgeLabel.classed("active", false).classed("inactive", true);
          PovertyLabel.classed("active", true).classed("inactive", false);
        }
      }
    });
  })
  .catch(function (error) {
    console.log(error);
  });
