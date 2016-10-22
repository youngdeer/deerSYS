/**
 * Created by youngdeer on 2016/10/20.
 */

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
            }
        }
    });
}
