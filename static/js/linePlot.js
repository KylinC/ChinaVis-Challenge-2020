// window.addEventListener("load", init);
var provinceData = {};

// function init() {
//     linePlot("湖北省", "confirmed");
// }

function chart1Export(province, caseType) {
    var status = "";
    if (caseType == 1) {
        status = "confirmed";
    } else {
        if (caseType == 2) {
            status = "cured";
        } else {
            status = "dead";
        }
    }
    linePlot(province, status);
}

function linePlot(province, item) {
    // Modify chart name
    var newName = province + "省内疫情趋势"
    document.getElementById("chart1Title").innerHTML = newName;

    d3.csv("static/data/provinceData.csv").then(function (data) {
        let confirmedData = {};
        let curedData = {};
        let deadData = {};

        // Collect data for each status
        for (let row of data) {
            let cur_province = row.Province;
            let date = row.Date;

            if (cur_province.includes(province)) {
                let count = parseInt(row.Count);
                if (row.Item == "confirmed") {
                    if (confirmedData[province] == undefined) {
                        let temp_dict = {};
                        temp_dict[date] = count;
                        confirmedData[province] = temp_dict;
                        console.log(confirmedData);
                    } else {
                        confirmedData[province][date] = count;
                    }
                }

                if (row.Item == "dead") {
                    if (deadData[province] == undefined) {
                        let temp_dict = {};
                        temp_dict[date] = count;
                        deadData[province] = temp_dict;
                    } else {
                        deadData[province][date] = count;
                    }
                }

                if (row.Item == "cured") {
                    if (curedData[province] == undefined) {
                        let temp_dict = {};
                        temp_dict[date] = count;
                        curedData[province] = temp_dict;
                    } else {
                        curedData[province][date] = count;
                    }
                }
            }
        }

        console.log(confirmedData);

        let xData = [];
        let yData = [];

        if (item == "dead") {
            xData = Object.keys(deadData[province]);
            yData = Object.values(deadData[province]);
        }

        if (item == "cured") {
            xData = Object.keys(curedData[province]);
            yData = Object.values(curedData[province]);
        }

        if (item == "confirmed") {
            console.log(confirmedData[province]);
            xData = Object.keys(confirmedData[province]);
            yData = Object.values(confirmedData[province]);
        }

        var div = document.getElementById("linePlot");

        var rect = div.getBoundingClientRect();
        console.log(rect);

        var margin = { top: rect.height / 8, right: rect.width / 10, bottom: rect.height / 10, left: rect.width/6},
            width = rect.width - margin.left - margin.right - 20,
            height = rect.height - margin.top - margin.bottom;

        d3.select(".LP").remove();

        div = d3.select("#linePlot");

        var svg = div.append("svg")
            .attr("class", "LP")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + 0 + "," + margin.top + ")");

        svg.transition()
            .duration(2000)
            .transition()
            .ease(d3.easeBounce);

        var xRange = [];

        for (var i = 0; i < xData.length; ++i) {
            xRange.push(i);
        }

        var xScale = d3.scaleLinear()
            .domain([d3.min(xRange), d3.max(xRange)])
            .range([0, width]);

        // Add x axis and vertical lines
        var xAxis = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + height + ")")
            .call(d3.axisBottom(xScale).tickSizeOuter(0)
                .tickSizeInner(0));

        xAxis.selectAll("line").style("stroke", "white");
        xAxis.selectAll("path").style("stroke", "white");
        xAxis.selectAll("text").style("stroke", "white");

        // // Add x axis label
        // svg.append("text")
        //     .attr("transform", "translate(" + (10 + width / 2) + "," + (height + 30) + ")")
        //     .attr("font-size", "10px")
        //     .attr("text-anchor", "middle")
        //     .style("fill", "white")
        //     .text("Date");

        console.log(yData);
        var yScale = d3.scaleLinear()
            .domain([d3.min(yData) * 0.8, d3.max(yData) * 1.2])
            .range([height, 0]);

        // Add y Axis and horizontal lines
        var yAxis = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + 0 + ")")
            .call(d3.axisLeft(yScale).tickSizeOuter(0)
                .tickSizeInner(0));

        yAxis.selectAll("line").style("stroke", "white");
        yAxis.selectAll("path").style("stroke", "white");
        yAxis.selectAll("text").style("stroke", "white");

        let temp = [];
        for (let i = yData.length - 1; i >= 0; --i) {
            temp.push(yData[i]);
        }
        yData = temp;


        temp = [];
        for (let i = xData.length - 1; i >= 0; --i) {
            temp.push(xData[i]);
        }
        xData = temp;

        // Get deltaY data
        let deltaY = [0]
        for(var i = 1; i < yData.length; ++i) {
            deltaY.push(yData[i] - yData[i-1])
            console.log(deltaY)
        }

        var yRScale = d3.scaleLinear()
            .domain([d3.min(deltaY) * 0.8, d3.max(deltaY) * 1.2])
            .range([height, 0]);

        // Add y Axis and horizontal lines
        var yRAxis = svg.append("g")
            .attr("transform", "translate(" + (width + margin.left) + "," + 0 + ")")
            .call(d3.axisRight(yRScale).tickSizeOuter(0)
                .tickSizeInner(0));

        yRAxis.selectAll("line").style("stroke", "white");
        yRAxis.selectAll("path").style("stroke", "white");
        yRAxis.selectAll("text").style("stroke", "white");

    //     let statusWord = "";
    //     if (item == "dead") {
    //         statusWord = "死亡";
    //     }
    //     if (item == "cured") {
    //         statusWord = "治愈";
    //     }
    //     if (item == "confirmed") {
    //         statusWord = "确诊";
    //     }

    //     g.append("text")
    //         .attr("transform", "translate(" + (10 + width / 2) + "," + (10) + ")")
    //         .attr("font-size", "10px")
    //         .attr("text-anchor", "middle")
    //         .style("fill", "white")
    //         .text(province + statusWord + "人数");

        // Reverse time value


        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        // Add brushing
        var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
            .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

        // Create the area variable: where both the area and the brush take place
        var area = svg.append('g')
            .attr("clip-path", "url(#clip)")
            .attr("transform", "translate(" + 1.05 * margin.left + ","  +"0)")

        // Create an area generator
        var areaGenerator1 = d3.area()
            .x(function (d) { return xScale(d[0]) })
            .y0(yScale(0))
            .y1(function (d) {return yScale(d[1]); })

        var areaGenerator2 = d3.area()
            .x(function (d) { return xScale(d[0]) })
            .y0(yScale(0))
            .y1(function (d) { return yRScale(d[1]); })

        let allData = [];
        for(var i = 0; i < xData.length; ++i) {
            allData.push([xRange[i], yData[i]]);
        }

        var cumulatedColor = ""
        if (item == "confirmed") {
            cumulatedColor = "#F08080";
        } else {
            if (item == "dead") {
                cumulatedColor = "#C0C0C0";
            } else {
                cumulatedColor = "#98FB98";
            }
        }

        // Add the area
        area.append("path")
            .datum(allData)
            .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
            .attr("fill", cumulatedColor)
            .attr("fill-opacity", .3)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("d", areaGenerator1);

        console.log(deltaY);

        var allDataDelta = [];
        for (var i = 0; i < xData.length; ++i) {
            allDataDelta.push([xRange[i], deltaY[i]]);
        }

        area.append("path")
            .datum(allDataDelta)
            .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
            .attr("fill", "#FFFF00")
            .attr("fill-opacity", .3)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("d", areaGenerator2);

        // Add the xS
        area
            .append("g")
            .attr("class", "brush")
            .call(brush);

        // A function that set idleTimeOut to null
        var idleTimeout
        function idled() { idleTimeout = null; }

        // A function that update the chart for given boundaries
        function updateChart() {

            // What are the selected boundaries?
            extent = d3.event.selection
            console.log(extent)

            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if (!extent) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                xScale.domain([4, 8])
                xAxis.selectAll("line").style("stroke", "white");
                xAxis.selectAll("path").style("stroke", "white");
                xAxis.selectAll("text").style("stroke", "white");
            } else {
                xScale.domain([xScale.invert(extent[0]), xScale.invert(extent[1])])
                xAxis.selectAll("line").style("stroke", "white");
                xAxis.selectAll("path").style("stroke", "white");
                xAxis.selectAll("text").style("stroke", "white");
                area.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }

            // Update axis and area position
            xAxis.transition().duration(1000).call(d3.axisBottom(xScale))
            xAxis.selectAll("line").style("stroke", "white");
            xAxis.selectAll("path").style("stroke", "white");
            xAxis.selectAll("text").style("stroke", "white");
            area
                .select('.myArea')
                .transition()
                .duration(1000)
                .attr("d", areaGenerator1)
            // area
            //     .select('.myArea')
            //     .transition()
            //     .duration(1000)
            //     .attr("d", areaGenerator2)
        }

        // If user double click, reinitialize the chart
        svg.on("dblclick", function () {
            xScale.domain([d3.min(xRange), d3.max(xRange)])
            xAxis.transition().call(d3.axisBottom(xScale))
            xAxis.selectAll("line").style("stroke", "white");
            xAxis.selectAll("path").style("stroke", "white");
            xAxis.selectAll("text").style("stroke", "white");
            area
                .select('.myArea')
                .transition()
                .attr("d", areaGenerator1)
        });
    });
}

 //     let total_data = [];
    //     for (var i = 0; i < xData.length; ++i) {
    //         total_data.push([xScale(xRange[i]), yScale(yData[i])]);
    //     }

    //     // // Append line
    //     // g.append("g")
    //     //     .attr("transform", "translate(20," + 0 + ")")
    //     //     .append("path")
    //     //     .attr("fill", "none")
    //     //     .attr("stroke", "#6699FF")
    //     //     .style("stroke-width", "3px")
    //     //     .attr("d", d3.line()(total_data));


    //     // Highlight the specie that is hovered
    //     var highlight = function (d, i) {
    //         var t = d3.transition()
    //             .duration(250)
    //             .ease(d3.easeLinear);

    //         // Second the hovered specie takes its color
    //         d3.selectAll(".circle" + i)
    //             .transition(t)
    //             .style("fill", "#FF3333")
    //             .attr("r", 4);

    //         radarChart(i);
    //         pieChart(i);
    //         barGraph(i);

    //         d3.select("#Current_month").text("Current month " + (i + 1));
    //     }

    //     // Highlight the specie that is hovered
    //     var doNotHighlight = function (d, i) {
    //         var t = d3.transition()
    //             .duration(250)
    //             .ease(d3.easeLinear);

    //         // Second the hovered specie takes its color
    //         d3.selectAll(".circle" + i)
    //             .transition(t)
    //             .style("fill", "#FF9966")
    //             .attr("r", 2);
    //     }

    //     g.append("g")
    //         .selectAll("dot")
    //         .data(yData)
    //         .enter()
    //         .append("circle")
    //         .attr("transform", "translate(20," + 0 + ")")
    //         .attr("class", function (d, i) { return "circle" + i; })
    //         .attr("cx", function (d, i) { return xScale(xRange[i]); })
    //         .attr("cy", function (d) { return yScale(d); })
    //         .attr("r", 2)
    //         .style("fill", "#FF9966")
    //         .on("mouseover", highlight)
    //         .on("mouseleave", doNotHighlight);
    // });


        // Add X axis --> it is a date format
        // var x = d3.scaleTime()
        //     .domain(xData)
        //     .range([0, width]);
        // xAxis = svg.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(x));

        // // Add Y axis
        // var y = d3.scaleLinear()
        //     .domain([d3.min(yData), d3.max(yData)])
        //     .range([height, 0]);
        // yAxis = svg.append("g")
        //     .call(d3.axisLeft(y));