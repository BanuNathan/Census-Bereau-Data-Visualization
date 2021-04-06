// function makeResponsive() {

//     // if the SVG area isn't empty when the browser loads,
//     // remove it and replace it with a resized version of the chart
//     var svgArea = d3.select("body").select("svg");

//     if (!svgArea.empty()) {
//         svgArea.remove();
//     }

//     var svgWidth = parseInt(d3.select("#scatter").style("width"));
//     var svgHeight = svgWidth - svgWidth / 4;

//         // var svgWidth = 960;
//         // var svgHeight = 500;

//         var margin = {
//         top: 20,
//         right: 40,
//         bottom: 80,
//         left: 100
//         };

//         var width = svgWidth - margin.left - margin.right;
//         var height = svgHeight - margin.top - margin.bottom;

//         // Create an SVG wrapper, append an SVG group that will hold our chart,
//         // and shift the latter by left and top margins.
//         var svg = d3
//         .select("#scatter")
//         .append("svg")
//         .attr("width", svgWidth)
//         .attr("height", svgHeight);

//         // Append an SVG group
//         var chartGroup = svg.append("g")
//         .attr("transform", `translate(${margin.left}, ${margin.top})`);

//         // Initial Params
//         var chosenXAxis = "poverty";
//         var chosenYAxis = "healthcare";

//         // function used for updating x-scale var upon click on axis label
//         function xScale(povertyData, chosenXAxis) {
//         // create scales
//         var xLinearScale = d3.scaleLinear()
//             .domain([d3.min(povertyData, d => d[chosenXAxis]) * 0.8,
//             d3.max(povertyData, d => d[chosenXAxis]) * 1.2
//             ])
//             .range([0, width]);
//             return xLinearScale;

//         }

//           // function used for updating x-scale var upon click on axis label
//         function yScale(povertyData, chosenYAxis) {
//             // create scales
//             var yLinearScale = d3.scaleLinear()
//             .domain([0, d3.max(povertyData, d => d[chosenYAxis])])
//             .range([height, 0]);
//             return yLinearScale;
    
//             }

//         // function used for updating xAxis var upon click on axis label
//         function renderAxes(newXScale, xAxis) {
//         var bottomAxis = d3.axisBottom(newXScale);

//         xAxis.transition()
//             .duration(1000)
//             .call(bottomAxis);

//         return xAxis;
//         }

//         function renderYAxes(newYScale, yAxis) {
//             var leftAxis = d3.axisLeft(newYScale);
    
//             xAxis.transition()
//                 .duration(1000)
//                 .call(leftAxis);
    
//             return yAxis;
//             }


//         // function used for updating circles group with a transition to
//         // new circles
//         function renderCircles(circlesGroup, newXScale, chosenXAxis) {

//         circlesGroup.transition()
//             .duration(1000)
//             .attr("cx", d => newXScale(d[chosenXAxis]))
//             .attr("cy", d => newYScale(d[chosenYAxis]));

//         return circlesGroup;
//         }

//         // function used for updating circles group with new tooltip
//         function updateToolTip(chosenXAxis, circlesGroup) {

//         if (chosenXAxis === "poverty") {
//             label = "poverty:";
//         }
//         else if (chosenXAxis === "age") {
//             label = "Age (Median)";
//         } else {
//             label = "Income";
//         }

//         var toolTip = d3.tip()
//             .attr("class", "tooltip")
//             .offset([70, -60])
//             .html(function(d) {
//             return (`<strong> ${d.state}<br>healthcare ${d.healthcare}<br> ${label} ${d[chosenXAxis]}`);
//             });
            

//         circlesGroup.call(toolTip);

     

//         circlesGroup.on("mouseover", function(data) {
//             toolTip.show(data)
//                 .style("display", "block")
//             .html(
//                 `<strong>banumathy${d.age}<strong><hr>${d.poverty}
//             medal(s) won`)
//             .style("left", d3.event.pageX + "px")
//             .style("top", d3.event.pageY + "px");
//         })
//             // onmouseout event
//             .on("mouseout", function(data, index) {
//             toolTip.hide(data);
//             });

//         return circlesGroup;
//         }

//         // Retrieve data from the CSV file and execute everything below
//         d3.csv("assets/data/data.csv").then(function(povertyData, err) {
//         if (err) throw err;

