function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the Chart
    var svgArea = d3.select("body").select("svg");
    var povertyData = [];
    d3.csv("assets/data/data.csv").then(function(povertyList, err) {
        if (err) throw err;
        // parse data
        povertyList.forEach(function(povertyData) {
            povertyData.poverty = +povertyData.poverty;
            povertyData.income = +povertyData.income;
            povertyData.healthcare = +povertyData.healthcare;
            povertyData.age = +povertyData.age;
            povertyData.obesity = +povertyData.obesity;
            povertyData.smokes = +povertyData.smokes;
        });
        povertyData = povertyList;
    });

    var xLinearScale = xScale(povertyData, chosenXAxis);

        // Create y scale function
    var yLinearScale = yScale(povertyData, chosenYAxis);
    


    if (!svgArea.empty()) {
        svgArea.remove();
    }


    var svgWidth = parseInt(d3.select("#scatter").style("width"));
    var svgHeight = svgWidth - svgWidth / 4;

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
        var chosenYAxis = "healthcare";
        var chosenColor="lightgreen";

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

          // function used for updating y-scale var upon click on axis label
        function yScale(povertyData, chosenYAxis) {
            // create scales
            var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(povertyData, d => d[chosenYAxis])])
            .range([height, 0]);
            return yLinearScale;
    
            }

        // function used for updating xAxis var upon click on axis label
        function renderAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
        }

        function renderYAxes(newYScale, yAxis) {
            var leftAxis = d3.axisLeft(newYScale);
    
            yAxis.transition()
                .duration(1000)
                .call(leftAxis);
    
            return yAxis;
            }

            

        function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
            var xLinearScale = xScale(povertyData, chosenXAxis);

        // Create y scale function
        var yLinearScale = yScale(povertyData, chosenYAxis);

                if (chosenXAxis === "poverty"){
                    chosenColor = "lightgreen"
                }else if(chosenXAxis === "age"){
                    chosenColor = "pink"
                }else {
                    chosenColor = "lightblue"
                }
                circlesGroup.transition()
                    .duration(1000)
                    .attr("cx", d => xLinearScale(d[chosenXAxis]))
                    .attr("cy", d => yLinearScale(d[chosenYAxis]))
                    .attr("fill", chosenColor);
                return circlesGroup;
        }


        function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis)
        {
            var xLinearScale = xScale(povertyData, chosenXAxis);

        // Create y scale function
        var yLinearScale = yScale(povertyData, chosenYAxis);
           
            // .attr("text-anchor", "middle");

                textGroup.transition()
                .duration(1000)
                .text(d => d.abbr)
                .attr('font-size', 10)//font size
                .attr("x", d => xLinearScale(d[chosenXAxis]))
                .attr("y", d => yLinearScale(d[chosenYAxis]));       
            return textGroup;
        }

            // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

        var xlabel;
        var ylabel;

        xlabel = chosenXAxis;
        ylabel = chosenYAxis;

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([70, -60])
            .html(function(d) {
            return (`<strong> ${d.state}<br>${ylabel} ${d[chosenYAxis]} <br> ${xlabel} ${d[chosenXAxis]}`)
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
        var yLinearScale = yScale(povertyData, chosenYAxis);

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
   
        var circlesGroup = chartGroup.append("g")
            .selectAll("circle")
            .data(povertyData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 18)
            .attr("fill", chosenColor)
            .attr("opacity", "0.7")
            .classed("stateCircle", true);
        
        var textGroup = chartGroup.append('g')
            .selectAll('text')
            .data(povertyData)
            .enter()
            .append('text')
            .text(d => d.abbr)
            .attr('font-size', 10)//font size
            .attr('x', d => xLinearScale(d[chosenXAxis]))
            .attr('y',d => yLinearScale(d[chosenYAxis]))
            .attr("dy", 3)
            .attr("dx",2)
            .classed("stateText", true)
            .attr("text-anchor", "middle");

        // Create group for three x-axis labels
        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var povertyLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .style('fill', 'green')
            .text("In poverty (%)");

        var ageLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .style('fill', 'pink')
            .text("Age (Median)");

        var incomeLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .style('fill', 'blue')
            .text("Household income (Median)");

          // append y axis    
        var yaxislabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)", "y", 0 - margin.left, "x", 0 - (height / 2) );
           
        
        var healthcareLabel = yaxislabelsGroup.append("text")
            .attr("x", -200)
            .attr("y", -30)
            .attr("value", "healthcare") // value to grab for event listener
            .classed("active", true)
            .text("Lacks Healthcare (%)");

        var smokesLabel = yaxislabelsGroup.append("text")
            .attr("x", -200)
            .attr("y", -50)
            .attr("value", "smokes") // value to grab for event listener
            .classed("inactive", true)
            .text("Smokes (%)");

        var obesityLabel = yaxislabelsGroup.append("text")
            .attr("x", -200)
            .attr("y", -70)
            .attr("value", "obesity") // value to grab for event listener
            .classed("inactive", true)
            .text("Obesity (%)");

        // updateToolTip function above csv import
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

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
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
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

        yaxislabelsGroup.selectAll("text")
        .on("click", function() {
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            // replaces chosenXAxis with value
            chosenYAxis = value;

            // console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            yLinearScale = yScale(povertyData, chosenYAxis);

            // updates x axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


            // changes classes to change bold text
            var healthcareBold = chosenYAxis === "healthcare";
            var smokesBold = chosenYAxis === "smokes";
            var obesityBold = chosenYAxis === "obesity";

            healthcareLabel
                .classed("active", healthcareBold)
                .classed("inactive", !healthcareBold);
            smokesLabel
                .classed("active", smokesBold)
                .classed("inactive", !smokesBold);
            obesityLabel
                .classed("active", obesityBold)
                .classed("inactive", !obesityBold);
            


            }
            });
        }).catch(function(error) {
        console.log(error);
        });
}

makeResponsive();

d3.select(window).on("resize", makeResponsive);

