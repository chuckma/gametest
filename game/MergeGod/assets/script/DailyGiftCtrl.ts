import GameManager from "./GameManager";
import { DAILY_GIFT_PEOPLE, DAILY_GIFT_HOUR, ENCOURAGE_DailyIF } from "./DataConfig";
import SDKCtrl from "./SDKCtrl";
import Bitbear from "./Bitbear";

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
export default class DailyGiftCtrl extends cc.Component {
    public static _instance: DailyGiftCtrl = null;



    iconA: cc.Node[] = null;

    @property(cc.Node)
    barBG: cc.Node = null;


    @property(cc.Node)
    receiveBtn: cc.Node = null;//领取按钮



    @property(cc.SpriteFrame)
    ashBtnSF: cc.SpriteFrame = null;//领取按钮

    @property(cc.Node)
    praiseBtn: cc.Node = null;//礼箱按钮

    @property(cc.Label)
    loginLabel: cc.Label = null;


    @property(cc.Label)
    infoLabel: cc.Label = null;

    //@property(cc.Node)
    //invitationBtn: cc.Node = null;

    @property(cc.Node)
    invitationDBtn: cc.Node = null;

    //已邀请人数
    invitingNum: number = null;

    //是否完成邀请领取
    isCompleteCollection: boolean = false;

    //离开的日期
    leaveDate: Date = null;

    onLoad() {
        DailyGiftCtrl._instance = this;
        this.iconA = this.barBG.children;


    }

    start() {

        //当日没有达成 1分钟后开启礼箱 按钮
       

        cc.game.on(cc.game.EVENT_HIDE, () => {
            //  console.log("游戏进入后台1111");
            let leaveDate = new Date();
            cc.sys.localStorage.setItem("leaveDate", leaveDate);//保存离线时间
        }, this);

    }



    refreshIcon(data) {
        let self = this;
        let n = 0;
        if (data.giftlist.length <= self.iconA.length) {
            n = data.giftlist.length;

        } else {
            n = self.iconA.length;


        }
        for (let i = 0; i < n; i++) {

            const element = self.iconA[i].getChildByName("photo");
            self.iconA[i].getComponent(cc.Button).enabled = false;
            element.active = true;
            cc.loader.load({ url: data.giftlist[i].user.avatar, type: 'png' }, function (err, texture) {
                let sprite = new cc.SpriteFrame(texture);
                element.getComponent(cc.Sprite).spriteFrame = sprite;
                element.width = 56;
                element.height = 56;

            });

        }
        if (data.user_is_receive == 1 && data.giftlist.length >= DAILY_GIFT_PEOPLE) {
            //可领取
            console.log("可领取");
            this.receiveBtn.active = true;
            this.invitationDBtn.active = false;

        } else if (data.user_is_receive == 0 && data.giftlist.length >= DAILY_GIFT_PEOPLE) {
            //已领取

            console.log("已领取");
            this.receiveBtn.active = true;
            this.invitationDBtn.active = false;
            this.receiveBtn.getComponent(cc.Button).enabled = false;
            this.receiveBtn.getComponent(cc.Sprite).spriteFrame = this.ashBtnSF;
            this.receiveBtn.getComponentInChildren(cc.Label).string = '已领取';
        } else {
            //不能领取
            console.log("不能领取");
            this.invitationDBtn.active = true;
        }
    }

    openPraiseView() {
        let self = this;
        this.node.children[0].active = true;
        //SDKCtrl._instance.createDailyGiftBtn();
        if (SDKCtrl._instance.isLogin) {
            this.loginLabel.node.active = false;
            this.infoLabel.node.active = true;
            //this.invitationBtn.active = true;
            this.barBG.active = true;
            // this.invitationDBtn.active = true;

            Bitbear.getInstance().getGiftDayUserList(function (data) {

                self.refreshIcon(data);

            });

        } else {
            this.loginLabel.node.active = true;
            this.infoLabel.node.active = false;
            // this.invitationBtn.active = false;
            this.barBG.active = false;
            this.invitationDBtn.active = false;
            SDKCtrl._instance.createDailyGiftAuthorizationBtn((ok) => {
                if (ok) {
                    this.openPraiseView();
                }
            });

        }
    }



    invitingFriends() {
        // this.successInviting();
        let self = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {



            // SDKCtrl.SHARE_STATE = ENCOURAGE_DailyIF;
            SDKCtrl._instance.share(ENCOURAGE_DailyIF);

        } else {

            self.successInviting();

        }
    }

    successInviting() {
        GameManager._instance.messageCtrl.OpenMessage("已邀请好友");
        this.invitingNum++;
        cc.sys.localStorage.setItem("invitingNum", this.invitingNum);
        //this.refreshIcon();
        if (this.invitingNum == DAILY_GIFT_PEOPLE) {
            this.receiveBtn.active = true;

            this.invitationDBtn.active = false;
        }


    }

    receiveCoin() {

        Bitbear.getInstance().receiveDayGift();
    }

    successReceiveCoin() {

        let n = GameManager._instance.coinPSNum * 60 * 60 * DAILY_GIFT_HOUR;
        GameManager._instance.AddCoin(n);
        this.isCompleteCollection = true;

        this.praiseBtn.active = false;

        this.closePraiseView();
    }
    closePraiseView() {
        this.node.children[0].active = false;
        SDKCtrl._instance.closeDailyGiftAuthorizationBtn();

    }
    // update (dt) {}
}
