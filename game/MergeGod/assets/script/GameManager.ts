import ShipItem from "./ShipItem";
import PoolItem from "./PoolItem";
import ShopCtrl from "./ShopCtrl";
import RewardCtrl from "./RewardCtrl";
import MessageCtrl from "./MessageCtrl";
import AudioCtrl from "./AudioCtrl";
import TrashCtrl from "./TrashCtrl";
import DataConfig, { OUTLINE_REWARD_MAX_SCE, OUTLINE_REWARD_RATE, OUTLINE_REWARD_MIX_SCE, INIT_COINNUM, LOTTERY_NUM, REDENVELOP_OPENLEVEL, OPERATE_ID, VERSION, MAX_GOD_LV } from "./DataConfig";
import ListGiftCtrl from "./ListGiftCtrl";
import FlyBoxCtrl from "./FlyBoxCtrl";
import DiamondStoreCtrl from "./DiamondStoreCtrl";
import HelpCtrl from "./HelpCtrl";
import GameUI from "./GameUI";
import SDKCtrl from "./SDKCtrl";
import FukubukuroCtrl from "./FukubukuroCtrl";
import GameSave from "./GameSave";
import Bitbear from "./Bitbear";
import AccelerateCtrl from "./AccelerateCtrl";
import StartCtrl from "./StartCtrl";
import RenewalAwardCtrl from "./RenewalAwardCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    public static _instance: GameManager = null;

    @property(cc.Prefab)
    poolPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    shipPrefab: cc.Prefab = null;

    @property(cc.Node)
    coinParticle4: cc.Node = null;

    @property(cc.Node)
    startView: cc.Node = null;

    @property(cc.Node)
    drawerAD: cc.Node = null;
    
    @property(cc.Label)
    qBuyBtnLevelLabel: cc.Label = null;

    @property(cc.Label)
    qBuyBtnCoinLabel: cc.Label = null;
    
    @property(cc.Node)
    topBtn: cc.Node = null;

    @property(cc.Node)
    giftPackageBtn: cc.Node = null;

    @property(cc.Node)
    signInBtn: cc.Node = null;

    @property(cc.Node)
    turntubleBtn: cc.Node = null;

    @property(cc.Node)
    dailyGiftBtn: cc.Node = null;

    @property(cc.Node)
    ropeBtn: cc.Node = null;



    public tagetShip: cc.Node = null;
    public shipGroup: cc.Node = null;

    //收益金币特效层级
    public coinGroup: cc.Node = null;
    public shipNumGroup: cc.Node = null;
    public runway: cc.Node = null;
    //public startView: cc.Node = null;

   // public minPrice: number = 0;//当前最低价格 

    public uINode: cc.Node = null;
    public hand: cc.Node = null;
    n: number = null;
    mergeNum = 0;
    // levelNum: number = 1;

    maxGodLevel: number = 1;


    poolNum: number = 12;//水池数 4
    public coinNum: number = 0;//总钱数
    public profitNum: number = 0;//总钱数
    coinPSNum: number = 0;//每秒产出钱数

    public diamondNum: number = 0;//钻石

    shipPrice: number = 0;//快捷购买船的价格

    quicklyBuyLevel: number = 1;//快捷购买船的等级

    public inWayNum: number = 0;//在跑道上的数量
    public MaxInWayNum: number = 1;//在跑道上的最大数量 1

    coinLabel: cc.Label = null;
    diamondLabel: cc.Label = null;
    shipPriceLabel: cc.Label = null;
    pSLabel: cc.Label = null;

    appellationLabel: cc.Label = null;

    public poolLayout: cc.Layout = null;

    public shipZ: number = 3;
    public poolZ: number = 2;

    public shopCtrl: ShopCtrl = null;

    public rewardCtrl: RewardCtrl = null;

    public messageCtrl: MessageCtrl = null;

    public gameSave: GameSave = null;

    public trashCtrl: TrashCtrl = null;

    public rewardCoinNum: number = 0;

    public inRecycle: boolean = false;

    helpNum: number = 0; // 0 ,点击购买  1 合并  2 放跑道  3 收回

    helpView: cc.Node = null;

    //加速
    public static addSpeedNum: number = 1;

    public inMainView: boolean = true;

    //是否获得权限
    public isLogin: boolean = false;

    private isDrawerADOpen: boolean = false;//抽屉广告条开关

    brownArrowA: cc.Node[] = null;

    buyBtn: cc.Node = null;
    buyBtnRedDot: cc.Node = null;
    shopBtn: cc.Node = null;
    shopBtnRedDot: cc.Node = null;
    collectBtn: cc.Node = null;

    onLoad() {
        //cc.sys.localStorage.clear();
        GameManager._instance = this;

        this.poolLayout = cc.find("Canvas/PoolLayout").getComponent(cc.Layout);

        this.coinLabel = cc.find("Canvas/UI/CoinBar/CoinLabel").getComponent(cc.Label);
        this.diamondLabel = cc.find("Canvas/UI/AddDiamondBtn/diamondLabel").getComponent(cc.Label);
        this.shipPriceLabel = cc.find("Canvas/UI/BuyBtn/coinLabel").getComponent(cc.Label);
        this.pSLabel = cc.find("Canvas/UI/CoinBar/PSLabel").getComponent(cc.Label);
        this.appellationLabel = cc.find("Canvas/UI/appellationLabel").getComponent(cc.Label);
        this.shipGroup = cc.find("Canvas/ShipGroup");
        this.coinGroup = cc.find("Canvas/CoinGroup");
        this.shipNumGroup = cc.find("Canvas/ShipNumGroup");
        this.runway = cc.find("Canvas/Runway");
        this.shopCtrl = cc.find("Canvas/ShopCtrl").getComponent(ShopCtrl);

        this.rewardCtrl = cc.find("Canvas/RewardCtrl").getComponent(RewardCtrl);

        this.messageCtrl = cc.find("Canvas/MessageCtrl").getComponent(MessageCtrl);

        this.gameSave = this.node.getComponent(GameSave);
        this.trashCtrl = cc.find("Canvas/TrashCtrl").getComponent(TrashCtrl);

        this.uINode = cc.find("Canvas/UI");
        this.hand = cc.find("Canvas/HelpCtrl/hand");
        this.helpView = cc.find("Canvas/helpView");


        this.buyBtn = cc.find("Canvas/UI/BuyBtn");
        this.buyBtnRedDot = this.buyBtn.getChildByName("redDot");
        this.shopBtn = cc.find("Canvas/UI/ShopBtn");
        this.shopBtnRedDot = this.shopBtn.getChildByName("redDot");
        this.collectBtn = cc.find("Canvas/UI/CollectBtn");
        this.turntubleBtn = cc.find("Canvas/UI/TurntubleBtn");

    }

    openBuyBtn() {
        this.buyBtn.active = true;
    }

    closeBuyBtn() {
        this.buyBtn.active = false;
    }

    OrderOfMagnitude: string[] = ["", "k", "m", "b", "t", "Aa", "Ab", "Ag"];
    public GetNumString(_num: number): string {
        let _CoinNum = 0;
        for (let index = 0; index < this.OrderOfMagnitude.length; index++) {

            _CoinNum = _num / Math.pow(10, 3 * index);
            if (_CoinNum < 1000000 && _CoinNum >= 1000) {

                if (_CoinNum < 10000) {

                    if (_num < 1000000) {
                        return _CoinNum.toFixed(0) + this.OrderOfMagnitude[index];
                    }
                    return _CoinNum.toFixed(1) + this.OrderOfMagnitude[index];
                }
                return _CoinNum.toFixed(0) + this.OrderOfMagnitude[index];
            }
        }
        return _num.toFixed(0);
    }
 
    LoadData() {
        // this.updateNetConfig();//加载网络配置
        this.updateNetRedEnvelopConfig();
        let self = this;
        cc.loader.loadRes('data/GodData', function (err, data) {
            let tcd = data.text.split("\n");
            for (let i = 1; i < tcd.length; i++) {
                let ttcd = tcd[i].split(";");
                DataConfig.GodConfigData.push([]);
                //console.log(ttcd);
                for (let j = 0; j < ttcd.length; j++) {
                    if (j == 1 || j == 16) {
                        DataConfig.GodConfigData[i - 1].push(ttcd[j]);
                    } else {
                        DataConfig.GodConfigData[i - 1].push(parseFloat(ttcd[j]));
                    }
                }
            }
            cc.loader.loadRes('data/ListGifData', function (err, data) {
                let tcd = data.text.split("\n");
                // console.log(tcd.length);
                for (let i = 1; i < tcd.length; i++) {
                    let ttcd = tcd[i].split(",");
                    DataConfig.ListGifData.push([]);
                    //console.log(ttcd);
                    for (let j = 0; j < ttcd.length; j++) {
                        DataConfig.ListGifData[i - 1].push(parseFloat(ttcd[j]));
                    }
                }
                cc.loader.loadRes('data/SignInData', function (err, data) {
                    let tcd = data.text.split("\n");
                    // console.log(tcd.length);
                    for (let i = 1; i < tcd.length; i++) {
                        let ttcd = tcd[i].split(",");
                        DataConfig.SignInData.push([]);
                        //console.log(ttcd);
                        for (let j = 0; j < ttcd.length; j++) {
                            DataConfig.SignInData[i - 1].push(parseFloat(ttcd[j]));
                        }
                    }
                    cc.loader.loadRes('data/FukubukuroData', function (err, data) {
                        let tcd = data.text.split("\n");
                        // console.log(tcd.length);
                        for (let i = 1; i < tcd.length; i++) {
                            let ttcd = tcd[i].split(",");
                            DataConfig.FukubukuroData.push([]);
                            //console.log(ttcd);
                            for (let j = 0; j < ttcd.length; j++) {
                                DataConfig.FukubukuroData[i - 1].push(parseFloat(ttcd[j]));
                            }
                        }
                        cc.loader.loadRes('data/ShareRewardData', function (err, data) {
                            let tcd = data.text.split("\n");
                            // console.log(tcd.length);
                            for (let i = 1; i < tcd.length; i++) {
                                let ttcd = tcd[i].split(",");
                                DataConfig.ShareRewardData.push([]);
                                //console.log(ttcd);
                                for (let j = 0; j < ttcd.length; j++) {
                                    DataConfig.ShareRewardData[i - 1].push(parseFloat(ttcd[j]));
                                }
                            }
                            cc.loader.loadRes('data/OperateData', function (err, data) {
                                let tcd = data.text.split("\n");
                                // console.log(tcd.length);
                                for (let i = 1; i < tcd.length; i++) {
                                    let ttcd = tcd[i].split(",");
                                    DataConfig.OperateData.push([]);
                                    //console.log(ttcd);
                                    for (let j = 0; j < ttcd.length; j++) {
                                        DataConfig.OperateData[i - 1].push(parseFloat(ttcd[j]));
                                    }
                                }
                                cc.loader.loadRes('data/TurntableWeightData', function (err, data) {
                                    let tcd = data.text.split("\n");
                                    // console.log(tcd.length);
                                    for (let i = 1; i < tcd.length; i++) {
                                        let ttcd = tcd[i].split(",");
                                        DataConfig.TurntableWeightData.push([]);
                                        //console.log(ttcd);
                                        for (let j = 0; j < ttcd.length; j++) {
                                            DataConfig.TurntableWeightData[i - 1].push(parseFloat(ttcd[j]));
                                        }
                                    }
                                    cc.loader.loadRes('data/LotteryData', function (err, data) {
                                        let tcd = data.text.split("\n");
                                        // console.log(tcd.length);
                                        for (let i = 1; i < tcd.length; i++) {
                                            let ttcd = tcd[i].split(",");
                                            DataConfig.LotteryData.push([]);
                                            //console.log(ttcd);
                                            for (let j = 0; j < ttcd.length; j++) {
                                                DataConfig.LotteryData[i - 1].push(parseFloat(ttcd[j]));
                                            }
                                        }
                                        //console.log(self.gameSave);
                                        self.gameSave.init(function (data) {

                                            console.log(" shop inity  7777777777" );
                                            let ud = data;
                                            self.updateNetConfig();//加载网络配置
                                            self.coinNum = ud.money;
                                            self.profitNum = ud.profitNum;
                                            self.diamondNum = ud.diamondNum;

                                            self.maxGodLevel = ud.maxLv;
                                            self.appellationLabel.string = DataConfig.GodConfigData[self.maxGodLevel - 1][DataConfig.GOD_Name];

                                            //self.ReckonMixPrice();
                                           // self.TestingBuyRedDot();
                                            AccelerateCtrl._instance.init();
                                            self.onLoadTestingDoubleOutput(data.doubleOutputID, data.doubleOutputTime);
                                            self.init();
                                        });
                                        //self.init();
                                    });
                                });
                            });

                        });
                    });

                });

            });
        });
    }

    init() {

        let self = this;
        DiamondStoreCtrl._instance.init();
        ShopCtrl._instance.init();
        ListGiftCtrl._instance.init();
        FlyBoxCtrl._instance.init();
        FukubukuroCtrl._instance.init();

        //创建泳池
        this.CreateMap();
        this.initBuyShipQuickly();
        //根据记录创建船
        self.ReckonCoinPSNum();
        this.RefreshLabel();
        //展示收益画面
        this.scheduleOnce(function () {
            if (this.maxGodLevel >= DataConfig.getOperateDataValue(OPERATE_ID.outlineProfit_open_level)) {
                self.ShowOutlienReward();
            }
        }, 0.6);

        if (GameSave.Inst.getLotteryNum() > 0) {

            let rd = this.turntubleBtn.getChildByName("redDot");
            rd.active = true;
            rd.runAction(cc.sequence(cc.scaleTo(0.4, 1.3), cc.scaleTo(0.4, 1)).repeatForever());
        } else {
            this.turntubleBtn.getChildByName("redDot").active = false;
        }

        this.testingOpenMenuBtn();

        //删除收益后措施 收益添加到资产
        if (GameSave.Inst.getGuideStep() == 1) {//避免卡引导
            GameSave.Inst.setGuideStep(2);
        }
        this.tempShipPrefab.push(cc.instantiate(this.shipPrefab));
        this.tempShipPrefab.push(cc.instantiate(this.shipPrefab));
    }

    closeStartVeiw() {
        if (this.startView.active) {
            this.startView.active = false;
            console.log(" closeStartVeiw   ");
        }
    }

    updateNetRedEnvelopConfig() {
        let self = this;
        Bitbear.getInstance().netConfig(function (data) {
            let vdata = JSON.parse(data.data.data['data' + VERSION]);
            FukubukuroCtrl._instance.initBtnOpen(vdata.isRedEnvelop);
        });
    }
    updateNetConfig() {
        let self = this;
        Bitbear.getInstance().netConfig(function (data) {
            let vdata = JSON.parse(data.data.data['data' + VERSION]);
            SDKCtrl._instance.isShare = vdata.isShare;
            SDKCtrl._instance.isMessageOpen = vdata.isMessageOpen;
            SDKCtrl._instance.isBannerOpen = vdata.isBannerOpen;
            self.initDrawerAD(vdata.isDrawerADOpen)

            if (!SDKCtrl._instance.isBannerOpen) {

                SDKCtrl._instance.closeBannerAd();
            } else {
                SDKCtrl._instance.openBannerAd();

            }
            FukubukuroCtrl._instance.initBtnOpen(vdata.isRedEnvelop);

            SDKCtrl._instance.encourageState = [];
            for (let index = 0; index < vdata.encourageState.length; index++) {
                const element = vdata.encourageState[index]['state'];
                SDKCtrl._instance.encourageState.push(element);
            }

        });
    }

    initDrawerAD(_isDrawerADOpen: boolean) {
        this.isDrawerADOpen = _isDrawerADOpen;
        if (this.isDrawerADOpen) {
            this.drawerAD.active = true;
        } else {
            this.drawerAD.active = false;
        }
    }
    testingOpenMenuBtn() {
 
        if (this.maxGodLevel >= DataConfig.getOperateDataValue(OPERATE_ID.banner_open_level)) {
            SDKCtrl._instance.openBannerAd();
        }
        if (this.maxGodLevel >= DataConfig.getOperateDataValue(OPERATE_ID.topBtn_open_level)) {
            SDKCtrl._instance.openBannerAd();
            this.topBtn.active = true;
        } else {
            this.topBtn.active = false;
        }
        if (this.maxGodLevel >= DataConfig.getOperateDataValue(OPERATE_ID.gift_open_level)) {
            this.giftPackageBtn.active = true;
        } else {
            this.giftPackageBtn.active = false;
        }
        if (this.maxGodLevel >= DataConfig.getOperateDataValue(OPERATE_ID.signIn_open_level)) {
            this.signInBtn.active = true;
        } else {
            this.signInBtn.active = false;
        }
        if (this.maxGodLevel >= DataConfig.getOperateDataValue(OPERATE_ID.turntable_open_level)) {
            this.turntubleBtn.active = true;
        } else {
            this.turntubleBtn.active = false;
        }
        if (this.maxGodLevel >= DataConfig.getOperateDataValue(OPERATE_ID.onlineGift_open_level)) {
            this.dailyGiftBtn.active = true;
        } else {
            this.dailyGiftBtn.active = false;
        }
        if (this.maxGodLevel >= DataConfig.getOperateDataValue(OPERATE_ID.hangBox_open_level)) {
            this.ropeBtn.active = true;
        } else {
            this.ropeBtn.active = false;
        }
        if (this.maxGodLevel >= DataConfig.getOperateDataValue(OPERATE_ID.flyBox_open_level)) {
            FlyBoxCtrl._instance.openflyBoxBtn();

        } else {
            if(FlyBoxCtrl._instance.flyBoxBtn.active){
                FlyBoxCtrl._instance.closeflyBoxBtn();
            }
        }
    }

    onLoadTestingDoubleOutput(_accID: number, _accTime: number) {
        if (_accTime > 0) {
            SDKCtrl._instance.startDoubleOutputTimer(_accTime);
        }
    }

    ShowOutlienReward() {
        let _lt = this.GetIntData("leaveTime", 0);
        if (_lt == 0) {
            return;
        }
        let sub = Date.now() - _lt;
        //毫
        sub = sub / 1000;
        //最长可累计12小时
        if (sub >= OUTLINE_REWARD_MAX_SCE) {
            sub = OUTLINE_REWARD_MAX_SCE;
            this.messageCtrl.OpenMessage("离线收益上限为" + OUTLINE_REWARD_MAX_SCE / 60 / 60 + "小时")
        }

        if (sub >= OUTLINE_REWARD_MIX_SCE) {
            this.rewardCoinNum = sub * OUTLINE_REWARD_RATE * this.coinPSNum;
            if (this.rewardCoinNum > 0 && !Number.isNaN(this.rewardCoinNum)) {
                this.rewardCtrl.OpenRewardOutlienCoinView(this.rewardCoinNum);
            }
        }
    }

    playCoinAudio() {
        AudioCtrl._instance.playCoinAudio();
    }

    public CloseCoinParticle() {
        this.coinParticle4.active = true;
        this.schedule(this.playCoinAudio, 0.25, 5);
    }
    public OpenHelpView() {
        if (this.inMainView) {
            this.helpView.active = true;
            this.inMainView = false;
        }
    }

    public CloseHelpView() {
        this.helpView.active = false;
        this.inMainView = true;
    }


    public OpenShipClean(_shipLevel: number, shipI: ShipItem) {
        this.trashCtrl.openView(_shipLevel, shipI);
    }


    public ScsessShipClean(_shipLevel: number, shipI: ShipItem) {
        shipI.RecycleShip();
        this.messageCtrl.OpenShipClean(_shipLevel);
        this.AddCoin(DataConfig.GodConfigData[_shipLevel - 1][DataConfig.GOD_trash_gold]);
        this.ReckonCoinPSNum();
        this.RefreshLabel();
    }

    onDestroy() {
        cc.sys.localStorage.setItem("leaveTime", Date.now());//保存离线时间
        GameManager._instance.SetIntData("leaveTime", Date.now());//保存离线时间
    }

    CreateMap() {

        let self = this;
        //帮助  0
        if (GameSave.Inst.getGuideStep() == 0) {//引导 合成
            if (FukubukuroCtrl._instance.isNetOpen) {
                FukubukuroCtrl._instance.randomRE(true);
            }
            //开始引导 第一个人物
            GameSave.Inst.setMassifDataOf(0, 1);
            GameSave.Inst.setBuyTimes(1, 1);
            let bb = cc.find("Canvas/UI/BuyBtn");
            self.hand.active = true;
            self.hand.setPosition(bb.x, bb.y);
            self.hand.position = self.hand.position.add(cc.v2(0, -60));
            HelpCtrl._instance.maskAsh.active = true;
            HelpCtrl._instance.maskAsh.getComponentInChildren(cc.Mask).node.height = 200;
            HelpCtrl._instance.maskAsh.getComponentInChildren(cc.Mask).node.width = 200;
            HelpCtrl._instance.maskAsh.position = self.hand.position.add(cc.v2(0, 60));
            HelpCtrl._instance.textLabel.string = HelpCtrl._instance.helptext[0];
            HelpCtrl._instance.textLabel.node.active = true;
            HelpCtrl._instance.textLabel.node.position = self.hand.position.add(cc.v2(0, -70));
        }
        for (let i = 0; i < this.poolLayout.node.childrenCount; i++) {
            const newNode = this.poolLayout.node.children[i];
            newNode.name = "pool_" + i;
            let slevel = GameSave.Inst.getMassifDataOf(i);
            //穿等级
            if (slevel > 0) {
                self.AddShipToPool(newNode.getComponent(PoolItem), slevel);//添加船到水池 水池船只等级
            }
        }
        GameManager._instance.closeStartVeiw();
    }



    UpdateOutputSpeed() {
        let shipA = this.shipGroup.children;
        for (let i = 0; i < shipA.length; i++) {
            const element = shipA[i];
            element.getComponent(ShipItem).PlayAnimaAndAddCoin();
        }
    }

  
    SetShipToThePool(_pool: PoolItem, _ship: cc.Node, _shipLevel: number) {//制定船放指定水池
        this.shipGroup.addChild(_ship);
        _ship.getComponent(ShipItem).Init(_pool.node, _shipLevel);
    }

    tempShipPrefab = [];
    AddShipToPool(_pool: PoolItem, _shipLevel: number) {//添加某等级船到某水池
        if (_shipLevel == null) {
            return;
        }
        let newNode = null;
        if (this.tempShipPrefab.length < 1) {
            newNode = cc.instantiate(this.shipPrefab);
        } else {
            newNode = this.tempShipPrefab.pop();
            if(this.tempShipPrefab.length<2){
                this.scheduleOnce(() => {
                    this.tempShipPrefab.push(cc.instantiate(this.shipPrefab));
                }, 0);
            }
        }
        this.SetShipToThePool(_pool, newNode, _shipLevel);
    }

    AddShip(_pool: PoolItem, _shipLevel: number) {
        let newNode = null;
        if (this.tempShipPrefab.length < 1) {
            newNode = cc.instantiate(this.shipPrefab);
        } else {
            newNode = this.tempShipPrefab.pop();
            if(this.tempShipPrefab.length<2){
                this.scheduleOnce(() => {
                    this.tempShipPrefab.push(cc.instantiate(this.shipPrefab));
                }, 0);
            }
        }
       
        this.SetShipToThePool(_pool,newNode, _shipLevel);
        this.ReckonCoinPSNum();
        this.RefreshLabel();
    }

    isCoinLabelAnimaOver = true;
    public AddCoin(_addCoin: number) {
        _addCoin = Math.fround(_addCoin);
        this.coinNum += _addCoin;
        if (this.isCoinLabelAnimaOver) {
            this.isCoinLabelAnimaOver = false;

            this.coinLabel.node.runAction(
                cc.sequence(
                    cc.scaleTo(0.05, 1.35, 1.35),
                    cc.delayTime(0.1),
                    cc.scaleTo(0.05, 1, 1),
                    cc.callFunc(() => this.isCoinLabelAnimaOver = true)
                ));
        }
        //检测商店红点
        this.RefreshLabel();
        GameSave.Inst.setMoney(this.coinNum);
    }

    public AddDiamond(_addDiamond: number) {
        this.diamondNum += _addDiamond;
        this.diamondLabel.node.runAction(cc.sequence(cc.scaleTo(0.2, 1.3, 1.3), cc.scaleTo(0.2, 1, 1)));
        //检测商店红点
        this.RefreshLabel();
        GameSave.Inst.setDiamond(this.diamondNum);
    }

    RefreshLabel() {
        this.coinLabel.string = this.GetCoinNumString();
        this.diamondLabel.string = Math.floor(this.diamondNum).toString();
        this.shipPriceLabel.string = this.GetNumString(this.shipPrice);
        this.pSLabel.string = this.GetNumString(this.coinPSNum * GameManager.addSpeedNum) + "/秒";
        if (ShopCtrl._instance.shopView.active) {
            ShopCtrl._instance.RefreshLabel();
        }
    }

    ReckonCoinPSNum(): number {
        let sumPSNum = 0;
        for (let i = 0; i < this.poolNum; i++) {
            let slevel = GameSave.Inst.getMassifDataOf(i);
            //穿等级
            if (slevel > 0) {
                sumPSNum += DataConfig.GodConfigData[slevel - 1][DataConfig.GOD_output_gold] / (DataConfig.GodConfigData[slevel - 1][DataConfig.GOD_gold_interval_m] / 1000);
            }
        }
        this.coinPSNum = sumPSNum;
        return this.coinPSNum;

    }

    GetCoinNumString(): string {
        return this.GetNumString(this.coinNum);
    }

    public SetFloatData(_string: string, _num: number) {
        cc.sys.localStorage.setItem(_string, _num);
    }

    CleanMap() {
        this.poolLayout.node.destroyAllChildren();
        this.shipGroup.destroyAllChildren();
        cc.find("Canvas/OverLookShipGroup").destroyAllChildren();
    }

    public GetBoolData(_string: string, _bool: boolean): boolean {

        let n: number = Number.parseInt(cc.sys.localStorage.getItem(_string) as string);

        if (Number.isNaN(n)) {
            if (_bool) {
                cc.sys.localStorage.setItem(_string, "1");
                return true;
            } else {
                cc.sys.localStorage.setItem(_string, "0");
                return false;
            }

        } else {
            if (n == 0) {
                return false;

            } else if (n == 1) {

                return true;

            }
        }

        return _bool;

    }

    public SetBoolData(_string: string, _bool: boolean): void {

        if (_bool) {
            cc.sys.localStorage.setItem(_string, "1");

        } else {
            cc.sys.localStorage.setItem(_string, "0");

        }

    }

    public SetIntData(_string: string, _num: number) {
        cc.sys.localStorage.setItem(_string, _num);
    }

    public GetIntData(_string: string, _num: number): number {
        let n: number = Number.parseInt(cc.sys.localStorage.getItem(_string) as string);

        if (Number.isNaN(n)) {
            cc.sys.localStorage.setItem(_string, _num);
            n = _num;

        }
        return n;
    }

    public GetFloatData(_string: string, _num: number): number {
        let n: number = Number.parseFloat(cc.sys.localStorage.getItem(_string) as string);
        if (Number.isNaN(n)) {
            cc.sys.localStorage.setItem(_string, _num);
            n = _num;

        }
        return n;
    }


    BuyDiamondShip(_shipLevel: string) {//商店买船
        AudioCtrl._instance.playClick();
        let le: number = Number.parseInt(_shipLevel);
        let price = this.getBuyDiaPrice(le);

        let _PoolItem = this.GetHaveNullPool();
        if (this.diamondNum >= price && _PoolItem) {
            AudioCtrl._instance.playBuyAudio();
            this.AddShip(_PoolItem,le);//增加船只
            this.AddDiamond(- price);//减钱
            this.BuyDiaNumAddOne(le);

            this.shopCtrl.RefreshPrice(le);
            this.initBuyShipQuickly();
        } else {

            if (this.diamondNum < price) {
                this.rewardCtrl.OpenNoDiamond();
                ShopCtrl._instance.CloseShop();
            }
            if (_PoolItem == null) {
                this.messageCtrl.OpenNoPool();
            }
        }

    }


    BuyShip(_shipLevel: string) {//商店买船
        AudioCtrl._instance.playClick();
        let le: number = Number.parseInt(_shipLevel);
        let price = this.getCoinPrice(le);
        let _PoolItem = this.GetHaveNullPool();
        if (this.coinNum >= price && _PoolItem) {
            AudioCtrl._instance.playBuyAudio();
            this.AddShip(_PoolItem, le);//增加船只
            this.coinNum -= price;//减钱
            GameSave.Inst.setMoney(this.coinNum);

            this.BuyNumAddOne(le);//船只增加购买次数 1是船只等级

            this.shopCtrl.RefreshPrice(le);
            this.initBuyShipQuickly();
        } else {

            if (this.coinNum < price) {
                this.rewardCtrl.OpenNoMoney();
                ShopCtrl._instance.CloseShop();
            }
            if (_PoolItem == null) {
                this.messageCtrl.OpenNoPool();

            }
        }
    }

    initBuyShipQuickly() {

        this.quicklyBuyLevel = this.getQuicklyBuyLevel();
        if (this.quicklyBuyLevel < 1) {
            this.quicklyBuyLevel = 1;
        }
        this.shipPrice = this.getCoinPrice(this.quicklyBuyLevel);
     
        this.qBuyBtnLevelLabel.string = "LV " + this.quicklyBuyLevel.toString();
        this.qBuyBtnCoinLabel.string = this.GetNumString(this.shipPrice);


    }

    getQuicklyBuyLevel(): number {
        let minR = 0;
        let quicklyLevel = 0;


        let maxLevel = this.maxGodLevel - 4;
        let mixLevel = this.maxGodLevel - 8;
        if (maxLevel < 1) {

            maxLevel = 1;
        }
        if (mixLevel < 1) {

            mixLevel = 1;
        }
        for (let index = mixLevel; index <= maxLevel; index++) {
            if (DataConfig.GodConfigData[index - 1][DataConfig.GOD_unlock_buy_gold_level] <= GameManager._instance.maxGodLevel) {
                const element = this.getCoinPrice(index) / this.getOutPutPS(index);

                if (element < minR || minR == 0) {

                    quicklyLevel = index;
                    minR = element;
                }
            }
        }
        return quicklyLevel;

    }


    getCoinPrice(_shipLevel: number): number {


        return DataConfig.GodConfigData[_shipLevel - 1][DataConfig.GOD_buy_gold]
            * Math.pow(DataConfig.GodConfigData[_shipLevel - 1][DataConfig.GOD_add_gold_rate]
                , GameSave.Inst.getBuyTimes(_shipLevel));
    }

    getBuyDiaPrice(_level: number): number {

        return DataConfig.GodConfigData[_level - 1][DataConfig.GOD_buy_diamond]
            + DataConfig.GodConfigData[_level - 1][DataConfig.GOD_add_diamond_rate]
            * GameSave.Inst.getBuyDiaTimes(_level);

    }
    getOutPutPS(_shipLevel: number) {
        return DataConfig.GodConfigData[_shipLevel - 1][DataConfig.GOD_output_gold] / (DataConfig.GodConfigData[_shipLevel - 1][DataConfig.GOD_gold_interval_m] / 1000);

    }

    quicklyBuyLevelSubNum = 1;
    BuyShipQuickly(): void {
        if (GameManager._instance.inMainView) {

            let _PoolItem = this.GetHaveNullPool();
            if (this.coinNum >= this.shipPrice && _PoolItem) {
                AudioCtrl._instance.playBuyAudio();
                this.AddShip(_PoolItem,this.quicklyBuyLevel);//增加船只
                this.coinNum -= this.shipPrice;//减钱
                GameSave.Inst.setMoney(this.coinNum);
                this.BuyNumAddOne(this.quicklyBuyLevel);//船只增加购买次数 1是船只等级
                this.initBuyShipQuickly();
                //检测红点
            } else {
                if (_PoolItem == null) {
                    this.messageCtrl.OpenNoPool();
                } else if (this.coinNum < this.shipPrice) {
                    this.rewardCtrl.OpenNoMoney();
                }
            }

            switch (GameSave.Inst.getGuideStep()) {
                case 0://快速买船
                    GameSave.Inst.setGuideStep(1);
                    let p1 = this.poolLayout.node.children[0];
                    let p2 = this.poolLayout.node.children[1];
                    let vp1 = p1.position.add(p1.parent.position);
                    let vp2 = p2.position.add(p2.parent.position);

                    this.hand.setPosition(vp1);
                    this.hand.runAction(cc.sequence(cc.moveTo(0.5, vp2), cc.moveTo(0.5, vp1)).repeatForever());

                    HelpCtrl._instance.maskAsh.active = true;
                    HelpCtrl._instance.maskAsh.getComponentInChildren(cc.Mask).node.height = 200;
                    HelpCtrl._instance.maskAsh.getComponentInChildren(cc.Mask).node.width = 300;
                    HelpCtrl._instance.maskAsh.position = this.hand.position.add(cc.v2(60, 60));

                    HelpCtrl._instance.textLabel.string = HelpCtrl._instance.helptext[1];
                    HelpCtrl._instance.textLabel.node.active = true;
                    HelpCtrl._instance.textLabel.node.position = this.hand.position.add(cc.v2(120, -120));
                    break;
                case 4:
                    GameSave.Inst.setGuideStep(5);
                    HelpCtrl._instance.textLabel.string = HelpCtrl._instance.helptext[3];
                    break;
                case 5:
                    GameSave.Inst.setGuideStep(6);
                    HelpCtrl._instance.textLabel.string = HelpCtrl._instance.helptext[4];
                    break;
                case 6:
                    GameSave.Inst.setGuideStep(7);

                    HelpCtrl._instance.maskAsh.active = false;
                    HelpCtrl._instance.hand.active = false;
                    HelpCtrl._instance.textLabel.node.active = false;
                    HelpCtrl._instance.openEndVeiw();
                    break;
                default:
                    break;
            }
            AudioCtrl._instance.playClick();
        }
    }




    BuyNumAddOne(_shiplevel: number): void {
        let n = GameSave.Inst.getBuyTimes(_shiplevel);
        GameSave.Inst.setBuyTimes(_shiplevel, n + 1);
    }

    BuyDiaNumAddOne(_shiplevel: number): void {
        let n = GameSave.Inst.getBuyDiaTimes(_shiplevel);
        GameSave.Inst.setBuyDiaTimes(_shiplevel, n + 1);
    }

    PlaceVacancy(_ship: ShipItem, _pool: cc.Node): void {
        _ship.CleanPool();
        _ship.Init(_pool, _ship.shipLevel);
    }

    ExchangeShip(_shipA: ShipItem, _shipB: ShipItem): void {
        //交换水池
        let tempPool: cc.Node = _shipA.pool;
        _shipA.Init(_shipB.pool, _shipA.shipLevel);
        _shipB.Init(tempPool, _shipB.shipLevel);
    }



    GetHaveNullPool(): PoolItem {
        let poolList = this.poolLayout.node.children
        for (let index = 0; index < poolList.length; index++) {
            const element =  poolList[index].getComponent(PoolItem);
            if (element.isHaveShip == false) {
             
                return element;
            }
        }
        return null;
    }

    ShowMergeAnima(shipA: cc.Node, shipB: cc.Node, _shipLevel: number, _pool: cc.Node): void {
        let self = this;
        let shipItemA = shipA.getComponent(ShipItem);
        let shipItemB = shipB.getComponent(ShipItem);
        shipItemA.OffEventType();
        shipItemB.OffEventType();
        shipItemA.unscheduleAllCallbacks();
        shipItemB.unscheduleAllCallbacks();
        let vp0 = shipB.position;
        let vp1 = new cc.Vec2(shipB.position.x + 40, shipB.position.y);
        let vp2 = new cc.Vec2(shipB.position.x - 40, shipB.position.y);
        //cc.log(vp1,vp2);
        shipA.stopAllActions();
        shipB.stopAllActions();
        shipA.setPosition(vp0);
        shipB.setPosition(vp0);
        shipA.runAction(cc.sequence(cc.moveTo(0.1, vp1), cc.moveTo(0.1, vp0)));
        shipB.runAction(cc.sequence(cc.moveTo(0.1, vp2), cc.moveTo(0.1, vp0), cc.callFunc(() => {

            shipA.getComponent(ShipItem).DestroyShip();
            self.MergeShip(_shipLevel, _pool);
           

        })));

    }

    MergeShip(_shipLevel: number, _pool: cc.Node): void {


        if (GameSave.Inst.getGuideStep() == 1) {//合成船 设置下一步
            GameSave.Inst.setGuideStep(2);
            this.hand.stopAllActions();
            this.hand.active = false;
            HelpCtrl._instance.maskAsh.active = false;
            HelpCtrl._instance.textLabel.node.active = false;
        }


        if (_shipLevel > this.maxGodLevel) {//如果合成的等级大于最大等级
           // this.scheduleOnce(()=>{
            this.rewardCtrl.OpenTopShipView(_shipLevel);//开最大等级船画面
           // },0);
            this.maxGodLevel += 1;//最大等级加一
            //检测红包获得
            if (this.maxGodLevel == REDENVELOP_OPENLEVEL && FukubukuroCtrl._instance.isNetOpen) {
                FukubukuroCtrl._instance.randomRE(true);
            }
            GameSave.Inst.setMaxLv(this.maxGodLevel);
            this.testingOpenMenuBtn();
            this.appellationLabel.string = DataConfig.GodConfigData[this.maxGodLevel - 1][DataConfig.GOD_Name];
            this.initBuyShipQuickly();
        }else{
            GameUI.Inst.CreateMergeEffectPrf(_pool);
        }

        this.mergeNum += 1;//合成数加一
        this.SetFloatData("mergeNum", this.mergeNum);//保存合成数
        let newship = _pool.getComponent(PoolItem).shipItem;
        newship.Init(_pool, _shipLevel);
        newship.registrationEvent();
        this.ReckonCoinPSNum();
        this.RefreshLabel();//刷新页面
        if (this.maxGodLevel > REDENVELOP_OPENLEVEL && FukubukuroCtrl._instance.isNetOpen) {
            FukubukuroCtrl._instance.testingRewardRE();
        }

        AudioCtrl._instance.playMergerAudio();
    }

}

var gm: GameManager = new GameManager();
window['GameManager'] = gm; //这步不能少