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
    var data = {
        "button":[
            {
                "type":"view",
                "name":"deerSYS",
                "url":"http://youngdeer.top/"
            },
            {
                "name":"测试2",
                "sub_button":[
                    {
                        "type":"view",
                        "name":"子1",
                        "url":"http://www.soso.com/"
                    },
                    {
                        "type":"click",
                        "name":"获取总开销",
                        "key":"V1001_GETTOTAL"
                    }
                ]
            },
            {
                "type":"view",
                "name":"getTotalCost",
                "url":"http://youngdeer.top/sendTotalCost"
            }
        ]
    }
    Weixin.getAccessToken(function (access_token) {
        client.post('cgi-bin/menu/create?access_token='+access_token+'&agentid=1', data, function(err, res, body) {
            return console.log(res.statusCode,body);
        });
    });
}