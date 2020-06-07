/**
 * China heatmap based on public voice.
 * Date: 5-31
 * Author: Snowfly
 * Copyright ChinaVis 2020
 * */
"use strict";

$(function () {
    // 变量声明
    var height=$(".chinaMap-box").height();
    var width=$(".chinaMap-box").width();
    var mapCenterPos={x:width/2,y:height/2};
    var colorLab=d3.interpolateLab("rgb(255,255,255)","#ff9900");

    var chinaProjection=d3.geoMercator().center([105,32]).translate([mapCenterPos.x,mapCenterPos.y]).scale(500); // 调整地图中心位置
    var chinaPath=d3.geoPath().projection(chinaProjection);
    var nanshaProjection=d3.geoMercator().center([106,23]).scale(200); // 调整地图中心位置
    var nanshaPath=d3.geoPath().projection(nanshaProjection);

    var RFCONSENSUS; // 存储舆论热度
    var capitalSet={};
    var date='05-12';
    var brushFlag=1;
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

    var rectChart=d3.select(".chinaMap-box")
        .append("svg")
        .attr("id","consensus_rect_svg")
        .attr("width",width)
        .attr("height",0.3*height);

    // 异步加载地图进行绘制
    var files = ["static/data/chinaVis-map/china.json?t="+new Date().getTime(),
                "static/data/chinaVis-map/island.json?t="+new Date().getTime(),
                "static/data/chinaVis-map/nansha.json?t="+new Date().getTime(),
                "static/data/RFJSON/RealtimeFlow_cities_All.json?t="+new Date().getTime()];
    var promises=[];
    files.forEach(function (url) {
        promises.push(d3.json(url));
    });
    Promise.all(promises).then(function (values) {
        displayConsensusMap(values[0],1,consensusChart);
        displayConsensusMap(values[1],2,nanhaiChart);
        displayConsensusMap(values[2],3,nanhaiChart);
        RFCONSENSUS=values[3];
        fillMap(date);
        addBrush();

        getCapitalSet();
        // 默认全国城市的top32数组
        // 临时数据
        let selectedProvinces=[];
        for(let item in capitalSet){
            selectedProvinces.push(item);
        }
        // 队选中的省份进行排序城市
        var currentDateSentimentArr=RFCONSENSUS[date];
        var citiesRectArr=[];
        selectedProvinces.forEach(function (item) {
            if(currentDateSentimentArr[item]!==undefined){
                var currentProvinceKeys=Object.keys(currentDateSentimentArr[item]);
                for(let i=4;i<currentProvinceKeys.length;i++){
                    citiesRectArr.push({city:currentProvinceKeys[i],value:currentDateSentimentArr[item][currentProvinceKeys[i]]['sum']});
                }
            }
        });
        citiesRectArr.sort(function (a,b) {
            return b.value-a.value;
        });
        // top32
        var citiesRect_top32=[];
        citiesRectArr.forEach(function (item,i) {
            if(i<32){
                citiesRect_top32.push(item);
            }
        });
        drawRect(citiesRect_top32);
        // 添加事件监听
        addListenerEvent();
    });

    function displayConsensusMap(json,type,chart) {
        if(type===1){
            chart.selectAll(".consensusPath")
                .data(json.features)
                .enter()
                .append("path")
                .attr("class","china_consensus_map consensus_heatmap")
                .attr("d",chinaPath)
                .attr("stroke","white")
                .attr("stroke-width",0.5)
                .attr("fill","#33cccc")
                .attr("opacity",0.8);
            chart.selectAll(".consensusPathCircle") //显示舆论热度
                .data(json.features)
                .enter()
                .append("circle")
                .attr("class","consensus_map_circle consensus_heatmap")
                .attr("cx",function(d,i){
                    if((/黑龙/).test(d.properties.name)||(/内蒙/).test(d.properties.name)||(/澳门/).test(d.properties.name)){
                        return chinaProjection(d.properties.cp)[0]+20;
                    }
                    else if((/香港/).test(d.properties.name)){
                        return chinaProjection(d.properties.cp)[0]+10;
                    }
                    else if((/甘肃/).test(d.properties.name)){
                        return chinaProjection(d.properties.cp)[0]+20;
                    }
                    return chinaProjection(d.properties.cp)[0];
                })
                .attr("cy",function(d,i){
                    if((/黑龙/).test(d.properties.name)||(/内蒙/).test(d.properties.name)){
                        return chinaProjection(d.properties.cp)[1]+30;
                    }
                    else if((/澳门/).test(d.properties.name)||(/香港/).test(d.properties.name)){
                        return chinaProjection(d.properties.cp)[1]+10;
                    }
                    return chinaProjection(d.properties.cp)[1];
                })
                .attr("fill","white")
                .attr("opacity",0.8)
                .attr("r",3);
            chart.selectAll(".consensusPathText")
                .data(json.features)
                .enter()
                .append("text")
                .attr("class","consensus_map_text")
                .attr("text-anchor","middle")
                .attr("font-size",10)
                .attr("x",function(d,i){
                    if((/黑龙/).test(d.properties.name)||(/内蒙/).test(d.properties.name)||(/澳门/).test(d.properties.name)){
                        return chinaProjection(d.properties.cp)[0]+20;
                    }
                    else if((/香港/).test(d.properties.name)){
                        return chinaProjection(d.properties.cp)[0]+10;
                    }
                    else if((/甘肃/).test(d.properties.name)){
                        return chinaProjection(d.properties.cp)[0]+20;
                    }
                    return chinaProjection(d.properties.cp)[0];
                })
                .attr("y",function(d,i){
                    if((/黑龙/).test(d.properties.name)||(/内蒙/).test(d.properties.name)){
                        return chinaProjection(d.properties.cp)[1]+30;
                    }
                    else if((/澳门/).test(d.properties.name)||(/香港/).test(d.properties.name)){
                        return chinaProjection(d.properties.cp)[1]+10;
                    }
                    return chinaProjection(d.properties.cp)[1];
                })
                .text(function(d,i){
                    let currentProvinceName;
                    if((/黑龙/).test(d.properties.name)||(/内蒙/).test(d.properties.name)){
                        currentProvinceName=d.properties.name.slice(0,3);
                    }else{
                        currentProvinceName=d.properties.name.slice(0,2);
                    }
                    return currentProvinceName;
                })
        }
        else if(type===2){
            chart.selectAll(".consensuslandPath")
                .data(json.features)
                .enter()
                .append("path")
                .attr("class","consensus_island_map consensus_heatmap")
                .attr("d",nanshaPath)
                .attr("stroke","white")
                .attr("stroke-width",0.5)
                .attr("fill","#33cccc")
                .attr("opacity",0.6)
                .attr("transform",`translate(-${nanshaProjection([106,23])[0]},-${nanshaProjection([106,23])[1]})`);
        }
        else{
            chart.selectAll(".consensusNanshaPath")
                .data(json.features)
                .enter()
                .append("path")
                .attr("class","consensus_nansha_map consensus_heatmap")
                .attr("d",nanshaPath)
                .attr("stroke","white")
                .attr("stroke-width",0.5)
                .attr("fill","#33cccc")
                .attr("opacity",0.6)
                .attr("transform",`translate(-${nanshaProjection([106,23])[0]},-${nanshaProjection([106,23])[1]})`);
        }
    }

    /**
     * 绘制刷选后热力矩形
     * rectArr: {name:value}
     * */
    function drawRect(rectArr) {
        $("#consensus_rect_svg").empty();
        rectChart.selectAll("heatRect")
            .data(rectArr)
            .enter()
            .append("rect")
            .attr("class","heat_rect")
            .attr("x",function (d,i) {
                return 16*i+10;
            })
            .attr("y",function (d) {
                return 0.3*height-2*d.value-26;
            })
            .attr("height",function (d) {
                return 2*d.value;
            })
            .attr("width",function () {
                return 12;
            })
            .attr("fill","#33cccc")
            .attr("opacity",0.8)
            .attr("stroke","white")
            .attr("stroke-width",1)
            .on("mouseover",function (d) {
                d3.select(this).attr("opacity",1.0).attr("cursor","pointer");
            })
            .on("mouseout",function (d) {
                d3.select(this).attr("opacity",0.8).attr("cursor","default");
            });
        rectChart.selectAll("heatRectText")
            .data(rectArr)
            .enter()
            .append("text")
            .attr("class",".heat_rect_text")
            .attr("x",function (d,i) {
                return 16*i+10;
            })
            .attr("y",function (d) {
                return 0.3*height-20;
            })
            .attr("font-size",8)
            .attr("fill","white")
            .attr("text-anchor","start")
            .attr("transform",function (d,i) {
                return "rotate(60,"+(16*i+10)+","+(0.3*height-18)+")";
            })
            .text(function (d,i) {
                return d.city;
            });
    }
    /**
     * 填充地图的颜色热力
     */
    function  fillMap(date) {
        // 获取当前日期的所有省份热度
        var currentDateSentimentArr=RFCONSENSUS[date];
        var heatArr=[];
        for(let ky in currentDateSentimentArr){
            heatArr.push(parseInt(currentDateSentimentArr[ky]['sum']));
        }
        // var heatScale=d3.scaleLinear()
        //     .domain([d3.min(heatArr),d3.max(heatArr)])
        //     .range([0.0,1.0]);
        d3.selectAll(".consensus_map_circle")
            .attr("r",function (d) {
                let provinceName=d.properties.name.slice(0,2);
                let provinceArr=Object.keys(currentDateSentimentArr);
                let existFlag=0;
                for (let i in provinceArr){
                    let pattern=eval(`/${provinceName}/`); //利用正则匹配解决简写不一致问题
                    if(pattern.test(provinceArr[i])){
                        provinceName=provinceArr[i];
                        existFlag=1;
                    }
                }
                if(existFlag===0){
                    return 0;
                }
                return Math.sqrt(parseInt(currentDateSentimentArr[provinceName]['sum']));
                // return colorLab(heatScale(parseInt(currentDateSentimentArr[provinceName]['sum'])));
            });
    }
    function getCapitalSet() {
        // 获取所有省会的点的位置
        d3.selectAll(".consensus_map_circle").call(function (sel) {
            sel.each(function (d,i) {
                let capitalX,capitalY;
                if((/黑龙/).test(d.properties.name)||(/内蒙/).test(d.properties.name)||(/澳门/).test(d.properties.name)){
                    capitalX=chinaProjection(d.properties.cp)[0]+20;
                } else if((/香港/).test(d.properties.name)){
                    capitalX=chinaProjection(d.properties.cp)[0]+10;
                } else if((/甘肃/).test(d.properties.name)){
                    capitalX=chinaProjection(d.properties.cp)[0]+20;
                }else{
                    capitalX=chinaProjection(d.properties.cp)[0];
                }

                if((/黑龙/).test(d.properties.name)||(/内蒙/).test(d.properties.name)){
                    capitalY=chinaProjection(d.properties.cp)[1]+30;
                } else if((/澳门/).test(d.properties.name)||(/香港/).test(d.properties.name)){
                    capitalY=chinaProjection(d.properties.cp)[1]+10;
                }else{
                     capitalY=chinaProjection(d.properties.cp)[1];
                }
                capitalSet[d.properties.name]={x:capitalX,y:capitalY}
            });
        });
    }
    function addBrush() {
        // 创建刷选按钮
        $(".chinaMap-box").append("<button id='brush_button'></button>");
        $("#brush_button").mouseover(function () {
            if(brushFlag===1){
                $(this).css("background-image","url(static/images/chinaVis-map/hover_pointer.svg)");
            } else{
                $(this).css("background-image","url(static/images/chinaVis-map/hover_brush.svg)");
            }
        })
        .mouseout(function () {
            if(brushFlag===1){
                $(this).css("background-image","url(static/images/chinaVis-map/pointer.svg)");
            }else{
                $(this).css("background-image","url(static/images/chinaVis-map/brush.svg)");
            }
        })
        .click(function () {
            // 按钮样式设置
            $(this).css("background-image","url(static/images/chinaVis-map/brush.svg)");
            brushFlag=(brushFlag+1)%2;
            if(brushFlag===1){
                $("#brush_g").remove();
                $(this).css("background-image","url(static/images/chinaVis-map/pointer.svg)");
                return;
            }
            var myBrush=d3.brush().extent([[0,0],[width,0.8*height]])
                    .on("end",updateRectChart);
            var myConsensusChart=consensusChart.append("g").attr("id","brush_g");
            myConsensusChart.call(myBrush);
            function updateRectChart() {
                let selectedProvinces=[];
                let extend=d3.event.selection;
                for(let item in capitalSet){
                    if (capitalSet[item].x>extend[0][0]&&capitalSet[item].y>extend[0][1]
                        &&capitalSet[item].x<extend[1][0]&&capitalSet[item].y<extend[1][1]){
                        selectedProvinces.push(item);
                    }
                }
                // 队选中的省份进行排序城市
                var currentDateSentimentArr=RFCONSENSUS[date];
                var citiesRectArr=[];
                selectedProvinces.forEach(function (item) {
                    if(currentDateSentimentArr[item]!==undefined) {
                        var currentProvinceKeys = Object.keys(currentDateSentimentArr[item]);
                        for (let i = 4; i < currentProvinceKeys.length; i++) {
                            citiesRectArr.push({
                                city: currentProvinceKeys[i],
                                value: currentDateSentimentArr[item][currentProvinceKeys[i]]['sum']
                            });
                        }
                    }
                });
                citiesRectArr.sort(function (a,b) {
                    return b.value-a.value;
                });
                // top32
                var citiesRect_top32=[];
                citiesRectArr.forEach(function (item,i) {
                    if(i<32){
                        citiesRect_top32.push(item);
                    }
                });
                drawRect(citiesRect_top32);
            }

        });

    }

    function addListenerEvent() {
        d3.selectAll(".consensus_heatmap")
            .on("mouseover",function (d) {
                d3.select(this).attr("opacity",1.0).attr("cursor","pointer");
            })
            .on("mouseout",function (d) {
                d3.select(this).attr("opacity",0.8).attr("cursor","default");
            });

    }
});
