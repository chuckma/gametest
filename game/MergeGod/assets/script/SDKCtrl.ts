// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import GameManager from "./GameManager";
import DiamondStoreCtrl from "./DiamondStoreCtrl";
import RewardCtrl from "./RewardCtrl";
import AccelerateCtrl from "./AccelerateCtrl";
import FlyBoxCtrl from "./FlyBoxCtrl";
import DataConfig, {
    ENCOURAGE_DailyIF,
    ENCOURAGE_ListGiftIF,
    ENCOURAGE_PreiseGiftIF,
    ENCOURAGE_XuanyaoTop,
    ENCOURAGE_RewrdCoinGame,
    SHARE_FAIL_TEXT,
    VIDEO_ID,
    ENCOURAGE_RewrdNoMoney,
    COLLECTIONGUIDANCE_DAINUM,
    VIDEO_FAIL_TEXT,
    VIDEO_PLAY_INTERVAL_TIME,
    ENCOURAGE_RewrdNoDiamond,
    SHARE_MIX_LEAVETIME,
    SHARE_MIX_SUCC_RATE_,
    ENCOURAGE_Outlien,
    ENCOURAGE_FlyBox,
    ENCOURAGE_Accelerate,
    SHARE_NUMFULL_TEXT,
    SHARE_FULL_NUM,
    ENCOURAGE_TopIF,
    DAILY_GIFT_PEOPLE,
    SHARE_CMONPLET_INVITATION_TEXT,
    ENCOURAGE_Fukubukuro,
    SHARE_FULL_NUM_REDENVELOP,
    VIDEO_LOADFAIL1_TEXT,
    VIDEO_LOADFAIL2_TEXT,
    VIDEO_FULL_NUM,
    ENCOURAGE_Default,
    ENCOURAGE_ID,
    ENCOURAGE_SHARE,
    ENCOURAGE_VIDEO,
    ENCOURAGE_RECEIVE,
    ENCOURAGE_SignInDouble,
    ENCOURAGE_SignInOneMore,
    OPERATE_ID,
    ENCOURAGE_AddLottery,
    ENCOURAGE_TurntableBox,
    BANNERAd_ID,
    ENCOURAGE_AddDiamondBtn
} from "./dataConfig";

import PraiseGiftCtrl from "./PraiseGiftCtrl";
import CollectionGuidanceCtrl from "./CollectionGuidanceCtrl";
import TurntableUI from "./TurntableUI";
import AudioCtrl from "./AudioCtrl";
import Bitbear from "./Bitbear";
import GameSave from "./GameSave";
import FukubukuroCtrl from "./FukubukuroCtrl";



const { ccclass, property } = cc._decorator;

@ccclass
export default class SDKCtrl extends cc.Component {
    public static _instance: SDKCtrl = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // @property(cc.Node)
    //startView: cc.Node = null;

    videoAd1 = null;
    videoAd2 = null;
    isVideoId1: boolean = false;
    isVideoId2: boolean = false;
    moreGameList = null;

    isDoubleOutputVideo: boolean = false;
    isCoinVideo: boolean = false;

    gameWidth: number = 0;
    gameHeight: number = 0;

    windowW: number = null;
    windowH: number = null;

    bannerH: number = null;
    isStartTime: boolean = false;
    isCloseBanner: boolean = false;
    sTime: number = 120;
    public bannerAd = null;
    avatarURL = null;

    rewardedVideoAd = null;

    VIDEO_STATE: number = -1;

    leaveGameTime: number;//跳出游戏时间

    public static SHARE_STATE = 0;

    public videoStateStr: string = "";

    videoIntervalTime = 0;



    isLogin: boolean = false;
    //isLogin: boolean = true;
    shareNum: number = 0;//点击分享次数
    shareFailNum: number = 0;//分享失败次数
    isShare: boolean = true;//分享总开关

    isShareCancel: boolean = false;//分享是否取消

    isBannerOpen: boolean = false;//广告条开关

    encourageState: number[] = [];

    // isShareOrVideo: boolean = false;//视频分享切换
    isMessageOpen: boolean = true; // 反馈信息 开关 包括：分享失败、分享成功、分享达到上限；


    sharingWillSucceed: boolean = false; //分享 将成功

