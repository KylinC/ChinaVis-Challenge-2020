const sourceChart = echarts.init(document.getElementById("source"));

var raw_data = {'02': {'legend': [], 'value': []}, '03': {'legend': [], 'value': []}, '04': {'legend': [], 'value': []}, '05': {'legend': [], 'value': []}, '06': {'legend': [], 'value': []}, '07': {'legend': ['新浪娱乐电影', '东方网', '新浪财经', '新浪科技', '搜狐', '天天快报'], 'value': [140, 11, 8, 6, 6, 6]}, '08': {'legend': ['新浪娱乐电影', '腾讯网', '东方网', '搜狐', '天天快报', '知乎'], 'value': [141, 23, 23, 19, 18, 8]}, '09': {'legend': ['东方网', '新浪娱乐电影', '天天快报', '腾讯网', '知乎', '中国煤炭新闻网'], 'value': [81, 74, 32, 19, 14, 13]}, '10': {'legend': ['东方网', '新浪娱乐电影', '腾讯网', '知乎', '搜狐', '天天快报'], 'value': [87, 55, 20, 17, 16, 15]}, '11': {'legend': ['新浪娱乐电影', '新浪微博', '东方网', '腾讯网', '新浪搜索', '百度百家号'], 'value': [199, 128, 22, 17, 15, 14]}, '12': {'legend': ['新浪娱乐电影', '搜狐', '百度百家号', '腾讯网', '东方网', '新浪搜索'], 'value': [615, 89, 65, 59, 58, 52]}, '13': {'legend': ['新浪娱乐电影', '搜狐', '新浪搜索', '中国煤炭新闻网', '新浪微博', '腾讯网'], 'value': [753, 134, 126, 110, 109, 94]}, '14': {'legend': ['新浪娱乐电影', '新浪搜索', '腾讯网', '搜狐', '中国煤炭新闻网', '新浪微博'], 'value': [823, 194, 167, 131, 126, 80]}, '15': {'legend': ['新浪娱乐电影', '搜狐', '中国煤炭新闻网', '微信', '新浪搜索', '52KD论坛'], 'value': [1360, 239, 203, 176, 169, 121]}, '16': {'legend': ['52KD论坛', '新浪娱乐电影', '搜狐', '中国煤炭新闻网', '新浪搜索', '微信'], 'value': [1101, 993, 296, 263, 148, 130]}, '17': {'legend': ['52KD论坛', '新浪娱乐电影', '中国煤炭新闻网', '新浪搜索', '搜狐', '百度百家号'], 'value': [1040, 959, 406, 245, 188, 153]}, '18': {'legend': ['新浪娱乐电影', '中国煤炭新闻网', '百度百家号', '搜狐', '知乎专栏', '微信'], 'value': [1003, 400, 241, 237, 214, 209]}, '19': {'legend': ['新浪娱乐电影', '中国煤炭新闻网', '百度百家号', '澳门日报', '新浪财经', '搜狐'], 'value': [1355, 408, 295, 251, 225, 217]}, '20': {'legend': ['中国煤炭新闻网', '新浪娱乐电影', '澳门日报', '百度百家号', '新浪财经', '知乎专栏'], 'value': [1163, 862, 623, 288, 223, 166]}, '21': {'legend': ['中国煤炭新闻网', '新浪娱乐电影', '52KD论坛', '新浪财经', '澳门日报', '一点资讯'], 'value': [2762, 1050, 338, 276, 234, 139]}, '22': {'legend': ['中国煤炭新闻网', '新浪娱乐电影', '澳门日报', '52KD论坛', '搜狐', '36氪'], 'value': [3240, 492, 431, 347, 219, 203]}, '23': {'legend': ['中国煤炭新闻网', '澳门日报', '36氪', '新浪娱乐电影', '淄博新闻网', '搜狐'], 'value': [1789, 762, 628, 420, 281, 257]}, '24': {'legend': ['中国煤炭新闻网', '36氪', '澳门日报', '爱思想', '百度百家号', '中国西藏新闻网'], 'value': [1696, 966, 633, 400, 281, 256]}, '25': {'legend': ['中国煤炭新闻网', '澳门日报', '新浪娱乐电影', '搜狐号', '百度百家号', '爱思想'], 'value': [1775, 752, 365, 338, 332, 297]}};

function source(time_str){

    var source_data=raw_data[time_str];
    var legend_data=source_data["legend"];
    var source_value=source_data["value"];
    var series_data=[];

    for(var i=0;i<legend_data.length;i++){
        series_data.push(
            {
                name: legend_data[i],
                type: 'bar',
                barWidth: 30,// 柱形的宽度
                barGap: 0.5,
                data: [source_value[i]]
            }
        )
    }

    date_str="05-"+time_str;

    console.log(legend_data);
    console.log(series_data);

    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            textStyle: {
                color: '#ddd'
                },
            itemWidth: 20, //图例的宽度
            itemHeight: 8, //图例的高度
            itemGap: 5,
            left: '25',
            top: 'top',
            icon: 'rect',
            selectedMode: true, //取消图例上的点击事件
            data: legend_data,
        },
        grid: {
            left: '10',
            right: '10',
            bottom: '90',
            containLabel: true
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
        },
        calculable: true,
        xAxis: [{
            splitLine: {
                show: false
            }, //去除网格线
            splitArea: {
                show: false
            }, //保留网格区域
            axisLine: {
                show: true,
                lineStyle: { //轴上的线样式
                    color: '#979797',
                    width: 0.6, //这里是为了突出显示加上的
                },
            },
            axisTick: {
                show: false
            },
            axisLabel: { //轴上的数据样式
                color: '#bbb',
            },
            data: [date_str],
        }],
        yAxis: [{
            // type: 'value',
            splitLine: {
                show: false
            }, //去除网格线
            splitArea: {
                show: false
            }, //保留网格区域
            axisLine: {
                show: true,
                lineStyle: { //轴上的线样式
                    color: '#979797',
                    width: 0.6, //这里是为了突出显示加上的
                },
            },
            axisTick: {
                show: false
            },
            axisLabel: { //轴上的数据样式
                color: '#bbb',
            }
        }],
        series: series_data
    }
    sourceChart.setOption(option);
}

window.onresize = function() {
    sourceChart.resize();
};