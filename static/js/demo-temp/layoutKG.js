const KGChart = echarts.init(document.getElementById("KG"));

var colorlist=['rgb(198,8,30)','rgb(61,146,153)','rgb(216,104,76)','rgb(31,54,68)','rgb(112,192,156)','rgb(86,145,110)']

//跳转代码
function layoutKG(input_data){
    console.log(input_data);
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
        tooltip: {
            position:"right"
        },
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
            data: input_data
        }]
    }
    
    KGChart.setOption(option);
}

KGChart.on('click', function(params) {
    console.log(params);
    window.open(params.data.url);
});

window.onresize = function() {
    KGChart.resize();
};

function BaseLayout(time_str,area_str){
    // var tmp_text = $("#neotext").val()
    keyword="疫情-null";
    postdata=[time_str,area_str,keyword];

    $.ajax({
        type: 'POST',
        url: '/demo2/layout',
        data: JSON.stringify(postdata),
        dataType: "jsonp",
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            var data_list=res["nodes"];
            var input_data=[];
            for(var i=0;i<data_list.length;i++){
                input_data.push({'name':data_list[i]['name'],'symbolSize':(parseInt(data_list[i]['relevance'])+1)*10,
                "draggable": true,
                "url":data_list[i]['url'],
                "itemStyle": {"normal": { "color": colorlist[i] } }
            })
            }
            layoutKG(input_data);
            
        },
        error: function (msg) {
            console.log(msg);
        }
    });
}