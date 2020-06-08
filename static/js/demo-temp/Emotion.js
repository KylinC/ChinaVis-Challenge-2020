const emotionChart = echarts.init(document.getElementById("emotion"));

function call_emotion(time_str,area_str){
    $.getJSON("static/data/Emotion/"+area_str+".json", function (data){
        var source_data=data[time_str];
        emotion(source_data);
    })
}

function emotion(source_data){

    var weekDay = 0;
    var data = [source_data[1][1], source_data[1][2], source_data[1][0]]

    option = {
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
                }}
        },
        polar: {
            center: ['50%', '50%'],
            radius: 115,
        },
        radiusAxis: {},
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
                    borderWidth: 4,
                    borderColor: '#ffffff',
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
                    borderWidth: 4,
                    borderColor: '#ffffff',
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
                    borderWidth: 3,
                    borderColor: '#ffffff',
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
            radius: ['75%', '80%'],
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
                    show: false
                }
            },
            data: [{
                value: data["0"].value["0"],
                name: data["0"].name
            }, {
                value: data["1"].value["0"],
                name: data["1"].name
            }, {
                value: data["2"].value["0"],
                name: data["2"].name
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
                    borderWidth: 3,
                    borderColor: '#ffffff',
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
            valuesFormatter.push(
                '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                option.angleAxis.data[weekDay].value + '<br>' + '</div>' +
                '<span style="color:' + params.color + '">' + params.name + '</span>: ' + params.value
            );
        } else {
            valuesFormatter.push(
                '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                params.seriesName +
                '</div>' +
                '<span style="color:' + params.color + '">' + params.name + '</span>: ' + params.value + '<br>');
        }

        return valuesFormatter;
    }
    emotionChart.setOption(option);
}

window.onresize = function() {
    emotionChart.resize();
};

emotionChart.on('click', function(params) {
    if (params.componentSubType != 'pie') {
        weekDay = params.dataIndex;
        option.series[3].data[0].value = data[0].value[weekDay];
        option.series[3].data[1].value = data[1].value[weekDay];
        option.series[3].data[2].value = data[2].value[weekDay];
        var weekDayData = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];;
        weekDayData[weekDay] = {
            value: weekDayData[weekDay],
            textStyle: {
                fontSize: 25,
            }
        };
        option.angleAxis.data = weekDayData;
        emotionChart.setOption(option);
    }
});