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
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "H+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
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

window.onload = function(){
    if($('#to').val().trim() != '' && $('#to').val() != 'undefined') {
        $("#mobileNum").val($('#to').val());
    }
    if($('#param').val().trim() != '' && $('#param').val() != 'undefined') {
        var wait=60;
        time();
        function time() {
            if (wait == 0) {
                $("#btn").removeAttr("disabled");
                $("#btn").html("Resend ");
                wait = 60;
            } else {
                $("#btn").attr("disabled", true);
                $("#btn").html("Resend " + wait + " seconds!");
                wait--;
                setTimeout(function() {
                        time()
                    },
                    1000)
            }
        }
    }
    setTimeout("$('#param').val(randomNum(10))", 1800000 );
}


function identifying(){
    var to = $("#to").val();
    var param = $("#param").val();
    var identifyingCode = $("#identifyingCode").val();
    if(identifyingCode.trim() == param.trim()){
        $.ajax({
            data: {username:to,
                   password:to,
                   type:'mobile'},
            url: '/reg',
            dataType: 'json',
            type:'post',
            success:function(data){
                if(data.error){
                    alert(data.error);
                }else{
                    alert('register success!');
                    window.location = '/';
                }
            }
        });
    }else{
        alert('identifyingCode is wrong.');
    }
}