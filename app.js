const data = require("./config.json");
const SignIn = require("./SignIn");


let signIn = new SignIn(data.userInfo.email, data.userInfo.password, "", data.host, data.loginPath, data.signInPath);


Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

signIn.createTokenPromise()
    .then(function(data) {
        // 设置获得的token值
        signIn.setToken(data);
    }, (err) => {
        console.log(err)
    })
    .then(function() {
        // 开始登录
        signIn.createLoginPromise()
            .then(function(data) {
                console.log(new Date().Format("yyyy-MM-dd hh:mm:ss"));
                console.log("用户 " + signIn.getUserEmail() + " 登录成功，签到中...");
                signIn.getMark(data);
            }, function() {
                console.log("用户 " + signIn.getUserEmail() + " 登录失败")
            });
    })