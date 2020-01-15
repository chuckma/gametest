import DataConfig, { LISTGIFT_PEOPLENUM, ENCOURAGE_ListGiftIF, SHARE_CMONPLET_INVITATION_TEXT } from "./DataConfig";
import GameManager from "./GameManager";
import SDKCtrl from "./SDKCtrl";
import Bitbear from "./Bitbear";
import ListGiftItem from "./ListGiftItem";

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
export default class ListGiftCtrl extends cc.Component {
    public static _instance: ListGiftCtrl = null;
    view: cc.Node;
    content: cc.Node;


    @property(cc.Prefab)
    listGiftItem : cc.Prefab = null;

    @property(cc.Label)
    loginLabel : cc.Label = null;
    //已邀请人数
    invitingNum : number = null;
    //lastgiftlistLength: number = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        ListGiftCtrl._instance = this;
        this.view = this.node.getChildByName("ListGiftView");
        this.content = this.node.getComponentInChildren(cc.ScrollView).content;
        this.invitingNum = GameManager._instance.GetIntData("invitingNumListGift", 0);
        // this.lastgiftlistLength = GameManager._instance.GetIntData("lastgiftlistLength",0);
    }

    init() {

        let self = this;
        //console.log('ListGiftCtrl init');
        let index = 0;
        this.schedule(function () {
            let LG = cc.instantiate(this.listGiftItem);
            this.content.addChild(LG);
            index += 1;
        }, 0, LISTGIFT_PEOPLENUM - 1);
        this.content.width = 160 * LISTGIFT_PEOPLENUM;

    }


    //数量少屏蔽
    ScrollViewCallBack() {
        let a = this.content.children;
        for (let index = 0; index < a.length; index++) {
            const element = a[index];
            // console.log()
            let x = element.position.x + this.content.position.x;
            // console.log(index + "  " + x);
            if (x > -550 && x < 550) {

                element.getChildByName("View").active = true;

            } else {

                element.getChildByName("View").active = false;
            }
        }

    }

    invitingFriends(event, _num) {
        let self = this;
        const n: number = parseInt(_num);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            SDKCtrl._instance.share(ENCOURAGE_ListGiftIF);
        } else {
            self.successInviting();
        }
    }

    successInviting() {

        // console.log();
        GameManager._instance.messageCtrl.OpenMessage("已邀请好友");
        this.invitingNum++;
        GameManager._instance.SetIntData("invitingNumListGift", this.invitingNum);
        let view = this.content.children[this.invitingNum - 1].getChildByName("View");
        view.getChildByName("photo").active = true;
        view.getChildByName("invitingBtn").getComponent(cc.Button).enabled = false;
        view.getChildByName("RewardBtn").active = true;
        view.getChildByName("AshRewardBtn").active = false;
    }

    Refresh(data) {
        console.log('Refresh');
        console.log(data);
        if (data.giftlist.length == 0) {
            return;
        }
        if (data.giftlist.length <= 100) {
            this.invitingNum = data.giftlist.length;
        } else {

            this.invitingNum = 100;
        }
        for (let i = 0; i < this.invitingNum; i++) {
            let view = this.content.children[i].getChildByName("View");
            let lgI = this.content.children[i].getComponent(ListGiftItem);
            if (i < this.invitingNum) {
                //已解锁
                let photo = view.getChildByName("photo");

                photo.active = true;
                view.getChildByName("invitingBtn").getComponent(cc.Button).enabled = false;
                view.getChildByName("RewardBtn").active = true;
                view.getChildByName("AshRewardBtn").active = false;
                view.getChildByName("nameRichText").getComponent(cc.RichText).string
                    = '<outline color=#2b70b1 width=2><size=28>' + DataConfig.getShortName(data.giftlist[i].user.nickname) + '</size></outline>';

                lgI.gift_id = data.giftlist[i].gift_id;
                cc.loader.load({ url: data.giftlist[i].user.avatar, type: 'png' }, function (err, texture) {
                    let sprite = new cc.SpriteFrame(texture);
                    photo.getComponent(cc.Sprite).spriteFrame = sprite;
                    photo.height = 60;
                    photo.width = 60;
                });
                if (data.giftlist[i].is_receive == 1) {
                    //已领取
           
                    view.getChildByName("RewardBtn").active = false;
                    view.getChildByName("HaveReward").active = true;
                }
            } else {

                //未解锁
                view.getChildByName("photo").active = false;
                view.getChildByName("invitingBtn").getComponent(cc.Button).enabled = true;
                view.getChildByName("RewardBtn").active = false;
                view.getChildByName("AshRewardBtn").active = true;

            }

        }

    }

    openView() {

        let self = this;
        this.view.active = true;


        if (SDKCtrl._instance.isLogin) {

            this.loginLabel.node.active = false;
            this.content.active = true;

                Bitbear.getInstance().getGiftUserList(
                    function (data) {
                        self.Refresh(data);
                    }
                );
       
            //console.log("openView" +this.content.childrenCount );
            //   this.Refresh();
        } else {
            this.content.active = false;
            this.loginLabel.node.active = true;
            SDKCtrl._instance.createListGiftLoginBtn((ok) => {
                if (ok) {
                    self.openView();
                }
            });
        }

        SDKCtrl._instance.openBannerAd();

    }

    Reward(event, _num: string) {
        let n = parseInt(_num);
        let lgi = this.content.children[n].getComponent(ListGiftItem);
        Bitbear.getInstance().receiveListGift(lgi);
    }

    successReward(lgi: ListGiftItem) {

        let n = lgi.node.getSiblingIndex();

        let dNum = DataConfig.ListGifData[n][DataConfig.ListGif_diamond];
        GameManager._instance.AddDiamond(dNum);
        GameManager._instance.messageCtrl.OpenMessage("恭喜获得钻石x" + dNum);
        // GameManager._instance.SetIntData("isRewardListGift" + n, 1);
        //this.content.children[n].getChildByName("invitingBtn").getChildByName("photo").active = true;

        let view = this.content.children[n].getChildByName("View");
        view.getChildByName("RewardBtn").active = false;
        view.getChildByName("HaveReward").active = true;

    }

    closeView() {
        this.view.active = false;
        SDKCtrl._instance.closeListGiftLoginBtn();
    }


    // update (dt) {}
}