    app: string = 'yu_di';
    start() {
        let self = this;
        SDKCtrl._instance = this;
        SDKCtrl.SHARE_STATE = ENCOURAGE_Default;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {

            //获取屏幕尺寸
            window['wx'].updateShareMenu({
                withShareTicket: true
            });
            window['wx'].getSystemInfo({
                success: function (res) {
                    self.windowH = res.windowHeight;
                    self.windowW = res.windowWidth;
                    console.log("wx W" + self.windowW + "  H  " + self.windowH);
                }

            });


            let v = cc.view.getVisibleSize();
            this.gameWidth = v.width;
            this.gameHeight = v.height;
            console.log("game W" + this.gameWidth + "  H  " + this.gameHeight);


            //启动判断是否被邀请
            let launchOption = window['wx'].getLaunchOptionsSync();
            if (launchOption.query.type == '1' || launchOption.query.type == '2') {
                Bitbear.getInstance().inviteLogin(launchOption.query);

            } else {

                SDKCtrl._instance.Login(launchOption.query);
            }

            window['wx'].onShow(function (res) {
                console.log("onShow");
                if (res.query.shareImg) {
                    Bitbear.getInstance().shareInfoLog('分享图' + res.query.shareImg);
                }
                if (res.scene == 1023 || res.scene == 1104) {
                    self.scheduleOnce(function () {
                        if (GameManager._instance.GetIntData("COLLECTIONGUIDANCE", 0) == 0) {
                            GameManager._instance.SetIntData("COLLECTIONGUIDANCE", 1);
                            GameManager._instance.AddDiamond(COLLECTIONGUIDANCE_DAINUM);
                            RewardCtrl._instance.OpenRewardDiamondView(COLLECTIONGUIDANCE_DAINUM);
                            CollectionGuidanceCtrl._instance.CloseRopeBox();
                        }
                    }, 1.5);
                }
            });
            this.schedule(function () {
                if (this.isLogin) {
                    Bitbear.getInstance().getGiftDayUserList(function (data) {
                        //console.log(data);
                        // console.log('每日礼包新长度' + data.giftlist.length + " 之前长度 " + GameSave.Inst.getLastDaygiftlistLength());
                        if (data.giftlist.length > GameSave.Inst.getLastDaygiftlistLength() && data.giftlist.length <= DAILY_GIFT_PEOPLE) {
                            GameManager._instance.messageCtrl.OpenMessage(SHARE_CMONPLET_INVITATION_TEXT);
                        }
                        GameSave.Inst.setLastDaygiftlistLength(data.giftlist.length);
                    });
                    Bitbear.getInstance().getGiftUserList(
                        function (data) {
                            console.log(data);
                            if (data.giftlist.length > GameSave.Inst.getLastGiftlistLength()) {
                                GameManager._instance.messageCtrl.OpenMessage(SHARE_CMONPLET_INVITATION_TEXT);
                            }
                            GameSave.Inst.setLastGiftlistLength(data.giftlist.length);
                        }
                    );
                }
                GameSave.Inst.uploadData();
                GameManager._instance.updateNetConfig();
            }, 60);
        } else {
            GameManager._instance.LoadData();
        }

        cc.game.on(cc.game.EVENT_SHOW, (res) => {
            self.scheduleOnce(function () {
                if (!self.isShareCancel) {
                    console.log("回到游戏", res);
                    // console.log(res);
                    let nt = GameManager._instance.GetIntData("leaveTime", Date.now());
                    self.leaveGameTime = Date.now() - nt;//保存离线时间
                    self.leaveGameTime /= 1000;
                    console.log("重新返回游戏 leaveTime " + self.leaveGameTime);
                    //首次分享必开
                    if (self.ShareSuccessForTheFirstTime()) {
                        console.log("分享id " + SDKCtrl.SHARE_STATE + "必开");
                        self.sharingWillSucceed = true;
                    }
                    if (SDKCtrl.SHARE_STATE == ENCOURAGE_Default
                        || SDKCtrl.SHARE_STATE == ENCOURAGE_DailyIF
                        || SDKCtrl.SHARE_STATE == ENCOURAGE_ListGiftIF) {
                        console.log("默认 和两个礼包");
                        self.sharingWillSucceed = true;
                    }
                    if (SDKCtrl.SHARE_STATE != ENCOURAGE_Default) {
                        console.log("OpenWaitServer --SDKCtrl.SHARE_STATE-- " + SDKCtrl.SHARE_STATE);
                        GameManager._instance.messageCtrl.OpenWaitServer();
                    }
                    if ((self.leaveGameTime > SHARE_MIX_LEAVETIME && Math.random() > SHARE_MIX_SUCC_RATE_)
                        || self.sharingWillSucceed) {
                        console.log("分享成功 n" + SDKCtrl.SHARE_STATE);
                        self.scheduleOnce(function () {
                            self.SuccessEncourage();
                            //SDKCtrl.SHARE_STATE = ENCOURAGE_Default;/////////////////////////////
                        }, 1.2);
                        SDKCtrl._instance.sharingWillSucceed = false;
                        self.shareFailNum = 0;
                    } else {
                        //分享失败
                        self.shareFailNum += 1;
                        if (SDKCtrl.SHARE_STATE != ENCOURAGE_Default) {
                            if (self.isShare) {
                                self.scheduleOnce(function () {
                                    GameManager._instance.messageCtrl.OpenMessage(SHARE_FAIL_TEXT);
                                }, 1.2);
                            }
                        }
                        console.log("分享失败 n" + SDKCtrl.SHARE_STATE);
                        self.scheduleOnce(function () {
                            SDKCtrl.SHARE_STATE = ENCOURAGE_Default;
                        }, 1);
                    }
                }
            }, 0.2);
        }, this);

        cc.game.on(cc.game.EVENT_HIDE, () => {
            console.log("跳到后台");
            GameManager._instance.SetIntData("leaveTime", Date.now());//保存离线时间
            GameSave.Inst.uploadData();
        }, this);

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {

            this.createAuthorizationBtn();
        }
    }

    ShareSuccessForTheFirstTime() {
        if (SDKCtrl.SHARE_STATE != ENCOURAGE_DailyIF && SDKCtrl.SHARE_STATE != ENCOURAGE_ListGiftIF) {
            let sn = GameSave.Inst.getEncourageSuccessNumOf(SDKCtrl.SHARE_STATE);
            if ((sn == 0 || sn == 1) && DiamondStoreCtrl._instance.dayNum == 1) {
                return true;
            }
        }
        return false;
    }

    SuccessEncourage(_state = SDKCtrl.SHARE_STATE) {
        // console.log('SuccessEncourage');
        SDKCtrl.SHARE_STATE = _state;
        switch (_state) {
            case ENCOURAGE_DailyIF:
                if (this.share) {
                    GameManager._instance.messageCtrl.OpenMessage("分享成功，请通知好友.");
                }
                break;
            case ENCOURAGE_ListGiftIF:
                if (this.share) {
                    GameManager._instance.messageCtrl.OpenMessage("分享成功，请通知好友.");
                }
                break;
            case ENCOURAGE_PreiseGiftIF:
                PraiseGiftCtrl._instance.successInviting();

                break;
            case ENCOURAGE_XuanyaoTop:
                RewardCtrl._instance.SuccessXuanyaoShip();
                break;

            case ENCOURAGE_RewrdCoinGame:
                RewardCtrl._instance.SuccessRewrdCoinGame();
                break;

            case ENCOURAGE_RewrdNoMoney:
                RewardCtrl._instance.SuccessNoMoney();
                break;

            case ENCOURAGE_RewrdNoDiamond:
                this.SuccessNoDiamond();
                break;
            case ENCOURAGE_AddLottery:

                TurntableUI._instance.SuccessAddBtnLotteryNum(ENCOURAGE_SHARE);
                break;
            case ENCOURAGE_Outlien:
                RewardCtrl._instance.SuccessOutLienVideo();
                if (this.share) {
                    GameManager._instance.messageCtrl.OpenMessage("获得双倍奖励");
                }
                break;
            case ENCOURAGE_AddDiamondBtn:
                this.SuccessClickAddDiamondBtn();
                break;
            case ENCOURAGE_FlyBox:
                FlyBoxCtrl._instance.SuccessFlyBoxRewardView();
                break;
            case ENCOURAGE_Accelerate:
                this.SuccessDoubleOutput();
                break;

            case ENCOURAGE_Fukubukuro:
                FukubukuroCtrl._instance.SuccessRedEnvelop();
                break;
            case ENCOURAGE_SignInDouble:
                DiamondStoreCtrl._instance.SuccessSignInDouble();
                break;
            case ENCOURAGE_SignInOneMore:
                DiamondStoreCtrl._instance.SuccessSignInDiamondOneMore();
                break;
            case ENCOURAGE_TurntableBox:
                TurntableUI._instance.SuccessBoxVideo();
                break;
            default:
                break;
        }
        GameSave.Inst.addEncourageSuccessNum(_state);

        SDKCtrl.SHARE_STATE = ENCOURAGE_Default;
        GameSave.Inst.uploadData();
    }

