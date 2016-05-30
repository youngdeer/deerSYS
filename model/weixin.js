/**
 * Created by luyang on 2015/11/12.
 */
var request = require('request');
var requestJson = require('request-json');
var WXBizMsgCrypt = require('wechat-enterprise').WXBizMsgCrypt;
var parseString = require('xml2js').parseString;
var TextAutoReply = require('../model/textAutoReply.js');
var Util = require('../model/util.js');
var Account = require('../model/account.js');

var Token = 'pjvGsTj2sNXio9QVTb2N3fB';
var EncodingAESKey = 't9aW3yr01xAadCel5OaNSOBsCckeBrTwjT3Eft314xr';
var id = 'wxf86bb1cbf7a5b02f';
var secret = 'AUp5EqMpAVlqN23JESKFdc1UoxFUa2yUBPgcTlFNS7wcaH-ualuKNlr8QP20RV75';
var wxBizMsgCrypt = new WXBizMsgCrypt(Token,EncodingAESKey,id);

function Weixin(){

}

module.exports = Weixin;

Weixin.getAccessToken = function getAccessToken(callback){
    request.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid='+id+'&corpsecret='+secret+'', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) ;
            //console.log(JSON.parse(body).access_token) ;
            var access_token = JSON.parse(body).access_token;
            callback(access_token);
        }
    });
}

Weixin.get = function get(req,res,callback){
    console.log(req.query);
    var echostr = req.query.echostr;
    var result = wxBizMsgCrypt.decrypt(echostr);
    console.log(result);
    res.writeHead(200,{"Content-Type":"text/json"});
    res.write(result.message);
    res.end();
    callback();
}

Weixin.post = function post(req,res,callback){
    //console.log(req.query);
    processMsg(req,res);
    callback();
}

/*
*消息回复
 */
function processMsg(req,res){
    var postData = '';
    req.on('data',function(chunk){
        postData += chunk;
    });

    req.on('end',function(){
        //console.log('Accept Data: '+postData);
        var syntonyData = parseSyntonyData(postData);
        //console.log(syntonyData);
        var msgType = syntonyData.xml.MsgType;
        console.log(msgType);
        switch (msgType){
            case 'text' :
                //处理文本消息
                sendTextMsg(syntonyData,res)
                break;
            default :
        }
    });
}

/*
*处理微信回调数据
 */
function parseSyntonyData(postData){
    var syntonyData = {};
    parseString(postData,{explicitArray: false},function(err,result){
        if(err){
            console.error(err);
            return;
        }
        //console.dir(result);
        var realMsg = wxBizMsgCrypt.decrypt(result.xml.Encrypt);
        //console.log(realMsg);
        parseString(realMsg.message,{explicitArray: false},function(err,result){
            if(err){
                console.error(err);
                return;
            }
            //console.dir(result);
            syntonyData = result;
        });
    });

    return syntonyData;
}

/*
*发送文本消息
 <xml>
 <ToUserName><![CDATA[toUser]]></ToUserName>
 <FromUserName><![CDATA[fromUser]]></FromUserName>
 <CreateTime>1348831860</CreateTime>
 <MsgType><![CDATA[text]]></MsgType>
 <Content><![CDATA[this is a test]]></Content>
 </xml>
 */
function sendTextMsg(syntonyData,res){
    var text = TextAutoReply.catchText(syntonyData.xml.Content);
    var sendMsg = '<xml>'+
    '<ToUserName><![CDATA['+syntonyData.xml.FromUserName+']]></ToUserName>'+
    '<FromUserName><![CDATA[wxf86bb1cbf7a5b02f]]></FromUserName>'+
    '<CreateTime>'+Date.now()+'</CreateTime>'+
    '<MsgType><![CDATA[text]]></MsgType>'+
    '<Content><![CDATA['+text+']]></Content>'+
    '</xml>';
    console.log(sendMsg);
    var msg_encrypt = wxBizMsgCrypt.encrypt(sendMsg);
    var timestamp = Date.now();
    var nonce = Util.randomNum(10);
    //console.log(timestamp+'|||'+nonce);
    var msg_signature = wxBizMsgCrypt.getSignature(timestamp,nonce,msg_encrypt);
    //console.log(msg_encrypt);
    var xml = '<xml>'+
    '<Encrypt><![CDATA['+msg_encrypt+']]></Encrypt>'+
    '<MsgSignature><![CDATA['+msg_signature+']]></MsgSignature>'+
    '<TimeStamp>'+timestamp+'</TimeStamp>'+
    '<Nonce><![CDATA['+nonce+']]></Nonce>'+
    '</xml>';
    //console.log(xml);
    res.send(xml);
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

Weixin.sendTotalCost = function sendTotalCost(context){
    var client = requestJson.createClient('https://qyapi.weixin.qq.com/');
    var data = {
        "touser": "youngdeer",
        "toparty": "",
        "totag": "",
        "msgtype": "text",
        "agentid": 1,
        "text": {
            "content": "totalCost: "+context
        },
        "safe":"0"
    }
    Weixin.getAccessToken(function (access_token) {
        client.post('cgi-bin/message/send?access_token='+access_token, data, function(err, res, body) {
            return console.log(res.statusCode,body);
        });
    });
}