/**
 * Created by luyang on 2015/10/19.
 */
$(document).ready(function(){
    $("#time").datepicker({format: 'yyyy-mm-dd'});
});

function deleteById(id){
    var flag = confirm('是否确认删除?');
    if(flag){
        $.ajax({
            data: {accountId:id},
            url: '/deleteAccount',
            dataType: 'json',
            type:'post',
            success:function(data){
                if(data.error){
                    alert(data.error);
                }else{
                    alert('删除成功!');
                    window.location = '/managerMoney';
                }
            }
        });
    }
}

function beforeSearch(){
    $("#isSearch").val('yes');
}

function refresh(){
    window.location = '/managerMoney';
}

/**
 * 编辑用途
 * luy
 */
function editType(){
    $.ajax({
        data: {},
        url: '/getUseType',
        dataType: 'json',
        type:'get',
        success:function(data){
            if(data.error){
                alert(data.error);
            }else{
                $("#typeList").html("");
                $.each(data,function(index,item){
                    renderTypeLIst(item);
                });
                $("#editTypeModal").modal();
            }
        }
    });
}

/**
 * 拼装用途列表
 * luy
 */
function renderTypeLIst(data){
    var trStr = "";
    trStr += "<tr>";
    trStr += "<td>"+data.useType+"</td>";
    trStr += "<td><a href='javascript:void(0)' onclick='deleteType(\""+data.id+"\")'>删除</a></td>";
    trStr += "</tr>";
    $("#typeList").append(trStr);
}

/**
 * 增加用途
 * luy
 */
function addType(){
    var type = $("#editType").val();
    $.ajax({
        data: {type:type},
        url: '/addType',
        dataType: 'json',
        type:'post',
        success:function(data){
            if(data.error){
                alert(data.error);
            }else{
                $.ajax({
                    data: {},
                    url: '/getUseType',
                    dataType: 'json',
                    type:'get',
                    success:function(data){
                        if(data.error){
                            alert(data.error);
                        }else{
                            $("#typeList").html("");
                            $.each(data,function(index,item){
                                renderTypeLIst(item);
                            });
                        }
                    }
                });
                $("#editType").val('');
            }
        }
    });
}