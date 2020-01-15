import DataConfig, {
    PRIZE_MassiveCoin,
    PRIZE_DiamondOneHundred,
    PRIZE_LargeCoin,
    PRIZE_ALittleCoin,
    PRIZE_DiamondTwoHundred,
    ENCOURAGE_AddLottery,
    ENCOURAGE_SHARE,
    ENCOURAGE_VIDEO,
    PRIZE_AccLarge,
    PRIZE_AccALittle,
    PRIZE_SeniorGod,
} from "./DataConfig";
import GameManager from "./GameManager";
import AudioCtrl from "./AudioCtrl";
import RewardCtrl from "./RewardCtrl";
import SDKCtrl from "./SDKCtrl";
import GameSave from "./GameSave";


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
export default class TurntableUI extends cc.Component {
    public static _instance: TurntableUI = null;
    @property(cc.Label)
    faText: cc.Label = null;

    @property(cc.Node)
    turntable: cc.Node = null;

    @property(cc.Sprite)
    maxTower: cc.Sprite = null;

    @property(cc.Node)
    prizeA: cc.Node = null;

    @property(cc.Node)
    goBtn: cc.Node = null;

    isTurntable: boolean = false;
    isOpenShare: boolean = true;
    prizeNum: number = -1;//奖品 号
    lastPrizeNum: number = -1;//上一个奖品 号
    lotteryNum: number = 0;

    tempTreasureBoxAdditionNum: number = 1;
    treasureBoxAdditionNum: number = 1;


    coinNumA: number[] = [0.1, 0.2, 0.4, 0.6];
    //luckdrawRate: number[] = [129, 27, 163, 95, 156, 218, 82, 129];
    luckdrawRate: number[] = [129  , 156,   27,     95,    163,  218,   82,    129];
                            // 海量 大加速 高级人物 钻石100 小加速 大量 ，少量。 钻石200
                    //        
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        TurntableUI._instance = this;

        this.lotteryNum = GameSave.Inst.getLotteryNum();
        this.faText.string = "转盘卷x" + this.lotteryNum;

