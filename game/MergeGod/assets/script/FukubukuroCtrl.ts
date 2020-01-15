import GameManager from "./GameManager";
import DataConfig, { ENCOURAGE_Fukubukuro, REDENVELOP_SHARE_INTERVAL_MIN, REDENVELOP_SHARE_INTERVAL_MAX, OPERATE_ID } from "./DataConfig";
import SDKCtrl from "./SDKCtrl";
import DiamondStoreCtrl from "./DiamondStoreCtrl";
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
export default class FukubukuroCtrl extends cc.Component {
    public static _instance: FukubukuroCtrl = null;
    redEnvelopOutView: cc.Node = null;
    extractView: cc.Node = null;
    redEnvelopInView: cc.Node = null;
    shopView: cc.Node = null;
    shareFailView: cc.Node = null;

    rEUnclaimedBtn: cc.Node = null;
    rEAccountBtn: cc.Node = null;

    accountRENum: number = 0;
    rECoinNum: number = 0;

    accountLabel: cc.Label = null;

    isNetOpen: boolean = false;

    isSuccessRedEnvelop: boolean = true;//有红包 没打开 false  ,没有红包 或已经打开 true
    testingRewardRENum: number = 0;

    minFukuCardNum: number = 0;
    maxFukuCardNum: number = 0;

    fukuNumForToday: number = 0; //本日获得红宝数


    //中奖 红包次数
    succFukuNum: number = 0; //

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        FukubukuroCtrl._instance = this;
        this.redEnvelopOutView = this.node.getChildByName('FukubukuroOutView');
        this.extractView = this.node.getChildByName('ExtractView');
        this.redEnvelopInView = this.node.getChildByName('FukubukuroInView');
        this.shopView = this.node.getChildByName('FukubukuroShopView');
        this.shareFailView = this.node.getChildByName('ShareFailView');

