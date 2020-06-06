const sourceChart = echarts.init(document.getElementById("source"));

function source(){
    option = {
        color: ['#1da1f2', '#fa7070', '#fcbb07', '#90dd75', '#8fa6ec', '#157efb'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            itemWidth: 20, //图例的宽度
            itemHeight: 8, //图例的高度
            itemGap: 40,
            left: '55',
            top: 'top',
            icon: 'rect',
            selectedMode: true, //取消图例上的点击事件
            data: ['微博', '朋友圈', '论坛', '搜索', 'APP','其他'],
        },
        grid: {
            left: '30',
            right: '30',
            bottom: '100',
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
            data: ['1月', '2月', '3月', '4月', '5月'],
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
        series: [
            {
                name: '微博',
                type: 'bar',
                barWidth: 12,// 柱形的宽度
                barGap: 0,
                data: [320, 332, 301, 334, 390]
            },
            {
                name: '朋友圈', 
                type: 'bar',
                barWidth: 12,// 柱形的宽度
                barGap: 0,
                data: [220, 182, 191, 234, 290]
            },
            {
                name: '论坛', 
                type: 'bar',
                barWidth: 12,// 柱形的宽度
                barGap: 0,
                data: [150, 232, 201, 154, 190]
            },
            {
                name: '搜索', 
                type: 'bar',
                barWidth: 12,// 柱形的宽度
                barGap: 0,
                data: [98, 77, 101, 99, 40]
            },
            {
                name: 'APP',
                type: 'bar',
                barWidth: 12,// 柱形的宽度
                barGap: 0,
                data: [98, 77, 101, 99, 40]
            },
            {
                name: '其他',
                type: 'bar',
                barWidth: 12,// 柱形的宽度
                barGap: 0,
                data: [98, 77, 101, 99, 40]
            },
            {
                type:'line',
                data:[666,333,234,56],
                symbol:'circle',
                symbolSize:'5',
                name: '总计',
            }
        ]
    }
    sourceChart.setOption(option);
}

window.onresize = function() {
    sourceChart.resize();
};