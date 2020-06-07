// window.addEventListener("load", init);
// var provinceData = {};

// function init() {
//     linePlot("海南省", "confirmed");
// }

// function linePlot(province, item) {
//     d3.csv("static/data/provinceData.csv").then(function (data) {
//         let confirmedData = {};
//         let curedData = {};
//         let deadData = {};

//         // Collect data for each status
//         for (let row of data) {
//             let cur_province = row.Province;
//             let date = row.Date;

//             if (cur_province == province) {
//                 let count = parseInt(row.Count);
//                 if (row.Item == "confirmed") {
//                     if (confirmedData[province] == undefined) {
//                         let temp_dict = {};
//                         temp_dict[date] = count;
//                         confirmedData[province] = temp_dict;
//                         console.log(province);
//                     } else {
//                         confirmedData[province][date] = count;
//                     }
//                 }

//                 if (row.Item == "dead") {
//                     if (deadData[province] == undefined) {
//                         let temp_dict = {};
//                         temp_dict[date] = count;
//                         deadData[province] = temp_dict;
//                     } else {
//                         deadData[province][date] = count;
//                     }
//                 }

//                 if (row.Item == "cured") {
//                     if (curedData[province] == undefined) {
//                         let temp_dict = {};
//                         temp_dict[date] = count;
//                         curedData[province] = temp_dict;
//                     } else {
//                         curedData[province][date] = count;
//                     }
//                 }
//             }
//         }

//         let xData = [];
//         let yData = [];

//         if (item == "dead") {
//             xData = Object.keys(deadData[province]);
//             yData = Object.values(deadData[province]);
//         }

//         if (item == "cured") {
//             xData = Object.keys(curedData[province]);
//             yData = Object.values(curedData[province]);
//         }

//         if (item == "confirmed") {
//             xData = Object.keys(confirmedData[province]);
//             yData = Object.values(confirmedData[province]);
//         }

//         var margin = { top: 40, right: 2, bottom: 2, left: 0 },
//             width = 230 - margin.left - margin.right,
//             height = 170 - margin.top - margin.bottom;

//         var div = d3.select("#linePlot");

//         var g = div.append("svg")
//             .attr("width", width + margin.left + margin.right)
//             .attr("height", height + margin.top + margin.bottom)
//             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//             // Add the grey background that makes ggplot2 famous
//             // g.append("rect")
//             //     .attr("transform", "translate(20," + 0 + ")")
//             //     .attr("x", 0)
//             //     .attr("y", 0)
//             //     .attr("height", height)
//             //     .attr("width", width)
//             //     .style("fill", "EBEBEB");


//             var xRange = [];

//             for(var i = 0; i < xData.length; ++i) {
//                 xRange.push(i);
//             }

//             var xScale = d3.scaleLinear()
//                 .domain([d3.min(xRange), d3.max(xRange)])
//                 .range([0, width]);

//             // Add x axis and vertical lines
//             var xAxis = g.append("g")
//                 .attr("transform", "translate(20," + height + ")")
//                 .call(d3.axisBottom(xScale));

//             xAxis.selectAll("line").style("stroke", "white");
//             xAxis.selectAll("path").style("stroke", "white");
//             xAxis.selectAll("text").style("stroke", "white");

//             // Add x axis label
//             g.append("text")
//                 .attr("transform", "translate(" + (10 + width / 2) + "," + (height + 30) + ")")
//                 .attr("font-size", "10px")
//                 .attr("text-anchor", "middle")
//                 .style("fill", "white")
//                 .text("Date");

//             var yScale = d3.scaleLinear()
//                 .domain([d3.min(yData) * 0.8, d3.max(yData) * 1.2])
//                 .range([height, 0]);

//             // Add y Axis and horizontal lines
//             var yAxis = g.append("g")
//                 .attr("transform", "translate(20," + 0 + ")")
//                 .call(d3.axisLeft(yScale));

//             yAxis.selectAll("line").style("stroke", "white");
//             yAxis.selectAll("path").style("stroke", "white");
//             yAxis.selectAll("text").style("stroke", "white");

//             let statusWord = "";
//             if(item == "dead") {
//                 statusWord = "死亡";
//             }
//             if (item == "cured") {
//                 statusWord = "治愈";
//             }
//             if (item == "confirmed") {
//                 statusWord = "确诊";
//             }

//             g.append("text")
//                 .attr("transform", "translate(" + (10 + width / 2) + "," + (10) + ")")
//                 .attr("font-size", "10px")
//                 .attr("text-anchor", "middle")
//                 .style("fill", "white")
//                 .text(province + statusWord + "人数");

//             // Reverse time value
//             let temp = [];
//             for (let i = yData.length - 1; i >= 0; --i) {
//                 temp.push(yData[i]);
//             }
//             yData = temp;

//             let total_data = [];
//             for (var i = 0; i < xData.length; ++i) {
//                 total_data.push([xScale(xRange[i]), yScale(yData[i])]);
//             }

//             // // Append line
//             // g.append("g")
//             //     .attr("transform", "translate(20," + 0 + ")")
//             //     .append("path")
//             //     .attr("fill", "none")
//             //     .attr("stroke", "#6699FF")
//             //     .style("stroke-width", "3px")
//             //     .attr("d", d3.line()(total_data));


//             // Highlight the specie that is hovered
//             var highlight = function (d, i) {
//                 var t = d3.transition()
//                     .duration(250)
//                     .ease(d3.easeLinear);

//                 // Second the hovered specie takes its color
//                 d3.selectAll(".circle" + i)
//                     .transition(t)
//                     .style("fill", "#FF3333")
//                     .attr("r", 4);

