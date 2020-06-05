/**
 * China heatmap.
 * Date: 2020-5-20 
 */

$(function () {
    "use strict";
    /** 部分数据初始化 */

    /* 变量申请 */
    var viewportWidth=$(document.body).width();
    var viewportHeight=$(document.body).height();
    console.log([viewportWidth,viewportHeight]);

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

    var chinaProjection=d3.geoMercator().center([105,32]).translate([mapCenterPos.x,mapCenterPos.y]).scale(500); // 调整地图中心位置
    var chinaPath=d3.geoPath().projection(chinaProjection);
    var nanshaProjection=d3.geoMercator().center([106,23]).scale(200); // 调整地图中心位置
    var nanshaPath=d3.geoPath().projection(nanshaProjection);

    var chinaSvg=d3.select("#china_heatmap_div")
            .append("svg")
            .attr("id","china_heatmap_svg")
            .attr("width",width)
            .attr("height",height);
    var nanshaSvg=d3.select("#china_heatmap_div")
            .append("svg")
            .attr("id","nansha_heatmap_svg")
            .attr("width",60)
            .attr("height",75);
    var dateArr=getEachDay('2020/1/10','2020/5/19'); // 2020-1-10至2020-5-19
    var currentDateStr="2-1"; //全局日期
    var caseType=1; // 全局确诊-治愈-死亡类型
    var globalMapData={};
    var currentGlobalMapData={};
    var cityCaseArr={};// 全局保存当前省份的城市案例
    var provincePageFlag=0;

    createDateSeletor();
    $("#confirmed_button").css({"background-color":"#0e94eb","color":"white"});

    /* 数据异步加载: 异步任务放入队列，加载完成之后在绘制热力图 */
    var files = ["static/data/chinaVis-map/china.json?t="+new Date().getTime(),
        "static/data/chinaVis-map/island.json?t="+new Date().getTime(),
        "static/data/chinaVis-map/nansha.json?t="+new Date().getTime()];
    var promises = [];
    files.forEach(function(url) {
        promises.push(d3.json(url))
    });

    Promise.all(promises).then(function(values) {
        console.log(values[0]);
        displayMap(values[0],1);
        displayMap(values[1],2);
        displayMap(values[2],3);
        mapLabel(1);
        loadCurrentDateCase(1); // 初始化
    });

    // d3.queue()
    //     .defer(d3.json,"static/data/chinaVis-map/china.json?t="+new Date().getTime())
    //     .defer(d3.json, "static/data/chinaVis-map/island.json?t="+new Date().getTime())
    //     .defer(d3.json, "static/data/chinaVis-map/nansha.json?t="+new Date().getTime())
    //     .await(function(error,mainlandJson,islandJson,nanshaJson,caseCsv) {
    //         if (error) return console.warn(error);
    //         displayMap(mainlandJson,1);
    //         displayMap(islandJson,2);
    //         displayMap(nanshaJson,3);
    //         mapLabel(1);
    //         loadCurrentDateCase(1); // 初始化
    //     });

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
        d3.json("static/data/chinaVis-map/case/province_case_"+currentDateStr+".json?t="+new Date().getTime()).then(function(json){
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
            .attr("x",50)
            .attr("y",function(d,i){
                return (height-140)-10*i;
            })
            .attr("ry",1)
            .attr("height",10)
            .attr("width",30)
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
            .attr("x",65)
            .attr("y",function(d,i){
                return (height-132)-10*i;
            })
            .attr("text-anchor","middle")
            .attr("fill","black")
            .attr("font-size",5)
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
            let xPosition=this.offsetLeft;
            let yPosition=this.offsetTop;
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
            let xPosition=this.offsetLeft;
            let yPosition=this.offsetTop;
            console.log([xPosition,yPosition]);
            d3.select("#default_tooltip")
                .style("left",(xPosition+28)+"px")
                .style("top",(yPosition-4)+"px");
            d3.select(".default_tooltiptext")
                .text(this.id.split('_')[1]);
        });
        $("#date_2020-"+currentDateStr).css("background-color","rgb(10, 170, 233)");
    }
    function showDefaultDateTooltip(selector){
        let xPosition=document.querySelector(selector).offsetLeft;
        let yPosition=document.querySelector(selector).offsetTop;
        console.log([xPosition,yPosition]);
        d3.select("#default_tooltip")
            .style("left",(xPosition+28)+"px")
            .style("top",(yPosition-4)+"px");
        d3.select(".default_tooltiptext")
            .text(selector.split('_')[1]);
        d3.select("#default_tooltip").classed("default_tooltip_hidden",false);
    }


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
                chart3Export(getProvinceAbbr(d.properties.name));
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
            var files = ["static/data/chinaVis-map/geometryProvince/"+d.properties.id+".json?t="+new Date().getTime(),
                "static/data/chinaVis-map/case/case_"+currentDateStr+".json?t="+new Date().getTime()];
            var promises = [];
            files.forEach(function(url) {
                promises.push(d3.json(url))
            });

            Promise.all(promises).then(function(values) {
                    let mapJson=values[0];
                    let caseJson=values[1];
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
});
