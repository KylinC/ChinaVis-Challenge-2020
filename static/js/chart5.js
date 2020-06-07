/**
 * Chart 3
 * 
 * Author: Weiqi Feng
 * Email:  fengweiqi@sjtu.edu.cn
 * Date:   May 28, 2020
 * Copyright 2019 Vic   
 */
var chart5Data;
function chart5Export(name) {
    chart5Draw(name, false);
}
function chart5FetchCSV() {
    d3.csv("static/data/chart5.csv").then(function(data){
        chart5Data = data;
        chart5Draw("湖北", true);
    });
}
function chart5Draw(city, first) {
    let data = chart5Data;
    let extractData = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i]["城市"].includes(city)) {
            extractData.push(data[i]);
        }
    }
    // Build series
    let series = [];
    let keys = ["商品房销售面积", "商品房销售额", "商品住宅销售面积", "商品住宅销售额"];
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

    let height = $("#chart5").height(), width = $("#chart5").width();
    let margin = ({top: 30, right: 30, bottom: 20, left: 20});
    let labelPadding = 3;
    let diff = d3.max(series, s => d3.max(s, d => d.value)) - d3.min(series, s => d3.min(s, d => d.value));
    let y = d3.scaleLinear()
    .domain([d3.min(series, s => d3.min(s, d => d.value)) - 0.1 * diff, d3.max(series, s => d3.max(s, d => d.value)) + 0.1 * diff])
    .range([height - margin.bottom, margin.top]);


    let x = d3.scaleOrdinal()
    .domain(["2020年2月", "2020年3月", "2020年4月"])
    .range([margin.left, (width - margin.right + margin.left) / 2, width - margin.right]);
    console.log(width - margin.right)
    console.log(x("2020年4月"))
    let xAxis = g => g
    .attr("color", "#cdddf7")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks((width) / 80).tickSizeOuter(0)) 
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
            .attr("x", -13)
            .attr("y", 5.5)
            .attr("dy", "0.35em")
            .text(d => d);
      };

    let svg;
    let tooltip;
    let path;
    let serie;
    let pathText;
    if (first) {
        // chart5Draw the figure
        svg = d3.select("#chart5")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);
        tooltip = d3.select("#chart5")
                    .append("div")
                    .attr("id", "chart5Tip");
        tooltip.append("span")
                  .attr("class", "chart5TipText");
        svg.append("g")
        .attr("id", "chart5xAxis")
        .call(xAxis);

        svg.append("g")
        .attr("id", "chart5Legend")
        .call(legend);

        serie = svg.append("g")
            .attr("id", "chart5Main")
            .attr("width", width)
            .attr("height", height)
            .selectAll("g")
            .data(series)
            .join("g");
        path = serie.append("path");
        pathText = serie.append("g")
                        .attr("class", "pathText");
        pathText1 = serie.append("g")
                       .attr("class", "pathText1");
    } else {
        svg = d3.select("#chart5 > svg");
        tooltip = d3.select("#chart5 > div");
        serie = svg.select("#chart5Main")
                .selectAll("g:not(.pathText):not(.pathText1)")
                .data(series)
                .join("g");
        path = serie.select("path");
        pathText = serie.select(".pathText");
        pathText1 = serie.select(".pathText1");
    }


    // Create series
    let delay = 2000;

    // Append data
    path
        .attr("fill", "none")
        .attr("stroke", d => z(d[0].key))
        .attr("stroke-width", 2.5)
        .on("mouseover", function(d) {
            let xPos = d3.event.clientX - $("#chart5").offset().left;
            let yPos = d3.event.clientY - $("#chart5").offset().top;
            d3.select("#chart5Tip")
              .style("left", (xPos + 6) + "px")
              .style("top", (yPos - 26) + "px");
            d3.select(".chart5TipText")
              .text(function () {
                      return city + " :" + d[0].key;
              });
            d3.select("#chart5Tip").classed("chart5Tip_hidden", false).transition().delay(delay);
        })
        .on("mouseout", function(d) {
            d3.select("#chart5Tip").classed("chart5Tip_hidden", true).transition().delay(delay);
        })
        .transition()
        .ease(d3.easeBounceOut)
        .duration(delay)
        .attr("d", d3.line()
            .x(d => x(d.date))
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
            .transition()
            .ease(d3.easeBounceOut)
            .duration(function() {
                if (first) {
                    return 0;
                } else {
                    return delay;
                }
            })
            .attr("x", d => x(d.date))
            .attr("y", d => y(d.value))
            .attr("fill", "none")
            .attr("stroke", "#824113")
            .attr("stroke-width", 6);

        pathText1
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
            .transition()
            .ease(d3.easeBounceOut)
            .duration(function() {
                if (first) {
                    return 0;
                } else {
                    return delay;
                }
            })
            .attr("x", d => x(d.date))
            .attr("y", d => y(d.value))

        // pathText
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", 10)
        //     .attr("stroke-linecap", "round")
        //     .attr("stroke-linejoin", "round")
        //     .attr("text-anchor", "middle")
        //   .selectAll("text")
        //   .data(d => d)
        //   .join("text")
        //     .text(d => d.value)
        //     .attr("dy", "0.35em")
        //     .attr("fill", "white")
        //     .transition()
        //     .ease(d3.easeBounceOut)
        //     .duration(function() {
        //         if (first) {
        //             return 0;
        //         } else {
        //             return delay;
        //         }
        //     })
        //     .attr("x", d => x(d.date))
        //     .attr("y", d => y(d.value));
        
}
(function() {
    "use strict";
    window.addEventListener("load", chart5Initialize);
    function chart5Initialize() {
        chart5FetchCSV();
    }
})()