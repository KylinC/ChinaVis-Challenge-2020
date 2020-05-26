/**
 * China heatmap.
 * Date: 2020-5-20 
 */

"use strict";
/* 变量申请 */
var colorGradient=[0,1,10,50,100,200,500,1000,2000];
var colorGradient2=[0,1,10,20,50,100,200,500,1000];
var colorGradient3=[0,1,5,10,20,50,100,200,500];
var currentColorGradient=[0,1,5,10,20,50,100,200,500];
var colorLab=d3.interpolateLab("rgb(255,255,255)","#ff1a1a");
var colorLab2=d3.interpolateLab("rgb(255,255,255)","#47d147");
var colorLab3=d3.interpolateLab("rgb(255,255,255)","#ff9900");
var circleColors=["#ffcc00","#33ccff","#ff3300"];

var width=$("#china_heatmap_div").width();
var height=$("#china_heatmap_div").height();
var mapCenterPos={x:width/2,y:height/2};

var chinaProjection=d3.geoMercator().center([110,36]).translate([mapCenterPos.x,mapCenterPos.y]).scale(800); // 调整地图中心位置
var chinaPath=d3.geoPath().projection(chinaProjection);
var nanshaProjection=d3.geoMercator().center([106,23]).scale(400); // 调整地图中心位置
var nanshaPath=d3.geoPath().projection(nanshaProjection);

var chinaSvg=d3.select("#china_heatmap_div")
        .append("svg")
        .attr("id","china_heatmap_svg")
        .attr("width",width)
        .attr("height",height);
var nanshaSvg=d3.select("#china_heatmap_div")
        .append("svg")
        .attr("id","nansha_heatmap_svg")
        .attr("width",120)
        .attr("height",150);
var dateArr=getEachDay('2020/1/10','2020/5/19'); // 2020-1-10至2020-5-19
var currentDateStr="2-1"; //全局日期
var caseType=1; // 全局确诊-治愈-死亡类型
var globalMapData={};
var currentGlobalMapData={};
var cityCaseArr={};// 全局保存当前省份的城市案例
var provincePageFlag=0;


/** 部分数据初始化 */
$("#confirmed_button").css({"background-color":"rgb(189, 222, 235)","color":"rgb(10, 170, 233)"});
createDateSeletor();

/* 数据异步加载: 异步任务放入队列，加载完成之后在绘制热力图 */
d3.queue()
    .defer(d3.json,"static/data/chinaVis-map/china.json?t="+new Date().getTime())
    .defer(d3.json, "static/data/chinaVis-map/island.json?t="+new Date().getTime())
    .defer(d3.json, "static/data/chinaVis-map/nansha.json?t="+new Date().getTime())
    .await(function(error,mainlandJson,islandJson,nanshaJson,caseCsv) {
        if (error) return console.warn(error);
        displayMap(mainlandJson,1);
        displayMap(islandJson,2);
        displayMap(nanshaJson,3);
        mapLabel(1);
        loadCurrentDateCase(1); // 初始化
    });
