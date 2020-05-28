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
        d3.csv("static/data/chart3.csv").then(function(data){
            draw(data);
        });
    }
    function draw(data) {
        let height = 200, width = 380;
        let margin = ({top: 5, right: 10, bottom: 30, left: 40});
        let label = ["居民消费价格指数", "商品零售价格指数","工业生产者购进价格指数","工业生产者出厂价格指数"];
        let months = ["2020年1月", "2020年2月", "2020年3月", "2020年4月"];
        let monthoffset = [4, 3, 2, 1];
        let city =  "北京";
        let extractData = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i]["城市"] == city) {
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
        console.log(groupKey);

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
        let start = 96;
        let y = d3.scaleLinear()
        .domain([start, d3.max(finalData, d => d3.max(label, key => d[key]))]).nice()
        .rangeRound([height - margin.bottom, margin.top]);

        let x0 = d3.scaleBand()
            .domain(finalData.map(d => d[groupKey]))
            .rangeRound([margin.left, width - margin.right])
            .paddingInner(0.1);
        let x1 = d3.scaleBand()
            .domain(label)
            .rangeRound([0, x0.bandwidth()])
            .padding(0.05)
        let svg = d3.select("#chart3")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);
        

        let legend = svg => {
                    const g = svg
                        .attr("transform", `translate(${width},0)`)
                        .attr("text-anchor", "end")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", 10)
                      .selectAll("g")
                      .data(color.domain().slice().reverse())
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

        svg.append("g")
                  .selectAll("g")
                  .data(finalData)
                  .join("g")
                    .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
                  .selectAll("rect")
                  .data(d => label.map(key => ({key, value: d[key]})))
                  .join("rect")
                    .attr("x", d => x1(d.key))
                    .attr("y", d => y(d.value))
                    .attr("width", x1.bandwidth())
                    .attr("height", d => y(start) - y(d.value))
                    .attr("fill", d => color(d.key));

        svg.append("g")
            .call(xAxis);
        svg.append("g")
            .call(yAxis);
        svg.append("g")
            .call(legend);
    }
})()