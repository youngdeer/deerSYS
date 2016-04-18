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
                "name":"今日歌曲",
                "key":"V1001_TODAY_MUSIC"
            },
            {
                "name":"菜单",
                "sub_button":[
                    {
                        "type":"view",
                        "name":"搜索",
                        "url":"http://www.soso.com/"
                    },
                    {
                        "type":"click",
                        "name":"赞一下我们",
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