/* 地图绘制(type:1-mainland,2-island,3-nansha) */
function displayMap(json,type){
    if(type===1){
        chinaSvg.selectAll(".chinaPath")
            .data(json.features)
            .enter()
            .append("path")
            .attr("class","china_map heatmap")
            .attr("d",chinaPath)
            .attr("stroke","black")
            .attr("stroke-width",0.5);
        chinaSvg.selectAll(".chinaPathCircle") //新增圆: 显示新增病例
            .data(json.features)
            .enter()
            .append("circle")
            .attr("class","china_map_circle")
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
                    return chinaProjection(d.properties.cp)[1]+50;
                }
                else if((/澳门/).test(d.properties.name)||(/香港/).test(d.properties.name)){
                    return chinaProjection(d.properties.cp)[1]+10;
                }
                return chinaProjection(d.properties.cp)[1];
            })
            .attr("opacity",0.8);
        chinaSvg.selectAll(".chinaPathText")
            .data(json.features)
            .enter()
            .append("text")
            .attr("class","china_map_text")
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
                    return chinaProjection(d.properties.cp)[1]+50;
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
        nanshaSvg.selectAll(".islandPath")
            .data(json.features)
            .enter()
            .append("path")
            .attr("class","island_map heatmap")
            .attr("d",nanshaPath)
            .attr("stroke","black")
            .attr("stroke-width",0.5)
            .attr("transform",`translate(-${nanshaProjection([106,23])[0]},-${nanshaProjection([106,23])[1]})`);
    }
    else{
        nanshaSvg.selectAll(".nanshaPath")
            .data(json.features)
            .enter()
            .append("path")
            .attr("class","nansha_map heatmap")
            .attr("d",nanshaPath)
            .attr("stroke","black")
            .attr("stroke-width",0.5)
            .attr("transform",`translate(-${nanshaProjection([106,23])[0]},-${nanshaProjection([106,23])[1]})`);
    }
    
}
/* 设置地图颜色填充 */
function fillMapColor(json){
    d3.selectAll(".heatmap").attr("fill",function(d,i){
        let currentProvinceName=getProvinceAbbr(d.properties.name);
        let provinceNameArr=Object.keys(json);
        if(provinceNameArr.indexOf(currentProvinceName)===-1){
            return "white";
        }
        // 默认确诊
        let confirmedCount=json[currentProvinceName]['累计确诊'];
        let curedCount=json[currentProvinceName]['累计治愈'];
        let deadCount=json[currentProvinceName]['累计死亡'];
        if(caseType===1){
            globalMapData[d.properties.name]="累计确诊: "+confirmedCount;
            return colorLab(myScale(confirmedCount,colorGradient));
        }
        else if(caseType===2){
            globalMapData[d.properties.name]="累计治愈: "+curedCount;
            return colorLab2(myScale(curedCount,colorGradient2));
        }
        else{
            globalMapData[d.properties.name]="累计死亡: "+deadCount;
            return colorLab3(myScale(deadCount,colorGradient3));
        }
    })
} 

/** 显示新增源泉 */
function showCaseCircle(json){
    d3.selectAll(".china_map_circle").attr("r",function(d,i){
        let currentProvinceName=getProvinceAbbr(d.properties.name);
        let provinceNameArr=Object.keys(json);
        if(provinceNameArr.indexOf(currentProvinceName)===-1){
            return 0;
        }
        // 默认确诊
        let currentConfirmedCount=json[currentProvinceName]['新增确诊'];
        let currentCuredCount=json[currentProvinceName]['新增治愈'];
        let currentDeadCount=json[currentProvinceName]['新增死亡'];
        if(caseType===1){
            currentGlobalMapData[d.properties.name]="新增确诊: "+currentConfirmedCount;
            return 20*myScale(currentConfirmedCount,currentColorGradient);
        }
        else if(caseType===2){
            currentGlobalMapData[d.properties.name]="新增治愈: "+currentCuredCount;
            return 20*myScale(currentCuredCount,currentColorGradient);
        }
        else{
            currentGlobalMapData[d.properties.name]="新增死亡: "+currentDeadCount;
            return 20*myScale(currentDeadCount,currentColorGradient);
        }
    }).attr("fill",circleColors[caseType-1]);
} 
function fillProvinceColor(){
    d3.selectAll(".province_map").attr("fill",function(d,i){
        if(caseType===1){
            return colorLab(myScale(cityCaseArr[d.properties.name],colorGradient));
        }else if(caseType===2){
            return colorLab2(myScale(cityCaseArr[d.properties.name],colorGradient2));
        }else{
            return colorLab3(myScale(cityCaseArr[d.properties.name],colorGradient3));
        }
    })
    d3.selectAll(".province_map_circle").attr("fill",circleColors[caseType-1]);
}
/* 点击后显示当天热力图 */
function loadCurrentDateCase(){
    console.log("invoke loadCurrentDateCase()!"+new Date().getTime());
    d3.json("static/data/chinaVis-map/case/province_case_"+currentDateStr+".json?t="+new Date().getTime(),function(error,json){
        fillMapColor(json);
        showCaseCircle(json);
        if(provincePageFlag===1){
            $(".province_map").fadeOut("slow");
            $(".province_map_text").fadeOut("slow");
            $(".province_map_circle").fadeOut("slow");
            $(".china_map").fadeIn("slow");
            $(".china_map_text").fadeIn("slow");
            $(".china_map_circle").fadeIn("slow");
        }
    })
}

