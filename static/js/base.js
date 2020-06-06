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
    // BaseSearch();
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
        let newDateSpl=startV.split("-");
        let mainWindowTimeStr=parseInt(newDateSpl[1])+"月"+parseInt(newDateSpl[2])+"日";

        // 主窗口时间
        document.getElementById("mainwindow-data").innerHTML=mainWindowTimeStr;
        document.getElementById("KGTitle").innerHTML=mainWindowTimeStr+" "+"流量新闻知识图谱";
        document.getElementById("paraTitle").innerHTML=mainWindowTimeStr+" "+"热词日浏览变化";

        // 唤醒para-point
        paraPoint(newDateSpl[2]);
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
paraPoint("25");
whatariver();
emotion();
source();