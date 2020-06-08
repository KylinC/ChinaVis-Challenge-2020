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
    var pieColors=["#ff4d4d","#ffff66","#ff9933"];
    var chinaScale=0.9*width;

    var chinaProjection=d3.geoMercator().center([105,30]).translate([mapCenterPos.x,mapCenterPos.y]).scale(chinaScale); // 调整地图中心位置
    var chinaPath=d3.geoPath().projection(chinaProjection);
    var nanshaProjection=d3.geoMercator().center([106,21]).scale(0.4*chinaScale); // 调整地图中心位置
    var nanshaPath=d3.geoPath().projection(nanshaProjection);

    var RFCONSENSUS; // 存储舆论热度
    var capitalSet={};
    var date='0'+(($("#mainwindow-data").text()).replace(/月/,'-')).replace(/日/,'');
    var brushFlag=1;
    var delay=1000; //动画延迟
    var provinceArr=[];
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
        // 地图缩放
    $(".chinaMap-box").append("<div id=\"my_tooltip\" class=\"my_tooltip_hidden\">\n" +
        "<span class=\"tooltiptext\"></span></div>");
     // $(".chinaMap-box").append("<button id='brush_button'></button>");
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
        RFCONSENSUS=values[3];
        displayConsensusMap(values[0],1,consensusChart);
        displayConsensusMap(values[1],2,nanhaiChart);
        displayConsensusMap(values[2],3,nanhaiChart);
        addBrush();

        getCapitalSet();
        // 默认全国城市的top32数组
        function citiesTop32(){
            let selectedProvinces=[];
            for(let item in capitalSet){
                selectedProvinces.push(item);
                provinceArr.push(item);
            }
            // 队选中的省份进行排序城市
            var currentDateSentimentArr=RFCONSENSUS[date];
            var citiesRectArr=[];
            selectedProvinces.forEach(function (item) {
                if(currentDateSentimentArr[item]!==undefined){
                    var currentProvinceKeys=Object.keys(currentDateSentimentArr[item]);
                    for(let i=4;i<currentProvinceKeys.length;i++){
                        citiesRectArr.push({city:currentProvinceKeys[i],value:currentDateSentimentArr[item][currentProvinceKeys[i]]['sum'],
                        positive:currentDateSentimentArr[item][currentProvinceKeys[i]]['positive'],
                        negative:currentDateSentimentArr[item][currentProvinceKeys[i]]['negative'],
                        neutral:currentDateSentimentArr[item][currentProvinceKeys[i]]['neutral']});
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
            return citiesRect_top32;
        }
        drawRect(citiesTop32());
        pieHeatLabel();
        // 添加事件监听
        addListenerEvent();
        // 监听日期内容是否变化
        $("#mainwindow-data").bind('DOMNodeInserted', function(e) {
            date='0'+(($(this).text()).replace(/月/,'-')).replace(/日/,'');
            drawRect(citiesTop32());
            drawPies();
        });
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
                });
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
                .attr("r",0);
            drawPies();
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
     * 绘制热度饼图
     * */
    function drawPies() {
        $(".gChart").empty();
        d3.selectAll(".consensus_map_circle").call(function(sel){
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
                origin={x:capitalX,y:capitalY}; // pie chart位置

                let provinceName=getProvinceAbbr(d.properties.name);
                let currentProvinceArr=Object.keys(RFCONSENSUS[date]);
                let existFlag=0;
                for (let i in currentProvinceArr){
                    let pattern=eval(`/${provinceName}/`); //利用正则匹配解决简写不一致问题
                    if(pattern.test(currentProvinceArr[i])){
                        provinceName=currentProvinceArr[i];
                        existFlag=1;
                    }
                }
                if(existFlag===0){
                    return 0;
                }
                let pieDataArr=[]; // 图形数据
                pieDataArr.push(RFCONSENSUS[date][provinceName]['positive']);
                pieDataArr.push(RFCONSENSUS[date][provinceName]['negative']);
                pieDataArr.push(RFCONSENSUS[date][provinceName]['neutral']);
                let radius=Math.sqrt(parseInt(RFCONSENSUS[date][provinceName]['sum']/3));
                // 会绘制line chart图形
                let gChart=consensusChart.append("g").attr("class","gChart");
                drawPieChart(pieDataArr,origin,gChart,pieColors,radius);
            });

        });
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
            .on("mouseover",function (d) {
                d3.select(this).attr("opacity",1.0).attr("cursor","pointer");
            })
            .on("mouseout",function (d) {
                d3.select(this).attr("opacity",0.8).attr("cursor","default");
            })
            .transition()
            .ease(d3.easeBounceOut)
            .duration(delay)
            .attr("x",function (d,i) {
                return 16*i+10;
            })
            .attr("y",function (d) {
                if (d.value>500){
                    return 0.3*height-Math.sqrt(30*500)-26;
                }
                return 0.3*height-Math.sqrt(30*d.value)-26;
            })
            .attr("height",function (d) {
                if (d.value>500){
                    return Math.sqrt(30*500);
                }
                return Math.sqrt(30*d.value);
            })
            .attr("width",function () {
                return 12;
            })
            .attr("fill","#33cccc")
            .attr("opacity",0.8)
            .attr("stroke","white")
            .attr("stroke-width",1);
        rectChart.selectAll("heatRectText")
            .data(rectArr)
            .enter()
            .append("text")
            .attr("class",".heat_rect_text")
            .transition()
            .ease(d3.easeLinear)
            .duration(delay)
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
        rectChart.append("text")
            .attr("x",10)
            .attr("y",10)
            .attr("font-size",10)
            .attr("fill","white")
            .attr("text-anchor","start")
            .text("舆论热度Top32")
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
                                city:currentProvinceKeys[i],
                                value:currentDateSentimentArr[item][currentProvinceKeys[i]]['sum'],
                                positive:currentDateSentimentArr[item][currentProvinceKeys[i]]['positive'],
                                negative:currentDateSentimentArr[item][currentProvinceKeys[i]]['negative'],
                                neutral:currentDateSentimentArr[item][currentProvinceKeys[i]]['neutral']
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
                addListenerEvent();
            }

        });

    }

    function addListenerEvent() {
        d3.selectAll(".consensus_heatmap")
            .on("mouseover",function (d) {
                d3.select(this).style("cursor","pointer")
                    .transition()
                    .duration(delay/2)
                    .attr("opacity",1.0);
                let xPosition=d3.event.clientX-$(".chinaMap-box").offset().left;
                let yPosition=d3.event.clientY-$(".chinaMap-box").offset().top;
                d3.select("#my_tooltip")
                    .style("left",(xPosition+6)+"px")
                    .style("top",(yPosition+6)+"px")
                d3.select(".tooltiptext")
                    .html(function(){
                        let currentProvinceName=getProvinceAbbr(d.properties.name);
                        let existFlag=0;
                        for (let i in provinceArr){
                            let pattern=eval(`/${currentProvinceName}/`); //利用正则匹配解决简写不一致问题
                            if(pattern.test(provinceArr[i])){
                                currentProvinceName=provinceArr[i];
                                existFlag=1;
                            }
                        }
                        if(existFlag===0){
                            return getProvinceAbbr(d.properties.name)+" 0";
                        }
                        return getProvinceAbbr(d.properties.name)+" 舆论热度 "+RFCONSENSUS[date][currentProvinceName]['sum']
                            +"<br>正面 "+RFCONSENSUS[date][currentProvinceName]['positive']+
                            " 负面 "+RFCONSENSUS[date][currentProvinceName]['negative']+" 中立 "+RFCONSENSUS[date][currentProvinceName]['neutral'];
                    });
                d3.select("#my_tooltip").classed("my_tooltip_hidden",false);
            })
            .on("mouseout",function (d) {
                d3.select(this).style("cursor","default")
                    .transition()
                    .duration(delay/2)
                    .attr("opacity",0.8);
                d3.select("#my_tooltip").classed("my_tooltip_hidden",true);
            });
        d3.selectAll(".heat_rect")
            .on("mouseover",function (d,i) {
                d3.select(this).style("cursor","pointer")
                    .attr("opacity",1.0);
                let xPosition=d3.event.clientX-$(".chinaMap-box").offset().left;
                let yPosition=d3.event.clientY-$(".chinaMap-box").offset().top;
                d3.select("#my_tooltip")
                    .style("left",(xPosition+10)+"px")
                    .style("top",(yPosition-30)+"px")
                d3.select(".tooltiptext")
                    .html(function(){
                        return d.city+" 舆论热度 "+d.value
                            +"<br>正面 "+d.positive+
                            " 负面 "+d.negative+" 中立 "+d.neutral;
                    });
                d3.select("#my_tooltip").classed("my_tooltip_hidden",false);
            })
            .on("mouseout",function () {
                d3.select(this).style("cursor","default")
                    .attr("opacity",0.8);
                d3.select("#my_tooltip").classed("my_tooltip_hidden",true);
            })
    }

    function pieHeatLabel() {
        consensusChart.selectAll("heatRectLabel")
            .data(pieColors)
            .enter()
            .append("rect")
            .attr("class","heat_rect_label")
            .attr("x",width-60)
            .attr("y",function (d,i) {
                return 0.6*height-10*i;
            })
            .attr("height",8)
            .attr("width",8)
            .attr("fill",function (d,i) {
                console.log(d);
                return d;
            })
            .attr("opacity",0.8)
            .attr("stroke","white")
            .attr("stroke-width",1);
        consensusChart.selectAll("heatTextLabel")
            .data(pieColors)
            .enter()
            .append("text")
            .attr("class","heat_text_label")
            .attr("x",width-50)
            .attr("y",function (d,i) {
                return 0.6*height-10*i+6;
            })
            .attr("font-size",8)
            .attr("fill","white")
            .attr("text-anchor","start")
            .text(function (d,i) {
                if(i===0){
                    return '正面';
                } else if(i===1){
                    return '负面';
                } else{
                    return '中立';
                }
            })
    }
    var zoom=d3.zoom().on("zoom",zooming);
    consensusChart.call(zoom)
            .call(zoom.transform,d3.zoomIdentity.translate(mapCenterPos.x,mapCenterPos.y).scale(0.25));
    function zooming(){
        var offset=[d3.event.transform.x,d3.event.transform.y];
        var newScale=d3.event.transform.k*2000;
        chinaProjection.translate([offset[0],offset[1]]).scale(newScale);
        d3.selectAll(".china_consensus_map").attr("d",chinaPath);
        d3.selectAll(".consensus_map_text")
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
                });
        drawPies();

    }
});