        //this.clickTurntableFABtn();
    }

    SuccessBoxVideo() {
        RewardCtrl._instance.CloseRewardView();
        this.treasureBoxAdditionNum = this.tempTreasureBoxAdditionNum;


    }

    videoAddLotteryNum() {
        SDKCtrl._instance.AddLotteryNumEncourage();


    }

    SuccessAddBtnLotteryNum(_encourageState?: number) {
        let n = GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_AddLottery);
        if (n > DataConfig.LotteryData.length - 1) {
            n = DataConfig.LotteryData.length - 1;
        }

        // console.log('n' + n + '   ' +DataConfig.LotteryData);
        this.lotteryNum += DataConfig.LotteryData[n][1];
        GameSave.Inst.setLotteryNum(this.lotteryNum);
        this.faText.string = "转盘卷x" + this.lotteryNum;
        if (_encourageState == ENCOURAGE_SHARE) {
            GameManager._instance.messageCtrl.OpenMessage('分享成功，转盘券' + DataConfig.LotteryData[n][1]);
        } else if (_encourageState == ENCOURAGE_VIDEO) {

            GameManager._instance.messageCtrl.OpenMessage('获得成功，转盘券' + DataConfig.LotteryData[n][1]);
        }
        SDKCtrl._instance.sharingWillSucceed = false;
        let rd = GameManager._instance.turntubleBtn.getChildByName("redDot");
        rd.active = true;
        rd.runAction(cc.sequence(cc.scaleTo(0.4, 1.3), cc.scaleTo(0.4, 1)).repeatForever());

    }

    clickTurntableFABtn() {

        if (!this.isTurntable && this.lotteryNum > 0) {

            this.isTurntable = true;
            // GameSave.Inst.addLotteryNum(-1);
            this.lotteryNum -= 1;
            if (this.lotteryNum <= 0) {


                this.node.on('noLotttery', this.showNoLotteryView, this);
            }

            GameSave.Inst.setLotteryNum(this.lotteryNum);
            this.faText.string = "转盘卷x" + this.lotteryNum;

            if (this.lastPrizeNum == 1 || this.lastPrizeNum== 4 ) {
                //有箱子
                this.prizeNum = this.getPrizeNoBoxNum();
            } else {

                this.prizeNum = this.getPrizeNum();
            }


            this.goBtn.getComponent(cc.Button).enabled = false;
            this.turntable.runAction(cc.sequence(

                cc.rotateBy(1.5, 2000).easing(cc.easeIn(1.5)),

                cc.callFunc(() => { this.turntable.rotation = 67.5 }),


                cc.rotateBy(1.5, 720 - 45 * this.prizeNum).easing(cc.easeOut(1.5)),

                cc.callFunc(this.actionCallbacks, this)
            ));
        } else if (!this.isTurntable && this.lotteryNum <= 0) {
            // GameManager._instance.messageCtrl.OpenMessage("抽奖券不足");

            this.showNoLotteryView();

        }

    }

    showNoLotteryView() {
        GameManager._instance.messageCtrl.OpenBtnMessage();
        let rd = GameManager._instance.turntubleBtn.getChildByName("redDot");
        rd.stopAllActions();
        rd.active = false;
        this.node.off('noLotttery', this.showNoLotteryView, this)
        //this.node.on('noLotttery',this.showNoLotteryView,this);
    }

    getPrizeNoBoxNum(): number {
        //return 1;
        let sum = 0;
        //let prizeNum = 0;
        for (let index = 0; index < this.luckdrawRate.length; index++) {
            if (index != 1 && index != 4) {
                sum += this.luckdrawRate[index];
            }
        }
        let r = Math.random() * sum;
        let s = 0;
        //return 1;
        for (let index = 0; index < this.luckdrawRate.length; index++) {
            if (index != 1 && index != 4) {
                s += this.luckdrawRate[index];
                if (s >= r) {
                    return index;
                }
            }
        }
        return 7;
    }


    getPrizeNum(): number {
        //return 2;
        let sum = 0;
        //let prizeNum = 0;
        for (let index = 0; index < this.luckdrawRate.length; index++) {
            sum += this.luckdrawRate[index];
        }
        let r = Math.random() * sum;
        let s = 0;
        //return 1;
        for (let index = 0; index < this.luckdrawRate.length; index++) {

            s += this.luckdrawRate[index];
            if (s >= r) {
                return index;
            }
        }
        return 7;
    }

    actionCallbacks() {
        AudioCtrl._instance.playCollectanAudio();
        this.isTurntable = false;
        this.goBtn.getComponent(cc.Button).enabled = true;

        this.lastPrizeNum = this.prizeNum;
        this.ReceivePrize();
    }

    ReceivePrize() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            // wx.aldSendEvent('限时宝箱“领取”按钮', { '限时宝箱“领取”按钮': '1' });
        }
        switch (this.prizeNum) {
            case PRIZE_MassiveCoin:
                // GameManager._instance.messageCtrl.OpenMessage("恭喜获得海量铜钱");
                let _coinNum = this.coinNumA[3] * DataConfig.getFlyBoxCoin() * this.treasureBoxAdditionNum;
                GameManager._instance.AddCoin(_coinNum);
                RewardCtrl._instance.OpenRewardCoinView(_coinNum);
                this.ResetTreasureBoxAdditionNum();
                break;
            case PRIZE_AccLarge:

                RewardCtrl._instance.OpenRewardAccelerateView(60);
                break;
            case PRIZE_SeniorGod:
                RewardCtrl._instance.OpenTurntableGodView(this.getMaxPrizePigLevel());
                break;
            case PRIZE_DiamondOneHundred:
                //GameManager._instance.messageCtrl.OpenMessage("恭喜获得钻石x100");
                let _diaNum =100 * this.treasureBoxAdditionNum;
                GameManager._instance.AddDiamond(_diaNum);
                RewardCtrl._instance.OpenRewardDiamondView(_diaNum);
                this.ResetTreasureBoxAdditionNum();
            
                break;
            case PRIZE_AccALittle:
                RewardCtrl._instance.OpenRewardAccelerateView(30);
                break;
            case PRIZE_LargeCoin:
                // GameManager._instance.messageCtrl.OpenMessage("恭喜获得大量铜钱");
                let _coinNum2 = this.coinNumA[2] * DataConfig.getFlyBoxCoin() * this.treasureBoxAdditionNum;
                GameManager._instance.AddCoin(_coinNum2);
                RewardCtrl._instance.OpenRewardCoinView(_coinNum2);
                this.ResetTreasureBoxAdditionNum();
                break;
            case PRIZE_ALittleCoin:
                // GameManager._instance.messageCtrl.OpenMessage("恭喜获得少量铜钱");
                let _coinNum0 = this.coinNumA[0] * DataConfig.getFlyBoxCoin() * this.treasureBoxAdditionNum;
                GameManager._instance.AddCoin(_coinNum0);
                RewardCtrl._instance.OpenRewardCoinView(_coinNum0);
                this.ResetTreasureBoxAdditionNum();
                break;
            case PRIZE_DiamondTwoHundred:
                //  GameManager._instance.messageCtrl.OpenMessage("恭喜获得钻石x200");
                let _diaNum1 =200 * this.treasureBoxAdditionNum;
                GameManager._instance.AddDiamond(_diaNum1);
                RewardCtrl._instance.OpenRewardDiamondView(_diaNum1);
                this.ResetTreasureBoxAdditionNum();
           
                break;
            default:
                break;
        }

        //console.log('prizeNum');
        // console.log(this.prizeNum);

        if (this.isOpenShare) {

            // SDKCtrl._instance.openBoxShare(this.prizeNum);
        } else {
            //未分享
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                // wx.aldSendEvent('限时宝箱“分享”按钮', { '限时宝箱“分享”按钮': '1' });
            }
        }
        GameManager._instance.RefreshLabel();

    }

    ResetTreasureBoxAdditionNum() {

        this.treasureBoxAdditionNum = 1;

    }

    getMaxPrizePigLevel() {
        let maxlevel = GameManager._instance.maxGodLevel;
        let level;
        if (maxlevel < 26) {
            level = maxlevel - Math.floor((maxlevel - 1) / 5);
            console.log(" getMaxPrizePigLevel " + level);
           
        } else {
            level = maxlevel - 5;

        }
        return level;
    }

    closeView() {
        this.node.active = false;

        //this.node.destroy();
    }
    clickShareToggle(event: cc.Toggle, customEventData) {
        this.isOpenShare = event.isChecked;

        // console.log( event.isChecked);
        // console.log(customEventData);
        // let node = event.target;

    }
    // update (dt) {}
}
