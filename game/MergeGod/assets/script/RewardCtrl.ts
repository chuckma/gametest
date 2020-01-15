import GameManager from "./GameManager";
import AudioCtrl from "./AudioCtrl";
import SDKCtrl from "./SDKCtrl";
import DataConfig, { ENCOURAGE_RewrdCoinGame, ENCOURAGE_XuanyaoTop,  ENCOURAGE_RewrdNoDiamond, ENCOURAGE_ID, ENCOURAGE_RECEIVE, ENCOURAGE_SHARE, ENCOURAGE_VIDEO, VIDEO_FAIL_TEXT, SHARE_NUMFULL_TEXT } from "./DataConfig";
import HelpCtrl from "./HelpCtrl";
import TurntableUI from "./TurntableUI";
import GameSave from "./GameSave";
import GameUI from "./GameUI";
import DiamondStoreCtrl from "./DiamondStoreCtrl";

const { ccclass, property } = cc._decorator;



@ccclass
export default class RewardCtrl extends cc.Component {
    public static _instance: RewardCtrl = null;


    @property(cc.Node)
    starA: cc.Node = null;
 
    @property(cc.RichText)
    shipInfoRichText: cc.RichText = null;
    
    @property(cc.Label)
    shipNameLabel: cc.Label = null;

    @property(cc.Sprite)
    shipIcon: cc.Sprite = null;

    @property(cc.Button)
    mainBtn: cc.Button = null;

    radiantLight: cc.Node = null;
    lightRot: cc.Node = null;

    lightSpecialRot: cc.Node = null;

    noMoneyView: cc.Node = null;
    shipView: cc.Node = null;
    coinView: cc.Node = null;
    rewardView: cc.Node = null;
    boxView: cc.Node = null;
    diaView: cc.Node = null;
    lotteryView: cc.Node = null;

    accelerateView :cc.Node = null;
    title: cc.RichText = null;
    agent = null;
    share_plugin = null;

    rewardCoin: number = null;
    pintuIcon: cc.Node = null;

   // mainBtn : cc.Node = null;
    videoBtn : cc.Node = null;
    shareBtn : cc.Node = null;


    normalReceiveBtn: cc.Node = null;
    closeBtn: cc.Node = null;

    mainInfoLabel :cc.Label = null;

    countDownLabel: cc.Label = null;

    viewBG: cc.Node = null;


    startTitleRT: string = '<outline color=#5a95d2 width=2><color=#ffffff ><b>';
    endTitleRT: string = '</b></color></outline>';

    onLoad() {
        this.noMoneyView = this.node.getChildByName("NoMoneyView");
        this.rewardView = this.node.getChildByName("RewardView");
        this.title = this.rewardView.getChildByName("Title").getChildByName("TitleRichText").getComponent(cc.RichText);
        this.shipView = this.rewardView.getChildByName("ShipView");
        this.coinView = this.rewardView.getChildByName("CoinView");
        this.boxView = this.rewardView.getChildByName("BoxView");
        this.diaView = this.rewardView.getChildByName("DiaView");
        this.lotteryView = this.rewardView.getChildByName("LotteryView");
        //this.specialView = this.rewardView.getChildByName("SpecialView");
        this.accelerateView = this.rewardView.getChildByName("AccelerateView");
        // this.mainBtn = this.rewardView.getChildByName("mainBtn");

        this.videoBtn = this.rewardView.getChildByName("videoBtn");
        this.shareBtn = this.rewardView.getChildByName("shareBtn");


        this.closeBtn = this.rewardView.getChildByName("closeBtn");
        this.normalReceiveBtn = this.rewardView.getChildByName("normalReceiveBtn");
        this.radiantLight = this.rewardView.getChildByName("radiantLight");
        this.lightRot = this.rewardView.getChildByName("light");
        this.lightSpecialRot = this.rewardView.getChildByName("SpecialLight");
        this.mainInfoLabel = this.rewardView.getChildByName("mainInfoLabel").getComponent(cc.Label);
        this.countDownLabel = this.rewardView.getChildByName("countDownLabel").getComponent(cc.Label);
        this.viewBG = this.rewardView.getChildByName("viewBG");
    }

