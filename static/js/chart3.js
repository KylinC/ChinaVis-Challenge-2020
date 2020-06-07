/**
 * Chart 3
 * 
 * Author: Weiqi Feng
 * Email:  fengweiqi@sjtu.edu.cn
 * Date:   May 28, 2020
 * Copyright 2019 Vic   
 */
var chart3Data;
function chart3FetchCSV() {
    d3.csv("static/data/chart3.csv").then(function(data){
        chart3Data = data;
        chart3Draw("武汉", true);
    });
}

function chart3Export(name) {
    chart3Draw(name, false);
}

function chart3Draw(city, first) {
    // $("#chart3").empty();
    let height = $("#chart3").height(), width = $("#chart3").width();
    let margin = ({top: 5, right: 10, bottom: 30, left: 40});
    let label = ["居民消费价格指数", "商品零售价格指数","工业生产购进价格指数","工业生产出厂价格指数"];
    let months = ["2020年1月", "2020年2月", "2020年3月", "2020年4月"];
    let monthoffset = [4, 3, 2, 1];
    let extractData = [];
    let data = chart3Data;
    for (let i = 0; i < data.length; i++) {
        if (data[i]["城市"].includes(city)) {
            extractData.push(data[i]);
        }
    }
    let finalData = [];
    for (let i = 0; i < months.length; i++) {
        let singleData = {};
        singleData["month"] = months[i];
        // Get column offset
        for (let j = 0; j < extractData.length; j++) {
            singleData[extractData[j]["指标"]] = parseFloat(extractData[j][months[i]]);
        }
        finalData.push(singleData);
    }
    let groupKey = "month";

    let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .attr("color", "#cdddf7")
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
    .attr("x", 3)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("上年同月=100"));

    let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("color", "#cdddf7")
    .call(d3.axisBottom(x0).tickSizeOuter(0))
    .call(g => g.select(".domain").remove());

    let color = d3.scaleOrdinal().range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    let getVal = function(data) {
        if (isNaN(data)) {
            return 0.0;
        } else {
            return data;
        }
    }
    let lowY = d3.min(finalData, d => d3.min(label, key => getVal(d[key]))) - 5.0;
    lowY = Math.round(lowY);
    if (lowY % 2 == 1) {
        lowY -= 1;
    }
    let y = d3.scaleLinear()
    .domain([lowY, d3.max(finalData, d => d3.max(label, key => getVal(d[key]))) + 5]).nice()
    .range([height - margin.bottom, margin.top]);

    let x0 = d3.scaleBand()
        .domain(finalData.map(d => d[groupKey]))
        .rangeRound([margin.left, width - margin.right])
        .paddingInner(0.1);
    let x1 = d3.scaleBand()
        .domain(label)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05)

    let svg;
    let tooltip;
    let gg;

    if (first) {
        svg = d3.select("#chart3")
                 .append("svg")
                 .attr("width", width)
                 .attr("height", height);
        tooltip = d3.select("#chart3")
                 .append("div")
                 .attr("id", "chart3Tip");
        tooltip.append("span")
                          .attr("class", "chart3TipText");
        gg = svg.append("g")
                .attr("id", "chart3Main");
    } else {
        svg = d3.select("#chart3 > svg");
        tooltip = d3.select("#chart3 > div");
        gg = svg.select("#chart3Main");
    }

    gg 
        .selectAll("g")
        .data(finalData)
        .join("g")
        .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
        .selectAll("rect")
        .data(d => label.map(key => ({key, value: d[key]})))
        .join("rect")
        .on("mouseover", function(d) {
        let xPos = d3.event.clientX - $("#chart3").offset().left;
        let yPos = d3.event.clientY - $("#chart3").offset().top;
        d3.select("#chart3Tip")
            .style("left", (xPos + 6) + "px")
            .style("top", (yPos - 26) + "px");
        d3.select(".chart3TipText")
            .text(function () {
                if (isNaN(d.value)) {
                    return city + " :NaN";
                } else {
                    return city + " :" + d.value.toString();
                }
            });
        d3.select("#chart3Tip").classed("chart3Tip_hidden", false);
        })
        .on("mouseout", function(d) {
            d3.select("#chart3Tip").classed("chart3Tip_hidden", true);
        })
        .transition()
        .ease(d3.easeBounceOut)
        .duration(function() {
            if (first) {
                return 0;
            } else {
                return 2000;
            }
        })
        .attr("x", d => x1(d.key))
        .attr("y", function (d) {
            if (isNaN(d.value)) {
                return height - margin.bottom;
            } else {
                return y(d.value);
            }
        })
        .attr("fill", d => color(d.key))
        .attr("width", x1.bandwidth())
        .attr("height", function (d) {
            if (isNaN(d.value)) {
                return 0.0;
            }
            return  -y(d.value) + y(lowY);
        });
    if (first) {
        svg.append("g")
            .attr("id", "chart3xAxis")
            .call(xAxis);
        svg.append("g")
            .attr("id", "chart3yAxis")
            .call(yAxis);
    } else {
        $("#chart3xAxis").empty()
        $("#chart3yAxis").empty()
        svg.select("#chart3xAxis")
            .call(xAxis);
        svg.select("#chart3yAxis")
            .call(yAxis);
    }

    let legend = svg => {
        const g = svg
            .attr("transform", `translate(${width},0)`)
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("g")
            .data(color.domain().slice().reverse())
            // .data([1, 2, 3, 4])
            .join("g")
            .attr("transform", (d, i) => `translate(0,${i * 20})`);

        g.append("rect")
            .attr("x", -19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", color);
      
        g.append("text")
            .attr("fill", "#cdddf7")
            .attr("x", -24)
            .attr("y", 9.5)
            .attr("dy", "0.35em")
            .text(d => d);
      };
    if (first) {             
        svg.append("g").call(legend);
    }
}

(function() {
    "use strict";
    window.addEventListener("load", chart3Initialize);
    function chart3Initialize() {
        chart3FetchCSV();
    }
})()