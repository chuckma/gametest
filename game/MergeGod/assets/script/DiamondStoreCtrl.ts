import GameManager from "./GameManager";
import AudioCtrl from "./AudioCtrl";
import SDKCtrl from "./SDKCtrl";
import DataConfig, { SHARE_FULL_NUM, SHARE_ID_NUM, ENCOURAGE_VIDEO, ENCOURAGE_RECEIVE } from "./DataConfig";
import RewardCtrl from "./RewardCtrl";
import GameSave from "./GameSave";
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
export default class DiamondStoreCtrl extends cc.Component {
    public static _instance: DiamondStoreCtrl = null;
    dayNum: number = 1;//登录天数
    rewardDayNum: number = null;//领取奖励的天数
    oneMoreView: cc.Node;
    rewardView: cc.Node;
    signInView: cc.Node;
    diaAddition :number = 1; // 获得钻石的翻倍加成 

    signInBtn: cc.Node;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        DiamondStoreCtrl._instance = this;
        this.oneMoreView = this.node.getChildByName("OneMoreView");
        this.rewardView = this.node.getChildByName("RewardView");
        this.signInBtn = cc.find("Canvas/UI/SignInBtn");
        this.signInView = this.node.getChildByName("SignInView");
    }


    init() {

        this.dayNum = GameSave.Inst.getDayNum();
        let todayData : number =Bitbear.getInstance().current_time ;
   

        //取值
        this.rewardDayNum = GameSave.Inst.getRewardSignInDayNum()%7;

        if (GameSave.Inst.getDayNum() == 0) {
            //GameManager._instance.SetIntData("dayNum", 1);
            GameSave.Inst.setDayNum(1);
            this.dayNum = 1;
            console.log('首次登录');
            console.log('第' + this.dayNum + '天登录');
            //GameManager._instance.SetIntData("fastLoginTime", testData.getTime());
            GameSave.Inst.setStartGameDate(todayData);
        } else {

            //每天
            let ztime = this.getfastLoginZeroTime(GameSave.Inst.getStartGameDate());
            let loginDaynum = (todayData - ztime) / 1000 / 60 / 60 / 24;
            if(loginDaynum < 1){
                loginDaynum = 1;
            }
            this.dayNum = Math.ceil(loginDaynum);

            //this.dayNum = 5;
            console.log('第' + this.dayNum + '天登录');
            //每分钟

            if (this.dayNum != GameSave.Inst.getDayNum()) {
                console.log('新的一天');
                
                //新的一天
                GameSave.Inst.setDayNum(this.dayNum);
                console.log("rewardDayNum  " + this.rewardDayNum);
                //刷新签到天数
                if(GameSave.Inst.getRwardInfoOf(this.rewardDayNum) == 1){

                    this.rewardDayNum +=1;
                    GameSave.Inst.setRewardSignInDayNum(this.rewardDayNum);

                    if(this.rewardDayNum>=GameSave.Inst.getRwardInfo().length){

                        this.rewardDayNum =this.rewardDayNum%7;
                        GameSave.Inst.cleanRwardInfo();
                    }
                    //越界检测

                }
                //初始化福袋当天获得数量
                GameManager._instance.SetIntData("fukuNumForToday", 0);

                //初始化分享次数
                GameSave.Inst.setShareSumNum(0);
                //初始化各id 分享次数
                GameSave.Inst.cleanEncourageSuccessNum();
                //初始化各id 视频次数

                //奖券刷新
                if (GameSave.Inst.getLotteryNum() < 5) {
                    GameSave.Inst.setLotteryNum(5);
                }

                GameSave.Inst.setLastDaygiftlistLength(0);
                SDKCtrl._instance.shareNum = 0;
             
            } else {
                //还是今天

                //读取分享次数

            }
            GameSave.Inst.waitUploadData();
        }

        let dvp: cc.Node =  this.signInView.getChildByName("panel");

        for (let i = 0; i < dvp.childrenCount; i++) {
            if (GameSave.Inst.getRwardInfoOf(i) == 1) {
                //已领取
                dvp.children[i].getChildByName("ashBG").active = true;
                dvp.children[i].getChildByName("numLabel").active = false;
                dvp.children[i].getChildByName("numLabel").getComponent(cc.Label).string = "已领取";
            } else if (i == this.rewardDayNum && GameSave.Inst.getRwardInfoOf(i) == 0) {
                //可领取
                dvp.children[i].getChildByName("ashBG").active = false;
            } else {
                //未领取
                dvp.children[i].getChildByName("ashBG").active = true;
                dvp.children[i].getChildByName("ashBG").getChildByName("received").active = false;
            }
            let diamondNumStr = "x" + DataConfig.SignInData[i][DataConfig.SignIn_DiaNum];
            dvp.children[i].getChildByName("numLabel").getComponent(cc.Label).string = diamondNumStr;
        }

        let rd = this.signInBtn.getChildByName("redDot");
        //打开每日收益界面
        if (GameSave.Inst.getRwardInfoOf(this.rewardDayNum) != 1 && this.rewardDayNum <= 7) {
            rd.active = true;
            rd.runAction(cc.sequence(cc.scaleTo(0.4, 1.3), cc.scaleTo(0.4, 1)).repeatForever());
        } else {
            rd.active = false;
            this.signInView.getChildByName("videoBtn").color = cc.Color.GRAY;
            this.signInView.getChildByName("videoBtn").getComponent(cc.Button).enabled = false;

        }

    }

    public getfastLoginZeroTime(_time: number): number {

        let dat = new Date();
        dat.setTime(_time);
        //console.log(dat.getTime());
        dat.setHours(0);
        dat.setMinutes(0);
        dat.setSeconds(0);
        //console.log(dat.getTime());
        return dat.getTime();
    }

    OpenOneMoreView() {
        this.closeSignInView();
        this.oneMoreView.active = true;
        this.oneMoreView.getChildByName("infoRichText").getComponent(cc.RichText).string 
        = "X" + DataConfig.SignInData[this.rewardDayNum][DataConfig.SignIn_DiaNumOneMore];

        let eh = new cc.Component.EventHandler;
        eh.target = this.node;
        eh.component = "DiamondStoreCtrl";
        eh.handler = "closeSignInView";

        this.signInView.getChildByName("closeBtn").getComponent(cc.Button).clickEvents[0] = eh;
    }

    SuccessSignInDiamondOneMore() {
        AudioCtrl._instance.playBuyAudio();
        GameManager._instance.AddDiamond(DataConfig.SignInData[this.rewardDayNum][DataConfig.SignIn_DiaNumOneMore]);
        this.CloseOneMoreView();
        //this.oneMoreView.active = false;
    }


    //点击天数领取 普通领取
    SuccessSignInNormal() {
        this.diaAddition = 1;
        RewardCtrl._instance.CloseRewardView();

        this.node.on("OpenOneMoreView" ,this.OpenOneMoreView,this);
    
        AudioCtrl._instance.playBuyAudio();

        let diaNum = DataConfig.SignInData[this.rewardDayNum][DataConfig.SignIn_DiaNum];
        RewardCtrl._instance.OpenRewardDiamondView(diaNum);
        GameManager._instance.AddDiamond(diaNum);

        let dvp: cc.Node =  this.signInView.getChildByName("panel");
        dvp.children[this.rewardDayNum].getChildByName("ashBG").active = true;
        dvp.children[this.rewardDayNum].getChildByName("numLabel").active = false;

        //打开奖励页面
        GameSave.Inst.setRwardInfoOf(this.rewardDayNum, 1);

        this.signInView.getChildByName("videoBtn").color = cc.Color.GRAY;
        this.signInView.getChildByName("videoBtn").getComponent(cc.Button).enabled = false;

        let rd = this.signInBtn.getChildByName("redDot");
        rd.stopAllActions();
        rd.active = false;
    }

    //双倍领取
    SuccessSignInDouble() {
        this.diaAddition = 2;
        RewardCtrl._instance.CloseRewardView();

        this.node.on("OpenOneMoreView" ,this.OpenOneMoreView,this);

        AudioCtrl._instance.playBuyAudio();
        let diaNum = DataConfig.SignInData[this.rewardDayNum][DataConfig.SignIn_DiaNum] * this.diaAddition; 
        RewardCtrl._instance.OpenRewardDiamondView(diaNum);
        GameManager._instance.AddDiamond(diaNum);

        let dvp: cc.Node =  this.signInView.getChildByName("panel");
        dvp.children[this.rewardDayNum].getChildByName("ashBG").active = true;
        dvp.children[this.rewardDayNum].getChildByName("numLabel").active = false;

        //关闭每日界面
        this.signInView.active = false;

        //打开奖励页面
        GameSave.Inst.setRwardInfoOf(this.rewardDayNum, 1);

        this.signInView.getChildByName("videoBtn").color = cc.Color.GRAY;
        this.signInView.getChildByName("videoBtn").getComponent(cc.Button).enabled = false;

        let rd = this.signInBtn.getChildByName("redDot");
        rd.stopAllActions();
        rd.active = false;

    }


    CloseOneMoreView() {
        this.oneMoreView.active = false;
        this.node.off('OpenOneMoreView', this.OpenOneMoreView, this);
    }

    public closeShopView() {

        this.node.getChildByName("ShopView").active = false;

    }

    public closeSignInView() {
        this.signInView.active = false;
    }

    public openShopView() {

        this.node.getChildByName("ShopView").active = true;

    }

    public openDayView() {

        this.signInView.active = true;

        let videoBtn =  this.signInView.getChildByName("videoBtn");

        //if(SDKCtrl._instance.isShare){
            //videoBtn.active = true;
            let eh1 = new cc.Component.EventHandler;
            eh1.target = SDKCtrl._instance.node;
            eh1.component = "SDKCtrl";
            eh1.handler = "SignInDiamondEncourage";
            eh1.customEventData = ENCOURAGE_VIDEO.toString();
            videoBtn.getComponent(cc.Button).clickEvents[0] = eh1;
            videoBtn.getComponentInChildren(cc.Label).string = "视频双倍";

        /*}else{
            //videoBtn.active = true;
            let eh = new cc.Component.EventHandler;
            eh.target = SDKCtrl._instance.node;
            eh.component = "SDKCtrl";
            eh.handler = "SignInDiamondEncourage";
            eh.customEventData = ENCOURAGE_RECEIVE.toString();
            videoBtn.getComponent(cc.Button).clickEvents[0] = eh;
            videoBtn.getComponentInChildren(cc.Label).string = "双倍领取";
        }*/

    }

    // update (dt) {}
}