    init() {
        this.radiantLight .active = false;
        this.lightSpecialRot.active = false;
        this.shipView.active = false;
        this.coinView.active = false;
        this.boxView.active = false;
        this.diaView.active = false;
        //this.rewardView.active = false;
        this.lotteryView.active = false;
        this.mainBtn.node.active = false;
        this.videoBtn.active = false;
        this.shareBtn.active = false;

        this.accelerateView.active = false;
        this.starA.active = false;
        this.closeBtn.active = true;
        this.normalReceiveBtn.active = false;
        this.mainInfoLabel.string = '';
    }

    start() {
        RewardCtrl._instance = this;
        this.starA.children.forEach(element => {
            element.stopAllActions();
            element.runAction( cc.sequence(  cc.fadeIn(0.3) ,cc.delayTime(0.2+Math.random()*0.5),cc.fadeOut(0.4)).repeatForever());
        });
    }

    showLightSpecial() {
        this.lightSpecialRot.active = true;
        this.lightSpecialRot.runAction(cc.rotateBy(10, 360).repeatForever());

    }

    showLight() {
        this.showRadiantLight();
        this.showStar() ;
    }

    showStar() {
        this.scheduleOnce(()=>{

            this.starA.active = true;
         /*   this.starA.children.forEach(element => {
                element.stopAllActions();
                element.runAction( cc.sequence(  cc.fadeIn(0.3) ,cc.delayTime(0.2+Math.random()*0.5),cc.fadeOut(0.4)).repeatForever());
            });*/

        },0);
    
  
    }

    showRadiantLight(){

        this.radiantLight.active = true;
        this.radiantLight.scale = 0.8;
        this.radiantLight.stopAllActions();
        this.radiantLight.runAction( 
            cc.spawn(
                cc.scaleTo(0.9,1.3),
                cc.sequence( cc.fadeIn(0.3) ,cc.delayTime(0.3),cc.fadeOut(0.3),cc.callFunc(()=> this.showRadiantLight()) )
            )
        );
    }

    OpenLotteryRewardView(_lotteryNum: number) {
        if (GameManager._instance.inMainView) {
            GameManager._instance.inMainView = false;

            AudioCtrl._instance.playCollectanAudio();
            this.init();

            this.rewardView.active = true;
            this.lotteryView.active = true;
            this.title.string = this.startTitleRT + "恭喜获得" + this.endTitleRT;

            this.mainInfoLabel.string = "抽奖券x" + _lotteryNum;

            this.mainBtn.node.active = true;
            let eh = new cc.Component.EventHandler;
            eh.target = this.node;
            eh.component = "RewardCtrl";
            eh.handler = "CloseRewardView";
            this.mainBtn.clickEvents[0] = eh;
            this.mainBtn.getComponentInChildren(cc.Label).string = "领取";

            this.showLightSpecial();
            this.title.node.active = false;
            GameUI.Inst.CreateTickerTapeParticle();
  
        }
    }

    OpenRewardAccelerateView(addTime :number) {
        GameManager._instance.inMainView = false;
        AudioCtrl._instance.playCollectanAudio();
        this.init();
        this.showLight();
        this.rewardView.active = true;
        this.title.string = this.startTitleRT + "恭喜获得" + this.endTitleRT;

        this.mainBtn.node.active = true;
        let eh = new cc.Component.EventHandler;
        eh.target = SDKCtrl._instance.node;
        eh.component = "SDKCtrl";
        eh.handler = "turntableAccelerate";
        eh.customEventData = addTime.toString();
        this.mainBtn.clickEvents[0] = eh;
        this.mainBtn.getComponentInChildren(cc.Label).string = "领取";

        this.accelerateView.active = true;

        this.mainInfoLabel.node.active = true;
        this.mainInfoLabel.string = "加速" + addTime + "s";
 
    }

 
    OpenRewardBoxView(_BoxNum: number) {

        GameManager._instance.inMainView = false;
        AudioCtrl._instance.playCollectanAudio();
        this.init();
        this.showLight();
        this.rewardView.active = true;
        this.title.string = this.startTitleRT + "恭喜获得" + this.endTitleRT;

        this.mainBtn.node.active = true;

        let eh = new cc.Component.EventHandler;
        eh.target = SDKCtrl._instance.node;
        eh.component = "SDKCtrl";
        eh.handler = "TurntableBoxVideo";
        this.mainBtn.clickEvents[0] = eh;
        this.mainBtn.getComponentInChildren(cc.Label).string = "领取";

        this.mainInfoLabel.node.active = true;
        this.mainInfoLabel.string = '下次转盘奖励' + _BoxNum + '倍';
  
    }

