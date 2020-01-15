
var globalData = {
    tryVals:[], //试玩列表配置
    mayVals:[], //猜你喜欢列表配置
    tryItems:[], //试玩列表
    mayItems:[], //猜你喜欢
    td_list:[], //试玩过的列表
    userData:null, //用户服务端存储数据
    startStamp:0, //试玩开始时间戳
    curIdx:-1, //试玩游戏索引
    instance:null, //试玩界面引用
    onPullAward(idx, cfg){ //领取奖励
        let msg = "恭喜你，获得奖励" + cfg.num + "钻！";  
        console.log(msg);
                                                        //【4.在这里调用项目发放钻石接口 cfg.num即为发放钻石数量】 
        /** [这部分代码放到项目发放钻石成功后的回调里*/
            //需要使用项目的提示类提示用户获得钻石
   
        window.GameManager._instance.AddDiamond(cfg.num );
        window.RewardCtrl._instance.OpenRewardDiamondView(cfg.num);

        globalData.savePlayedList(cfg);
        globalData.tryVals[idx].state = 2; //更新成已领取
        globalData.instance.updateTryList();
        /**] */
    },
    /**
     * 保存玩过的列表
     * @param {*} cfg 
     */
    savePlayedList(cfg) {
        globalData.td_list.push(cfg.adid);
        globalData.userData.td_list = globalData.td_list;
        debugger;
        wx.request({
            url: 'https://constellation.mamapai.net/common/upload-data',
            data: {
                app: ConfigData.appName,
                token: ConfigData.token,
                data : JSON.stringify(globalData.userData) //已试玩的小游戏aid列表
            },
            method: "POST",
            success: function(res){
                console.log("保存配置成功: ", res); //保存成功
            }
        });
    },
}
var ConfigData = require("ConfigData");
cc.Class({
    extends: cc.Component,
    properties: {
        btnClose: cc.Button,
        tryItem_prefab:{ //试玩领钻列表项的资源预制体 
            type:cc.Prefab, 
            default:null, 
        },
        mayItem_prefab:{ //猜你喜欢列表项的资源预制体 
            type:cc.Prefab, 
            default:null, 
        },
        scroll_view:{ //获取scrollview组件 
            type:cc.ScrollView, 
            default:null, 
        },
        mayList:{
            type:cc.Node,
            default:null,
        }
    },

    onLoad () {
        globalData.instance = this;
        this.btnClose.node.on("click", this.onClose, this);

        globalData.startStamp = 0; //开始试玩的时间戳
        globalData.td_list = []; //试玩过的adid列表
        globalData.curIdx = -1; //当前试玩游戏索引

        this.userData = null;
        this.inited = false; //数据拉取完成与否

        let self = this;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.onShow((res)=> { //回到前台
                console.log("launchOption2: ", res);
                if(globalData.startStamp){
                    let cfg = globalData.tryVals[globalData.curIdx];
                    if(cfg){
                        if(Date.now() - globalData.startStamp > cfg.tryTime){ //判断试玩过的游戏是否符合体验时长
                            //试玩成功 改变状态为可领取
                            globalData.tryVals[globalData.curIdx].state = 0;
                            self.updateTryList();
                        }else{
                             //【3.项目使用自己的提示弹窗提醒用户未达到领取条件】
                             window.GameManager._instance.messageCtrl.OpenMessage("试玩时间不足，无法领取奖励");
                            
                             console.log("试玩时间不足，无法领取奖励") 
                        }
                    }
                }
                globalData.curIdx = -1; //结束这次试玩检测调度
            });
        }
    },

    onShow() {
        if(this.inited){
            this.onOpen();
        }else{
            wx.showLoading({title: '加载中'}); //显示加载中
            this.getPlayedList();
        }
    },

    onOpen(){
        this.scroll_view.scrollToTop();
        if(this.inited && this.isScroll){
            this.schedule(this.updateMayList, this.swTimes); //间隔时间滚动猜你喜欢列表
        }
    },

    onClose() {
        this.unschedule(this.updateMayList); //停止滚动猜你喜欢列表
        this.node.active = false;
    },

    /**
     * 获取玩过的列表
     */
    getPlayedList() {
        let self = this;
        wx.request({
            url: 'https://constellation.mamapai.net/common/download-data',
            data: {
                app: ConfigData.appName,
                token: ConfigData.token
            },
            method: "POST",
            success: function(res){
                console.log("获取配置: ", res); //获取成功
                if(res.data && res.data.data && res.data.data.data){
                    globalData.userData = JSON.parse(res.data.data.data);
                    globalData.td_list = globalData.userData.td_list ? globalData.userData.td_list : [];
                }else{
                    globalData.userData = {};
                    globalData.td_list = [];
                }
                self.processCfg();
            }
        });
    },

    processCfg() { //下载配置文件
        let self = this;
        var url = ConfigData.baseUrl + "yu_di_play.json";
        cc.loader.load( url, function( err, res) {
            if(res.playPat){
                res.playPat[1] && (globalData.tryVals = res.playPat[1].data);
                res.playPat[2] && (globalData.mayVals = res.playPat[2].data);
            }
            self.isScroll = (res && res.main && res.main[1].isScroll) ? res.main[1].isScroll : false; //是否刷新
            self.swTimes = (res && res.main && res.main[1].swTimes) ? res.main[1].swTimes : 5; //猜你喜欢列表刷新间隔/秒
            
            for(var i = 0, sz = globalData.tryVals.length; i<sz; i++){ //试玩列表
                if(globalData.td_list.indexOf(globalData.tryVals[i].adid) != -1){
                    globalData.tryVals[i].state = 2;
                }
            }
            for(var j = 0, sz = globalData.mayVals.length; j<sz; j++){ //猜你喜欢列表
                if(globalData.td_list.indexOf(globalData.mayVals[j].adid) != -1){
                    globalData.mayVals[j].state = 2;
                }
            }
            let content = self.scroll_view.content;
            for(var k=0;k<globalData.tryVals.length;k++) { 
                let item = cc.instantiate(self.tryItem_prefab);
                item.opacity = 255;
                content.addChild(item);
                globalData.tryItems.push(item);
            }
            self.updateTryList();

            for(var w=0;w<8;w++) { //猜你喜欢列表
                let item = cc.instantiate(self.mayItem_prefab);
                item.opacity = 255;
                item.getComponent('MayItem').updateItem(w);
                self.mayList.addChild(item);
                globalData.mayItems.push(item);
            }
            self.inited = true;
            wx.hideLoading(); //隐藏loading
            self.onOpen();
        });
    },

    updateTryList() { //重排列表
        globalData.tryVals.sort(function (a, b) {
            return a["state"] - b["state"];
        });
        for(var i=0;i<globalData.tryItems.length;i++) {
            globalData.tryItems[i].getComponent('TryItem').updateItem(i);
        }
        this.scroll_view.scrollToTop(0.5);
    },

    updateMayList() { //随机打乱猜你喜欢列表
        if(!this.isScroll) return;
        for(let i = 0,len = globalData.mayVals.length; i < len; i++){ //打乱配置
            let rdmIdx = Math.random() * len|0;
            let curCfg = globalData.mayVals[i]; 
            globalData.mayVals[i] = globalData.mayVals[rdmIdx]; 
            globalData.mayVals[rdmIdx] = curCfg; 
        }
        for(let j = 0, itemNum = globalData.mayItems.length; j < itemNum; j++){ //更新显示
            let item = globalData.mayItems[j];
            item.getComponent('MayItem').updateItem(j);
        }
    },
});
module.exports = globalData;