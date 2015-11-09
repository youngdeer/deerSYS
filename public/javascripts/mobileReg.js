/**
 * Created by luyang on 2015/11/6.
 */
function getIdentifyingCode(){
    var mobileNum  = $("#mobileNum").val().trim();
    if(mobileNum == '' || mobileNum == null){
        alert("please entry mobile number!");
        return false;
    }
    $("#to").val(mobileNum);
    $("#param").val(randomNum(6));
    $("#timestamp").val(new Date().Format("yyyyMMddHHmmss"));
    $("#sig").val(getSig());
    $("#identifyingCode").submit();
}

function randomNum(n){
    var t='';
    for(var i=0;i<n;i++){
        t+=Math.floor(Math.random()*10);
    }
    return t;
}

Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //�·�
        "d+" : this.getDate(),                    //��
        "H+" : this.getHours(),                   //Сʱ
        "m+" : this.getMinutes(),                 //��
        "s+" : this.getSeconds(),                 //��
        "q+" : Math.floor((this.getMonth()+3)/3), //����
        "S"  : this.getMilliseconds()             //����
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

function getSig(){
    var str = "7144845b85074746885531f61b1409bc95a9694fe9cb40dd8fc69916ee845d95"+$("#timestamp").val();
    return $.md5(str);
}