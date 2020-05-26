/**
 * toolfunction used to simplify function call.
 * Date: 2020-5-21
 */

const dayStep=86400000;
 /* 比例尺 */
function myScale(number,arr){
    if(number>=arr[0]&&number<arr[1]){
        return 0.0;
    }else if(number>=arr[1]&&number<arr[2]){
        return 0.1;
    }else if(number>=arr[2]&&number<arr[3]){
        return 0.2;
    }else if(number>=arr[3]&&number<arr[4]){
        return 0.3;
    }else if(number>=arr[4]&&number<arr[5]){
        return 0.4;
    }else if(number>=arr[5]&&number<arr[6]){
        return 0.5;
    }else if(number>=arr[6]&&number<arr[7]){
        return 0.6;
    }else if(number>=arr[7]&&number<arr[8]){
        return 0.7;
    }else if(number>=arr[8]&&number<arr[9]){
        return 0.8;
    }else{
        return 0.9;
    }
}

/** 获取两个日期之间所有日期 */
function getEachDay(startDate,endDate){
    let eachDayArr=[];
    let start=new Date(startDate);
    let end=new Date(endDate);

    let startSeconds=start.getTime();
    let endSeconds=end.getTime();
    for(;startSeconds<endSeconds;startSeconds+=dayStep){
        let tempDate=new Date(startSeconds);
        let dateStr=tempDate.getFullYear()+'-'+(tempDate.getMonth() + 1) + '-' + tempDate.getDate();
        eachDayArr.push(dateStr);
    }
    return eachDayArr;
}

/** 获取省份简称 */
function getProvinceAbbr(provinceName){
    if((/黑龙/).test(provinceName)||(/内蒙/).test(provinceName)){
        provinceName=provinceName.slice(0,3);
    }else{
        provinceName=provinceName.slice(0,2);
    }
    return provinceName;
}