    topInvitationShare() {
        this.share(ENCOURAGE_TopIF);
    }

    share(_shareID: number) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let self = this;
            this.isShareCancel = false;
            let _shareNum = 0;
            SDKCtrl.SHARE_STATE = _shareID;

            let type = 0;
            switch (SDKCtrl.SHARE_STATE) {
                case ENCOURAGE_RewrdNoMoney:
                    _shareNum = GameSave.Inst.getEncourageSuccessNumOf(SDKCtrl.SHARE_STATE);
                    break;
                case ENCOURAGE_FlyBox:
                    _shareNum = GameSave.Inst.getEncourageSuccessNumOf(SDKCtrl.SHARE_STATE);
                    break;
                case ENCOURAGE_RewrdNoDiamond:
                    _shareNum = GameSave.Inst.getEncourageSuccessNumOf(SDKCtrl.SHARE_STATE);
                    break;
                case ENCOURAGE_ListGiftIF:
                    type = 1;
                    break;
                case ENCOURAGE_DailyIF:
                    type = 2;
                    break;
                default:

                    break;
            }

            if (self.isShare
                || SDKCtrl.SHARE_STATE == ENCOURAGE_DailyIF
                || SDKCtrl.SHARE_STATE == ENCOURAGE_ListGiftIF
                || SDKCtrl.SHARE_STATE == ENCOURAGE_Fukubukuro) {
                Bitbear.getInstance().netConfig(function (data) {
                    if (self.testingIsShareMAXTime(_shareNum)) {
                        //self.shareNum = self.shareNum + 1;
                        let n = Math.floor(Math.random() * data.data.data.share_text.length);
                        self.shareNum += 1;
                        let shareImg = n + 1;

                        window['wx'].showShareMenu();


                        window['wx'].onShareAppMessage(function () {
                            return {
                                title: data.data.data.share_text[n],
                                imageUrl: data.data.data.share_img[n]
                            }
                        })

                        window['wx'].shareAppMessage({
                            title: data.data.data.share_text[n],
                            imageUrl: data.data.data.share_img[n],
                            query: 'id=' + Bitbear.getInstance().invite_user_id + '&type=' + type + '&shareImg=' + data.data.data.share_name[n],
                            success: function (res: any): void {
                                // GameManager._instance.messageCtrl.OpenMessage("邀请成功");
                                console.log("share success");
                                console.log(res);
                            },

                            cancel: function (res: any): void {
                                // GameManager._instance.messageCtrl.OpenMessage("邀请成功");
                                console.log("share cancel");
                                console.log(res);
                                self.isShareCancel = true;
                                GameManager._instance.messageCtrl.OpenMessage(SHARE_FAIL_TEXT);
                            }
                        });
                    } else {
                        if (self.isShare) {
                            GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
                        }
                    }
                });
            } else {
                if (self.testingIsShareMAXTime(_shareNum)) {
                    self.SuccessEncourage();
                } else {
                    if (self.isShare) {
                        GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
                    }
                }
            }
            //  });
        }
    }


    testingIsShareMAXTime(_shareNum: number): boolean {
        if (SDKCtrl.SHARE_STATE == ENCOURAGE_Fukubukuro) {
            //红包分享上线
            if (GameSave.Inst.getEncourageSuccessNumOf(SDKCtrl.SHARE_STATE) > SHARE_FULL_NUM_REDENVELOP) {
                return false;
            } else {
                return true;
            }
        } else {
            if (_shareNum < SHARE_FULL_NUM) {
                return true;
            } else {
                return false;
            }
        }
    }

    lastVideoID: string = null;
    viewAdVideo(viewCallback: (boolean) => void, videoID: number) {
        //console.log("viewAdVideo  this.videoIntervalTime  " + this.videoIntervalTime);

        //console.log("videoID  " + videoID);
        //console.log("getEncourageSuccessNumOf  " + GameSave.Inst.getEncourageSuccessNumOf(videoID));
        //超过观看次数 不能看
        if (GameSave.Inst.getEncourageSuccessNumOf(videoID) >= VIDEO_FULL_NUM) {
            console.log(VIDEO_LOADFAIL1_TEXT);
            GameManager._instance.messageCtrl.OpenMessage(VIDEO_LOADFAIL1_TEXT);
            return;
        }

        let self = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (this.videoIntervalTime <= 0) {
                this.VIDEO_STATE = videoID;
                let vid = videoID;
                if (vid > VIDEO_ID.length - 1) {

                    vid = 1;

                }
                console.log('激励视频 加载 ' + vid + '  VIDEO_ID ' + VIDEO_ID[vid - 1]);
                self.closeBannerAd();


                if (this.lastVideoID != VIDEO_ID[vid - 1] || this.rewardedVideoAd == null) {
                    this.rewardedVideoAd = window['wx'].createRewardedVideoAd({ adUnitId: VIDEO_ID[vid - 1] });

                }
                this.lastVideoID = VIDEO_ID[vid - 1];

                this.rewardedVideoAd.load();
                this.rewardedVideoAd.onLoad(() => {
                    console.log('激励视频 广告加载成功');
                });
                this.rewardedVideoAd.onError((res) => {
                    console.log(res);
                    GameManager._instance.messageCtrl.OpenMessage(VIDEO_LOADFAIL2_TEXT);
                });
                this.rewardedVideoAd.show().catch(err => {
                    this.rewardedVideoAd.load().then(
                        () => {
                            self.rewardedVideoAd.show();
                        }
                    )
                });

                this.rewardedVideoAd.onClose((res) => {
                    self.rewardedVideoAd.offClose();
                    // 用户点击了【关闭广告】按钮
                    // 小于 2.1.0 的基础库版本，res 是一个 undefined
                    if (res && res.isEnded || res === undefined) {
                        // 正常播放结束，可以下发游戏奖励

                        //console.log("播放成功");
                        self.startVideoIntervalTimer();
                        // GameSave.Inst.addEncourageSuccessNum(videoID);
                        viewCallback(true);
                        self.VIDEO_STATE = -1;
                    }
                    else {
                        // 播放中途退出，不下发游戏奖励
                        // console.log("中途退出");
                        viewCallback(false);

                        self.VIDEO_STATE = -1;
                    }
                    self.openBannerAd();
                    //self.rewardedVideoAd.destroy()
                });
            } else {
                GameManager._instance.messageCtrl.OpenMessage("不要频繁看视频，请" + self.videoIntervalTime + "秒后重试");
            }
        } else {
            console.log("viewAdVideo");
            viewCallback(true);

        }
    }




    Login(query?) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let self = this;
            window['wx'].updateShareMenu({
                withShareTicket: true
            });
            window['wx'].login({
                success: function (res1) {
                    Bitbear.getInstance().login(res1.code, query);
                    //self.openBannerAd();
                    console.log(res1);
                    window['wx'].getUserInfo({
                        success: function (res2) {

                            console.log("获取用户头像成功");
                            console.log(res2);
                            self.isLogin = true;
                        },
                        fail: function (err) {
                            console.log(err);

                        }
                    });
                }
            });
        }
    }

    createAuthorizationBtn() {
        let self = this;
        self.listGiftLoginBtn = window['wx'].createUserInfoButton({
            type: "image",
            image: "res/souquan.png",
            style: {
                left: self.windowW / 2 - (190 * (self.windowW / self.gameWidth)) / 2 + 0 * (self.windowW / self.gameWidth),
                top: self.windowH / 2 - (68 * (self.windowH / self.gameHeight)) / 2 + 365 * (self.windowH / self.gameHeight),
                width: 190 * (self.windowW / self.gameWidth),
                height: 68 * (self.windowH / self.gameHeight),
                lineHeight: 0,
                backgroundColor: '#e88414',
                color: '#ffffff',
                textAlign: 'center',
                borderRadius: 0
            },
            withCredentials: true
        });
        self.closeListGiftLoginBtn();

        self.dailyAuthorizationBtn = window['wx'].createUserInfoButton({
            type: "image",
            image: "res/souquan.png",
            style: {
                left: self.windowW / 2 - (190 * (self.windowW / self.gameWidth)) / 2 + 0 * (self.windowW / self.gameWidth),
                top: self.windowH / 2 - (68 * (self.windowH / self.gameHeight)) / 2 + 205 * (self.windowH / self.gameHeight),
                width: 190 * (self.windowW / self.gameWidth),
                height: 68 * (self.windowH / self.gameHeight),
                lineHeight: 0,
                backgroundColor: '#e88414',
                color: '#ffffff',
                textAlign: 'center',
                borderRadius: 0
            },
            withCredentials: true
        });
        self.closeDailyGiftAuthorizationBtn();
    }


    listGiftLoginBtn = null;
    createListGiftLoginBtn(viewCallback: (boolean) => void) {

        let self = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            window['wx'].updateShareMenu({
                withShareTicket: true
            });
            window['wx'].login({
                success: function (res1) {
                    // Bitbear.getInstance().login(res1.code);
                    console.log(res1);
                    window['wx'].getUserInfo({
                        success: function (res2) {
                            //self.openBannerAd();
                            // console.log("获取用户头像成功");
                            console.log(res2);
                            self.isLogin = true;

                            viewCallback(true);
                        },
                        fail: function (err) {
                            console.log(err);
                            self.closeListGiftLoginBtn();
                            self.listGiftLoginBtn.show();
                            self.listGiftLoginBtn.onTap((res3) => {
                                // self.openBannerAd();
                                console.log(res3);
                                //console.log("获取用户头像成功");
                                if (res3.errMsg == 'getUserInfo:ok') {
                                    self.isLogin = true;
                                    viewCallback(true);
                                    self.listGiftLoginBtn.hide();
                                    //button2.hide();
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    closeListGiftLoginBtn() {
        if (this.listGiftLoginBtn != null) {
            this.listGiftLoginBtn.hide();
        }
    }

    dailyAuthorizationBtn = null;
    createDailyGiftAuthorizationBtn(viewCallback: (boolean) => void) {
        let self = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            window['wx'].updateShareMenu({
                withShareTicket: true
            });
            window['wx'].login({
                success: function (res1) {
                    //Bitbear.getInstance().login(res1.code);
                    console.log(res1);
                    window['wx'].getUserInfo({
                        success: function (res2) {
                            self.isLogin = true;
                            viewCallback(true);
                            //self.openBannerAd();
                            // console.log("获取用户头像成功");
                            console.log(res2);
                        },
                        fail: function (err) {
                            console.log(err);
                            self.closeDailyGiftAuthorizationBtn();
                            self.dailyAuthorizationBtn.show();
                            self.dailyAuthorizationBtn.onTap((res3) => {
                                // self.openBannerAd();
                                console.log(res3);
                                //console.log("获取用户头像成功");
                                if (res3.errMsg == 'getUserInfo:ok') {
                                    self.isLogin = true;
                                    viewCallback(true);
                                    self.dailyAuthorizationBtn.hide();
                                    //button2.hide();
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    closeDailyGiftAuthorizationBtn() {
        if (this.dailyAuthorizationBtn != null) {
            this.dailyAuthorizationBtn.hide();
        }
    }

    //获取sessionid
    getHeader(): any {
        let header: any = { 'Content-Type': 'application/json' };
        let cookie: any = window['wx'].getStorageSync("SESSID");
        if (cookie) {
            header.Cookie = cookie;
        }
        return header;
    }


    SuccessDoubleOutput() {

        let s = AccelerateCtrl._instance.btn_time[AccelerateCtrl._instance.ACCELERATE_ENCOURAGE];
        this.startDoubleOutputTimer(s);

        GameManager._instance.messageCtrl.OpenMessage("加速成功");
    }

    public OpenRecommendGames() {
        let url = '';
        if (cc.sys.platform == cc.sys.WECHAT_GAME && GameManager._instance.inMainView) {
            let self = this;
            window['wx'].request({
                url: url, dataType: 'json', success: function (object) {

                    console.log("object");
                    console.log(object);
                    self.moreGameList = object;
                    self.showMoreGame(
                        self.moreGameList.data.data.ad.ad1[0].ad_id
                        , self.moreGameList.data.data.ad.ad1[0].ad_old_url
                        , self.moreGameList.data.data.ad.ad1[0].channel_parameters
                    );

                }
            });
        }
    }


    ////////////////////////////////////////////////////////////////
    ClickNoDiamondEncourage(taget, eState) {
        AudioCtrl._instance.playClick();
        let self = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            // if (GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_RewrdNoDiamond) < DataConfig.getOperateDataValue(OPERATE_ID.noDiamond_dayOpen_maxNum)) {
            switch (parseInt(eState)) {

                case ENCOURAGE_RECEIVE:
                    console.log('ENCOURAGE_RECEIVE');
                    SDKCtrl.SHARE_STATE = ENCOURAGE_RewrdNoDiamond;
                    SDKCtrl._instance.SuccessEncourage();
                    break;
                case ENCOURAGE_SHARE:
                    console.log('ENCOURAGE_SHARE');
                    this.share(ENCOURAGE_RewrdNoDiamond);
                    break;
                case ENCOURAGE_VIDEO:
                    console.log('ENCOURAGE_VIDEO');
                    SDKCtrl._instance.viewAdVideo(
                        (ok) => {
                            if (ok) {
                                SDKCtrl.SHARE_STATE = ENCOURAGE_RewrdNoDiamond;
                                SDKCtrl._instance.SuccessEncourage();
                            } else {
                                GameManager._instance.messageCtrl.OpenMessage(VIDEO_FAIL_TEXT);
                            }
                        }, ENCOURAGE_RewrdNoDiamond
                    );
                    break;
                default:
                    break;
            }
            /* } else {
                 GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
                 RewardCtrl._instance.CloseNoMoney();
             }*/
        } else {
            SDKCtrl.SHARE_STATE = ENCOURAGE_RewrdNoDiamond;
            self.SuccessEncourage();
        }
    }


    SuccessNoDiamond() {
        let n = GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_RewrdNoDiamond);
        if (n >= DataConfig.ShareRewardData.length) {

            n = DataConfig.ShareRewardData.length - 1;
        }
        let data = DataConfig.ShareRewardData[n];
        let diaNum = data[DataConfig.ShareReward_Short_Diamond];
        GameManager._instance.AddDiamond(diaNum);
        this.scheduleOnce(() => {

            RewardCtrl._instance.OpenRewardDiamondView(diaNum);

        }, 0.2);
    }

    topIFShare() {

        this.share(ENCOURAGE_TopIF);

    }

    cddd = null;
    public startVideoIntervalTimer() {
        console.log("startVideoIntervalTimer");
        this.videoIntervalTime = VIDEO_PLAY_INTERVAL_TIME;

        this.schedule(this.cddd = () => {
            this.videoIntervalTime = this.videoIntervalTime - 1;
            if (this.videoIntervalTime <= 0) {
                this.unschedule(this.cddd);
            }
        }, 1);


    }
    public ClickOutlienEncourage(taget, eState) {

        console.log('OpenOutlienVideo');
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            //switch (this.encourageState[ENCOURAGE_ID.outline_double]) {
            switch (parseInt(eState)) {
                case ENCOURAGE_RECEIVE:
                    console.log('ENCOURAGE_RECEIVE');
                    SDKCtrl.SHARE_STATE = ENCOURAGE_Outlien;
                    SDKCtrl._instance.SuccessEncourage();
                    break;
                case ENCOURAGE_SHARE:
                    console.log('ENCOURAGE_SHARE');
                    this.share(ENCOURAGE_Outlien);
                    break;
                case ENCOURAGE_VIDEO:
                    console.log('ENCOURAGE_VIDEO');
                    SDKCtrl._instance.viewAdVideo(
                        (ok) => {
                            if (ok) {
                                SDKCtrl.SHARE_STATE = ENCOURAGE_Outlien;
                                SDKCtrl._instance.SuccessEncourage();
                                GameManager._instance.messageCtrl.OpenMessage("播放成功 获得双倍奖励");
                            } else {
                                GameManager._instance.messageCtrl.OpenMessage(VIDEO_FAIL_TEXT);
                                // this.openBannerAd();
                            }
                        }
                        , ENCOURAGE_Outlien
                    );
                    break;
                default:
                    break;
            }
        } else {
            SDKCtrl.SHARE_STATE = ENCOURAGE_Outlien;
            SDKCtrl._instance.SuccessEncourage();
        }
    }

    public SignInDiamondEncourage(taget, eState) {
        console.log('OpenSignInEncourage');
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            //switch (this.encourageState[ENCOURAGE_ID.signIn_double]) {
            switch (parseInt(eState)) {
                case ENCOURAGE_RECEIVE:
                    SDKCtrl.SHARE_STATE = ENCOURAGE_SignInDouble;
                    SDKCtrl._instance.SuccessEncourage();
                    break;
                case ENCOURAGE_SHARE:
                    this.share(ENCOURAGE_SignInDouble);
                    break;
                case ENCOURAGE_VIDEO:
                    SDKCtrl._instance.viewAdVideo(
                        (ok) => {
                            if (ok) {
                                SDKCtrl.SHARE_STATE = ENCOURAGE_SignInDouble;
                                SDKCtrl._instance.SuccessEncourage();
                            } else {
                                GameManager._instance.messageCtrl.OpenMessage(VIDEO_FAIL_TEXT);
                                //this.openBannerAd();
                            }
                        }, ENCOURAGE_SignInDouble);
                    break;
                default:
                    break;
            }
        } else {
            DiamondStoreCtrl._instance.SuccessSignInDouble();
        }
    }


    public OpenSignInDiamondOneMoreVideo() {
        console.log('OpenSignInDiamondOneMoreVideo');
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (!this.isStartTime && GameManager._instance.inMainView) {

                switch (this.encourageState[ENCOURAGE_ID.signIn_onemore]) {
                    case ENCOURAGE_RECEIVE:
                        SDKCtrl.SHARE_STATE = ENCOURAGE_SignInOneMore;
                        SDKCtrl._instance.SuccessEncourage();
                        break;
                    case ENCOURAGE_SHARE:
                        this.share(ENCOURAGE_SignInOneMore);
                        break;
                    case ENCOURAGE_VIDEO:
                        SDKCtrl._instance.viewAdVideo((ok) => {
                            if (ok) {
                                SDKCtrl.SHARE_STATE = ENCOURAGE_SignInOneMore;
                                SDKCtrl._instance.SuccessEncourage();
                                GameManager._instance.messageCtrl.OpenMessage("获得双倍奖励");
                            } else {
                                GameManager._instance.messageCtrl.OpenMessage(VIDEO_FAIL_TEXT);
                                //this.openBannerAd();
                            }
                        }, ENCOURAGE_SignInDouble);
                        break;
                    default:
                        break;
                }

            }
        } else {
            DiamondStoreCtrl._instance.SuccessSignInDiamondOneMore();
            GameManager._instance.messageCtrl.OpenMessage("获得双倍奖励");
        }
    }

    public AddLotteryNumEncourage() {
        let maxNum = DataConfig.getOperateDataValue(OPERATE_ID.lottery_share_max);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            //console.log('AddLotteryNumEncourage' + this.encourageState[ENCOURAGE_ID.lottery]);


            switch (this.encourageState[ENCOURAGE_ID.lottery]) {
                case ENCOURAGE_RECEIVE:

                    SDKCtrl.SHARE_STATE = ENCOURAGE_AddLottery;
                    SDKCtrl._instance.SuccessEncourage();
                    break;
                case ENCOURAGE_SHARE:
                    if (GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_AddLottery) >= maxNum) {
                        GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
                        return;
                    }
                    SDKCtrl._instance.share(ENCOURAGE_AddLottery);
                    break;
                case ENCOURAGE_VIDEO:
                    if (GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_AddLottery) >= maxNum) {
                        GameManager._instance.messageCtrl.OpenMessage(VIDEO_LOADFAIL1_TEXT);
                        return;
                    }
                    this.isClickVideo = true;
                    SDKCtrl._instance.viewAdVideo((ok) => {
                        if (ok) {
                            if (this.isClickVideo) {
                                this.isClickVideo = false;
                                SDKCtrl.SHARE_STATE = ENCOURAGE_AddLottery;
                                SDKCtrl._instance.SuccessEncourage();
                            }
                        } else {
                            GameManager._instance.messageCtrl.OpenMessage("播放中途退出,请重新观看");
                            // SDKCtrl._instance.openBannerAd();
                        }
                    }, ENCOURAGE_AddLottery);
                    break;
                default:
                    break;
            }
        } else {
            //console.log(GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_AddLottery) + '  ' + maxNum);
            if (GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_AddLottery) >= maxNum) {
                GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
                return;
            }
            // SDKCtrl._instance.share(ENCOURAGE_AddLottery);
            SDKCtrl.SHARE_STATE = ENCOURAGE_AddLottery;
            SDKCtrl._instance.SuccessEncourage();
        }

    }

    isClickVideo: Boolean = false;
    ClickAddDiamondBtn() {
        let succNum = GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_AddDiamondBtn);
        console.log("  ClickAddDiamondBtn succNum  " + succNum);
        if (succNum < DataConfig.getOperateDataValue(OPERATE_ID.addDiamondBtn_dayOpen_maxNum)) {
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {

                GameManager._instance.messageCtrl.OpenMessage("即将获得200钻石", 1);

                this.isClickVideo = true;
                SDKCtrl._instance.viewAdVideo(
                    (ok) => {
                        if (ok) {
                            if (this.isClickVideo) {
                                this.isClickVideo = false;
                                this.SuccessEncourage(ENCOURAGE_AddDiamondBtn);
                            }
                        } else {
                            GameManager._instance.messageCtrl.OpenMessage("获取失败，请重新尝试", 1);
                            // this.openBannerAd();
                        }
                    }
                    , ENCOURAGE_AddDiamondBtn
                );
            } else {
                this.SuccessEncourage(ENCOURAGE_AddDiamondBtn);
            }
        } else {
            GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
        }
    }

    SuccessClickAddDiamondBtn() {
        GameManager._instance.AddDiamond(200);
        GameManager._instance.messageCtrl.OpenMessage("钻石 +200", 1);
    }

    public NoMoneyEncourage(taget, eState) {

        let maxNum = DataConfig.getOperateDataValue(OPERATE_ID.noMoney_dayOpen_maxNum);
        let sNoMoneyNum = GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_RewrdNoMoney);
        let sflyBox = GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_FlyBox);
        let succNum = sNoMoneyNum + sflyBox;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {


            // switch (this.encourageState[ENCOURAGE_ID.noMoney]) {
            switch (parseInt(eState)) {
                case ENCOURAGE_RECEIVE:
                    if (succNum >= maxNum) {
                        GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
                        return;
                    }
                    SDKCtrl.SHARE_STATE = ENCOURAGE_RewrdNoMoney;
                    SDKCtrl._instance.SuccessEncourage();
                    break;
                case ENCOURAGE_SHARE:
                    if (succNum >= maxNum) {
                        //console.log("金币不足 分享超出")
                        GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
                        return;
                    }
                    this.share(ENCOURAGE_RewrdNoMoney);
                    break;
                case ENCOURAGE_VIDEO:
                    if (succNum >= maxNum) {
                        //console.log("金币不足 视频超出")
                        GameManager._instance.messageCtrl.OpenMessage(VIDEO_LOADFAIL1_TEXT);
                        return;
                    }
                    SDKCtrl._instance.viewAdVideo((ok) => {
                        if (ok) {
                            SDKCtrl.SHARE_STATE = ENCOURAGE_RewrdNoMoney;
                            SDKCtrl._instance.SuccessEncourage();
                        } else {
                            GameManager._instance.messageCtrl.OpenMessage(VIDEO_FAIL_TEXT);
                        }
                    }, ENCOURAGE_RewrdNoMoney);
                    break;
                default:
                    break;
            }
        } else {
            if (succNum >= maxNum) {
                GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
                return;
            }
            SDKCtrl.SHARE_STATE = ENCOURAGE_RewrdNoMoney;
            SDKCtrl._instance.SuccessEncourage();

        }

    }

    public OpenDoubleOutputEncourage() {

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (!this.isStartTime && GameManager._instance.inMainView) {
                let maxNum = DataConfig.getOperateDataValue(OPERATE_ID.accBtn2_dayOpen_maxNum);
                let eState = ENCOURAGE_VIDEO;
                switch (eState) {
                    case ENCOURAGE_RECEIVE:
                        SDKCtrl.SHARE_STATE = ENCOURAGE_Accelerate;
                        this.SuccessEncourage();
                        break;
                    case ENCOURAGE_SHARE:
                        if (GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_Accelerate) >= maxNum) {
                            GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
                            return;
                        }
                        this.share(ENCOURAGE_Accelerate);
                        break;
                    case ENCOURAGE_VIDEO:
                        if (GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_Accelerate) >= maxNum) {
                            GameManager._instance.messageCtrl.OpenMessage(VIDEO_LOADFAIL1_TEXT);
                            return;
                        }


                        GameManager._instance.messageCtrl.OpenMessage("生产速度 x2 ，持续" + 60 + "秒", 1);
                        SDKCtrl._instance.viewAdVideo((ok) => {
                            if (ok) {
                                SDKCtrl.SHARE_STATE = ENCOURAGE_Accelerate;
                                this.SuccessEncourage();
                            } else {
                                GameManager._instance.messageCtrl.OpenMessage("加速失败");
                                // GameManager._instance.messageCtrl.OpenMessage(VIDEO_FAIL_TEXT);
                            }
                        }, ENCOURAGE_Accelerate);
                        break;
                    default:
                        break;
                }
            }
        } else {
            SDKCtrl.SHARE_STATE = ENCOURAGE_Accelerate;
            this.SuccessEncourage();
        }
    }
    public TurntableBoxVideo(event, customEventData) {
        //console.log("FlyBoxVideo");
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let eID = null;
            switch (TurntableUI._instance.treasureBoxAdditionNum * TurntableUI._instance.tempTreasureBoxAdditionNum) {
                case 5:
                    eID = ENCOURAGE_ID.turntable_5;
                    break;
                case 10:
                    eID = ENCOURAGE_ID.turntable_10;
                    break;
                case 25:
                    eID = ENCOURAGE_ID.turntable_25;
                    break;
                case 50:
                    eID = ENCOURAGE_ID.turntable_50;
                    break;
                case 100:
                    eID = ENCOURAGE_ID.turntable_100;
                    break;
                default:
                    break;
            }
            let n = GameManager._instance.GetIntData("TurntableBoxVideo", 0);
            if (n < 2 && TurntableUI._instance.treasureBoxAdditionNum * TurntableUI._instance.tempTreasureBoxAdditionNum >= 25) {
                GameManager._instance.SetIntData("TurntableBoxVideo", n + 1);
                SDKCtrl.SHARE_STATE = ENCOURAGE_TurntableBox;
                SDKCtrl._instance.SuccessEncourage();
                return;
            }
            switch (this.encourageState[eID]) {
                case ENCOURAGE_RECEIVE:
                    SDKCtrl.SHARE_STATE = ENCOURAGE_TurntableBox;
                    SDKCtrl._instance.SuccessEncourage();
                    //TurntableUI._instance.SuccessBoxVideo();
                    break;
                case ENCOURAGE_SHARE:
                    this.share(ENCOURAGE_TurntableBox);
                    break;
                case ENCOURAGE_VIDEO:
                    SDKCtrl._instance.viewAdVideo((ok) => {
                        if (ok) {
                            SDKCtrl.SHARE_STATE = ENCOURAGE_TurntableBox;
                            SDKCtrl._instance.SuccessEncourage();
                        } else {
                            GameManager._instance.messageCtrl.OpenMessage(VIDEO_FAIL_TEXT);
                            //this.openBannerAd();
                        }
                    }, ENCOURAGE_TurntableBox);
                    break;
                default:
                    break;
            }
        } else {
            SDKCtrl.SHARE_STATE = ENCOURAGE_TurntableBox;
            SDKCtrl._instance.SuccessEncourage();
            //TurntableUI._instance.SuccessBoxVideo();

        }
    }




    public FlyBoxEncourage(event, eState) {
        //console.log("FlyBoxEncourage");
        let maxNum = DataConfig.getOperateDataValue(OPERATE_ID.flybox_dayOpen_maxNum);
        let sNoMoneyNum = GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_RewrdNoMoney);
        let sflyBox = GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_FlyBox);

        let succNum = sflyBox + sNoMoneyNum;

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {


            //switch (this.encourageState[ENCOURAGE_ID.flybox]) {
            switch (parseInt(eState)) {
                case ENCOURAGE_RECEIVE:
                    if (succNum >= maxNum) {
                        GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
                        return;
                    }
                    SDKCtrl.SHARE_STATE = ENCOURAGE_FlyBox;
                    this.SuccessEncourage();
                    break;
                case ENCOURAGE_SHARE:
                    if (succNum >= maxNum) {
                        GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
                        return;
                    }
                    this.share(ENCOURAGE_FlyBox);
                    break;
                case ENCOURAGE_VIDEO:
                    if (succNum >= maxNum) {
                        GameManager._instance.messageCtrl.OpenMessage(VIDEO_LOADFAIL1_TEXT);
                        return;
                    }
                    SDKCtrl._instance.viewAdVideo((ok) => {
                        if (ok) {
                            SDKCtrl.SHARE_STATE = ENCOURAGE_FlyBox;
                            this.SuccessEncourage();
                        } else {
                            GameManager._instance.messageCtrl.OpenMessage(VIDEO_FAIL_TEXT);
                            //this.openBannerAd();
                        }
                    }, ENCOURAGE_FlyBox);
                    break;
                default:
                    break;
            }
        } else {
            if (succNum >= maxNum) {
                GameManager._instance.messageCtrl.OpenMessage(SHARE_NUMFULL_TEXT);
                return;
            }
            SDKCtrl.SHARE_STATE = ENCOURAGE_FlyBox;
            this.SuccessEncourage();
        }
    }


    FlyBoxBtnClose() {
        cc.find("Canvas/UI/FlyBoxBtn").active = false;
        this.scheduleOnce(function () {
            cc.find("Canvas/UI/FlyBoxBtn").active = true;
        }, 30);
    }

    SuccessCoinNoMoneyVideo() {
        console.log("SuccessCoinNoMoneyVideo");
        GameManager._instance.AddCoin(DataConfig.getFlyBoxCoin());
    }

    closeBannerAd() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            // if (this.isBannerOpen) {
            this.isCloseBanner = true;
            if (this.bannerAd != null) {
                this.bannerAd.destroy();
            }
            // }
        }
    }

    openBannerAd() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {


            let openLevel = DataConfig.getOperateDataValue(OPERATE_ID.banner_open_level);
            if (this.isBannerOpen && GameManager._instance.maxGodLevel >= openLevel) {
                this.isCloseBanner = false;

                let self = this;
                let top1: number = self.windowH - self.bannerH;
                //let top1: number = self.windowH - 107.6;
                console.log(top1);
                if (self.bannerAd != null) {
                    self.bannerAd.destroy();
                }
                let pixelRatio = self.gameHeight / self.windowH;


               // let h = (self.gameHeight / 2 - 437) / pixelRatio
                let h = (self.gameHeight / 2 - 300) / pixelRatio
                console.log(self.gameHeight);
                console.log(self.gameHeight / 2);
                console.log("Banner H  " + h);


                let aspectRatio =self.gameWidth/ self.gameHeight;
                console.log("aspectRatio " + aspectRatio);
                if (aspectRatio < 0.47) {
                    // X
                    console.log("x " + h);
                    let xtop = top1-50;
                    self.bannerAd = window['wx'].createBannerAd({
                        adUnitId: BANNERAd_ID,
                        style: { left: 0, top: xtop, width: self.windowW }
                    });

                }else{

                    self.bannerAd = window['wx'].createBannerAd({
                        adUnitId: BANNERAd_ID,
                        style: { left: 0, top: top1, height: h }
                    });
                }
                self.bannerAd.onError((res) => {
                    console.log('bannerAd onError');
                    console.log(res);
                });

                self.bannerAd.onResize(function (res) {
                    console.log("onResize res  ");
                    console.log(res);
                    let w = (res.width / res.height) * h;
                    if (w > self.windowW) {
                        w = self.windowW;
                        h = Math.floor(w / (res.width / res.height));

                    }
                    console.log("   w  " + w + " h " + h);
                    self.bannerAd.style.left = self.windowW / 2 - res.width / 2;
               

                    if (aspectRatio < 0.47) {
                         // X
                        self.bannerAd.style.width = self.windowW;
                        self.bannerAd.style.top = self.windowH - res.height - 50;
                    }else{
                        self.bannerAd.style.height = h;
                        self.bannerAd.style.width = w;
                        self.bannerAd.style.top = self.windowH - res.height;
                    }
                 
       
                    self.bannerAd.show();
                });
            }
        }
    }


    /*  self.bannerAd = window['wx'].createBannerAd({
          adUnitId: BANNERAd_ID,
          style: { left: 0, top: top1, width: self.windowW * 0.5 }
      });
  
      self.bannerAd.onError((res) => {
          console.log('bannerAd onError');
          console.log(res);
      });
  
      self.bannerAd.onResize(function (res) {
          self.bannerAd.style.height = res.height * 0.1;
          self.bannerAd.style.width = 300;
          self.bannerAd.style.left = self.windowW / 2 - res.width / 2;
          self.bannerAd.style.top = self.windowH - res.height;
          self.bannerAd.show();
      });*/

    public turntablePigEncourage(tag, maxpiglevel: string) {
        let _maxpiglevel: number = parseInt(maxpiglevel);
        let _PoolItem = GameManager._instance.GetHaveNullPool();
        if (_PoolItem) {
            GameManager._instance.AddShip(_PoolItem, _maxpiglevel);
        } else {
            let addCoinNum = GameManager._instance.getCoinPrice(_maxpiglevel);
            GameManager._instance.messageCtrl.OpenMessage("猪猪已满，已兑换金币" + GameManager._instance.GetNumString(addCoinNum));
            GameManager._instance.AddCoin(addCoinNum);
        }

        RewardCtrl._instance.CloseRewardView();

    }

    public turntableAccelerate(tag, addTime: string) {
        let _addTime: number = parseInt(addTime);
        if (this.isStartTime) {
            this.sTime = this.sTime + _addTime;
            this.startDoubleOutputTimer(this.sTime);
        } else {
            this.startDoubleOutputTimer(_addTime);
        }
        RewardCtrl._instance.CloseRewardView();

    }

    cbb;
    public startDoubleOutputTimer(_accTime: number): void {
        this.sTime = _accTime;

        console.log(this.sTime);
        AccelerateCtrl._instance.closeView();
        let vb: cc.Node = GameManager._instance.uINode.getChildByName("AccelerateBtn");

        let timeLabel = vb.getChildByName("timeLabel");
        timeLabel.active = true;
        timeLabel.getComponent(cc.Label).string = '';
        vb.color = cc.Color.GRAY;
        vb.getComponent(cc.Button).enabled = false;


        this.unschedule(this.cbb);
        this.isStartTime = true;
        // GameManager.addSpeedNum = AccelerateCtrl._instance.btn_rate[_accID];
        GameManager.addSpeedNum = 2;

        GameManager._instance.RefreshLabel();
        GameManager._instance.UpdateOutputSpeed();
        this.schedule(this.cbb = function () {
            timeLabel.getComponent(cc.Label).string = this.sTime + "秒";
            this.sTime--;
            GameSave.Inst.setDoubleOutputTime(this.sTime);
            if (this.sTime == 0) {
                vb.color = cc.Color.WHITE;
                vb.getComponent(cc.Button).enabled = true;
                timeLabel.active = false;
                GameManager.addSpeedNum = 1;
                GameManager._instance.RefreshLabel();
                GameSave.Inst.setDoubleOutputTime(this.sTime);
                GameManager._instance.UpdateOutputSpeed();
                this.isStartTime = false;

            }
        }, 1, this.sTime);

    }

    public VideoADClick(ad_id: any, ad_old_url: any, channel_parameters: any): void {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (window['wx'].navigateToMiniProgram != undefined) {
                window['wx'].navigateToMiniProgram({
                    appId: ad_id,
                    path: channel_parameters
                });
            } else {
                if (ad_old_url && ad_old_url != "") window['wx'].previewImage({ urls: [ad_old_url] });
            }
        }
    }

    public handlerBannerAdClick(ad_id: any, ad_old_url: any, channel_parameters: any): void {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (window['wx'].navigateToMiniProgram != undefined) {
                window['wx'].navigateToMiniProgram({
                    appId: ad_id,
                    path: channel_parameters
                });
            } else {
                if (ad_old_url && ad_old_url != "") window['wx'].previewImage({ urls: [ad_old_url] });
            }
        }
    }

    public showMoreGame(ad_id: any, ad_old_url: any, channel_parameters: any): void {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (window['wx'].navigateToMiniProgram != undefined) {
                window['wx'].navigateToMiniProgram({
                    appId: ad_id,
                    path: channel_parameters
                });
            } else {
                if (ad_old_url && ad_old_url != "") window['wx'].previewImage({ urls: [ad_old_url] });
            }
        }
    }


    // update (dt) {}
}
