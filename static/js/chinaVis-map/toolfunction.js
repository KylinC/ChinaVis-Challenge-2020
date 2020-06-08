/**
 * toolfunction used to simplify function call.
 * Date: 2020-5-21
 */

const dayStep=86400000;
const transitionDelay=1000;
 /* 比例尺 */
function myScale(number,arr){
    if(number>=arr[0]&&number<arr[1]){
        return 0.0;
    }else if(number>=arr[1]&&number<arr[2]){
        return 0.1;
    }else if(number>=arr[2]&&number<arr[3]){
        return 0.2;
    }else if(number>=arr[3]&&number<arr[4]){
        return 0.3;
    }else if(number>=arr[4]&&number<arr[5]){
        return 0.4;
    }else if(number>=arr[5]&&number<arr[6]){
        return 0.5;
    }else if(number>=arr[6]&&number<arr[7]){
        return 0.6;
    }else if(number>=arr[7]&&number<arr[8]){
        return 0.7;
    }else if(number>=arr[8]&&number<arr[9]){
        return 0.8;
    }else{
        return 0.9;
    }
}

/** 获取两个日期之间所有日期 */
function getEachDay(startDate,endDate){
    let eachDayArr=[];
    let start=new Date(startDate);
    let end=new Date(endDate);

    let startSeconds=start.getTime();
    let endSeconds=end.getTime();
    for(;startSeconds<endSeconds;startSeconds+=dayStep){
        let tempDate=new Date(startSeconds);
        let dateStr=tempDate.getFullYear()+'-'+(tempDate.getMonth() + 1) + '-' + tempDate.getDate();
        eachDayArr.push(dateStr);
    }
    return eachDayArr;
}

/** 获取当前日期前n天的日期*/
function  getPreWeekDate(curDate,pre_n) {
    var preDateArr=[];
    var currentDate=new Date(curDate);
    var currentSecond=currentDate.getTime();
    for(let i=currentSecond;i>currentSecond-pre_n*dayStep;i-=dayStep){
        let tempDate=new Date(i);
        let dateStr=(tempDate.getMonth() + 1) + '-' + tempDate.getDate();
        preDateArr.push(dateStr);
    }
    return preDateArr;
}

/** 获取省份简称 */
function getProvinceAbbr(provinceName){
    if((/黑龙/).test(provinceName)||(/内蒙/).test(provinceName)){
        provinceName=provinceName.slice(0,3);
    }else{
        provinceName=provinceName.slice(0,2);
    }
    return provinceName;
}

/** 绘制折线点图*/
function drawLineChart(lineArr,origin,gChart,color){
    var line=d3.line()
    .x(function(d,i){
        return 3*i+origin.x+1;
    })
    .y(function(d,i){
        return origin.y-d-1;
    });
    gChart.append("path")
        .transition()
        .ease(d3.easeCircleIn)
        .duration(transitionDelay/2)
    .attr("stroke",color)
    .attr("stroke-width",2)
    .attr("fill","none")
    .attr("d",line(lineArr));

    gChart.append("line")
    .attr("x1",origin.x)
    .attr("y1",origin.y-21)
    .attr("x2",origin.x)
    .attr("y2",origin.y)
    .attr("stroke","white")
    .attr("stroke-width",1)
    .attr("fill","none");

    gChart.append("line")
    .attr("x1",origin.x+21)
    .attr("y1",origin.y)
    .attr("x2",origin.x)
    .attr("y2",origin.y)
    .attr("stroke","white")
    .attr("stroke-width",1)
    .attr("fill","none");
}

function drawPieChart(pieArr,origin,gChart,colors,radius){
    var arc=d3.arc()
                .innerRadius(0)
                .outerRadius(radius);
    var pie=d3.pie();//创建饼状布局
    var arcs=gChart.selectAll("g.arc")
                    .data(pie(pieArr))
                    .enter()
                    .append("g")
                    .attr("transform","translate("+origin.x+","+origin.y+")");
    arcs.append("path")
        .attr("class","arc")
        .on("mouseover",function(d,i){
            d3.select(this)
                .transition()
                .duration(200)
                .attr("transform","scale(1.1)")
                .attr("opacity",1.0);
                 let xPosition=d3.event.clientX-$(".chinaMap-box").offset().left;
                let yPosition=d3.event.clientY-$(".chinaMap-box").offset().top;
                d3.select("#my_tooltip")
                    .style("left",(xPosition+6)+"px")
                    .style("top",(yPosition+6)+"px")
                d3.select(".tooltiptext")
                    .text(function(){
                        if(i===0){
                            return "舆情热度-正面 "+d.value;
                        } else if(i===1){
                            return "舆情热度-负面 "+d.value;
                        } else{
                            return "舆情热度-中立 "+d.value;
                        }
                    });
            d3.select("#my_tooltip").classed("my_tooltip_hidden",false);
        })
        .on("mouseout",function(d,i){
            d3.select(this)
                .transition()
                .duration(200)
                .attr("transform","scale(1)");
            d3.select("#my_tooltip").classed("my_tooltip_hidden",false);
        })
        .transition()
        .ease(d3.easeLinear)
        .duration(transitionDelay)
        .attr("d",arc)
        .attr("opacity",0.8)
        .attr("fill",function(d,i){
            return colors[i];
        })
}