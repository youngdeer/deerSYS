/**
 * Created by youngdeer on 2016/10/20.
 */
/**
 * 页面加载结束后执行方法
 */
$(document).ready(function(){
    //初始化问题列表，状态下拉框的值
    $("#questionMonitorList").find("tr").each(function(index,item){
        var statusShow =  $(item).find("#statusShow").html();
        $(item).find("#StatusSelect option[value='"+statusShow+"']").attr("selected","selected");
    });
});


/**
 * 问题记录保存
 */
function saveQm(){
    var postdata = $('#QmForm').serialize()
    $.ajax({
        data: postdata,
        url: '/DeerWork/saveQm',
        dataType: 'json',
        type:'post',
        success:function(data){
            if(data.error){
                alert(data.error);
            }else{
                alert(data.success);
                window.location = '/DeerWork/questionMonitor';
            }
        }
    });
}

/**
 * 问题状态更改
 */
function updateStatus(id,obj){
    var status = $(obj).parent().parent().find('#StatusSelect').val();
    $.ajax({
        data: {
            id:id,
            status:status
        },
        url: '/DeerWork/updateStatus',
        dataType: 'json',
        type:'post',
        success:function(data){
            if(data.error){
                alert(data.error);
            }else{
                alert(data.success);
                window.location = '/DeerWork/questionMonitor';
            }
        }
    });
}

/**
 * 问题记录删除
 */
function deleteQm(id){
    var flag = confirm('是否确认删除?');
    if(flag){
        $.ajax({
            data: {id:id},
            url: '/DeerWork/deleteById',
            dataType: 'json',
            type:'post',
            success:function(data){
                if(data.error){
                    alert(data.error);
                }else{
                    alert(data.success);
                    window.location = '/DeerWork/questionMonitor';
                }
            }
        });
    }
}

/**
 * 问题详情查看
 */
function viewDetail(id){
    $.ajax({
        data: {id:id},
        url: '/DeerWork/getQmById',
        dataType: 'json',
        type:'post',
        success:function(data){
            if(data.error){
                alert(data.error);
            }else{
                setFromValue(data.questionMonitors[0]);
                $("html,body").animate({scrollTop:0}, 500);
            }
        }
    });
}

/**
 * form赋值
 */
function setFromValue(questionMonitors){
    $("#module").val(questionMonitors.module);
    $("#simpleDesc").val(questionMonitors.simpleDesc);
    $("#priority").val(questionMonitors.priority);
    $("#startTime").val(questionMonitors.startTime);
    $("#dealTime").val(questionMonitors.dealTime);
    $("#mark").val(questionMonitors.mark);
    $("#description").val(questionMonitors.description);
    $("#status").val(questionMonitors.status);
    $("#id").val(questionMonitors.id);
}
