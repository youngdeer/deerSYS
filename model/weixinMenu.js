/**
 * Created by luyang on 2016/4/18.
 */

var Weixin = require('../model/weixin.js');
var requestJson = require('request-json');

function WeixinMenu(){

}

module.exports = WeixinMenu;

WeixinMenu.createMenu = function createMenu(){
    var client = requestJson.createClient('https://qyapi.weixin.qq.com/');
    var access_token = Weixin.getAccessToken();
    console.log(Weixin.getAccessToken());
    var data = {
        "button":[
            {
                "type":"click",
                "name":"���ո���",
                "key":"V1001_TODAY_MUSIC"
            },
            {
                "name":"�˵�",
                "sub_button":[
                    {
                        "type":"view",
                        "name":"����",
                        "url":"http://www.soso.com/"
                    },
                    {
                        "type":"click",
                        "name":"��һ������",
                        "key":"V1001_GOOD"
                    }
                ]
            }
        ]
    };
    client.post('cgi-bin/menu/create?access_token='+access_token+'&agentid=1', data, function(err, res, body) {
        return console.log(res.statusCode,body);
    });
}