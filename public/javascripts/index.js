/**
 * Created by youngdeer on 2016/8/9.
 */

function deletePost(id){
    var flag = confirm('是否确认删除?');
    if(flag){
        $.ajax({
            data: {postId:id},
            url: '/deletePost',
            dataType: 'json',
            type:'post',
            success:function(data){
                if(data.error){
                    alert(data.error);
                }else{
                    alert('删除成功!');
                    window.location = '/';
                }
            }
        });
    }
}
