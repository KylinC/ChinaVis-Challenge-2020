/**
 * Chart 3
 * 
 * Author: Weiqi Feng
 * Email:  fengweiqi@sjtu.edu.cn
 * Date:   May 28, 2020
 * Copyright 2019 Vic   
 */
var chart3Data;
function chart3Export(name) {
    chart3Draw(name, false);
}
function chart3FetchCSV() {
    d3.csv("static/data/chart3.csv").then(function(data){
        chart3Data = data;
        chart3Draw("湖北", true);
    });
}
function chart3Draw(city, first) {
    let data = chart3Data;
    let extractData = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i]["城市"].includes(city)) {
            extractData.push(data[i]);
        }
    }
    // Build series
    let series = [];
    let keys = ["亏损企业增减", "存货增加比例", "负债增加", "产生品增减"];
    for (let i = 0; i < extractData.length; i++) {
        let single = [];
        for (let j = data.columns.length - 2; j >= 1; j--) {
            let month = data.columns[j];
            single.push({key: extractData[i]["指标"],
                         date: month,
                         value: parseFloat(extractData[i][month])});
        }
        series.push(single);
    }

    let height = $("#chart3").height(), width = $("#chart3").width();
    let margin = ({top: 30, right: 50, bottom: 20, left: 30});
    let labelPadding = 3;
    let diff = d3.max(series, s => d3.max(s, d => d.value)) - d3.min(series, s => d3.min(s, d => d.value));
    let y = d3.scaleLinear()
    .domain([d3.min(series, s => d3.min(s, d => d.value)) - 0.1 * diff, d3.max(series, s => d3.max(s, d => d.value)) + 0.1 * diff])
    .range([height - margin.bottom, margin.top]);

    let x = d3.scaleBand()
    .domain(["2020年1月", "2020年2月", "2020年3月", "2020年4月"])
    .rangeRound([margin.left, width - margin.right]);

    let xAxis = g => g
    .attr("color", "#cdddf7")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0)) 
    let z = function(key) {
        if (key == keys[0]) {
            return "#6b486b";
        }
        if (key == keys[1]) {
            return "#a05d56";
        }
        if (key == keys[2]) {
            return "#d0743c";
        }
        if (key == keys[3]) {
            return "#ff8c00";
        }
    };
    let legend = svg => {
        const g = svg
            .attr("transform", `translate(100,10)`)
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
          .selectAll("g")
          .data(keys)
          .join("g")
            .attr("transform", (d, i) => `translate(0,${i * 20})`);
        g.append("rect")
            .attr("x", 0)
            .attr("width", 25)
            .attr("height", 3)
            .attr("fill", d => z(d));
      
        g.append("text")
            .attr("fill", "#cdddf7")
            .attr("x", -24)
            .attr("y", 2.5)
            .attr("dy", "0.35em")
            .text(d => d);
      };

    let svg;
    let tooltip;
    let path;
    let serie;
    let pathText;
    if (first) {
        // chart3Draw the figure
        svg = d3.select("#chart3")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);
        tooltip = d3.select("#chart3")
                    .append("div")
                    .attr("id", "chart3Tip");
        tooltip.append("span")
                  .attr("class", "chart3TipText");
        svg.append("g")
        .attr("id", "chart3xAxis")
        .call(xAxis);

        svg.append("g")
        .attr("id", "chart3Legend")
        .call(legend);

        serie = svg.append("g")
            .attr("id", "chart3Main")
            .selectAll("g")
            .data(series)
            .join("g");
        path = serie.append("path");
        pathText = serie.append("g")
                        .attr("class", "pathText");
    } else {
        svg = d3.select("#chart3 > svg");
        tooltip = d3.select("#chart3 > div");
        serie = svg.select("#chart3Main")
                .selectAll("g:not(.pathText)")
                .data(series)
                .join("g");
        path = serie.select("path");
        pathText = serie.select(".pathText");
    }


    let diffX = 48.5;
    // Create series
    let delay = 2000;

    // Append data
    path
        .attr("fill", "none")
        .attr("stroke", d => z(d[0].key))
        .attr("stroke-width", 2.5)
        .on("mouseover", function(d) {
            let xPos = d3.event.clientX - $("#chart3").offset().left;
            let yPos = d3.event.clientY - $("#chart3").offset().top;
            d3.select("#chart3Tip")
              .style("left", (xPos + 6) + "px")
              .style("top", (yPos - 26) + "px");
            d3.select(".chart3TipText")
              .text(function () {
                      return city + " :" + d[0].key;
              });
            d3.select("#chart3Tip").classed("chart3Tip_hidden", false).transition().delay(delay);
        })
        .on("mouseout", function(d) {
            d3.select("#chart3Tip").classed("chart3Tip_hidden", true).transition().delay(delay);
        })
        .transition()
        .ease(d3.easeBounceOut)
        .duration(delay)
        .attr("d", d3.line()
            .x(d => x(d.date) + diffX)
            .y(d => y(d.value)))
        ;


        pathText
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("text-anchor", "middle")
          .selectAll("text")
          .data(d => d)
          .join("text")
            .text(d => d.value)
            .attr("dy", "0.35em")
            .attr("fill", "white")
            .attr("border-style", "dotted")
            .attr("border-color", "white")
            .transition()
            .ease(d3.easeBounceOut)
            .duration(function() {
                if (first) {
                    return 0;
                } else {
                    return delay;
                }
            })
            .attr("x", d => x(d.date) + diffX)
            .attr("y", d => y(d.value));
}
(function() {
    "use strict";
    window.addEventListener("load", chart3Initialize);
    function chart3Initialize() {
        chart3FetchCSV();
    }
})()