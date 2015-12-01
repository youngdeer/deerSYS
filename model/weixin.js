/**
 * Created by luyang on 2015/11/12.
 */
var request = require('request');
var requestJson = require('request-json');
var WXBizMsgCrypt = require('wechat-enterprise').WXBizMsgCrypt;

function Weixin(){

}

module.exports = Weixin;

Weixin.getAccessToken = function getAccessToken(){
    var id ='wxf86bb1cbf7a5b02f';
    var secret = 'AUp5EqMpAVlqN23JESKFdc1UoxFUa2yUBPgcTlFNS7wcaH-ualuKNlr8QP20RV75';
    request.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid='+id+'&corpsecret='+secret+'', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) ;
        }
    })
}

Weixin.get = function get(req,res,callback){
    var Token = 'pjvGsTj2sNXio9QVTb2N3fB';
    var EncodingAESKey = 't9aW3yr01xAadCel5OaNSOBsCckeBrTwjT3Eft314xr';
    var id = 'wxf86bb1cbf7a5b02f';
    var wxBizMsgCrypt = new WXBizMsgCrypt(Token,EncodingAESKey,id);
    console.log(req.query);
    var echostr = req.query.echostr;
    var result = wxBizMsgCrypt.decrypt(echostr);
    console.log(result);
    res.writeHead(200,{"Content-Type":"text/json"});
    res.write(result.message);
    res.end();
    callback();
}

Weixin.getMedia = function getMedia(){
    var client = requestJson.createClient('https://api.weixin.qq.com/');
    var data = {
        type: "video",
        offset: 0,
        count: 20
    };
    client.post('cgi-bin/material/batchget_material?access_token=6QWLCF4Jb2UPHcOUyq8VDdp4aFx_uPbIoHeCYMQd5hSC_OQgoRL036OxZrCPVXWT3nxd7tnVPy6Vg9jkZTJbsDx3TCev781qFI_DwU5KRjcAOWiAIAHVD', data, function(err, res, body) {
        return console.log(res.statusCode,body);
    });
}