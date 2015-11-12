/**
 * Created by luyang on 2015/11/12.
 */
var request = require('request');

function Weixin(){

}

module.exports = Weixin;

Weixin.getAccessToken = function getAccessToken(callback){
    var id ='wxf86bb1cbf7a5b02f';
    var secret = 'AUp5EqMpAVlqN23JESKFdc1UoxFUa2yUBPgcTlFNS7wcaH-ualuKNlr8QP20RV75';
    request.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid='+id+'&corpsecret='+secret+'', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) ;
            callback();
        }
    })
}
