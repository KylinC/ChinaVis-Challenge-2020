/**
 * Chart 3
 * 
 * Author: Weiqi Feng
 * Email:  fengweiqi@sjtu.edu.cn
 * Date:   May 28, 2020
 * Copyright 2019 Vic   
 */
(function() {
    "use strict";
    window.addEventListener("load", initialize);
    function initialize() {
        fetchCSV();
    }
    function fetchCSV() {
        d3.csv("static/data/chart4.csv").then(function(data){
            draw(data);
        });
    }
    function draw(data) {
        let city =  "北京";
        let extractData = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i]["城市"] == city) {
                extractData.push(data[i]);
            }
        }
        // Build series
        let series = [];
        let keys = [];
        for (let i = 0; i < extractData.length; i++) {
            let single = [];
            for (let j = data.columns.length - 2; j >= 1; j--) {
                let month = data.columns[j];
                single.push({key: extractData[i]["指标"],
                             date: month,
                             value: parseFloat(extractData[i][month])});
            }
            keys.push(extractData[i]["指标"]);
            series.push(single);
        }

        let height = 260, width = 500;
        let margin = ({top: 30, right: 50, bottom: 20, left: 30});
        let labelPadding = 3;
        let y = d3.scaleLinear()
        .domain([0, d3.max(series, s => d3.max(s, d => d.value))])
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

        // Draw the figure
        let svg = d3.select("#chart4")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);
        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(legend);
        let diffX = 48.5;
        // Create series
        let serie = svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g");
        // Append data
        serie.append("path")
            .attr("fill", "none")
            .attr("stroke", d => z(d[0].key))
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.date) + diffX)
                .y(d => y(d.value)));

        serie.append("g")
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
                .attr("x", d => x(d.date) + diffX)
                .attr("y", d => y(d.value))
                .attr("fill", "#cdddf7")
              .clone(true).lower()
                .attr("fill", "none")
                .attr("stroke", "#795548")
                .attr("stroke-width", 5);
    }
})()