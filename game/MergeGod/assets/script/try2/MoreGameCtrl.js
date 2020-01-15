var Util = require("Util");
var ConfigData = require("ConfigData");
cc.Class({
    extends: cc.Component,

    properties: {
        btnTry:cc.Button,
        bg:cc.Node,
        playView:cc.Node
        /*try2Prefab:{ //试玩领钻的资源预制体 
            type:cc.Prefab, 
            default:null, 
        },*/
    },

    start () {
        Util.onLogin(function(){ //【1.登录获取token】
            this.btnTry.node.on("click", this.onShow2Play, this); //【2.点击打开试玩领钻界面 界面适配根据需要可改动】
        }.bind(this)); 
    },

    onShow2Play(){
        if(ConfigData.token){
          /*  if(!this.playView){
                this.playView = cc.instantiate(this.try2Prefab);
                this.node.addChild(this.playView);
            }*/
            this.playView.active = true;
            this.playView.getComponent('Try2Play').onShow();
        }else{
            console.warn("token未获取，请先获取token！");
        }
    }
});
