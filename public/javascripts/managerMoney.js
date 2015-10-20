/**
 * Created by luyang on 2015/10/19.
 */
$(document).ready(function(){
    $("#time").datepicker({format: 'yyyy-mm-dd'});
});

function deleteById(id){
    var flag = confirm('confirm delete this record?');
    if(flag){
        $.ajax({
            data: {accountId:id},
            url: '/deleteAccount',
            dataType: 'json',
            type:'post',
            success:function(){
                alert('delete success!');
                window.location = '/managerMoney';
            }
        });
    }
}

