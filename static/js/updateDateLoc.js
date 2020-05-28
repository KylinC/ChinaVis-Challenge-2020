/**
 * Update date in left-top chart area.
 * */

const weekArr=['Mon.','Tues.','Wed.','Thur.','Fri.','Sat.','Sun.'];
!(function () {
    // 更新时间
    setInterval(function () {
        let mDate=new Date();

        let mHour=mDate.getHours();
        let mMinute=mDate.getMinutes()<10?'0'+mDate.getMinutes():mDate.getMinutes();
        let mSecond=mDate.getSeconds()<10?'0'+mDate.getSeconds():mDate.getSeconds();
        $("#time").text(mHour+":"+mMinute+":"+mSecond);

        let mYear=mDate.getFullYear();
        let mMonth=mDate.getMonth();
        let mDay=mDate.getDate();
        let mWeek=mDate.getDay();
        let apm=mHour>11?'pm':'am';
        $("#date").text(mYear+'-'+(mMonth+1)+'-'+mDay+' '+apm+' '+weekArr[mWeek]);

    },1000);
    // 更新位置
    $.getJSON('https://ipapi.co/json/', function(data) {
        let city=data['city'];
        let province=data['region'];
    });
})();