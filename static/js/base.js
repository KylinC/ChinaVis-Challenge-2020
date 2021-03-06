var selected_global; // 是stream图有动态变化效果共享的全局变量
var selected_time="25";  // 共享的时间选择变量

$('#close-pop1').on('click', function () {
    $(this).parent().parent().hide().find('.cont-div').attr('style', 'visibility: hidden');
})

$('#setBtn').on('click', function () {
    $('.container').attr('style', 'visibility: visible').find('#pop-up1').attr('style', 'visibility: visible').siblings().attr('style', 'visibility: hidden');
    BaseSearch();
})

$('#close-pop2').on('click', function () {
    $(this).parent().parent().hide().find('.cont-div').attr('style', 'visibility: hidden');
})

$('#setBtn2').on('click', function () {
    $('.container').attr('style', 'visibility: visible').find('#pop-up2').attr('style', 'visibility: visible').siblings().attr('style', 'visibility: hidden');
    riveroption.legend.selected = selected_global;
    console.log(selected_global);
    riverChart.setOption(riveroption);
})

$('#dateBtn').on('click', function () {
    if ($('#timeBox').is(":hidden")) {
        $('#timeBox').show();
        document.getElementById('timeBox').focus();

    } else {
        $('#timeBox').hide();
    }
})

//时间选择器
var startV = '';
var endV = '';
laydate.skin('danlan');
var startTime = {
    elem: '#startTime',
    format: 'YYYY-MM-DD',
    min: '2020-05-11', //设定最小日期为当前日期
    max: laydate.now(), //最大日期
    istime: true,
    istoday: true,
    fixed: false,
    choose: function (datas) {
        startV = datas;
    
        // 重置逻辑
        sizeFunction = all_func;

        let newDateSpl=startV.split("-");
        let mainWindowTimeStr=parseInt(newDateSpl[1])+"月"+parseInt(newDateSpl[2])+"日";

        // 主窗口时间
        document.getElementById("mainwindow-data").innerHTML=mainWindowTimeStr;
        document.getElementById("KGTitle").innerHTML=mainWindowTimeStr+" "+"流量新闻知识图谱";
        document.getElementById("paraTitle").innerHTML=mainWindowTimeStr+" "+"热词日浏览变化";
        document.getElementById("siteTitle").innerHTML=mainWindowTimeStr+" "+"舆论站点分布趋势";
        document.getElementById("emotionTitle").innerHTML=mainWindowTimeStr+" "+"一周舆论情感趋势";

        // 唤醒para-point
        selected_time=newDateSpl[2];
        call_paraPoint(newDateSpl[2],"全国");
        selected_global=call_whatariver(newDateSpl[2],"全国");
        call_source(newDateSpl[2],"全国");
        call_emotion(newDateSpl[2],"全国");
        BaseLayout(newDateSpl[2],"全国");
    }
};

laydate(startTime);

//点击时间选择器的时候更改样式
$('#endTime').on('click', function () {
    dateCss();
})

$('#end').on('click', function () {
    dateCss();
})


//更改日期插件的样式
function dateCss() {
    var arr = $('#laydate_box').attr('style').split(';');
    var cssStr =
        'position:absolute;right:0;';
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].indexOf('top') != -1) {
            cssStr += arr[i];
        }
    }

    $('#laydate_box').attr('style', cssStr);
}

// 初始化渲染
document.getElementById("startTime").value="2020-05-25";
call_paraPoint("25","全国");
selected_global=call_whatariver("25","全国");
console.log(selected_global);
call_emotion("25","全国");
call_source("25","全国");

BaseLayout("25","全国")