    OpenRewardCoinView(_coinNum: number, additionNum: number = 1) {

        GameManager._instance.inMainView = false;
        AudioCtrl._instance.playCollectanAudio();
        this.init();

        this.rewardView.active = true;
        this.mainBtn.node.active = true;
        this.closeBtn.active = false;
        let eh = new cc.Component.EventHandler;
        eh.target = this.node;
        eh.component = "RewardCtrl";
        eh.handler = "CloseRewardView";
        this.mainBtn.clickEvents[0] = eh;
        this.mainBtn.getComponentInChildren(cc.Label).string = "确 定";


        this.coinView.active = true;
        this.title.string = this.startTitleRT + "恭喜获得" + this.endTitleRT;
        
        this.mainInfoLabel.node.active = true;
        this.mainInfoLabel.string = "+" + GameManager._instance.GetNumString(_coinNum);

        this.showLight();

    }

    OpenRewardDiamondView(_DiaNum: number, additionNum: number = 1) {
        GameManager._instance.inMainView = false;
        AudioCtrl._instance.playCollectanAudio();
        this.init();
        this.rewardView.active = true;
        this.mainBtn.node.active = true;
        this.closeBtn.active = false;
        let eh = new cc.Component.EventHandler;
        eh.target = this.node;
        eh.component = "RewardCtrl";
        eh.handler = "CloseRewardView";
        this.mainBtn.clickEvents[0] = eh;
        this.mainBtn.getComponentInChildren(cc.Label).string = "确 定";
        this.diaView.active = true;
        this.title.string = this.startTitleRT + "恭喜获得" + this.endTitleRT;

        this.mainInfoLabel.node.active = true;
        this.mainInfoLabel.string = "+" + GameManager._instance.GetNumString(_DiaNum);
        if (additionNum > 1) {
            this.showLightSpecial();
            this.title.node.active = false;
            GameUI.Inst.CreateTickerTapeParticle();
        } else {
            this.showLight();

        }
    }
    
    OpenTurntableGodView(_maxlevel: number) {
        if (GameManager._instance.inMainView) {
            GameManager._instance.inMainView = false;

            AudioCtrl._instance.playNewTopAudio();
            this.init();
            this.showLight();
            this.title.string = this.startTitleRT + "恭喜获得" + this.endTitleRT;
            this.rewardView.active = true;
            this.shipView.active = true;
            this.shipView.getChildByName("nameLabel").getComponent(cc.Label).string
                = DataConfig.GodConfigData[_maxlevel - 1][DataConfig.GOD_Name];

            this.shipIcon.spriteFrame = GameUI.Inst.godSFA[_maxlevel];
        
            this.mainBtn.node.active = true;
            let eh = new cc.Component.EventHandler;
            eh.target = SDKCtrl._instance.node;
            eh.component = "SDKCtrl";
            eh.handler = "turntablePigEncourage";
            eh.customEventData = _maxlevel.toString();
            this.mainBtn.clickEvents[0] = eh;
            this.mainBtn.getComponentInChildren(cc.Label).string = "领取";
        }
    }
    
