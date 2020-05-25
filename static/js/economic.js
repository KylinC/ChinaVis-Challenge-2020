/**
 * Economic graph
 * 
 * Author: Weiqi Feng
 * Email:  fengweiqi@sjtu.edu.cn
 * Date:   May 25, 2020  
 * Copyright 2019 Vic
 */
(function () {
    "use strict";
    window.addEventListener("load", initialize);
    /* Add a function that will be called when window is loaded */
    function initialize() {
        console.log("Vic hello world!");
        main();
    }
    function main() {
        d3.csv("static/data/aapl.csv").then(function (d) {
            let data = [];
            for (let i = 0; i < d.length / 2; i++) {
                data.push({date: d[i].date, value: d[i].close});
            }
            draw(data);
        });
    }
    function draw(data) {
        let height = 150;
        let width = height;
        let margin = ({top: 5, right: 5, bottom: 5, left: 5})
        let yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y));
        let xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
        let y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top]);
        let x = d3.scaleUtc()
            .domain(d3.extent(data, d => d.date))
            .range([margin.left, width - margin.right]);
        let line = d3.line()
            .defined(d => !isNaN(d.value))
            .x(d => x(d.date))
            .y(d => y(d.value));
        
        let svg = d3.select("#chart2")
            .append("svg");
      
        svg.append("g")
            .call(xAxis);
      
        svg.append("g")
            .call(yAxis);
      
        // svg.append("path")
        //     .datum(data)
        //     .attr("fill", "none")
        //     .attr("stroke", "steelblue")
        //     .attr("stroke-width", 1.5)
        //     .attr("stroke-linejoin", "round")
        //     .attr("stroke-linecap", "round")
        //     .attr("d", line);
    }
})()