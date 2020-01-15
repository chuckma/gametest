var ConfigData = require("ConfigData");
var Util = {
    /**登录获取token */
    onLogin(susCbk) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.login({
                success(res) {
                    if (res.code) {
                        // 发起网络请求
                        window['wx'].request({
                            url: 'https://constellation.mamapai.net/user/login',
                            data: {
                                app: ConfigData.appName,
                                code: res.code, //微信登录code
                            },
                            method: "POST",
                            success(res) {
                                // console.log("请求结果：", res);
                                if (res.data.data && res.data.data.token) {
                                    ConfigData.token = res.data.data.token;
                                    susCbk && susCbk();
                                }else{
                                    console.warn("token不存在！");
                                }
                            }
                        });
                    } else {
                        console.log('登录失败！' + res.errMsg);
                    }
                }
            });
        }
    },

    /**
     * 跳转到小游戏
     * @param {*} cfg 配置
     * @param {*} susCbk 成功回调
     */
    onNav: function(cfg, susCbk){
        if(!cfg) return;
        let self = this;
        if (wx.navigateToMiniProgram){
            wx.navigateToMiniProgram({
                appId: cfg.appid,
                path: cfg.path,
                // envVersion: 'develop',
                success: res=>{
                    // console.log("nav successed");
                    self.adStatis(cfg.appid);
                    susCbk && susCbk();
                }
            });
        }
    },

    /**
     * 预览图片
     * @param {*} cfg 配置
     */
    onPreView(cfg, susCbk){
        let self = this;
        let qrPath = ConfigData.baseUrl + cfg.path;
        wx.previewImage({
            current: qrPath, // 当前显示图片的http链接
            urls: [qrPath], // 需要预览的图片http链接列表
            success: res=>{
                // console.log("prev successed");
                self.adStatis(cfg.appid);
                susCbk && susCbk();
            }
        });
    },

    /**
     * 广告位uv上报统计
     * @param {*} appid 
     */
    adStatis(appid){
        if (ConfigData.token){
            wx.request({
                url: 'https://constellation.mamapai.net/common/ad-statistics',
                data: {
                    app: ConfigData.appName,
                    token: ConfigData.token,
                    ad_appid : appid //广告位对应的小游戏appid
                },
                method: "POST",
                success: res=>{
                    //console.log("result: ", res); //上报统计成功
                }
            });
        } else{
            console.error("上报失败, token尚未设置, 请先获取token！");
        }
    },
}

module.exports = Util