        this.rEUnclaimedBtn = cc.find("Canvas/UI/REUnclaimedBtn");
        this.rEAccountBtn = cc.find("Canvas/UI/REAccountBtn");
        this.accountLabel = this.rEAccountBtn.getComponentInChildren(cc.Label);
        //account
    }

    init() {

        this.loadRedEnvelopData();

        this.updateSuccFukuNum();
        this.refreshLabel();
    }


    initBtnOpen(_isOpen: boolean) {
        let self = this;
        this.isNetOpen = _isOpen;
        if (this.isNetOpen) {
            console.log('开启');
            if (self.isSuccessRedEnvelop) {
                self.rEUnclaimedBtn.active = false;
                self.rEAccountBtn.active = true;
            } else {
                self.rEUnclaimedBtn.active = true;
                self.rEAccountBtn.active = false;
            }
        } else {
            console.log('不开启');
            self.rEUnclaimedBtn.active = false;
            self.rEAccountBtn.active = false;
        }


    }

    updateSuccFukuNum() {
        let max = REDENVELOP_SHARE_INTERVAL_MAX;
        let min = REDENVELOP_SHARE_INTERVAL_MIN;
        this.succFukuNum = Math.round( (max - min) * Math.random() + min);

        //console.log(' this.succFukuNum '  + this.succFukuNum );
    }

    saveRedEnvelopData() {
        GameManager._instance.SetIntData("rECoinNum", this.rECoinNum);
        GameManager._instance.SetIntData("accountRENum", this.accountRENum);
        GameManager._instance.SetBoolData("isSuccessRedEnvelop", this.isSuccessRedEnvelop);
        GameManager._instance.SetIntData("fukuNumForToday", this.fukuNumForToday);

    }

    loadRedEnvelopData() {
        this.rECoinNum = GameManager._instance.GetIntData("rECoinNum", this.rECoinNum);

        let a = GameManager._instance.GetIntData("accountRENum", this.accountRENum);
        // a= 5.5;
        if (a >= 15 && a < 20) {
            a = 14;
        }
        if (a < 15) {
            a = Math.ceil(a * 100);
            GameManager._instance.SetIntData("accountRENum", a);
        }
        this.accountRENum = a;
        //this.accountRENum = 1389;
        this.isSuccessRedEnvelop = GameManager._instance.GetBoolData("isSuccessRedEnvelop", this.isSuccessRedEnvelop);
        this.fukuNumForToday = GameManager._instance.GetIntData("fukuNumForToday", this.fukuNumForToday);
        console.log('fukuNumForToday ' + this.fukuNumForToday);

    }

    testingRewardRE() {
        //console.log('start merge test fuku Num：' + this.testingRewardRENum + ' fuku num today' + this.fukuNumForToday);
        //console.log('succFukuNum' + this.succFukuNum);
        if (this.accountRENum < 1500 && this.fukuNumForToday < DataConfig.getOperateDataValue(OPERATE_ID.fuku_dayOpen_maxNum)) {
            if (this.isSuccessRedEnvelop) {
                this.testingRewardRENum += 1;

                if (this.testingRewardRENum == this.succFukuNum) {
                    this.randomRE(true);
                }
            }
            this.saveRedEnvelopData();
        }
    }

    static Fukubukuro_ID = 0
    static Fukubukuro_LimitNum = 1
    static Fukubukuro_Min_redpacket = 2
    static Fukubukuro_Max_redpacket = 3
    public static FukubukuroData = [[]];

    randomRE(_sharingWillSucceed: boolean) {
        //console.log(' 开始 根据 余额 配置红包：' + this.accountRENum);
        if (this.accountRENum < 1500) {
            for (let index = 0; index < DataConfig.FukubukuroData.length - 1; index++) {
                let bL = DataConfig.FukubukuroData[index][DataConfig.Fukubukuro_LimitNum];
                let aL = DataConfig.FukubukuroData[index + 1][DataConfig.Fukubukuro_LimitNum];
                if (this.accountRENum < aL && this.accountRENum >= bL) {
                    this.minFukuCardNum = DataConfig.FukubukuroData[index][DataConfig.Fukubukuro_Min_redpacket];
                    this.maxFukuCardNum = DataConfig.FukubukuroData[index][DataConfig.Fukubukuro_Max_redpacket];
                    console.log("中红包");
                    this.testingRewardRENum = 0;
                    this.isSuccessRedEnvelop = false;
                    this.rEUnclaimedBtn.active = true;
                    this.rEAccountBtn.active = false;
                    this.openRedEnvelopOutView();
                }
            }
        }
    }

    SuccessRedEnvelop() {
        this.fukuNumForToday += 1;
        //console.log('reward fuku ' + this.fukuNumForToday);
        this.isSuccessRedEnvelop = true;
        this.openExtractView();
        this.rEUnclaimedBtn.active = false;
        this.rEAccountBtn.active = true;
        this.closeRedEnvelopOutView();
        this.saveRedEnvelopData();
        this.updateSuccFukuNum();
    }

    onOpenREBtn() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            
            SDKCtrl._instance.share(ENCOURAGE_Fukubukuro);
        } else {
            this.SuccessRedEnvelop();
        }
    }

    onClickExchangeBtn() {
        GameManager._instance.messageCtrl.OpenMessage('福卡不足，合并人物得到福卡');

    }

    onClickWithdrawalOfDepositsBtn() {
        this.openShopView();
    }

    openRedEnvelopOutView() {
        this.redEnvelopOutView.active = true;
        this.redEnvelopOutView.getChildByName('view').scale = 0;
        this.redEnvelopOutView.getChildByName('view').runAction(cc.scaleTo(0.5, 1));
    }

    closeRedEnvelopOutView() {
        this.redEnvelopOutView.active = false;
    }


    openExtractView() {

        this.extractView.active = true;
        let min = this.minFukuCardNum;
        let max = this.maxFukuCardNum;
        this.rECoinNum = Math.ceil(min + Math.random() * (max - min));
        this.accountRENum += this.rECoinNum;
        this.saveRedEnvelopData();
        this.refreshLabel();
        this.extractView.getChildByName("accountRichText").getComponent(cc.RichText).string
            = '<color=#f3d448>' + this.accountRENum + '福卡</color>';
        this.extractView.getChildByName("rewardRichText").getComponent(cc.RichText).string
            = '<color=#f3d448>' + this.rECoinNum + '福卡</color>';
        this.closeRedEnvelopOutView();
    }

    refreshLabel() {
        this.accountLabel.string = this.accountRENum.toString();
    }

    closeExtractView() {
        this.extractView.active = false;
    }

    openRedEnvelopInView() {
        this.redEnvelopInView.active = true;
        this.redEnvelopInView.getChildByName("accountRichText").getComponent(cc.RichText).string
            = '<color=#f3d448>' + this.accountRENum + '福卡</color>';
    }

    closeRedEnvelopInView() {
        this.redEnvelopInView.active = false;

    }

    openShopView() {
        this.shopView.active = true;
        this.shopView.getChildByName('accountLabel').getComponent(cc.Label).string = '当前有福卡:' + this.accountRENum;
    }

    closeShopView() {
        this.shopView.active = false;

    }

    openShareFailView() {

        this.shareFailView.active = true;
        this.shareFailView.runAction(cc.sequence(cc.fadeIn(0.5), cc.delayTime(0.5), cc.fadeOut(0.5), cc.callFunc(() => this.shareFailView.active = false)));

    }
    closeShareFailView() {
        this.shareFailView.active = false;

    }
    // update (dt) {}
}
