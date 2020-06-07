/**
 * Chart 3
 * 
 * Author: Weiqi Feng
 * Email:  fengweiqi@sjtu.edu.cn
 * Date:   May 28, 2020
 * Copyright 2019 Vic   
 */
var chart4Data;
function chart4FetchCSV() {
    d3.csv("static/data/chart4.csv").then(function(data){
        chart4Data = data;
        chart4Draw("武汉", true);
    });
}

function chart4Export(name) {
    chart4Draw(name, false);
}

function chart4Draw(city, first) {
    // $("#chart4").empty();
    let height = $("#chart4").height(), width = $("#chart4").width();
    let margin = ({top: 5, right: 10, bottom: 30, left: 40});
    let label = ["居民消费价格指数", "商品零售价格指数","工业生产购进价格指数","工业生产出厂价格指数"];
    let months = ["2020年1月", "2020年2月", "2020年3月", "2020年4月"];
    let monthoffset = [4, 3, 2, 1];
    let extractData = [];
    let data = chart4Data;
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
        svg = d3.select("#chart4")
                 .append("svg")
                 .attr("width", width)
                 .attr("height", height);
        tooltip = d3.select("#chart4")
                 .append("div")
                 .attr("id", "chart4Tip");
        tooltip.append("span")
                          .attr("class", "chart4TipText");
        gg = svg.append("g")
                .attr("id", "chart4Main");
    } else {
        svg = d3.select("#chart4 > svg");
        tooltip = d3.select("#chart4 > div");
        gg = svg.select("#chart4Main");
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
        let xPos = d3.event.clientX - $("#chart4").offset().left;
        let yPos = d3.event.clientY - $("#chart4").offset().top;
        d3.select("#chart4Tip")
            .style("left", (xPos + 6) + "px")
            .style("top", (yPos - 26) + "px");
        d3.select(".chart4TipText")
            .text(function () {
                if (isNaN(d.value)) {
                    return city + " :NaN";
                } else {
                    return city + " :" + d.value.toString();
                }
            });
        d3.select("#chart4Tip").classed("chart4Tip_hidden", false);
        })
        .on("mouseout", function(d) {
            d3.select("#chart4Tip").classed("chart4Tip_hidden", true);
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
            .attr("id", "chart4xAxis")
            .call(xAxis);
        svg.append("g")
            .attr("id", "chart4yAxis")
            .call(yAxis);
    } else {
        $("#chart4xAxis").empty()
        $("#chart4yAxis").empty()
        svg.select("#chart4xAxis")
            .call(xAxis);
        svg.select("#chart4yAxis")
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
    window.addEventListener("load", chart4Initialize);
    function chart4Initialize() {
        chart4FetchCSV();
    }
})()