const parapointChart = echarts.init(document.getElementById("para-point"));

var hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22','23','24'];
var days = ['疫苗', '两会', '新冠', '开学',
        '无症状'];

var data = [[0, 0, 243], [0, 1, 54], [0, 2, 263], [0, 3, 298], [0, 4, 187], [0, 5, 235], [0, 6, 476], [0, 7, 145], [0, 8, 72], [0, 9, 111], [0, 10, 49], [0, 11, 24], [0, 12, 57], [0, 13, 34], [0, 14, 20], [0, 15, 84], [0, 16, 54], [0, 17, 31], [0, 18, 70], [0, 19, 53], [0, 20, 101],
[1, 0, 4], [1, 1, 16], [1, 2, 11], [1, 3, 20], [1, 4, 20], [1, 5, 6], [1, 6, 15], [1, 7, 4], [1, 8, 9], [1, 9, 13], [1, 10, 3], [1, 11, 2], [1, 12, 4], [1, 13, 1], [1, 14, 5], [1, 15, 67], [1, 16, 59], [1, 17, 51], [1, 18, 84], [1, 19, 59], [1, 20, 35],
[2, 0, 197], [2, 1, 303], [2, 2, 360], [2, 3, 383], [2, 4, 312], [2, 5, 298], [2, 6, 402], [2, 7, 73], [2, 8, 45], [2, 9, 62], [2, 10, 59], [2, 11, 131], [2, 12, 60], [2, 13, 15], [2, 14, 22], [2, 15, 41], [2, 16, 29], [2, 17, 11], [2, 18, 22], [2, 19, 16], [2, 20, 21],
[3, 0, 3], [3, 1, 9], [3, 2, 2], [3, 3, 8], [3, 4, 12], [3, 5, 3], [3, 6, 4], [3, 7, 1], [3, 8, 5], [3, 9, 3], [3, 10, 3], [3, 11, 2], [3, 12, 1], [3, 13, 0], [3, 14, 27], [3, 15, 247], [3, 16, 225], [3, 17, 228], [3, 18, 290], [3, 19, 176], [3, 20, 221],
[4, 0, 0], [4, 1, 0], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 0], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 0], [4, 10, 4], [4, 11, 112], [4, 12, 370], [4, 13, 102], [4, 14, 98], [4, 15, 3], [4, 16, 4], [4, 17, 1], [4, 18, 4], [4, 19, 3], [4, 20, 2],
];

option = {
    tooltip: {
        position: 'top'
    },
    title: [],
    singleAxis: [],
    series: [],
    grid: {
        left: '0%',
        right: '45%',
        top: '70%',
        bottom: 10
    },
};

days.forEach(function (day, idx, arr) {
    option.title.push({
        textBaseline: 'middle',
        top: (idx + 1.2) * 150 / 10 + '%',
        text: day,
        textStyle: {
            fontSize: 13,
            color: 'rgba(255,255,255, 0.9)'
        }
    });
    option.singleAxis.push({
        left: 60,
        type: 'category',
        boundaryGap: false,
        data: hours,
        top: (idx + 1.2) * 150 / 10 + '%',
        height: (100 / 10 - 10) + '%',
        axisLabel: {
            interval: 2
        },
        axisLine : {
        lineStyle : {
            color : '#fff'
        }
    },
    });
    option.series.push({
        singleAxisIndex: idx,
        coordinateSystem: 'singleAxis',
        type: 'scatter',
        data: [],
        symbolSize: function (dataItem) {
            return dataItem[1] * 0.18;
        }
    });
});

data.forEach(function (dataItem, idx, arr) {
    option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
});

parapointChart.setOption(option);

window.onresize = function() {
    parapointChart.resize();
};