var Util = require("Util");
var ConfigData = require("ConfigData");
var Try2Play = require("Try2Play");
cc.Class({
    extends: cc.Component,

    properties: {
        img: cc.Sprite,
        app: cc.Label,
        btn: cc.Button,
        diamond: cc.Sprite,
        stateSpr:{
            default:[],
            type:[cc.Sprite],
        },
        num: cc.Label,
        itemID: 0,
    },

    updateItem(itemId) {
        this.itemID = itemId;
        let cfg = Try2Play.tryVals[this.itemID];
        this.app.node.getComponent(cc.Label).string = cfg.name; //游戏名称
        this.btn.node.getComponent(cc.Sprite).spriteFrame = this.stateSpr[cfg.state].spriteFrame; //状态 0：立即领取 1：试玩 2：已领取
        this.diamond.node.opacity = (cfg.state == 2) ? 0 : 255;
        this.num.node.getComponent(cc.Label).string = (cfg.state == 2) ? '已领取' : ("+" + cfg.num); //奖励钻石数量

        this.app.node.getComponent(cc.Label).batchAsBitmap = true;
        this.num.node.getComponent(cc.Label).batchAsBitmap = true;
        
        let self = this;
        let url = ConfigData.baseUrl + cfg.imgUrl;
        if(url){
            cc.loader.load(url, function (err, texture) {
                var sprite  = new cc.SpriteFrame(texture);
                self.img.node.getComponent(cc.Sprite).spriteFrame = sprite;
            });
        }
    },

    onLoad () {
        this.btn.node.on("click", this.onClick, this);
    },

    onClick() {
        let cfg = Try2Play.tryVals[this.itemID];
        if(!cfg) return;
        switch(cfg.state){
            case 0:
                Try2Play.onPullAward(this.itemID, cfg); //已试玩 领取奖励
                break;
            case 1:
                Util.onNav(cfg, function(){ //开始试玩 检测试玩时长
                    Try2Play.startStamp = Date.now(); //试玩跳转成功时间戳 用于比对返回本游戏时间戳 判断是否满足发放条件
                    Try2Play.curIdx = this.itemID; //开始此次试玩检测调度
                }.bind(this));
                break;
            case 2:
                Util.onNav(cfg, null); //已领取 不检测不发放
                break;
        }
    },
});
