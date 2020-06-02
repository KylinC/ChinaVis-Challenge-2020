/**
 * China heatmap based on public voice.
 * Date: 5-31
 * */
"use strict";

$(function () {
    // 变量声明
    var height=$(".chinaMap-box").height();
    var width=$(".chinaMap-box").width();
    var mapCenterPos={x:width/2,y:height/2};

    var chinaProjection=d3.geoMercator().center([105,32]).translate([mapCenterPos.x,mapCenterPos.y]).scale(500); // 调整地图中心位置
    var chinaPath=d3.geoPath().projection(chinaProjection);
    var nanshaProjection=d3.geoMercator().center([106,23]).scale(200); // 调整地图中心位置
    var nanshaPath=d3.geoPath().projection(nanshaProjection);
    $(function createConsensusMap() {
        // 创建svg
        var consensusChart=d3.select(".chinaMap-box")
            .append("svg")
            .attr("width",width)
            .attr("height",height);

        var nanhaiChart=d3.select(".chinaMap-box")
            .append("svg")
            .attr("id","consensus_nansha_svg")
            .attr("width",60)
            .attr("height",75);

        // 异步加载地图进行绘制
        var files = ["static/data/chinaVis-map/china.json?t="+new Date().getTime(),
                    "static/data/chinaVis-map/island.json?t="+new Date().getTime(),
                    "static/data/chinaVis-map/nansha.json?t="+new Date().getTime()];
        var promises=[];
        files.forEach(function (url) {
            promises.push(d3.json(url));
        });
        Promise.all(promises).then(function (values) {
            console.log(values);
            displayConsensusMap(values[0],1,consensusChart);
            displayConsensusMap(values[1],2,nanhaiChart);
            displayConsensusMap(values[2],3,nanhaiChart);
        });
    });

    function displayConsensusMap(json,type,chart) {
        if(type===1){
            chart.selectAll(".consensusPath")
                .data(json.features)
                .enter()
                .append("path")
                // .attr("class","china_map heatmap")
                .attr("d",chinaPath)
                .attr("stroke","black")
                .attr("stroke-width",0.5)
                .attr("fill","#33bbff")
            // chart.selectAll(".consensusPathCircle") //新增圆: 显示新增病例
            //     .data(json.features)
            //     .enter()
            //     .append("circle")
            //     .attr("class","consensus_map_circle")
            //     .attr("cx",function(d,i){
            //         if((/黑龙/).test(d.properties.name)||(/内蒙/).test(d.properties.name)||(/澳门/).test(d.properties.name)){
            //             return chinaProjection(d.properties.cp)[0]+20;
            //         }
            //         else if((/香港/).test(d.properties.name)){
            //             return chinaProjection(d.properties.cp)[0]+10;
            //         }
            //         else if((/甘肃/).test(d.properties.name)){
            //             return chinaProjection(d.properties.cp)[0]+20;
            //         }
            //         return chinaProjection(d.properties.cp)[0];
            //     })
            //     .attr("cy",function(d,i){
            //         if((/黑龙/).test(d.properties.name)||(/内蒙/).test(d.properties.name)){
            //             return chinaProjection(d.properties.cp)[1]+50;
            //         }
            //         else if((/澳门/).test(d.properties.name)||(/香港/).test(d.properties.name)){
            //             return chinaProjection(d.properties.cp)[1]+10;
            //         }
            //         return chinaProjection(d.properties.cp)[1];
            //     })
            //     .attr("opacity",0.8);
            // chart.selectAll(".consensusPathText")
            //     .data(json.features)
            //     .enter()
            //     .append("text")
            //     .attr("class","consensus_map_text")
            //     .attr("text-anchor","middle")
            //     .attr("font-size",10)
            //     .attr("x",function(d,i){
            //         if((/黑龙/).test(d.properties.name)||(/内蒙/).test(d.properties.name)||(/澳门/).test(d.properties.name)){
            //             return chinaProjection(d.properties.cp)[0]+20;
            //         }
            //         else if((/香港/).test(d.properties.name)){
            //             return chinaProjection(d.properties.cp)[0]+10;
            //         }
            //         else if((/甘肃/).test(d.properties.name)){
            //             return chinaProjection(d.properties.cp)[0]+20;
            //         }
            //         return chinaProjection(d.properties.cp)[0];
            //     })
            //     .attr("y",function(d,i){
            //         if((/黑龙/).test(d.properties.name)||(/内蒙/).test(d.properties.name)){
            //             return chinaProjection(d.properties.cp)[1]+50;
            //         }
            //         else if((/澳门/).test(d.properties.name)||(/香港/).test(d.properties.name)){
            //             return chinaProjection(d.properties.cp)[1]+10;
            //         }
            //         return chinaProjection(d.properties.cp)[1];
            //     })
            //     .text(function(d,i){
            //         let currentProvinceName;
            //         if((/黑龙/).test(d.properties.name)||(/内蒙/).test(d.properties.name)){
            //             currentProvinceName=d.properties.name.slice(0,3);
            //         }else{
            //             currentProvinceName=d.properties.name.slice(0,2);
            //         }
            //         return currentProvinceName;
            //     })
        }
        else if(type===2){
            chart.selectAll(".consensuslandPath")
                .data(json.features)
                .enter()
                .append("path")
                .attr("class","consensus_island_map heatmap")
                .attr("d",nanshaPath)
                .attr("stroke","black")
                .attr("stroke-width",0.5)
                .attr("fill","#33bbff")
                .attr("transform",`translate(-${nanshaProjection([106,23])[0]},-${nanshaProjection([106,23])[1]})`);
        }
        else{
            chart.selectAll(".consensusNanshaPath")
                .data(json.features)
                .enter()
                .append("path")
                .attr("class","consensus_nansha_map heatmap")
                .attr("d",nanshaPath)
                .attr("stroke","black")
                .attr("stroke-width",0.5)
                .attr("fill","#33bbff")
                .attr("transform",`translate(-${nanshaProjection([106,23])[0]},-${nanshaProjection([106,23])[1]})`);
        }
    }
});