    OpenTopShipView(_maxlevel: number) {
        if (GameManager._instance.inMainView) {
            GameManager._instance.inMainView = false;

            this.init();

            this.rewardView.active = true;
            this.title.string = this.startTitleRT + "升仙成功" + this.endTitleRT;
            this.shipView.active = true;
            this.shipNameLabel.string
                = DataConfig.GodConfigData[_maxlevel - 1][DataConfig.GOD_Name];

            //this.mainInfoLabel.node.active = true;
            //this.mainInfoLabel.string = DataConfig.GodConfigData[_maxlevel-1][DataConfig.GOD_info];


            this.shipInfoRichText.node.active = true;
            this.shipInfoRichText.string = "<outline color=#2D70B1 width=2><color=#ffffff><size=30>" + DataConfig.GodConfigData[_maxlevel-1][DataConfig.GOD_info] + "</size></color></outline>";

            this.shipIcon.spriteFrame = GameUI.Inst.godSFA[_maxlevel];
            let shareDiamond = DataConfig.GodConfigData[_maxlevel - 1][DataConfig.GOD_diamond];
            if (shareDiamond > 0) {
                //炫耀
                this.mainBtn.node.active = true;
                let eh = new cc.Component.EventHandler;
                eh.target = this.node;
                eh.component = "RewardCtrl";
                eh.handler = "ClickXuanyaoShip";
                eh.customEventData = _maxlevel.toString();
                this.mainBtn.clickEvents[0] = eh;
                this.mainBtn.getComponentInChildren(cc.Label).string = '炫耀';
                //self.shipView.getChildByName("shipLabel").active = true;

                this.normalReceiveBtn.active = true;
                let eh1 = new cc.Component.EventHandler;
                eh1.target = this.node;
                eh1.component = "RewardCtrl";
                eh1.handler = "NormalReceiveBtn";
                eh1.customEventData = _maxlevel.toString();
                this.normalReceiveBtn.getComponent(cc.Button).clickEvents[0] = eh1;

            } else {
                //点确定获取
                this.mainBtn.node.active = true;
                let eh = new cc.Component.EventHandler;
                eh.target = this.node;
                eh.component = "RewardCtrl";
                eh.handler = "ClickOKBtnTopShipView";
                eh.customEventData = _maxlevel.toString();
                this.mainBtn.clickEvents[0] = eh;
                this.mainBtn.getComponentInChildren(cc.Label).string = '领取';
            }

            let eh = new cc.Component.EventHandler;
            eh.target = this.node;
            eh.component = "RewardCtrl";
            eh.handler = "NormalReceiveBtn";
            // eh.customEventData = "close";
            this.closeBtn.getComponent(cc.Button).clickEvents[0] = eh;

            this.showLight();
            AudioCtrl._instance.playNewTopAudio();
        }
    }

    ClickOKBtnTopShipView() {
        this.CloseRewardView();
        let diaNum = DataConfig.GodConfigData[GameManager._instance.maxGodLevel - 1][DataConfig.GOD_unlock_diamond];

        if (diaNum > 0) {
            this.OpenRewardDiamondView(diaNum);
            GameManager._instance.AddDiamond(diaNum);
        }

    }

    NormalReceiveBtn() {
        let diaNum = DataConfig.GodConfigData[GameManager._instance.maxGodLevel - 1][DataConfig.GOD_diamond];
        if (diaNum <= 0) {
            diaNum = DataConfig.GodConfigData[GameManager._instance.maxGodLevel - 1][DataConfig.GOD_unlock_diamond];
        }
        if (diaNum > 0) {
            this.OpenRewardDiamondView(diaNum);
            GameManager._instance.AddDiamond(diaNum);
        } else {
            this.CloseRewardView('', 'topClose');
        }
    }

