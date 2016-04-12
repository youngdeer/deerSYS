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

function editType(){
    alert("编辑类型");
}