var myChart = echarts.init(document.getElementById('addKG'),'macarons');
var categories = [{name:"News"},{name:"Mailuo"},{name:"Platform"},{name:"Url"}];
function relationshipGraph(graph) {
    // var categories = [];
    // for(i=0;i<graph.catas.length;i++){
    //   categories[i]={name:graph.catas[i]}
    // }
    // console.log(categories);

    graph.edges.forEach(function (edge) {
        edge.lineStyle = {
            width:2,
            color:"#FFFAFA"
        };
        edge.type = 'dashed';
        edge.label={
            formatter:edge.name,
            position:'middle',
            show:true,
            fontSize:12,
            fontStyle:'italic',
            color:"#D3D3D3"
        };
        edge.effect = {
            show:true,
            period:6,
            symbolSize: 3,
            color:"#fff",
            trailLength: 0.7
        };
    });

    var option = {
        tooltip: {
            formatter: function(param){
                if(param.dataType === 'edge'){
                    return param.data.name;
                }
                else{
                    if(param.data.name != undefined){
                        return param.data.detail;
                    }
                    else{
                        return param.data.title;
                    }
                }

            }
        },
        toolbox: {
            show : true,//是否显示工具箱
            feature : {
                magicType: ['line', 'bar'], // 图表类型切换，当前仅支持直角系下的折线图、柱状图转换，上图icon左数6/7，分别是切换折线图，切换柱形图
                restore: true, // 还原，复位原始图表，
                saveAsImage: true  // 保存为图片，
            }
        },

        legend: [{
            // selectedMode: 'single',
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            textStyle:{color:'#fff'},
            data: categories.map(function (a) {
                return a.name;
            })
        }],
        animation: true,
        series : [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'force',
                data: graph.nodes,
                links: graph.edges,
                edgeSymbol: ['','arrow'],
                edgeSymbolSize: [0,8],
                categories: categories,
                roam: true,
                draggable: true,
                focusNodeAdjacency: true,
                label: {
                    normal: {
                        show:true,
                        formatter: function(params){
                            return params.data.name;
                        }
                    }
                },
                force: {
                    repulsion: 100,
                    friction: 0.2
                }
            }
        ]
    };
    myChart.setOption(option);
}

myChart.on('click', function(params){
    console.log(params);
    if(params.dataType == 'node'){
        if(params.data.label == 'Mailuo'){
            $.ajax({
                type: 'post',
                url: 'http://127.0.0.1:5000/demo2/click',
                data: JSON.stringify([params.data]),
                dataType: "jsonp",
                contentType: "application/json; charset=utf-8",
                success: function (res) {
                    relationshipGraph(res);
                },
                error: function (msg) {
                    console.log(msg);
                }
            });
        }
        if(params.data.label == 'Url'){
            console.log(params);
            window.open(params.data.name);
        }
        
        // console.log(params);
    }
    else{
        console.log(params);
    }
})

window.onresize = function() {
    myChart.resize();
};

function BaseSearch(){
    // var tmp_text = $("#neotext").val()
    keytime="5-25";
    keyword="冠状病毒-感染";
    postdata=[keytime,keyword];

    $.ajax({
        type: 'post',
        url: 'http://127.0.0.1:5000/demo2/KG',
        data: JSON.stringify(postdata),
        dataType: "jsonp",
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            console.log(res);
            relationshipGraph(res);
            
        },
        error: function (msg) {
            console.log(msg);
        }
    });
}