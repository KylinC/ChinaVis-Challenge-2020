const emotionChart = echarts.init(document.getElementById("emotion"));

function call_emotion(time_str,area_str){
    $.getJSON("static/data/Emotion/"+area_str+".json", function (data){
        var source_data=data[time_str];
        emotion(time_str,source_data);
    })
}

var tag_container;

function emotion(time_str,source_data){

    var weekDay=source_data[0].indexOf('5-'+time_str);

    // var weekDay = 3;
    var data = [source_data[1][1], source_data[1][2], source_data[1][0]]
    tag_container=source_data[0];

    Eoption = {
        tooltip: {
            trigger: 'item',
            padding: 10,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
            formatter: tooltipFormatter,

        },
        angleAxis: {
            type: 'category',
            data: source_data[0],
            z: 10,
            axisLabel: {
                fontSize: 10,
                interval: 0,
                textStyle: {
                    color: '#ddd'
                }
            }
        },
        polar: {
            center: ['50%', '50%'],
            radius: 100,
        },
        radiusAxis: {
            max:100
        },
        series: [{
            type: 'bar',
            data: [
                data["0"].value["0"],
                data["0"].value["1"],
                data["0"].value["2"],
                data["0"].value["3"],
                data["0"].value["4"],
                data["0"].value["5"],
                data["0"].value["6"],
            ],
            coordinateSystem: 'polar',
            name: data["0"].name,
            stack: 'a',
            itemStyle: {
                normal: {
                    color:"rgba(255,127,0,0.9)",
                    // borderWidth: 4,
                    // borderColor: '#ffffff',
                },
                emphasis: {
                    borderWidth: 0,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }, {
            type: 'bar',
            data: [
                data["1"].value["0"],
                data["1"].value["1"],
                data["1"].value["2"],
                data["1"].value["3"],
                data["1"].value["4"],
                data["1"].value["5"],
                data["1"].value["6"],
            ],
            coordinateSystem: 'polar',
            name: data["1"].name,
            stack: 'a',
            itemStyle: {
                normal: {
                    color:"rgba(197,239,73,0.9)",
                    // borderWidth: 4,
                    // borderColor: '#ffffff',
                },
                emphasis: {
                    borderWidth: 0,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }, {
            type: 'bar',
            data: [
                data["2"].value["0"],
                data["2"].value["1"],
                data["2"].value["2"],
                data["2"].value["3"],
                data["2"].value["4"],
                data["2"].value["5"],
                data["2"].value["6"],
            ],
            coordinateSystem: 'polar',
            name: data["2"].name,
            stack: 'a',
            itemStyle: {
                normal: {
                    color:"rgba(220,62,73,0.9)",
                    // borderWidth: 3,
                    // borderColor: '#ffffff',
                },
                emphasis: {
                    borderWidth: 3,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }, {
            name: 'Emotion',
            type: 'pie',
            radius: ['64%', '72%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}'

                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '15',
                        fontWeight: 'normal'
                    }
                }
            },
            labelLine: {
                normal: {
                    length:"5",
                    length2:"5",
                    show: true
                }
            },
            data: [{
                value: data["0"].value["3"],
                name: data["0"].name,
                itemStyle:{
                    color:"rgba(255,127,0,0.9)"
                }
            }, {
                value: data["1"].value["3"],
                name: data["1"].name,
                itemStyle:{
                    color:"rgba(197,239,73,0.9)"
                }
            }, {
                value: data["2"].value["3"],
                name: data["2"].name,
                itemStyle:{
                    color:"rgba(220,62,73,0.9)"
                }
            }],
            legend: {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'top',
                data: [data["0"].name, data["1"].name, data["2"].name, ]
            },
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: '#ffffff'
                },
                emphasis: {
                    borderWidth: 3,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    }

    function tooltipFormatter(params) {
        var valuesFormatter = [];
        if (params.componentSubType == 'pie') {
            let tmp=Eoption.angleAxis.data[weekDay];
            if(typeof tmp == 'string'){
                valuesFormatter.push(
                    '<div style="border-bottom: 1px solid rgba(255,255,255,.3);color:rgb(255,255,255); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                    Eoption.angleAxis.data[weekDay] + '<br>' + '</div>' +
                    '<span style="color:' + params.color + '">' + params.name + '</span>: ' + params.value
                );
            }else{
                valuesFormatter.push(
                    '<div style="border-bottom: 1px solid rgba(255,255,255,.3);color:rgb(255,255,255); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                    Eoption.angleAxis.data[weekDay]['value'] + '<br>' + '</div>' +
                    '<span style="color:' + params.color + '">' + params.name + '</span>: ' + params.value
                );
            }
            
        } else {
            valuesFormatter.push(
                '<div style="border-bottom: 1px solid rgba(255,255,255,.3);color:rgb(255,255,255); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                params.seriesName +
                '</div>' +
                '<span style="color:' + params.color + '">' + params.name + '</span>: ' + params.value + '<br>');
        }

        return valuesFormatter;
    }
    emotionChart.setOption(Eoption);

    emotionChart.on('click', function(params) {
        if (params.componentSubType != 'pie') {
            weekDay = params.dataIndex;
            Eoption.series[3].data[0].value = data[0].value[weekDay];
            Eoption.series[3].data[1].value = data[1].value[weekDay];
            Eoption.series[3].data[2].value = data[2].value[weekDay];
            var weekDayData=[];
            for(var i=0;i<tag_container.length;i++){
                weekDayData.push(tag_container[i]);
            }
            weekDayData[weekDay] = {
                value: weekDayData[weekDay],
                textStyle: {
                    fontSize: 20,
                }
            };
            Eoption.angleAxis.data = weekDayData;
            emotionChart.setOption(Eoption);
        }
    });
}

window.onresize = function() {
    emotionChart.resize();
};