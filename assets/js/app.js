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

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 40)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

function xScale(data, chosenXAxis, chartWidth) {
  // Create scales.
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * .8,
      d3.max(data, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, chartWidth]);
  return xLinearScale;
}
function renderXAxes(newXScale, xAxis) {
  var xAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(xAxis);
  return xAxis;
}

function yScale(data, chosenYAxis, chartHeight) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]),
      d3.max(data, d => d[chosenYAxis])
    ])
    .range([chartHeight, 0]);
  return yLinearScale;
}
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(yAxis);
  return yAxis;
}
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}
function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circletextGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));
  return circletextGroup;
}
// function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
//   if (chosenXAxis === "poverty") {
//     var xlabel = "Poverty: ";
//   } else if (chosenXAxis === "income") {
//     var xlabel = "Median Income: "
//   } else {
//     var xlabel = "Age: "
//   }
//   if (chosenYAxis === "healthcare") {
//     var ylabel = "Lacks Healthcare: ";
//   } else if (chosenYAxis === "smokes") {
//     var ylabel = "Smokers: "
//   } else {
//     var ylabel = "Obesity: "
//   }
// }
// load Data
d3.csv("../assets/data/data.csv").then(function (data) {
  console.log(data);
  data.forEach(function (data) {
    data.state = data.state;
    // data.age = +data.age;
    // data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    data.abbr = data.abbr;
    // data.income = +data.income;
  })
  // function passValueAlongToUpdateXScale(value) {
  //   return d3.scaleLinear()
  //     .domain(d3.extent(data, d => d.poverty))
  //     .range([0, svgWidth]);
  // }

  var xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.poverty))
    .range([0, svgWidth]);
    var xAxis = svg.append("g")
    .attr("transform", "translate(0, " + svgHeight + ")")
    .call(
    d3.axisBottom(
      d3.scaleLinear()
      .domain(d3.extent(data, d => d.poverty))
      .range([0, svgWidth])
    ))
  
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.healthcare)])
    .range([svgHeight, 0]);
  var yAxis = svg.append("g")
  .attr("transform", "translate(" + svgWidth + ", 0)")
  .call(
    d3.axisLeft(
      d3.scaleLinear()
      .domain(d3.max(data, d => +d.healthcare))
      .range([svgHeight, 0])
    ))

    // chartGroup.append("g")
    //   .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("g circle")
    .data(data)
    .enter()
    .append("g");

  var circlesXY = circlesGroup.append("circle")
    .attr("cx", d => xScale(d[chosenXAxis]))
    .attr("cy", d => yScale(d[chosenYAxis]))
    .attr("r", 15)
    .classed("stateCircle", true);

  var circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx", d => xScale(d[chosenXAxis]))
    .attr("dy", d => yScale(d[chosenYAxis]) + 5)
    .classed("stateText", true);

  const xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height})`);

  const povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty")
    .text("In Poverty (%)")
    .classed("active", true);
  const ylabelsGroup = chartGroup.append("g");

  const healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -40)
    .attr("value", "healthcare")
    .text("Lacks Healthcare (%)")
    .classed("active", true);
});