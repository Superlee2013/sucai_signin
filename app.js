const data = require("./config.json");
const SignIn = require("./SignIn");


let signIn = new SignIn(data.userInfo.email, data.userInfo.password, "", data.host, data.loginPath, data.signInPath);


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
                console.log("用户 " + signIn.getUserEmail() + " 登录成功，签到中...");
                signIn.getMark(data);
            }, function() {
                console.log("用户 " + signIn.getUserEmail() + " 登录失败")
            });
    })