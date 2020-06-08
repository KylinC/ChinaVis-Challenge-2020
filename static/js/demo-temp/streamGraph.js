const riverChart = echarts.init(document.getElementById("addRiver"));

function call_whatariver(time_str,area_str){
    $.ajaxSettings.async = false;
    var result ="";
    $.getJSON("static/data/Heat/"+area_str+".json", function (data){
        var source_data=data[time_str];
        a =  whatariver(source_data);
    })
    $.ajaxSettings.async = true;
    return result;
}

var riveroption = {

    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: 'rgba(0,0,0,0.2)',
                width: 1,
                type: 'solid'
            }
        }
    },

    legend: {
        textStyle: {
            fontSize: 12,
            color: '#ddd'
            },
        data: [],
        // selected: {
        //     // 选中'系列1'
        //     'DQ': true,
        //     // 不选中'系列2'
        //     'TY': false
        // }
    },

    "dataZoom": [{
        "show": true,
        bottom: 0,
        height:20,
        "start": 10,
        "end": 90,
        textStyle:{
            color:"#fff"},
            
    },{
        "type": "inside",
        "show": true,
        "height": 15,
        "start": 3,
        "end": 4
    }],

    singleAxis: {
        top: 50,
        bottom: 50,
        axisTick: {
            interval: 0
        },
        splitNumber:8,
        axisLabel: {
            fontSize: 10,
            interval: 0,
            textStyle: {
                color: '#ddd'
            }},
        type: 'time',
        axisPointer: {
            animation: true,
            label: {
                show: true
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed',
                opacity: 0.2
            }
        }
    },

    series: [
        {
            type: 'themeRiver',
            label: {
                show: false
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 100,
                    shadowColor: 'rgba(0, 0, 0, 0.9)'
                }
            },
            data: []
        }
    ]
};

function whatariver(source_selected_data){

    var source_legend=source_selected_data["days"];
    var source_data=source_selected_data["data"];
    var source_date=source_selected_data["hours"];
    var riverdata=[];
    for(var i=0;i<source_data.length;i++){
        let tmp_data=source_data[i];

        let date_inside="2020/05/"+source_date[tmp_data[1]];
        let value_inside=tmp_data[2];
        if(value_inside=="null"){
            value_inside=0;
        }
        let cate_inside=source_legend[tmp_data[0]];
        riverdata.push([date_inside,value_inside,cate_inside])
    }
    // console.log(riverdata);

    riveroption.legend.data=source_legend;
    riveroption.series[0].data=riverdata;

    var unselected_item={};
    var selected_item={};
    for(var i=0;i<source_legend.length;i++){
        unselected_item[source_legend[i]]=false;
        selected_item[source_legend[i]]=true;
    }
    riveroption.legend.selected = unselected_item;

    riverChart.setOption(riveroption);

    // riverChart.setOption(riveroption);
    return selected_item;
}

window.onresize = function() {
    riverChart.resize();
};