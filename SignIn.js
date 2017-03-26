var http = require('http');
var crypto = require('crypto');
var request = require('request');
var request = request.defaults({
    jar: true
})

class SignIn {
    constructor(email, password, token, host, loginPath, signInPath) {
        this.email = email;
        this.password = password;
        this.token = token;
        this.host = host;
        this.loginPath = loginPath;
        this.signInPath = signInPath;
    }

    setToken(token) {
        this.token = token;
    }

    getUserEmail() {
        return this.email;
    }

    // 创建获取token的promise对象
    createTokenPromise() {
        var that = this;
        return new Promise(function(resolve, reject) {
            http.get(that.host, function(res) {
                let pageData = "";
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    pageData += chunk;
                })

                res.on('end', function() {
                    var reg = /.*var.*token.*=.*'(.+)'.*/;
                    var result = reg.exec(pageData.toString());
                    if (result[1]) {
                        // that.token = result[1];
                        resolve(result[1]);
                    } else {
                        reject(new Error("网络错误"));
                    }
                })
            })
        })
    }

    // 创建登录的promise对象
    createLoginPromise() {
        const that = this;
        return new Promise(function(resolve, reject) {
            request.post({
                url: that.host + that.loginPath,
                form: that.createPostData(that.email, that.password, that.token),
                forever: true
            }, function(err, httpResponse, body) {
                var result = JSON.parse(body);
                if (result.msg == "登录成功" && result.ret == 1) {
                    resolve("success");
                } else {
                    reject("error");
                }
            });
        });
    }

    // 进行签到
    getMark() {
        var that = this;
        // 签到
        request.get(that.host + that.signInPath, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var signResult = JSON.parse(body);
                if (signResult.code == 200) {
                    if (signResult.day && signResult.score) {
                        console.log("用户 " + that.email + " 已成功签到 " + signResult.day + " 天,连续积分 " + signResult.score + " ;");
                    } else {
                        console.log("用户 " + that.email + " 已签到");
                    }
                } else {
                    console.log("用户 " + that.email + " 签到失败");
                }
            } else {
                console.log("用户 " + that.email + " 签到失败");
            }
        })
    }


    // 生成发送的用户数据
    createPostData(email, password, token) {
        var that = this;
        var postData = {
            email: email,
            password: that.cryptoSHA1(password),
            token: token
        }

        return postData;
    }

    // SHA加密密文
    cryptoSHA1(pwd) {
        var shasum = crypto.createHash("sha1");
        shasum.update(pwd);
        return shasum.digest('hex');
    }

}

module.exports = SignIn;