    ClickXuanyaoShip(event, customEventData) {//炫耀分享船

        AudioCtrl._instance.playClick();
        // let self = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            switch (SDKCtrl._instance.encourageState[ENCOURAGE_ID.top_god]) {
                case ENCOURAGE_RECEIVE:
                    SDKCtrl.SHARE_STATE = ENCOURAGE_XuanyaoTop;
                    SDKCtrl._instance.SuccessEncourage();
                    break;
                case ENCOURAGE_SHARE:
                    SDKCtrl._instance.share(ENCOURAGE_XuanyaoTop);
                    break;
                case ENCOURAGE_VIDEO:
                    SDKCtrl._instance.viewAdVideo((ok) => {
                        if (ok) {
                            this.SuccessXuanyaoShip();
                        } else {
                            GameManager._instance.messageCtrl.OpenMessage(VIDEO_FAIL_TEXT);
                            //SDKCtrl._instance.openBannerAd();
                        }
                    }, ENCOURAGE_XuanyaoTop);
                    break;
                default:
                    break;
            }
        } else {
            SDKCtrl.SHARE_STATE = ENCOURAGE_XuanyaoTop;
            SDKCtrl._instance.SuccessEncourage();
        }
    }


    SuccessXuanyaoShip() {
        let diaNum = DataConfig.GodConfigData[GameManager._instance.maxGodLevel - 1][DataConfig.GOD_diamond];
        if (diaNum <= 0) {
            diaNum = DataConfig.GodConfigData[GameManager._instance.maxGodLevel - 1][DataConfig.GOD_unlock_diamond];
        }

        let addition = 1;
        if (diaNum > 0) {
            this.OpenRewardDiamondView(diaNum * addition);
            GameManager._instance.AddDiamond(diaNum * addition);
            // GameManager._instance.messageCtrl.OpenMessage("炫耀成功");
        } else {
            this.CloseRewardView('', 'topClose');
        }
    }




    OpenFlyBoxRewardView() {
     
            this.init();

            let cNum = DataConfig.getFlyBoxCoin();
            if(isNaN(cNum) || cNum == undefined|| cNum == null){
                GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
                return null;
            }
            
            AudioCtrl._instance.playClick();
            this.rewardCoin = cNum;
            this.mainInfoLabel.node.active = true;
            this.mainInfoLabel.string   = "+" + GameManager._instance.GetNumString(this.rewardCoin) + "金币";

            this.showLight();
            this.rewardView.active = true;
            this.coinView.active = true;
            this.title.string = this.startTitleRT + "获得免费宝箱" + this.endTitleRT;
    



            if(SDKCtrl._instance.isShare){
                this.mainBtn.node.active = true;
                let eh = new cc.Component.EventHandler;
                eh.target = SDKCtrl._instance.node;
                eh.component = "SDKCtrl";
                eh.handler = "FlyBoxEncourage";
                eh.customEventData = ENCOURAGE_SHARE.toString();
                this.mainBtn.clickEvents[0] = eh;
                this.mainBtn.getComponentInChildren(cc.Label).string = "分享领取"
            }else{
                this.mainBtn.node.active = true;
                let eh = new cc.Component.EventHandler;
                eh.target = SDKCtrl._instance.node;
                eh.component = "SDKCtrl";
                eh.handler = "FlyBoxEncourage";
                eh.customEventData = ENCOURAGE_RECEIVE.toString();
                this.mainBtn.clickEvents[0] = eh;
                this.mainBtn.getComponentInChildren(cc.Label).string = "免费领取"
            }

           // AudioCtrl._instance.playCollectanAudio();
 
    }

    OpenNoMoney() {
        this.init();

        let cNum = DataConfig.getNoMoneyCoin();
        if(isNaN(cNum) || cNum == undefined|| cNum == null){
            GameManager._instance.messageCtrl.OpenMessage("金币不足");
            return null;
        }
        this.rewardCoin = cNum;
        this.mainInfoLabel.node.active = true;
        this.mainInfoLabel.string = "+" + GameManager._instance.GetNumString(cNum);

        GameManager._instance.inMainView = false;
        AudioCtrl._instance.playClick();
   
        this.rewardView.active = true;
        this.coinView.active = true;
        this.title.string = this.startTitleRT + "免费金币" + this.endTitleRT;


        if(SDKCtrl._instance.isShare){
            this.videoBtn.active = true;
            let eh1 = new cc.Component.EventHandler;
            eh1.target = SDKCtrl._instance.node;
            eh1.component = "SDKCtrl";
            eh1.handler = "NoMoneyEncourage";
            eh1.customEventData = ENCOURAGE_VIDEO.toString();
            this.videoBtn.getComponent(cc.Button).clickEvents[0] = eh1;
            this.videoBtn.getComponentInChildren(cc.Label).string = "视频领取";

            this.shareBtn.active = true;
            let eh = new cc.Component.EventHandler;
            eh.target = SDKCtrl._instance.node;
            eh.component = "SDKCtrl";
            eh.handler = "NoMoneyEncourage";
            eh.customEventData = ENCOURAGE_SHARE.toString();
            this.shareBtn.getComponent(cc.Button).clickEvents[0] = eh;
            this.shareBtn.getComponentInChildren(cc.Label).string = "分享领取";

 
        }else{

            this.mainBtn.node.active = true;
            let eh = new cc.Component.EventHandler;
            eh.target = SDKCtrl._instance.node;
            eh.component = "SDKCtrl";
            eh.handler = "NoMoneyEncourage";
            eh.customEventData = ENCOURAGE_RECEIVE.toString();
            this.mainBtn.clickEvents[0] = eh;
            this.mainBtn.getComponentInChildren(cc.Label).string = '我要金币';
        }

     
 
    }

    OpenNoDiamond() {

        this.init();


        let n = GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_RewrdNoDiamond);
        let data = DataConfig.ShareRewardData[n];
        let diaNum = data[DataConfig.ShareReward_Short_Diamond];
 

        if(isNaN(diaNum) ||undefined == diaNum ||null == diaNum){
            GameManager._instance.messageCtrl.OpenMessage("钻石不足");
            return null;
        }


        
        GameManager._instance.inMainView = false;
        AudioCtrl._instance.playCollectanAudio();

        this.rewardView.active = true;
        this.diaView.active = true;
        this.title.string = this.startTitleRT + "免费钻石" + this.endTitleRT;

  

        if(SDKCtrl._instance.isShare){

            this.videoBtn.active = true;
            let eh1 = new cc.Component.EventHandler;
            eh1.target = SDKCtrl._instance.node;
            eh1.component = "SDKCtrl";
            eh1.handler = "ClickNoDiamondEncourage";
            eh1.customEventData = ENCOURAGE_VIDEO.toString();
            this.videoBtn.getComponent(cc.Button).clickEvents[0] = eh1;
            this.videoBtn.getComponentInChildren(cc.Label).string = "视频领取";

            this.shareBtn.active = true;
            let eh = new cc.Component.EventHandler;
            eh.target = SDKCtrl._instance.node;
            eh.component = "SDKCtrl";
            eh.handler = "ClickNoDiamondEncourage";
            eh.customEventData = ENCOURAGE_SHARE.toString();
            this.shareBtn.getComponent(cc.Button).clickEvents[0] = eh;
            this.shareBtn.getComponentInChildren(cc.Label).string = "分享领取";



        }else{

            this.mainBtn.node.active = true;
            let eh = new cc.Component.EventHandler;
            eh.target = SDKCtrl._instance.node;
            eh.component = "SDKCtrl";
            eh.handler = "ClickNoDiamondEncourage";
            eh.customEventData = ENCOURAGE_RECEIVE.toString();
            this.mainBtn.clickEvents[0] = eh;
            this.mainBtn.getComponentInChildren(cc.Label).string = "我要钻石";
        }
        this.mainInfoLabel.node.active = true;
        this.mainInfoLabel.string = "+" + diaNum + "钻石";
    }

    OpenRewardOutlienCoinView(_coinNum: number) {
        if (GameManager._instance.inMainView) {
            GameManager._instance.inMainView = false;
            AudioCtrl._instance.playCollectanAudio();
            this.init();
            this.title.string = this.startTitleRT + "离线收益" + this.endTitleRT;
            this.rewardView.active = true;
            this.coinView.active = true;


            if(SDKCtrl._instance.isShare){
                this.videoBtn.active = true;
                let eh1 = new cc.Component.EventHandler;
                eh1.target = SDKCtrl._instance.node;
                eh1.component = "SDKCtrl";
                eh1.handler = "ClickOutlienEncourage";
                eh1.customEventData = ENCOURAGE_VIDEO.toString();
                this.videoBtn.getComponent(cc.Button).clickEvents[0] = eh1;
                this.videoBtn.getComponentInChildren(cc.Label).string = "视频双倍";

                this.shareBtn.active = true;
                let eh = new cc.Component.EventHandler;
                eh.target = SDKCtrl._instance.node;
                eh.component = "SDKCtrl";
                eh.handler = "ClickOutlienEncourage";
                eh.customEventData = ENCOURAGE_SHARE.toString();
                this.shareBtn.getComponent(cc.Button).clickEvents[0] = eh;
                this.shareBtn.getComponentInChildren(cc.Label).string = "分享双倍";
            }else{
                this.mainBtn.node.active = true;
                let eh = new cc.Component.EventHandler;
                eh.target = SDKCtrl._instance.node;
                eh.component = "SDKCtrl";
                eh.handler = "ClickOutlienEncourage";
                eh.customEventData = ENCOURAGE_RECEIVE.toString();
                this.mainBtn.clickEvents[0] = eh;
                this.mainBtn.getComponentInChildren(cc.Label).string = "双倍领取";
            }
        
            let eh1 = new cc.Component.EventHandler;
            eh1.target = this.node;
            eh1.component = "RewardCtrl";
            eh1.handler = "CloseRewardCoin";
            this.closeBtn.getComponent(cc.Button).clickEvents[0] = eh1;
            this.rewardCoin = _coinNum;
                       
            this.mainInfoLabel.node.active = true;
            this.mainInfoLabel.string = "+" + GameManager._instance.GetNumString(_coinNum);
        }
    }

    CloseRewardCoin() {
        GameManager._instance.CloseCoinParticle();
        GameManager._instance.AddCoin(this.rewardCoin);
        this.CloseRewardView();
    }

    SuccessOutLienVideo() {
        this.CloseRewardView();
        this.OpenRewardCoinView(this.rewardCoin * 2);
        GameManager._instance.AddCoin(this.rewardCoin * 2);
        GameManager._instance.node.on('SuccessOutLien', GameManager._instance.CloseCoinParticle, GameManager._instance);
    }

    ClickVideoRewrd() {//视频离线收益
        AudioCtrl._instance.playClick();
        this.shareRewrdGame(this.rewardCoin * 2);
    }

    ClickShareRewrd() {//离线收益
        AudioCtrl._instance.playClick();
        this.shareRewrdGame(this.rewardCoin * 2);
    }

    shareRewrdGame(_rewardCoin: number) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            window['wx'].showShareMenu();
            this.rewardCoin = _rewardCoin;
            SDKCtrl._instance.share(ENCOURAGE_RewrdCoinGame);
        }
    }

    SuccessRewrdCoinGame() {
        GameManager._instance.messageCtrl.OpenMessage("收益2倍");
        GameManager._instance.AddCoin(this.rewardCoin);
    }


    SuccessNoMoney() {
        GameManager._instance.AddCoin(this.rewardCoin);
        this.rewardView.active = false;
        this.OpenRewardCoinView(this.rewardCoin);
    }

    getHeader() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let cookie = window['wx'].getStorageSync('SESSID');
            let header = { 'Content-Type': 'application/json' };
            if (cookie) {
                header["Cookie"] = cookie;
            }
            return header;
        }
    }

    CloseRewardView(event?, customEventDatas?) {
        if (TurntableUI._instance != null) {
            if (TurntableUI._instance.node != null) {
                if (TurntableUI._instance.node.active == true) {
                    let Custom_Event = new cc.Event.EventCustom("noLotttery", false);
                    Custom_Event.setUserData(true);
                    TurntableUI._instance.node.dispatchEvent(Custom_Event);

                }
            }
        }
        let Custom_Event = new cc.Event.EventCustom("SuccessOutLien", false);
        Custom_Event.setUserData(true);
        GameManager._instance.node.dispatchEvent(Custom_Event);
        GameManager._instance.node.off('SuccessOutLien', GameManager._instance.CloseCoinParticle, GameManager._instance);

        DiamondStoreCtrl._instance.node.emit('OpenOneMoreView');

        GameUI.Inst.DestroytTckerTapeParticleA();
        AudioCtrl._instance.playClick();
        this.rewardView.active = false;
        GameManager._instance.inMainView = true;
        if (GameSave.Inst.getGuideStep() == 2) {//
            GameSave.Inst.setGuideStep(3);
        }
        else if (GameSave.Inst.getGuideStep() == 3) {//
            GameSave.Inst.setGuideStep(4);
            let bb = cc.find("Canvas/UI/BuyBtn");
            GameManager._instance.hand.active = true;
            GameManager._instance.hand.setPosition(bb.x, bb.y);
            GameManager._instance.hand.position = GameManager._instance.hand.position.add(cc.v2(0, -60));
            HelpCtrl._instance.maskAsh.active = true;
            HelpCtrl._instance.maskAsh.getComponentInChildren(cc.Mask).node.height = 200;
            HelpCtrl._instance.maskAsh.getComponentInChildren(cc.Mask).node.width = 200;
            HelpCtrl._instance.maskAsh.position = GameManager._instance.hand.position.add(cc.v2(0, 60));
            HelpCtrl._instance.textLabel.string = HelpCtrl._instance.helptext[2];
            HelpCtrl._instance.textLabel.node.active = true;
            HelpCtrl._instance.textLabel.node.position = GameManager._instance.hand.position.add(cc.v2(0, -70));
        }
        HelpCtrl._instance.shopHelp(customEventDatas);

        let eh = new cc.Component.EventHandler;
        eh.target = this.node;
        eh.component = "RewardCtrl";
        eh.handler = "CloseRewardView";
        this.closeBtn.getComponent(cc.Button).clickEvents[0] = eh;
    }

    // update (dt) {}
}

var rc : RewardCtrl = new RewardCtrl();
window['RewardCtrl'] = rc; //这步不能少
