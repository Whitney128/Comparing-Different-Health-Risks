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
  .attr("height", svgHeight + 40); 

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

function xScale(data, chosenXAxis, chartWidth) {
    // Create scales.
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * .8,
            d3.max(data, d => d[chosenXAxis]) * 1.1])
        .range([0, chartWidth]);
    return xLinearScale;
    }

  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
    //xAxis = svg.attr("xAxis");
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// Initialize the X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

function yScale(data, chosenYAxis, chartHeight) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * .8,
            d3.max(data, d => d[chosenYAxis]) * 1.2])
        .range([chartHeight, 0]);
    return yLinearScale;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")

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

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
    if (chosenXAxis === "poverty") {
        var xlabel = "Poverty: ";
    } else if (chosenXAxis === "income") {
        var xlabel = "Median Income: "
    } else {
        var xlabel = "Age: "
    }
    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare: ";
    } else if (chosenYAxis === "smokes") {
        var ylabel = "Smokers: "
    } else {
        var ylabel = "Obesity: "
      }
    }

 
      

svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

svg.append("g").attr("class", "xText");
var xText = d3.select(".yText");


  // load Data
  d3.csv("../assets/data/data.csv").then(function(data){
  	console.log(data);

  		data.forEach(function(data) {
  		data.state = data.state; 
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.abbr = data.abbr;
        data.income = +data.income;
      })

      xlabelsGroup.selectAll("text")
      .on("click",function(){
//do something
 const value = d3.select(this).attr("value");
 passValueAlongToUpdateXScale(value)
})//end click 

function passValueAlongToUpdateXScale(value){
return d3.scaleLinear()
    .domain(d3.extent(data, d => d.poverty))
    .range([0, svgWidth]);
} 

    // var xScale = d3.scaleLinear()
    // .domain(d3.extent(data, d => d.poverty))
    // .range([0, svgWidth]);


     var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([svgHeight, 0]);

     svg.append("path")
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("fill", "none")

  var xLinearScale = xScale(data, chosenXAxis);
  var yLinearScale = yScale(data, chosenYAxis);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

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
//})
      const xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height})`);

     const povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty") 
    .text("In Poverty (%)")
    .classed("active", true);

     const ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") 
    .text("Age (Median)")
    .classed("inactive", true);

     const incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "income") 
    .text("Household Income (Median)")
    .classed("inactive", true);

    const ylabelsGroup = chartGroup.append("g");

     const healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -40)
    .attr("value", "healthcare")
    .text("Lacks Healthcare (%)")
    .classed("active", true);

    const smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("value", "smokes")
    .text("Smokes (%)")
    .classed("inactive", true);

      const obeseLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -80)
    .attr("value", "obesity") 
    .text("Obese (%)")
    .classed("inactive", true);
//})
      xlabelsGroup.selectAll("text")
    .on("click", function() {

    const value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      chosenXAxis = value;

      xLinearScale = xScale(data, chosenXAxis);

      //xAxis = renderXAxes(xLinearScale, xAxis);
      xAxis =svg.attr("xAxis");
      //xAxis = renderXAxes(xLinearScale, xAxis);

      //circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);
      circlesXY = svg.attr("renderXCircles");

      circlesText = svg.attr("renderXText");//(circlesText, xLinearScale, chosenXAxis);
    }

      circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);


          if (chosenXAxis === "age") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }

          else if (chosenXAxis === "income") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
      }

            else if (chosenXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        
      }
    });

       ylabelsGroup.selectAll("text")
    .on("click", function() {
    const value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      chosenYAxis = value;

      yLinearScale = yScale(data, chosenYAxis);

      yAxis = svg.attr("yAxis");

      circlesXY = svg.attr("renderYCircles");//(circlesXY, yLinearScale, chosenYAxis);

      circlesText = svg.attr("renderYText");//(circlesText, yLinearScale, chosenYAxis);

    }

      circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

           if (chosenYAxis === "smokes") {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
      }

         else if (chosenYAxis === "obesity"){
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
      }

            else if (chosenYAxis === "Lacks Healthcare") {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        }
      });
    });