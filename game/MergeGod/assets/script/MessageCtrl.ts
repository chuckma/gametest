import GameManager from "./GameManager";
import DataConfig, { SHARE_WAIT_TEXT } from "./DataConfig";
import TurntableUI from "./TurntableUI";
import SDKCtrl from "./SDKCtrl";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MessageCtrl extends cc.Component {
    messageBtnView: cc.Node = null;
    messageView: cc.Node = null;
    titleRichText: cc.RichText = null;

    messageRT: cc.RichText = null;

    @property(cc.Label)
    coinLabel: cc.Label = null;


    startTitleRT: string = '<outline color=#0e2242 width=2><color=#ffffff ><b>';
    endTitleRT: string = '</b></color></outline>';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.messageBtnView = this.node.getChildByName("MessageBtnView");
        this.messageView = this.node.getChildByName("MessageView");
        this.titleRichText = this.node.getChildByName("MessageView").getChildByName("MessageRichText").getComponent(cc.RichText);
        this.messageRT = this.node.getChildByName("MessageRichText").getComponent(cc.RichText);
    }

    public OpenNoPool() {

        this.messageView.active = true;
        this.titleRichText.string = this.startTitleRT + "仙位已满，请合成或者拖到右下角回收" + this.endTitleRT;
        this.unscheduleAllCallbacks();
        this.scheduleOnce(function () {
            this.closeView();
        }, 1.5);
    }



    public OpenWaitServer() {
        if (SDKCtrl._instance.isMessageOpen) {
            this.messageRT.node.active = true;
            this.messageView.active = false;
            let n = 0;
            let str = SHARE_WAIT_TEXT;

            this.messageRT.string = "<outline color=ffffff width=2><b><color=#000000>" + str + "</c></b></outline>";
            this.unscheduleAllCallbacks();
            let _time = 1.2;
            let _dT = _time / 3;
            this.schedule(function () {
                if (n % 4 == 0) {
                    str = SHARE_WAIT_TEXT;

                }
                this.messageRT.string = "<outline color=ffffff width=2><b><color=#000000>" + str + "</c></b></outline>";
                str += '.';
                /// console.log(n);
                if (n >= _time / _dT * 4 - 2) {
                    this.messageRT.node.active = false;
                }
                n += 1;
            }, _dT / 4, _time / _dT * 4);
        }
    }



    public OpenBtnMessage() {

        this.messageBtnView.active = true;

    }

    public OpenMessage(mess: string , showTime : number = 1.5) {
        if (SDKCtrl._instance.isMessageOpen) {
            this.messageRT.node.active = false;
            this.messageView.active = true;
            this.titleRichText.string =  this.startTitleRT + mess + this.endTitleRT;
            this.unscheduleAllCallbacks();
            this.scheduleOnce(function () {
                this.closeView();
            }, showTime);
        }
    }

    public OpenShipClean(_level: number) {

        // this.messageView.active = true;
        //this.titleLabel.string = "已删除！" + " +" + _level*50;
        this.coinLabel.string = "+" + GameManager._instance.GetNumString(DataConfig.GodConfigData[_level - 1][DataConfig.GOD_trash_gold]);
        this.coinLabel.node.active = true;
        this.coinLabel.node.setPosition(0, 0);
        this.coinLabel.node.opacity = 255;
        this.coinLabel.node.runAction(cc.moveBy(0.5, new cc.Vec2(0, 200)));
        this.coinLabel.node.runAction(cc.fadeOut(0.5));

        // this.scheduleOnce(function() {
        //     this.closeView();
        //  },0.5);
    }

    okBtnView() {
        this.messageBtnView.active = false;

        TurntableUI._instance.videoAddLotteryNum();
     
    }


    closeBtnView() {
        this.messageBtnView.active = false;
       // TurntableUI._instance.videoAddLotteryNum();

    }

    closeView() {
        this.messageView.active = false;
        //GameManager._instance.inMainView = true;
    }
    // update (dt) {}
}
