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
                // .call(text => text.filter((d, i, data) => i === data.length - 1)
                //   .append("tspan")
                //     .attr("font-weight", "bold")
                //     .text(d => ` ${d.key}`))
              .clone(true).lower()
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("stroke-width", 6);
        return
        // let height = 200, width = 380;
        // let margin = ({top: 5, right: 10, bottom: 30, left: 40});
        // let label = ["居民消费价格指数", "商品零售价格指数","工业生产者购进价格指数","工业生产者出厂价格指数"];
        // let months = ["2020年1月", "2020年2月", "2020年3月", "2020年4月"];
        // let monthoffset = [4, 3, 2, 1];
        // let city =  "北京";
        // let extractData = [];
        // for (let i = 0; i < data.length; i++) {
            // if (data[i]["城市"] == city) {
                // extractData.push(data[i]);
            // }
        // }
        // let finalData = [];
        // for (let i = 0; i < months.length; i++) {
            // let singleData = {};
            // singleData["month"] = months[i];
            //Get column offset
            // for (let j = 0; j < extractData.length; j++) {
                // singleData[extractData[j]["指标"]] = parseFloat(extractData[j][months[i]]);
            // }
            // finalData.push(singleData);
        // }
        // let groupKey = "month";
        // console.log(groupKey);

        // let yAxis = g => g
        // .attr("transform", `translate(${margin.left},0)`)
        // .attr("color", "#cdddf7")
        // .call(d3.axisLeft(y).ticks(null, "s"))
        // .call(g => g.select(".domain").remove())
        // .call(g => g.select(".tick:last-of-type text").clone()
        // .attr("x", 3)
        // .attr("text-anchor", "start")
        // .attr("font-weight", "bold")
        // .text("上年同月=100"));

        // let xAxis = g => g
        // .attr("transform", `translate(0,${height - margin.bottom})`)
        // .attr("color", "#cdddf7")
        // .call(d3.axisBottom(x0).tickSizeOuter(0))
        // .call(g => g.select(".domain").remove());

        // let color = d3.scaleOrdinal().range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
        // let start = 96;
        // let y = d3.scaleLinear()
        // .domain([start, d3.max(finalData, d => d3.max(label, key => d[key]))]).nice()
        // .rangeRound([height - margin.bottom, margin.top]);

        // let x0 = d3.scaleBand()
            // .domain(finalData.map(d => d[groupKey]))
            // .rangeRound([margin.left, width - margin.right])
            // .paddingInner(0.1);
        // let x1 = d3.scaleBand()
            // .domain(label)
            // .rangeRound([0, x0.bandwidth()])
            // .padding(0.05)
        // let svg = d3.select("#chart4")
                //   .append("svg")
                //   .attr("width", width)
                //   .attr("height", height);
        // 

        // let legend = svg => {
                    // const g = svg
                        // .attr("transform", `translate(${width},0)`)
                        // .attr("text-anchor", "end")
                        // .attr("font-family", "sans-serif")
                        // .attr("font-size", 10)
                    //   .selectAll("g")
                    //   .data(color.domain().slice().reverse())
                    //   .join("g")
                        // .attr("transform", (d, i) => `translate(0,${i * 20})`);
                //   
                    // g.append("rect")
                        // .attr("x", -19)
                        // .attr("width", 19)
                        // .attr("height", 19)
                        // .attr("fill", color);
                //   
                    // g.append("text")
                        // .attr("fill", "#cdddf7")
                        // .attr("x", -24)
                        // .attr("y", 9.5)
                        // .attr("dy", "0.35em")
                        // .text(d => d);
                //   };

        // svg.append("g")
                //   .selectAll("g")
                //   .data(finalData)
                //   .join("g")
                    // .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
                //   .selectAll("rect")
                //   .data(d => label.map(key => ({key, value: d[key]})))
                //   .join("rect")
                    // .attr("x", d => x1(d.key))
                    // .attr("y", d => y(d.value))
                    // .attr("width", x1.bandwidth())
                    // .attr("height", d => y(start) - y(d.value))
                    // .attr("fill", d => color(d.key));
        // svg.append("g")
            // 
            // .call(xAxis);
        // svg.append("g")
            // .call(yAxis);
        // svg.append("g")
            // .call(legend);
    }
})()