/** 绘制标签 */
function mapLabel(){
    chinaSvg.selectAll(".mapRectLabel")
        .data(colorGradient)
        .enter()
        .append("rect")
        .attr("class","map_rect_label")
        .attr("x",150)
        .attr("y",function(d,i){
            return (height-150)-20*i;
        })
        .attr("ry",1)
        .attr("height",20)
        .attr("width",60)
        .attr("fill",function(d){
            if(caseType===1){
                return colorLab(myScale(d,colorGradient));
            }
            else if(caseType===2){
                return colorLab2(myScale(d,colorGradient2));
            }
            else{
                return colorLab3(myScale(d,colorGradient3));
            }
        })
        .attr("stroke","black")
        .attr("stroke-width",0.5);
    let tempColorGradient;
    if(caseType===1){
        tempColorGradient=colorGradient
    }else if(caseType===2){
        tempColorGradient=colorGradient2;
    }else{
        tempColorGradient=colorGradient3;
    }
    chinaSvg.selectAll(".mapRectText")
        .data(tempColorGradient)
        .enter()
        .append("text")
        .attr("class","map_rect_text")
        .attr("x",180)
        .attr("y",function(d,i){
            return (height-136)-20*i;
        })
        .attr("text-anchor","middle")
        .attr("fill","black")
        .attr("font-size",10)
        .text(function(d,i){
            if(i===0) return d;
            else if(i>=1&&i<8){
                return tempColorGradient[i]+'-'+tempColorGradient[i+1];
            }
            else{
                return '>'+d;
            }
        });
}
/** 创建日期滑条 */
function createDateSeletor(){
    // 暂时创建100个div
    for(let i=0;i<dateArr.length;i++){
        let newDiv=$("<div class='sub_date_rect_div' id='date_"+dateArr[i]+"'></div>");
        newDiv.appendTo($("#date_rect_div"));
    }
    showDefaultDateTooltip("#date_2020-"+currentDateStr);
    $(".sub_date_rect_div").mouseover(function(e){
        let xPosition=$(this).offset().left;
        let yPosition=$(this).offset().top;
        d3.select("#date_tooltip")
            .style("left",(xPosition+28)+"px")
            .style("top",(yPosition-4)+"px");
        d3.select(".date_tooltiptext")
            .text((this.id).split('_')[1]);
        d3.select("#date_tooltip").classed("date_tooltip_hidden",false);
    })
    .mouseout(function(){
        d3.select("#date_tooltip").classed("date_tooltip_hidden",true);
    })
    .click(function(){
        let xPosition=$(this).offset().left;
        let yPosition=$(this).offset().top;
        d3.select("#default_tooltip")
            .style("left",(xPosition+28)+"px")
            .style("top",(yPosition-4)+"px");
        d3.select(".default_tooltiptext")
            .text(this.id.split('_')[1]);
    });
    $("#date_2020-"+currentDateStr).css("background-color","rgb(10, 170, 233)"); 
}
function showDefaultDateTooltip(selector){
    let xPosition=$(selector).offset().left;
    let yPosition=$(selector).offset().top;
    d3.select("#default_tooltip")
        .style("left",(xPosition+28)+"px")
        .style("top",(yPosition-4)+"px");
    d3.select(".default_tooltiptext")
        .text(selector.split('_')[1]);
    d3.select("#default_tooltip").classed("default_tooltip_hidden",false);
}
