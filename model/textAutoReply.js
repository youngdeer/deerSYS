/**
 * Created by luyang on 2016/4/8.
 */
function TextAutoReply(){

}

module.exports = TextAutoReply;

TextAutoReply.catchText = function catchText(text){
    var reply = '';
    if(text == '煞笔'){
        reply = '煞笔叫谁？';
    }else if(text == '我漂亮么'){
        reply = '你最漂亮了！';
    }else if(text == '下雨了'){
        reply = '你这么丑快去收衣服！';
    }else{
        reply = 'you say what？';
    }
    return reply;
}