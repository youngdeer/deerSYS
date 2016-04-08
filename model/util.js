/**
 * Created by luyang on 2016/4/8.
 */

function Util(){

}

module.exports = Util;

Util.randomNum = function randomNum(n){
    var t='';
    for(var i=0;i<n;i++){
        t+=Math.floor(Math.random()*10);
    }
    return t;
}