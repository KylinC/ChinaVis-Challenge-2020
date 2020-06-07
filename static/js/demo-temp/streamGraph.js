const riverChart = echarts.init(document.getElementById("addRiver"));

var sourcedata={'11': {'hours': [11, 12, 13, 14, 15, 16, 17], 'days': ['疫情-美国', '疫情-欧洲', '疫情-两会', '新冠-两会', 'null'], 'data': [[0, 0, 226], [0, 1, 530], [0, 2, 851], [0, 3, 1445], [0, 4, 2367], [0, 5, 3561], [0, 6, 5083], [1, 0, 91], [1, 1, 219], [1, 2, 344], [1, 3, 622], [1, 4, 918], [1, 5, 1992], [1, 6, 2735], [2, 0, 21], [2, 1, 43], [2, 2, 104], [2, 3, 206], [2, 4, 389], [2, 5, 571], [2, 6, 974], [3, 0, 9], [3, 1, 26], [3, 2, 54], [3, 3, 117], [3, 4, 217], [3, 5, 397], [3, 6, 630], [4, 0, 0], [4, 1, 0], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 0], [4, 6, 0]]}, '12': {'hours': [11, 12, 13, 14, 15, 16, 17], 'days': ['疫情-美国', '疫情-欧洲', '新冠-无症状', '疫情-两会', '新冠-两会'], 'data': [[0, 0, 226], [0, 1, 530], [0, 2, 851], [0, 3, 1445], [0, 4, 2367], [0, 5, 3561], [0, 6, 5083], [1, 0, 91], [1, 1, 219], [1, 2, 344], [1, 3, 622], [1, 4, 918], [1, 5, 1992], [1, 6, 2735], [2, 0, 0], [2, 1, 52], [2, 2, 121], [2, 3, 210], [2, 4, 343], [2, 5, 482], [2, 6, 643], [3, 0, 21], [3, 1, 43], [3, 2, 104], [3, 3, 206], [3, 4, 389], [3, 5, 571], [3, 6, 974], [4, 0, 9], [4, 1, 26], [4, 2, 54], [4, 3, 117], [4, 4, 217], [4, 5, 397], [4, 6, 630]]}, '13': {'hours': [11, 12, 13, 14, 15, 16, 17], 'days': ['疫情-美国', '疫情-欧洲', '新冠-无症状', '疫情-两会', '新冠-两会'], 'data': [[0, 0, 226], [0, 1, 530], [0, 2, 851], [0, 3, 1445], [0, 4, 2367], [0, 5, 3561], [0, 6, 5083], [1, 0, 91], [1, 1, 219], [1, 2, 344], [1, 3, 622], [1, 4, 918], [1, 5, 1992], [1, 6, 2735], [2, 0, 0], [2, 1, 52], [2, 2, 121], [2, 3, 210], [2, 4, 343], [2, 5, 482], [2, 6, 643], [3, 0, 21], [3, 1, 43], [3, 2, 104], [3, 3, 206], [3, 4, 389], [3, 5, 571], [3, 6, 974], [4, 0, 9], [4, 1, 26], [4, 2, 54], [4, 3, 117], [4, 4, 217], [4, 5, 397], [4, 6, 630]]}, '14': {'hours': [11, 12, 13, 14, 15, 16, 17], 'days': ['疫情-美国', '疫情-欧洲', '新冠-无症状', '疫情-两会', '新冠-两会'], 'data': [[0, 0, 226], [0, 1, 530], [0, 2, 851], [0, 3, 1445], [0, 4, 2367], [0, 5, 3561], [0, 6, 5083], [1, 0, 91], [1, 1, 219], [1, 2, 344], [1, 3, 622], [1, 4, 918], [1, 5, 1992], [1, 6, 2735], [2, 0, 0], [2, 1, 52], [2, 2, 121], [2, 3, 210], [2, 4, 343], [2, 5, 482], [2, 6, 643], [3, 0, 21], [3, 1, 43], [3, 2, 104], [3, 3, 206], [3, 4, 389], [3, 5, 571], [3, 6, 974], [4, 0, 9], [4, 1, 26], [4, 2, 54], [4, 3, 117], [4, 4, 217], [4, 5, 397], [4, 6, 630]]}, '15': {'hours': [12, 13, 14, 15, 16, 17, 18], 'days': ['疫情-美国', '疫情-欧洲', '疫情-两会', '新冠-无症状', '新冠-两会'], 'data': [[0, 0, 530], [0, 1, 851], [0, 2, 1445], [0, 3, 2367], [0, 4, 3561], [0, 5, 5083], [0, 6, 10746], [1, 0, 219], [1, 1, 344], [1, 2, 622], [1, 3, 918], [1, 4, 1992], [1, 5, 2735], [1, 6, 5998], [2, 0, 43], [2, 1, 104], [2, 2, 206], [2, 3, 389], [2, 4, 571], [2, 5, 974], [2, 6, 2792], [3, 0, 52], [3, 1, 121], [3, 2, 210], [3, 3, 343], [3, 4, 482], [3, 5, 643], [3, 6, 1113], [4, 0, 26], [4, 1, 54], [4, 2, 117], [4, 3, 217], [4, 4, 397], [4, 5, 630], [4, 6, 1774]]}, '16': {'hours': [13, 14, 15, 16, 17, 18, 19], 'days': ['疫情-美国', '疫情-欧洲', '疫情-两会', '新冠-无症状', '新冠-两会'], 'data': [[0, 0, 851], [0, 1, 1445], [0, 2, 2367], [0, 3, 3561], [0, 4, 5083], [0, 5, 10746], [0, 6, 10141], [1, 0, 344], [1, 1, 622], [1, 2, 918], [1, 3, 1992], [1, 4, 2735], [1, 5, 5998], [1, 6, 7026], [2, 0, 104], [2, 1, 206], [2, 2, 389], [2, 3, 571], [2, 4, 974], [2, 5, 2792], [2, 6, 3010], [3, 0, 121], [3, 1, 210], [3, 2, 343], [3, 3, 482], [3, 4, 643], [3, 5, 1113], [3, 6, 5188], [4, 0, 54], [4, 1, 117], [4, 2, 217], [4, 3, 397], [4, 4, 630], [4, 5, 1774], [4, 6, 2082]]}, '17': {'hours': [14, 15, 16, 17, 18, 19, 20], 'days': ['疫情-美国', '疫情-欧洲', '疫情-两会', '新冠-无症状', '新冠-两会'], 'data': [[0, 0, 1445], [0, 1, 2367], [0, 2, 3561], [0, 3, 5083], [0, 4, 10746], [0, 5, 10141], [0, 6, 12112], [1, 0, 622], [1, 1, 918], [1, 2, 1992], [1, 3, 2735], [1, 4, 5998], [1, 5, 7026], [1, 6, 6861], [2, 0, 206], [2, 1, 389], [2, 2, 571], [2, 3, 974], [2, 4, 2792], [2, 5, 3010], [2, 6, 5045], [3, 0, 210], [3, 1, 343], [3, 2, 482], [3, 3, 643], [3, 4, 1113], [3, 5, 5188], [3, 6, 5470], [4, 0, 117], [4, 1, 217], [4, 2, 397], [4, 3, 630], [4, 4, 1774], [4, 5, 2082], [4, 6, 2636]]}, '18': {'hours': [15, 16, 17, 18, 19, 20, 21], 'days': ['疫情-美国', '疫情-欧洲', '疫情-两会', '新冠-两会', '新冠-无症状'], 'data': [[0, 0, 2367], [0, 1, 3561], [0, 2, 5083], [0, 3, 10746], [0, 4, 10141], [0, 5, 12112], [0, 6, 17484], [1, 0, 918], [1, 1, 1992], [1, 2, 2735], [1, 3, 5998], [1, 4, 7026], [1, 5, 6861], [1, 6, 10898], [2, 0, 389], [2, 1, 571], [2, 2, 974], [2, 3, 2792], [2, 4, 3010], [2, 5, 5045], [2, 6, 7786], [3, 0, 217], [3, 1, 397], [3, 2, 630], [3, 3, 1774], [3, 4, 2082], [3, 5, 2636], [3, 6, 4390], [4, 0, 343], [4, 1, 482], [4, 2, 643], [4, 3, 1113], [4, 4, 5188], [4, 5, 5470], [4, 6, 8132]]}, '19': {'hours': [16, 17, 18, 19, 20, 21, 22], 'days': ['疫情-美国', '疫情-欧洲', '新冠-无症状', '疫情-两会', '新冠-两会'], 'data': [[0, 0, 3561], [0, 1, 5083], [0, 2, 10746], [0, 3, 10141], [0, 4, 12112], [0, 5, 17484], [0, 6, 24687], [1, 0, 1992], [1, 1, 2735], [1, 2, 5998], [1, 3, 7026], [1, 4, 6861], [1, 5, 10898], [1, 6, 16499], [2, 0, 482], [2, 1, 643], [2, 2, 1113], [2, 3, 5188], [2, 4, 5470], [2, 5, 8132], [2, 6, 7520], [3, 0, 571], [3, 1, 974], [3, 2, 2792], [3, 3, 3010], [3, 4, 5045], [3, 5, 7786], [3, 6, 10666], [4, 0, 397], [4, 1, 630], [4, 2, 1774], [4, 3, 2082], [4, 4, 2636], [4, 5, 4390], [4, 6, 6355]]}, '20': {'hours': [17, 18, 19, 20, 21, 22, 23], 'days': ['疫情-美国', '疫情-欧洲', '新冠-无症状', '疫情-两会', '新冠-两会'], 'data': [[0, 0, 5083], [0, 1, 10746], [0, 2, 10141], [0, 3, 12112], [0, 4, 17484], [0, 5, 24687], [0, 6, 11836], [1, 0, 2735], [1, 1, 5998], [1, 2, 7026], [1, 3, 6861], [1, 4, 10898], [1, 5, 16499], [1, 6, 6095], [2, 0, 643], [2, 1, 1113], [2, 2, 5188], [2, 3, 5470], [2, 4, 8132], [2, 5, 7520], [2, 6, 4048], [3, 0, 974], [3, 1, 2792], [3, 2, 3010], [3, 3, 5045], [3, 4, 7786], [3, 5, 10666], [3, 6, 7044], [4, 0, 630], [4, 1, 1774], [4, 2, 2082], [4, 3, 2636], [4, 4, 4390], [4, 5, 6355], [4, 6, 4047]]}, '21': {'hours': [18, 19, 20, 21, 22, 23, 24], 'days': ['疫情-美国', '疫情-欧洲', '新冠-无症状', '疫情-两会', '新冠-两会'], 'data': [[0, 0, 10746], [0, 1, 10141], [0, 2, 12112], [0, 3, 17484], [0, 4, 24687], [0, 5, 11836], [0, 6, 15674], [1, 0, 5998], [1, 1, 7026], [1, 2, 6861], [1, 3, 10898], [1, 4, 16499], [1, 5, 6095], [1, 6, 8331], [2, 0, 1113], [2, 1, 5188], [2, 2, 5470], [2, 3, 8132], [2, 4, 7520], [2, 5, 4048], [2, 6, 4114], [3, 0, 2792], [3, 1, 3010], [3, 2, 5045], [3, 3, 7786], [3, 4, 10666], [3, 5, 7044], [3, 6, 7259], [4, 0, 1774], [4, 1, 2082], [4, 2, 2636], [4, 3, 4390], [4, 4, 6355], [4, 5, 4047], [4, 6, 4445]]}, '22': {'hours': [19, 20, 21, 22, 23, 24, 25], 'days': ['疫情-美国', '疫情-欧洲', '疫情-两会', '新冠-无症状', '新冠-两会'], 'data': [[0, 0, 10141], [0, 1, 12112], [0, 2, 17484], [0, 3, 24687], [0, 4, 11836], [0, 5, 15674], [0, 6, 108887], [1, 0, 7026], [1, 1, 6861], [1, 2, 10898], [1, 3, 16499], [1, 4, 6095], [1, 5, 8331], [1, 6, 74119], [2, 0, 3010], [2, 1, 5045], [2, 2, 7786], [2, 3, 10666], [2, 4, 7044], [2, 5, 7259], [2, 6, 16041], [3, 0, 5188], [3, 1, 5470], [3, 2, 8132], [3, 3, 7520], [3, 4, 4048], [3, 5, 4114], [3, 6, 6774], [4, 0, 2082], [4, 1, 2636], [4, 2, 4390], [4, 3, 6355], [4, 4, 4047], [4, 5, 4445], [4, 6, 10018]]}, '23': {'hours': [19, 20, 21, 22, 23, 24, 25], 'days': ['疫情-美国', '疫情-两会', '疫情-欧洲', '新冠-无症状', '新冠-两会'], 'data': [[0, 0, 10141], [0, 1, 12112], [0, 2, 17484], [0, 3, 24687], [0, 4, 11836], [0, 5, 15674], [0, 6, 108887], [1, 0, 3010], [1, 1, 5045], [1, 2, 7786], [1, 3, 10666], [1, 4, 7044], [1, 5, 7259], [1, 6, 16041], [2, 0, 7026], [2, 1, 6861], [2, 2, 10898], [2, 3, 16499], [2, 4, 6095], [2, 5, 8331], [2, 6, 74119], [3, 0, 5188], [3, 1, 5470], [3, 2, 8132], [3, 3, 7520], [3, 4, 4048], [3, 5, 4114], [3, 6, 6774], [4, 0, 2082], [4, 1, 2636], [4, 2, 4390], [4, 3, 6355], [4, 4, 4047], [4, 5, 4445], [4, 6, 10018]]}, '24': {'hours': [19, 20, 21, 22, 23, 24, 25], 'days': ['疫情-美国', '疫情-欧洲', '疫情-两会', '新冠-两会', '新冠-无症状'], 'data': [[0, 0, 10141], [0, 1, 12112], [0, 2, 17484], [0, 3, 24687], [0, 4, 11836], [0, 5, 15674], [0, 6, 108887], [1, 0, 7026], [1, 1, 6861], [1, 2, 10898], [1, 3, 16499], [1, 4, 6095], [1, 5, 8331], [1, 6, 74119], [2, 0, 3010], [2, 1, 5045], [2, 2, 7786], [2, 3, 10666], [2, 4, 7044], [2, 5, 7259], [2, 6, 16041], [3, 0, 2082], [3, 1, 2636], [3, 2, 4390], [3, 3, 6355], [3, 4, 4047], [3, 5, 4445], [3, 6, 10018], [4, 0, 5188], [4, 1, 5470], [4, 2, 8132], [4, 3, 7520], [4, 4, 4048], [4, 5, 4114], [4, 6, 6774]]}, '25': {'hours': [19, 20, 21, 22, 23, 24, 25], 'days': ['疫情-美国', '疫情-欧洲', '疫情-经济', '疫情-两会', '新冠-两会'], 'data': [[0, 0, 10141], [0, 1, 12112], [0, 2, 17484], [0, 3, 24687], [0, 4, 11836], [0, 5, 15674], [0, 6, 108887], [1, 0, 7026], [1, 1, 6861], [1, 2, 10898], [1, 3, 16499], [1, 4, 6095], [1, 5, 8331], [1, 6, 74119], [2, 0, 646], [2, 1, 1437], [2, 2, 2531], [2, 3, 3544], [2, 4, 2675], [2, 5, 4091], [2, 6, 24583], [3, 0, 3010], [3, 1, 5045], [3, 2, 7786], [3, 3, 10666], [3, 4, 7044], [3, 5, 7259], [3, 6, 16041], [4, 0, 2082], [4, 1, 2636], [4, 2, 4390], [4, 3, 6355], [4, 4, 4047], [4, 5, 4445], [4, 6, 10018]]}};

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

function whatariver(time_str){

    var source_selected_data=sourcedata[time_str];
    var source_legend=source_selected_data["days"];
    var source_data=source_selected_data["data"];
    var source_date=source_selected_data["hours"];
    var riverdata=[];
    for(var i=0;i<source_data.length;i++){
        let tmp_data=source_data[i];

        let date_inside="2020/05/"+source_date[tmp_data[1]];
        let value_inside=tmp_data[2];
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