//         // parse data
//         povertyData.forEach(function(povertyData) {
//             povertyData.poverty = +povertyData.poverty;
//             povertyData.income = +povertyData.income;
//             povertyData.healthcare = +povertyData.healthcare;
//             povertyData.age = +povertyData.age;
//             povertyData.obesity = +povertyData.obesity;
//             povertyData.smokes = +povertyData.smokes;
//         });
//         // xLinearScale function above csv import
//         var xLinearScale = xScale(povertyData, chosenXAxis);

//         // Create y scale function
//         var yLinearScale = yScale(povertyData, chosenYAxis);

//         // Create initial axis functions
//         var bottomAxis = d3.axisBottom(xLinearScale);
//         var leftAxis = d3.axisLeft(yLinearScale);

//         // append x axis
//         var xAxis = chartGroup.append("g")
//             .classed("x-axis", true)
//             .attr("transform", `translate(0, ${height})`)
//             .call(bottomAxis);

//         // append y axis
//         chartGroup.append("g")
//             .call(leftAxis);

//         // append initial circles
//         var circlesGroup = chartGroup.selectAll("circle")
//             .data(povertyData)
//             .enter()
//             .append("circle")
//             .attr("cx", d => xLinearScale(d[chosenXAxis]))
//             .attr("cy", d => yLinearScale(d[chosenYAxis]))
//             .attr("r", 10)
//             .attr("fill", "pink")
//             .attr("opacity", ".5")
//             .text(function(d){return d.abbr})
            

//         // Create group for three x-axis labels
//         var labelsGroup = chartGroup.append("g")
//             .attr("transform", `translate(${width / 2}, ${height + 20})`);

//         var povertyLabel = labelsGroup.append("text")
//             .attr("x", 0)
//             .attr("y", 20)
//             .attr("value", "poverty") // value to grab for event listener
//             .classed("active", true)
//             .text("In poverty (%)");

//         var ageLabel = labelsGroup.append("text")
//             .attr("x", 0)
//             .attr("y", 40)
//             .attr("value", "age") // value to grab for event listener
//             .classed("inactive", true)
//             .text("Age (Median)");

//         var incomeLabel = labelsGroup.append("text")
//             .attr("x", 0)
//             .attr("y", 60)
//             .attr("value", "income") // value to grab for event listener
//             .classed("inactive", true)
//             .text("Household income (Median)");

//           // append y axis    
//         var yaxislabelsGroup = chartGroup.append("g")
//             .attr("transform", "rotate(-90)");
        
//         var healthcareLabel = yaxislabelsGroup.append("text")
//             .attr("y", -75)
//             .attr("x", -290)
//             .attr("value", "healthcare") // value to grab for event listener
//             .classed("inactive", true)
//             .text("Healthcare (%)");

//         var smokesLabel = yaxislabelsGroup.append("text")
//             .attr("x", -300)
//             .attr("y", -40)
//             .attr("value", "smokes") // value to grab for event listener
//             .classed("inactive", true)
//             .text("Smokes (%)");

//         // updateToolTip function above csv import
//         var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//         // x axis labels event listener
//         labelsGroup.selectAll("text")
//             .on("click", function() {
//             // get value of selection
//             var value = d3.select(this).attr("value");
//             if (value !== chosenXAxis) {

//                 // replaces chosenXAxis with value
//                 chosenXAxis = value;

//                 // console.log(chosenXAxis)

//                 // functions here found above csv import
//                 // updates x scale for new data
//                 xLinearScale = xScale(povertyData, chosenXAxis);

//                 // updates x axis with transition
//                 xAxis = renderAxes(xLinearScale, xAxis);

//                 // updates circles with new x values
//                 circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

//                 // updates tooltips with new info
//                 circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


//                 // changes classes to change bold text
//                 var ageBold = chosenXAxis === "age";
//                 var povertyBold = chosenXAxis === "poverty";
//                 var incomeBold = chosenXAxis === "income";

//                 ageLabel
//                     .classed("active", ageBold)
//                     .classed("inactive", !ageBold);
//                 povertyLabel
//                     .classed("active", povertyBold)
//                     .classed("inactive", !povertyBold);
//                 incomeLabel
//                     .classed("active", incomeBold)
//                     .classed("inactive", !incomeBold);
                

//                 }
//             });

//         yaxislabelsGroup.selectAll("text")
//         .on("click", function() {
//         var value = d3.select(this).attr("value");
//         if (value !== chosenYAxis) {

//             // replaces chosenXAxis with value
//             chosenYAxis = value;

//             // console.log(chosenXAxis)

//             // functions here found above csv import
//             // updates x scale for new data
//             yLinearScale = yScale(povertyData, chosenYAxis);