//                 radarChart(i);
//                 pieChart(i);
//                 barGraph(i);

//                 d3.select("#Current_month").text("Current month " + (i + 1));
//             }

//             // Highlight the specie that is hovered
//             var doNotHighlight = function (d, i) {
//                 var t = d3.transition()
//                     .duration(250)
//                     .ease(d3.easeLinear);

//                 // Second the hovered specie takes its color
//                 d3.selectAll(".circle" + i)
//                     .transition(t)
//                     .style("fill", "#FF9966")
//                     .attr("r", 2);
//             }

//             g.append("g")
//                 .selectAll("dot")
//                 .data(yData)
//                 .enter()
//                 .append("circle")
//                 .attr("transform", "translate(20," + 0 + ")")
//                 .attr("class", function (d, i) { return "circle" + i; })
//                 .attr("cx", function (d, i) { return xScale(xRange[i]); })
//                 .attr("cy", function (d) { return yScale(d); })
//                 .attr("r", 2)
//                 .style("fill", "#FF9966")
//                 .on("mouseover", highlight)
//                 .on("mouseleave", doNotHighlight);
//     });
// }

window.addEventListener("load", init);
var provinceData = {};

function init() {
    linePlot("湖北省", "confirmed");
}

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

        var margin = { top: rect.height / 8, right: rect.width / 10, bottom: rect.height / 10, left: rect.width / 8 },
            width = rect.width - margin.left - margin.right,
            height = rect.height - margin.top - margin.bottom;

        d3.select(".LP").remove();

        div = d3.select("#linePlot");

        var g = div.append("svg")
            .attr("class", "LP")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add the grey background that makes ggplot2 famous
        // g.append("rect")
        //     .attr("transform", "translate(20," + 0 + ")")
        //     .attr("x", 0)
        //     .attr("y", 0)
        //     .attr("height", height)
        //     .attr("width", width)
        //     .style("fill", "EBEBEB");


        var xRange = [];

        for (var i = 0; i < xData.length; ++i) {
            xRange.push(i);
        }

        var xScale = d3.scaleLinear()
            .domain([d3.min(xRange), d3.max(xRange)])
            .range([0, width]);

        // Add x axis and vertical lines
        var xAxis = g.append("g")
            .attr("transform", "translate(20," + height + ")")
            .call(d3.axisBottom(xScale).tickSizeOuter(0)
                .tickSizeInner(0));

        xAxis.selectAll("line").style("stroke", "white");
        xAxis.selectAll("path").style("stroke", "white");
        xAxis.selectAll("text").style("stroke", "white");

        // Add x axis label
        g.append("text")
            .attr("transform", "translate(" + (10 + width / 2) + "," + (height + 30) + ")")
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .text("Date");

        console.log(yData);
        var yScale = d3.scaleLinear()
            .domain([d3.min(yData) * 0.8, d3.max(yData) * 1.2])
            .range([height, 0]);

        // Add y Axis and horizontal lines
        var yAxis = g.append("g")
            .attr("transform", "translate(20," + 0 + ")")
            .call(d3.axisLeft(yScale).tickSizeOuter(0)
                .tickSizeInner(0));

        yAxis.selectAll("line").style("stroke", "white");
        yAxis.selectAll("path").style("stroke", "white");
        yAxis.selectAll("text").style("stroke", "white");

        let statusWord = "";
        if (item == "dead") {
            statusWord = "死亡";
        }
        if (item == "cured") {
            statusWord = "治愈";
        }
        if (item == "confirmed") {
            statusWord = "确诊";
        }

        g.append("text")
            .attr("transform", "translate(" + (10 + width / 2) + "," + (10) + ")")
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .text(province + statusWord + "人数");

        // Reverse time value
        let temp = [];
        for (let i = yData.length - 1; i >= 0; --i) {
            temp.push(yData[i]);
        }
        yData = temp;

        let total_data = [];
        for (var i = 0; i < xData.length; ++i) {
            total_data.push([xScale(xRange[i]), yScale(yData[i])]);
        }

        // // Append line
        // g.append("g")
        //     .attr("transform", "translate(20," + 0 + ")")
        //     .append("path")
        //     .attr("fill", "none")
        //     .attr("stroke", "#6699FF")
        //     .style("stroke-width", "3px")
        //     .attr("d", d3.line()(total_data));


        // Highlight the specie that is hovered
        var highlight = function (d, i) {
            var t = d3.transition()
                .duration(250)
                .ease(d3.easeLinear);

            // Second the hovered specie takes its color
            d3.selectAll(".circle" + i)
                .transition(t)
                .style("fill", "#FF3333")
                .attr("r", 4);

            radarChart(i);
            pieChart(i);
            barGraph(i);

            d3.select("#Current_month").text("Current month " + (i + 1));
        }

        // Highlight the specie that is hovered
        var doNotHighlight = function (d, i) {
            var t = d3.transition()
                .duration(250)
                .ease(d3.easeLinear);

            // Second the hovered specie takes its color
            d3.selectAll(".circle" + i)
                .transition(t)
                .style("fill", "#FF9966")
                .attr("r", 2);
        }

        g.append("g")
            .selectAll("dot")
            .data(yData)
            .enter()
            .append("circle")
            .attr("transform", "translate(20," + 0 + ")")
            .attr("class", function (d, i) { return "circle" + i; })
            .attr("cx", function (d, i) { return xScale(xRange[i]); })
            .attr("cy", function (d) { return yScale(d); })
            .attr("r", 2)
            .style("fill", "#FF9966")
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight);
    });
}