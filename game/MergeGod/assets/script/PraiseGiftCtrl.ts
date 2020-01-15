import GameManager from "./GameManager";
import SDKCtrl from "./SDKCtrl";
import { ENCOURAGE_PreiseGiftIF } from "./DataConfig";

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
export default class PraiseGiftCtrl extends cc.Component {
    public static _instance: PraiseGiftCtrl = null;
    


    iconA: cc.Node[] = null;

    @property(cc.Node)
    barBG: cc.Node = null;



    @property(cc.Node)
    receiveBtn: cc.Node = null;//领取按钮



    @property(cc.Node)
    dailyGiftBtn: cc.Node = null;//礼箱按钮

    //已邀请人数
    invitingNum: number = null;

    //是否完成邀请领取
    isCompleteCollection: boolean = false;

    //离开的天数
    leaveDay: number = null;


    onLoad() {
        PraiseGiftCtrl._instance = this;
        this.invitingNum = GameManager._instance.GetIntData("invitingNum", 0);
        this.isCompleteCollection = GameManager._instance.GetBoolData("isCompleteCollection", false);
        this.iconA = this.barBG.children;

        let testDate = new Date();
        
        //console.log(  "getDate");
        //console.log(  testDate.getDate());
        if (GameManager._instance.GetIntData("leaveDay", 0) == 0) {
            //第一次登录

            this.leaveDay = testDate.getDate();
            cc.sys.localStorage.setItem("leaveDay", this.leaveDay);

        } else if (testDate.getDate() != GameManager._instance.GetIntData("leaveDay", 0)) {
            //不是今天
            //设置为今天
            this.leaveDay = testDate.getDate();
            GameManager._instance.SetIntData("leaveDay", testDate.getDate());

            //重新计数
            this.invitingNum = 0;
            GameManager._instance.SetIntData("invitingNum", testDate.getDate());
            
            this.isCompleteCollection = false;
            GameManager._instance.SetBoolData("isCompleteCollection", false);
        }



        //cc.log(this.iconA.length);
        // cc.log("dddddddddddddd  " + this.iconA );
        this.refreshIcon();


    }

    start() {

        //当日没有达成 1分钟后开启礼箱 按钮
        if (!this.isCompleteCollection) {
            this.scheduleOnce(function () {
                this.praiseBtn.active = true;
                if (this.invitingNum == 3) {
                    this.receiveBtn.active = true;

                }
                //cc.log("receiveBtn");
            }, 3);//60
        }
    }

    refreshIcon() {

        for (let i = 0; i < this.iconA.length; i++) {
            if (i < this.invitingNum) {
                //切换点赞
                this.iconA[i].getChildByName("zanIcon").active = true;
                this.iconA[i].getChildByName("addIcon").active = false;
                this.iconA[i].getComponent(cc.Button).enabled = false;
            }

        }
    }

    openPraiseView() {
        this.node.children[0].active = true;

    }

    invitingFriends() {
        // this.successInviting();
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            //SDKCtrl.SHARE_STATE = ENCOURAGE_PreiseGiftIF;
            SDKCtrl._instance.share(ENCOURAGE_PreiseGiftIF);
        }
    }

    successInviting() {
        GameManager._instance.messageCtrl.OpenMessage("已邀请好友");
        this.invitingNum++;
        cc.sys.localStorage.setItem("invitingNum", this.invitingNum);
        this.refreshIcon();
        if (this.invitingNum == 3) {
            this.receiveBtn.active = true;

        }


    }

    receiveCoin() {
        GameManager._instance.AddCoin(200000);
        GameManager._instance.messageCtrl.OpenMessage("获得金币20万");
        this.isCompleteCollection = true;
        GameManager._instance.SetBoolData("isCompleteCollection", this.isCompleteCollection);

        this.dailyGiftBtn.active = false;

        this.closePraiseView();
    }

    closePraiseView() {
        this.node.children[0].active = false;

    }
    // update (dt) {}
}
