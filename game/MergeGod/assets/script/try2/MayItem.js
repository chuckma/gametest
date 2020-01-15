var Util = require("Util");
var ConfigData = require("ConfigData");
var Try2Play = require("Try2Play");
cc.Class({
    extends: cc.Component,

    properties: {
        btn: cc.Button,
        red: cc.Sprite,
        lbl: cc.Label,
        itemID: 0,
    },

    updateItem(itemId) {
        this.itemID = itemId;
        let cfg = Try2Play.mayVals[this.itemID];
        this.lbl.node.getComponent(cc.Label).string = cfg.name;
        this.red.node.opacity = (cfg.state == 1) ? 0 : 255;

        let self = this;
        let url = ConfigData.baseUrl + cfg.imgUrl;
        cc.loader.load(url, function (err, texture) {
            var sprite  = new cc.SpriteFrame(texture);
            self.btn.node.getComponent(cc.Sprite).spriteFrame = sprite;
        });
    },

    onLoad () {
        this.btn.node.on("click", this.onClick, this);
    },

    onClick() {
        let cfg = Try2Play.mayVals[this.itemID];
        if(!cfg) return;
        if(cfg.mod === 0)
            Util.onNav(cfg, function(){
                this.red.node.opacity = 0;
                Try2Play.mayVals[this.itemID].state = 0;
                Try2Play.savePlayedList(cfg);
            }.bind(this));
        else
            Util.onPreView(cfg, function(){
                this.red.node.opacity = 0;
                Try2Play.mayVals[this.itemID].state = 0;
                Try2Play.savePlayedList(cfg);
            }.bind(this));
    },
});