//             // updates x axis with transition
//             yAxis = renderYAxes(yLinearScale, yAxis);

//             // updates circles with new x values
//             circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

//             // updates tooltips with new info
//             circlesGroup = updateToolTip(chosenYAxis, circlesGroup);


//             // changes classes to change bold text
//             var healthcareBold = chosen/yAxis === "healthcare";
//             var smokesBold = chosenYAxis === "smokes";
//             var obesityBold = chosenYAxis === "obesity";

//             healthcareLabel
//                 .classed("active", healthcareBold)
//                 .classed("inactive", !healthcareBold);
//             smokesLabel
//                 .classed("active", smokesBold)
//                 .classed("inactive", !smokesBold);
//             obesityLabel
//                 .classed("active", obesityBold)
//                 .classed("inactive", !obesityBold);
            

//             }
//             });
//         }).catch(function(error) {
//         console.log(error);
//         });
// }

// makeResponsive();
    
//     // Event listener for window resize.
//     // When the browser window is resized, makeResponsive() is called.
// d3.select(window).on("resize", makeResponsive);


function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
    var chosenColor="lightgreen";

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    var svgWidth = parseInt(d3.select("#scatter").style("width"));
    var svgHeight = svgWidth - svgWidth / 4;

    // var svgWidth = 960;
    // var svgHeight = 500;

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
    var chosenXAxis = "poverty";

    // function used for updating x-scale var upon click on axis label
    function xScale(povertyData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(povertyData, d => d[chosenXAxis]) * 0.8,
        d3.max(povertyData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

    }

    // function used for updating xAxis var upon click on axis label
    function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
    }

    // function used for updating circles group with a transition to
    // new circles
    function renderCircles(circlesGroup, newXScale, chosenXAxis) {
        if (chosenXAxis === "poverty"){
            chosenColor = "lightgreen"
        }else if(chosenXAxis === "age"){
            chosenColor = "pink"
        }else {
            chosenColor = "lightblue"
        }
    
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("fill", chosenColor)
        .attr("class", function(d){return "stateCircle" + d.abbr})
      
    return circlesGroup;
    }

    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, circlesGroup) {

        var label;

        if (chosenXAxis === "poverty") {
            label = "poverty:";
        }
        else if (chosenXAxis === "age") {
            label = "Age (Median)";
        } else {
            label = "Income";
        }

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([70, -60])
            .html(function(d) {
            return (`<strong> ${d.state}<br>healthcare ${d.healthcare}<br> ${label} ${d[chosenXAxis]}`)
        });
    

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this)
        })
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
        });

    return circlesGroup;
    }

    // Retrieve data from the CSV file and execute everything below
    d3.csv("assets/data/data.csv").then(function(povertyData, err) {
    if (err) throw err;
    
    // parse data
    povertyData.forEach(function(povertyData) {
        povertyData.poverty = +povertyData.poverty;
        povertyData.income = +povertyData.income;
        povertyData.healthcare = +povertyData.healthcare;
        povertyData.age = +povertyData.age;
        povertyData.obesity = +povertyData.obesity;
        povertyData.smokes = +povertyData.smokes;
    });
    // xLinearScale function above csv import
    var xLinearScale = xScale(povertyData, chosenXAxis);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(povertyData, d => d.healthcare)])
        .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(povertyData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 15)
        .attr("fill", chosenColor)
        .attr("opacity", ".5")

    // banu
    var textGroup = circlesGroup.selectAll("text")
        .data(povertyData)
        .enter()
        .append('text')
        .text(d => d.abbr)
        .attr('font-size',8)//font size
        .attr('dx', -10)//positions text towards the left of the center of the circle
        .attr('dy',4)

    // Create group for three x-axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In poverty (%)")
        .style('fill', 'green');

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)")
        .style('fill', 'pink');

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household income (Median)")
        .style('fill', 'blue');

    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
               
        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            xLinearScale = xScale(povertyData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        
            console.log(chosenColor);
            // changes classes to change bold text
            var ageBold = chosenXAxis === "age";
            var povertyBold = chosenXAxis === "poverty";
            var incomeBold = chosenXAxis === "income";

            ageLabel
                .classed("active", ageBold)
                .classed("inactive", !ageBold);
            povertyLabel
                .classed("active", povertyBold)
                .classed("inactive", !povertyBold);
            incomeLabel
                .classed("active", incomeBold)
                .classed("inactive", !incomeBold);
            }
        });

    }).catch(function(error) {
    console.log(error);
    });
}

makeResponsive();
    
    // Event listener for window resize.
    // When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
