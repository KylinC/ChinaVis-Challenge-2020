const KGChart = echarts.init(document.getElementById("addKG"));

//跳转代码
KGChart.on('click', function(params) {
    console.log(params.name);
    window.open(params.data.url);
    // window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.value));
});

var colorList = [[
    '#111111', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
    '#1e90ff', '#ff6347', '#7b68ee', '#d0648a', '#ffd700',
    '#6b8e23', '#4ea397', '#3cb371', '#b8860b', '#7bd9a5'
    ],
    [
    '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
    '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
    '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
    ],
    [
    '#929fff', '#9de0ff', '#ffa897', '#af87fe', '#7dc3fe',
    '#bb60b2', '#433e7c', '#f47a75', '#009db2', '#024b51', 
    '#0780cf', '#765005', '#e75840', '#26ccd8', '#3685fe', 
    '#9977ef', '#f5616f', '#f7b13f', '#f9e264', '#50c48f'
    ]][2];

option = {
    title: {
    },
    tooltip: {},
    animationDurationUpdate: function(idx) {
        return idx * 1100;
    },
    animationEasingUpdate: 'bounceIn',
    color: ['#fff', '#fff', '#fff'],
    series: [{
        type: 'graph',
        layout: 'force',
        force: {
            repulsion: 250,
            edgeLength: 10
        },
        roam: true,
        label: {
            normal: {
                show: true
            }
        },
        data: [
        {"name": "吉林市断链病例找到传染源", "value": 1751491, "symbolSize": 60, "draggable": true, "itemStyle": {"normal": { "color": "rgb(252,0,6)" } } },
        {"name": "印度新冠肺炎确诊病例升至17265例", "value": 1524287, "symbolSize": 40, "draggable": true, "itemStyle": {"normal": { "color": "rgb(252,84,5)" } } },
        {"name": "5月19日湖南新冠肺炎确诊病例0例无症状感染者0例", "value": 1435649, "symbolSize": 33, "draggable": true, "itemStyle": {"normal": { "color": "rgb(253,204,10)"} } },
        {"name": "吉林省新型冠状病毒核酸检测机构名单", "value": 1301903, "symbolSize": 31, "draggable": true, "itemStyle": {"normal": { "color": "rgb(203,236,72)" } } },
        {"name": "阳城县新型冠状病毒肺炎疫情通报", "value": 1150224, "symbolSize": 30, "draggable": true, "itemStyle": {"normal": { "color": "rgb(123,197,234)" } } },
            ]
    }]
}

KGChart.setOption(option);

window.onresize = function() {
    KGChart.resize();
};