var svgWidth = 960;
var svgHeight = 600;
var margin = {
  top: 30,
  right: 40,
  bottom: 150,
  left: 150
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
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
}

//function used for updating y-scale var upon click on axis
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
      d3.max(data, d => d[chosenYAxis]) * 1.2
    ])
    .range([height,0]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

//function used for updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}

//function creating state abbreviations
function renderStateAbbr(stateAbbr, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  stateAbbr.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));
  return stateAbbr;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  var labelx;
  var labely;
  if (chosenXAxis == "poverty") {
    labelx = "In poverty (%):";
  }
  else if(chosenXAxis == "age") {
    labelx = "Age: ";
  }
  else {
    labelx = "Income: $"
  }
  if (chosenYAxis == "healthcare") {
    labely = "Healthcare:";
  }
  else if(chosenYAxis == "smokes") {
    labely = "Smokes: ";
  }
  else {
    labely = "Obesity: "
  }

  return circlesGroup;
}

// pulling data
d3.csv("assets/data/data.csv").then(function(data, err) {
  if (err) throw err;
  // parse data
  data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    data.age = +data.age;
    data.income = +data.income;
  });

  var xLinearScale = xScale(data, chosenXAxis);
  var yLinearScale = yScale(data, chosenYAxis);
  
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  // append y axis
 var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);
  
  // append circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class","stateCircle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 12)
    .attr("opacity", "0.8")
  
    //append state abbreviations 
  var stateAbbr = chartGroup.selectAll("abbr")
    .data(data)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .classed("class","StateText")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("font-size", "8px")
  
    //creating xaxis labels
  var labelsGroupX = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  //creating poverty label
  var povertyLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .classed("active", true)
    .text("Poverty (%)");
  
  //creating age label
  var ageLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .classed("inactive", true)
    .text("Age: Median ");
  
  //creating household income label
  var houseLabel = labelsGroupX.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income") 
  .classed("inactive", true)
  .text("Hosehold Income: Median ");
  
  // creating yaxis labels
  var labelsGroupY = chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
  
  //creating lack of healthcare label
  var healhLabel = labelsGroupY.append("text") 
    .attr("value", "healthcare")
    .attr("dx", "-10em")
    .attr("dy", "-2em")
    .classed("active", true)
    .text("Lacks Healthcare %");
  
  //creating smokers label
  var smokesLabel = labelsGroupY.append("text") 
  .attr("value", "smokes")
  .attr("dx", "-10em")
  .attr("dy", "-4em")
  .classed("inactive", true)
  .text("Smokes %");
  
  //creating obese label
  var obeseLabel = labelsGroupY.append("text") 
  .attr("value", "obesity")
  .attr("dx", "-10em")
  .attr("dy", "-6em")
  .classed("inactive", true)
  .text("Obese %");

  //adding xAxis interaction
  labelsGroupX.selectAll("text")
    .on("click", function() {

      var xvalue = d3.select(this).attr("value");
      if (xvalue !== chosenXAxis) {

        chosenXAxis = xvalue;

        xLinearScale = xScale(data, chosenXAxis);

        xAxis = renderAxesX(xLinearScale, xAxis);

        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        stateAbbr = renderStateAbbr(stateAbbr, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        
        //adding age label interaction
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active",true)
            .classed("inactive", false);
          povertyLabel
            .classed("active",false)
            .classed("inactive", true);
          houseLabel
            .classed("active",false)
            .classed("inactive", true);
        } 
        
        //adding income label interaction
        else if(chosenXAxis === "income"){
          houseLabel
            .classed("active",true)
            .classed("inactive", false);
          povertyLabel
            .classed("active",false)
            .classed("inactive", true);
          ageLabel
            .classed("active",false)
            .classed("inactive", true);
        } 
        
        //adding poverty label interaction
        else {
          houseLabel
            .classed("active",false)
            .classed("inactive", true);
          povertyLabel
            .classed("active",true)
            .classed("inactive", false);
          ageLabel
            .classed("active",false)
            .classed("inactive", true);
        }
      }
    })
  
  //adding yAxis interaction
      labelsGroupY.selectAll("text")
        .on("click", function() {
        // get value of selection
          var yvalue = d3.select(this).attr("value");
          if (yvalue !== chosenYAxis) {

            chosenYAxis = yvalue;

            yLinearScale = yScale(data, chosenYAxis);

            yAxis = renderAxesY(yLinearScale, yAxis);

            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            
            stateAbbr = renderStateAbbr(stateAbbr, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            
            //adding smokers label interaction
            if (chosenYAxis === "smokes") {
              smokesLabel
                .classed("active",true)
                .classed("inactive", false);
              healhLabel
                .classed("active",false)
                .classed("inactive", true);
              obeseLabel
                .classed("active",false)
                .classed("inactive", true);
            } 
            
            //adding obesity label interaction
            else if(chosenXAxis === "obesity"){
              smokesLabel
                .classed("active",false)
                .classed("inactive", true);
              healhLabel
                .classed("active",false)
                .classed("inactive", true);
              obeseLabel
                .classed("active",true)
                .classed("inactive", false);
            } 
            
            //adding lack of healthcare label interaction
            else {
              smokesLabel
                .classed("active",false)
                .classed("inactive", true);
              healhLabel
                .classed("active",true)
                .classed("inactive", false);
              obeseLabel
                .classed("active",false)
                .classed("inactive", true);
            }
          }
      })
    }).catch(function(error) {
      console.log(error);
    });
