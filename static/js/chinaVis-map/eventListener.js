/**
 * Add event listener for DOM elements. 
 * Date: 2020-5-20
 */

setTimeout(updatePage, 1000); // 等待map加载完成再进行加载
function updatePage(){
    /** 按钮监听: 用于选中确诊,治愈,死亡等信息*/
    $("#confirmed_button").click(function(){
        caseType=1;
        $(".case_button").css({"background-color":"#252525","color":"white"});
        $(this).css({"background-color":"#0e94eb","color":"white"});
        loadCurrentDateCase();
        mapLabel();
        fillProvinceColor();
    });
    $("#cured_button").click(function(){
        caseType=2;
        $(".case_button").css({"background-color":"#252525","color":"white"});
        $(this).css({"background-color":"#0e94eb","color":"white"});
        loadCurrentDateCase();
        mapLabel();
        fillProvinceColor();
    });
    $("#dead_button").click(function(){
        caseType=3;
        $(".case_button").css({"background-color":"#252525","color":"white"});
        $(this).css({"background-color":"#0e94eb","color":"white"});
        loadCurrentDateCase();
        mapLabel();
        fillProvinceColor();
    });

    /** 日期选择监听事件 */
    document.onclick=function(e){
        e=e?e:window.event;
        let clickTarget=e.target.id;
        if((/date_2020-[0-9]+-[0-9]+/).test(clickTarget)){
            currentDateStr=((clickTarget.split("_")[1]).split("-").slice(1)).join("-");
            $(".sub_date_rect_div").css("background-color","white");
            $("#date_2020-"+currentDateStr).css("background-color","rgb(10, 170, 233)");
            loadCurrentDateCase();
        }
    }
    /** 地图省份监听: 点击某省展示相应内部病例信息 */
    d3.selectAll(".china_map")
        .on("mouseover",function(d,i){
            d3.select(this).attr("stroke","rgb(70,130,180)").style("cursor","pointer");
            let xPosition=d3.event.clientX-$("#china_heatmap_div").offset().left;
            let yPosition=d3.event.clientY-$("#china_heatmap_div").offset().top;
            d3.select("#my_tooltip")
                .style("left",(xPosition+6)+"px")
                .style("top",(yPosition+6)+"px")
            d3.select(".tooltiptext")
                .text(function(){
                    let currentProvinceName=getProvinceAbbr(d.properties.name);
                    return currentProvinceName+" "+globalMapData[d.properties.name];
                });
            d3.select("#my_tooltip").classed("my_tooltip_hidden",false);
        })
        .on("mouseout",function(d,i){
            d3.select(this).attr("stroke","black").style("cursor","default");
            d3.select("#my_tooltip").classed("my_tooltip_hidden",true);
        })
        .on("click",displayProvince);
    d3.selectAll(".china_map_circle").on("click",displayProvince);
    function displayProvince(d,i){
        provincePageFlag=1;
        // $(".china_map").animate({opacity:0.2},"slow");
        $(".china_map").fadeOut("slow");
        $(".china_map_text").fadeOut("slow");
        $(".china_map_circle").fadeOut("slow");

        /** 获取省名字 */
        let provinceName=d.properties.name.slice(0,2);
        /** 加载某省具体数据 */
        d3.queue()
            .defer(d3.json,"static/data/chinaVis-map/geometryProvince/"+d.properties.id+".json?t="+new Date().getTime())
            .defer(d3.json,"static/data/chinaVis-map/case/case_"+currentDateStr+".json?t="+new Date().getTime())
            .await(function(error,mapJson,caseJson){
                if(error) return console.warn(error);
                let provinceNameArr=Object.keys(caseJson);
                if(provinceNameArr.indexOf(provinceName)===-1){
                    for(let i in provinceNameArr){
                        let pattern=eval(`/[${provinceNameArr[i]}]/g`); //利用正则匹配解决简写不一致问题
                        if(pattern.test(d.properties.name)){
                            provinceName=provinceNameArr[i];
                        }
                    }
                }
                caseJson=caseJson[provinceName]
                let cityNameArr=Object.keys(caseJson);
                if((/新疆/).test(d.properties.name)||(/西藏/).test(d.properties.name)||(/内蒙古/).test(d.properties.name)||(/黑龙江/).test(d.properties.name)){
                    chinaProjection.center([d.properties.cp[0]+2,d.properties.cp[1]]).scale(1500); //重新绘制比例尺
                }
                else if((/重庆/).test(d.properties.name)||(/海南/).test(d.properties.name)){
                    chinaProjection.center([d.properties.cp[0],d.properties.cp[1]]).scale(6000); //重新绘制比例尺
                }
                else if((/北京/).test(d.properties.name)||(/天津/).test(d.properties.name)){
                    chinaProjection.center([d.properties.cp[0],d.properties.cp[1]]).scale(10000); //重新绘制比例尺
                }
                else if((/台湾/).test(d.properties.name)||(/澳门/).test(d.properties.name)||
                    (/香港/).test(d.properties.name)||(/上海/).test(d.properties.name)){
                    chinaProjection.center([d.properties.cp[0],d.properties.cp[1]]).scale(18000); //重新绘制比例尺
                }
                else{
                    chinaProjection.center([d.properties.cp[0]+2,d.properties.cp[1]]).scale(3000); //重新绘制比例尺
                }
                chinaSvg.selectAll(".provincePath")
                    .data(mapJson.features)
                    .enter()
                    .append("path")
                    .attr("class","province_map")
                    .attr("d",chinaPath)
                    .attr("stroke","black")
                    .attr("stroke-width",0.5)
                    .on("mouseover",function(d,i){
                        let cityName=d.properties.name.slice(0,2);
                        if(cityNameArr.indexOf(cityName)===-1){
                            let existFlag=0;// 城市名字查询不存在: 1.简写不一致 2.确实不存在
                            for(let i in cityNameArr){
                                let pattern=eval(`/[${cityNameArr[i]}]/g`); //利用正则匹配解决简写不一致问题
                                if(pattern.test(d.properties.name)){
                                    cityName=cityNameArr[i];
                                    existFlag=1;
                                }
                            }
                            if(existFlag===0){
                                return 0; // 不存在返回0
                            }
                        }
                        d3.select(this).attr("stroke","rgb(70,130,180)").style("cursor","pointer");
                        let xPosition=d3.event.clientX-$("#china_heatmap_div").offset().left;
                        let yPosition=d3.event.clientY-$("#china_heatmap_div").offset().top;
                        d3.select("#my_tooltip")
                            .style("left",(xPosition+6)+"px")
                            .style("top",(yPosition+6)+"px")
                        d3.select(".tooltiptext")
                            .text(function(){
                                let confirmedCount=caseJson[cityName]['累计确诊'];
                                return d.properties.name+" 累计确诊: "+confirmedCount;
                            });
                        d3.select("#my_tooltip").classed("my_tooltip_hidden",false);
                    })
                    .on("mouseout",function(d,i){
                        d3.select(this).attr("stroke","black");
                        d3.select("#my_tooltip").classed("my_tooltip_hidden",true);
                    })
                    .on("click",function(d,i){
                        provincePageFlag=0;
                        $(".province_map").fadeOut("slow");
                        $(".province_map_text").fadeOut("slow");
                        $(".province_map_circle").fadeOut("slow");
                        $(".china_map").fadeIn("slow");
                        $(".china_map_text").fadeIn("slow");
                        $(".china_map_circle").fadeIn("slow");
                    })
                    .attr("fill",function(d,i){
                        let cityName=d.properties.name.slice(0,2);
                        if(cityNameArr.indexOf(cityName)===-1){
                            // 城市名字查询不存在: 1.简写不一致 2.确实不存在
                            let existFlag=0;
                            for(let i in cityNameArr){
                                let pattern=eval(`/[${cityNameArr[i]}]/g`); //利用正则匹配解决简写不一致问题
                                if(pattern.test(d.properties.name)){
                                    cityName=cityNameArr[i];
                                    existFlag=1;
                                }
                            }
                            if(existFlag===0){
                                cityCaseArr[d.properties.name]=0;
                                return "white";
                            }
                        }
                        let confirmedCount=caseJson[cityName]['累计确诊'];
                        let curedCount=caseJson[cityName]['累计治愈'];
                        let deadCount=caseJson[cityName]['累计死亡'];
                        if(caseType===1){
                            cityCaseArr[d.properties.name]=confirmedCount;
                            return colorLab(myScale(confirmedCount,colorGradient));
                        }else if(caseType===2){
                            cityCaseArr[d.properties.name]=curedCount;
                            return colorLab2(myScale(curedCount,colorGradient2));
                        }else{
                            cityCaseArr[d.properties.name]=deadCount;
                            return colorLab3(myScale(deadCount,colorGradient3));
                        }
                    });
                chinaSvg.selectAll(".provincePathCircle") //新增圆: 显示新增病例
                    .data(mapJson.features)
                    .enter()
                    .append("circle")
                    .attr("class","province_map_circle")
                    .attr("cx",function(d,i){
                        return chinaProjection(d.properties.cp)[0];
                    })
                    .attr("cy",function(d,i){
                        return chinaProjection(d.properties.cp)[1];
                    })
                    .attr("opacity",0.8)
                    .attr("fill",circleColors[caseType-1])
                    .attr("r",function(d,i){
                        let cityName=d.properties.name.slice(0,2);
                        if(cityNameArr.indexOf(cityName)===-1){
                            // 城市名字查询不存在: 1.简写不一致 2.确实不存在
                            let existFlag=0;
                            for(let i in cityNameArr){
                                let pattern=eval(`/[${cityNameArr[i]}]/g`); //利用正则匹配解决简写不一致问题
                                if(pattern.test(d.properties.name)){
                                    cityName=cityNameArr[i];
                                    existFlag=1;
                                }
                            }
                            if(existFlag===0){
                                return 0;
                            }
                        }
                        let currentConfirmedCount=caseJson[cityName]['新增确诊'];
                        let currentCuredCount=caseJson[cityName]['新增治愈'];
                        let currentDeadCount=caseJson[cityName]['新增死亡'];
                        if(caseType===1){
                            return 20*myScale(currentConfirmedCount,currentColorGradient);
                        }else if(caseType===2){
                            return 20*myScale(currentCuredCount,currentColorGradient);
                        }else{
                            return 20*myScale(currentDeadCount,currentColorGradient);
                        }
                    })
                    .on("mouseover",function(d,i){
                        d3.select(this).style("cursor","pointer");
                        let xPosition=d3.event.clientX-$("#china_heatmap_div").offset().left;
                        let yPosition=d3.event.clientY-$("#china_heatmap_div").offset().top;
                        d3.select("#my_tooltip")
                            .style("left",(xPosition+6)+"px")
                            .style("top",(yPosition+6)+"px")
                        d3.select(".tooltiptext")
                            .text(function(){
                                let cityName=d.properties.name.slice(0,2);
                                if(cityNameArr.indexOf(cityName)===-1){
                                    // 城市名字查询不存在: 1.简写不一致 2.确实不存在
                                    let existFlag=0;
                                    for(let i in cityNameArr){
                                        let pattern=eval(`/[${cityNameArr[i]}]/g`); //利用正则匹配解决简写不一致问题
                                        if(pattern.test(d.properties.name)){
                                            cityName=cityNameArr[i];
                                            existFlag=1;
                                        }
                                    }
                                    if(existFlag===0){
                                        return 0;
                                    }
                                }
                                if(caseType===1){
                                    return cityName+" 新增确诊: "+caseJson[cityName]['新增确诊'];
                                }else if(caseType===2){
                                    return cityName+" 新增治愈: "+caseJson[cityName]['新增治愈'];
                                }else{
                                    return cityName+" 新增死亡: "+caseJson[cityName]['新增死亡'];
                                }
                            });
                        d3.select("#my_tooltip").classed("my_tooltip_hidden",false);
                    })
                    .on("mouseout",function(d,i){
                        d3.select("#my_tooltip").classed("my_tooltip_hidden",true);
                    });
                chinaSvg.selectAll(".provincePathText")
                    .data(mapJson.features)
                    .enter()
                    .append("text")
                    .attr("class","province_map_text")
                    .attr("text-anchor","middle")
                    .attr("font-size",9)
                    .attr("x",function(d){
                        return chinaProjection(d.properties.cp)[0];
                    })
                    .attr("y",function(d){
                        return chinaProjection(d.properties.cp)[1];
                    })
                    .text(function(d){
                        return d.properties.name;
                    })
            });
    }

    d3.selectAll(".china_map_circle")
        .on("mouseover",function(d,i){
            d3.select(this).style("cursor","pointer");
            let xPosition=d3.event.clientX-$("#china_heatmap_div").offset().left;
            let yPosition=d3.event.clientY-$("#china_heatmap_div").offset().top;
            d3.select("#my_tooltip")
                .style("left",(xPosition+6)+"px")
                .style("top",(yPosition+6)+"px")
            d3.select(".tooltiptext")
                .text(function(){
                    let currentProvinceName=getProvinceAbbr(d.properties.name);
                    return currentProvinceName+" "+currentGlobalMapData[d.properties.name];
                });
            d3.select("#my_tooltip").classed("my_tooltip_hidden",false);
        })
        .on("mouseout",function(d,i){
            d3.select("#my_tooltip").classed("my_tooltip_hidden",true);
        });
}

