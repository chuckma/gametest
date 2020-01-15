import DataConfig, { LISTGIFT_PEOPLENUM } from "./dataConfig";
import ListGiftCtrl from "./ListGiftCtrl";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ListGiftItem extends cc.Component {

    public gift_id:number = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let _view = this.node.getChildByName("View");
        // console.log("1111nnn " + (index + n * 10));
        let index = this.node.getSiblingIndex();
        _view.getChildByName("nameRichText").getComponent(cc.RichText).string = "<outline color=#2b70b1 width=2><size=28>第" + DataConfig.ListGifData[index][DataConfig.ListGif_ID] + "位</size></outline>";
        // console.log(DataConfig.ListGifData[index][DataConfig.ListGif_diamond]);
        _view.getChildByName("DNumLable").getComponent(cc.RichText).string = "<outline color=#2b70b1 width=2><size=28>" + DataConfig.ListGifData[index][DataConfig.ListGif_diamond] + "</size></outline>";
        _view.active = true;

        let btn1: cc.Button = _view.getChildByName("invitingBtn").getComponent(cc.Button);
        let eh1 = new cc.Component.EventHandler;
        eh1.target = ListGiftCtrl._instance.node;
        eh1.component = "ListGiftCtrl";
        eh1.handler = "invitingFriends";
        eh1.customEventData = index.toString();
        btn1.clickEvents[0] = eh1;
        //console.log(index.toString());
        let btn: cc.Button = _view.getChildByName("RewardBtn").getComponent(cc.Button);
        let eh = new cc.Component.EventHandler;
        eh.target = ListGiftCtrl._instance.node;
        eh.component = "ListGiftCtrl";
        eh.handler = "Reward";
        eh.customEventData = index.toString();
        btn.clickEvents[0] = eh;

    }

    // update (dt) {}
}
