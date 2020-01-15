import SDKCtrl from "./SDKCtrl";
import DailyGiftCtrl from "./DailyGiftCtrl";
import ListGiftCtrl from "./ListGiftCtrl";
import GameManager from "./GameManager";
import ListGiftItem from "./ListGiftItem";
import RenewalAwardCtrl from "./RenewalAwardCtrl";

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
export default class Bitbear extends cc.Component {
    private static _instance: Bitbear;
    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';


    domainName = 'https://constellation.mamapai.net';
    app = 'yu_di';
    public token = null;
    public code = null;
    public current_time = null;//登录时间
    public invite_user_id = null;
    public isInvite: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    public static getInstance(): Bitbear {
        if (!this._instance) {
            this._instance = new Bitbear();
        }
        return this._instance;
    }

    login(_code, query?) {
        let self = this;
          //console.log("Bitbear login  " );
        this.code = _code;
        let channelCode = ""; //渠道 id
        console.log('login');
       // console.log(query);
        if (query) {
            console.log('query');
            if (query.scene) {
                console.log('scene');

                //channelCode 获取场景一：玩家通过外部渠道扫描带渠道参数二维码进入游戏 res.query.scene 形如 cid%3Djtdld
                console.log(query.scene);
                let launchData = decodeURIComponent(query.scene); //转码为"cid=jtdld"的形式
                let reg = new RegExp("(^|&)" + "cid" + "=([^&]*)(&|$)"); //这里的"cid"是规定的渠道标识 key 值
                let r = launchData.match(reg); //查询是否带渠道参数
                if (r != null) {
                    channelCode = unescape(r[2]);
                }
            } else if (query.cid) { //channelCode 获取场景二：玩家通过外部渠道点击跳转进入游戏
                channelCode = query.cid;
            }
        }
        console.log(" login  channelCode  " + channelCode);
       // console.log( channelCode);
       // console.log( query);
        window['wx'].request({
            url: self.domainName + '/user/login',
            data: {
                app: this.app,
                code: _code,
                cid: channelCode,
                version: '1.0.0'
            },
            method: 'POST',
            header: SDKCtrl._instance.getHeader(),
            success: function (data) {
                console.log("successlogin");
                console.log(data);
                self.token = data.data.data.token;
                //HotMod.token = data.data.data.token;
                self.updataUserInfo(data.data.data.token);
                self.invite_user_id = data.data.data.user_id;
                self.current_time = data.data.data.current_time;
               // console.log("data.data.data.is_old_user");
              //  console.log(data.data.data.is_old_user);

                if(data.data.data.is_old_user){
                    self.iSRenewalAwardDiamond((res)=>{
                       // console.log("res.data.is_record)");
                      //  console.log(res);
                      //  console.log(res.data.data.is_record);
                        if(!res.data.data.is_record){
                            RenewalAwardCtrl._instance.openView();
                        }

                    });

                }
                GameManager._instance.LoadData();
                if (query.shareImg) {
                    Bitbear.getInstance().shareInfoLog('分享图' + query.shareImg);
                }
            }
        });
     
    }


   /* aDStatistics(){
        console.log("shareInfoLogStart");
        let self = this;
        window['wx'].request({
            url: self.domainName + '/common/ad-statistics',
            data: {
                app: self.app,
                token: self.token,
                share_img : _share_img
            },
            method: 'POST',
            header: SDKCtrl._instance.getHeader(),
            success: function (data) {
                console.log("aDStatistics");
                console.log(data);
               // viewCallback(data);
            }
        });
    }*/

    
    iSRenewalAwardDiamond(viewCallback){

        let self = this;
        window['wx'].request({
            url: self.domainName + '/yu-di/is-record',
            data: {
                app: self.app,
                token: self.token,
            },
            method: 'POST',
            header: SDKCtrl._instance.getHeader(),
            success: function (data) {
                console.log("successiSRenewalAwardDiamond");
                console.log(data);
                viewCallback(data);
            }
        });

    }


    saveRenewalAwardDiamond(viewCallback){

        let self = this;
        window['wx'].request({
            url: self.domainName + '/yu-di/save-record',
            data: {
                app: self.app,
                token: self.token,
            },
            method: 'POST',
            header: SDKCtrl._instance.getHeader(),
            success: function (data) {
                console.log("successSaveRenewalAwardDiamond");
                console.log(data);
                viewCallback(data);
            }
        });

    }


    shareInfoLog(_share_img : string){
        console.log("shareInfoLogStart");
        let self = this;
        window['wx'].request({
            url: self.domainName + '/common/share-img',
            data: {
                app: self.app,
                token: self.token,
                share_img : _share_img
            },
            method: 'POST',
            header: SDKCtrl._instance.getHeader(),
            success: function (data) {
                console.log("shareInfoLog");
                console.log(data);
               // viewCallback(data);
            }
        });
    }
    downloadData(viewCallback: (data) => void) {
        let self = this;

        window['wx'].request({
            url: self.domainName + '/yu-di/download-data',
            data: {
                app: self.app,
                token: self.token,
            },
            method: 'POST',
            header: SDKCtrl._instance.getHeader(),
            success: function (data) {
                //console.log("successdownloadData");
                //console.log(data);
                viewCallback(data);
            }
        });
    }

    uploadData(_data: string, viewCallback: (data) => void) {

        let self = this;

        window['wx'].request({
            url: self.domainName + '/yu-di/upload-data',
            data: {
                app: self.app,
                token: self.token,
                data: _data
            },

            method: 'POST',
            header: SDKCtrl._instance.getHeader(),
            success: function (result) {
                //console.log("successuploadData");
                //console.log(result);
                viewCallback(result);
            }
        });

    }



    netConfig(viewCallback: (data) => void) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let self = this;
            //console.log("netConfig");
            window['wx'].request({
                url: self.domainName + '/yu-di/get-config',
                data: {

                    app: self.app,
                },

                method: 'POST',
                header: SDKCtrl._instance.getHeader(),
                success: function (data) {
                    console.log("successNetConfig");
                    console.log(data);

                    viewCallback(data);
                }
            });
        }
    }

    inviteLogin(query) {
        let self = this;
        let channelCode = ""; //渠道 id
        if (query.scene) {
            //channelCode 获取场景一：玩家通过外部渠道扫描带渠道参数二维码进入游戏 res.query.scene 形如 cid%3Djtdld
            let launchData = decodeURIComponent(query.scene); //转码为"cid=jtdld"的形式
            let reg = new RegExp("(^|&)" + "cid" + "=([^&]*)(&|$)"); //这里的"cid"是规定的渠道标识 key 值
            let r = launchData.match(reg); //查询是否带渠道参数
            if (r != null) {
                channelCode = unescape(r[2]);
            }
        } else if (query.cid) { //channelCode 获取场景二：玩家通过外部渠道点击跳转进入游戏
            channelCode = query.cid;
        }
        //console.log(" inviteLogin  channelCode  " + channelCode);
        window['wx'].updateShareMenu({
            withShareTicket: true
        });
        window['wx'].login({
            success: function (res1) {
                SDKCtrl._instance.isLogin = true;
                window['wx'].request({
                    url: self.domainName + '/user/login',
                    data: {
                        invite_user_id: query.id,
                        invite_type: query.type,
                        app: self.app,
                        code: res1.code,
                        cid: channelCode,
                        version: '1.0.0'
                    },
                    method: 'POST',
                    header: SDKCtrl._instance.getHeader(),
                    success: function (data) {
                        console.log("successinviteLogin");
                        //console.log(data);
                        self.token = data.data.data.token;
                       // HotMod.token = data.data.data.token;
                        self.updataUserInfo(data.data.data.token);
                        self.invite_user_id = data.data.data.user_id;
                        GameManager._instance.LoadData();
                        if (query.shareImg) {
                            Bitbear.getInstance().shareInfoLog('分享图' + query.shareImg);
                        }
                    }
                });
            }
        });
     
    }



    shareIFGift(invite_user_id) {
        let self = this;
        window['wx'].request({
            url: this.domainName + '/user/login',
            data: {
                invite_user_id: invite_user_id,
                type: '1',
                app: self.app,
                code: self.code
            },
            method: 'POST',
            header: SDKCtrl._instance.getHeader(),
            success: function (data) {
                //console.log("SuccessEncourageIFGift");
                //console.log(data);
            }
        });


    }

    shareIFGiftDay(invite_user_id) {
        let self = this;
        window['wx'].request({
            url: this.domainName + '/user/login',
            data: {
                invite_user_id: invite_user_id,
                type: '2',
                app: self.app,
                code: self.code
            },
            method: 'POST',
            header: SDKCtrl._instance.getHeader(),
            success: function (data) {
                // console.log("SuccessEncourageIFGiftDay");
                //console.log(data);
            }
        });




    }
    giftReceive() {



    }

    getGiftIF() {



    }

    updataUserInfo(_token) {
        let self = this;

        // console.log("startUpdataUserInfo", _token);

        window['wx'].getUserInfo({
            success: function (res2) {
                // console.log('successgetUserInfo');
                // console.log(res2);
                //console.log(res2.userInfo);
                //console.log(res2.userInfo.cid);
                window['wx'].request({
                    url: self.domainName + '/user/update-user-info',
                    data: {
                        "token": _token,
                        "app": self.app,
                        "nickname": res2.userInfo.nickName,
                        "avatar": res2.userInfo.avatarUrl,
                        "gender": '',
                        "country": '',
                        "province": '',
                        "cid": '',
                        "city": ''
                    },
                    method: 'POST',
                    header: SDKCtrl._instance.getHeader(),
                    success: function (data) {
                        data.data.token
                        //console.log("updataUserInfoSuccess");
                        // console.log(data);

                    }
                });

            },
            fail: function (err) {


            }
        });


    }



    receiveListGift(lgi: ListGiftItem) {
        let self = this;

        //console.log("receiveListGift");
        window['wx'].request({
            url: this.domainName + '/yu-di/gift-receive',
            data: {
                gift_id: lgi.gift_id,
                token: self.token,
                app: self.app
            },
            method: 'POST',
            header: SDKCtrl._instance.getHeader(),
            success: function (data) {
                //console.log("successreceiveListGift");
                // console.log(data.data.data.result);
                if (data.data.data.result == 1) {

                    ListGiftCtrl._instance.successReward(lgi);
                } else if (data.data.data.result == 0) {
                    // console.log("successreceiveListGift");
                    // console.log(data.data.data.result);
                    GameManager._instance.messageCtrl.OpenMessage("礼包已领取");
                }

                //console.log(data);
                // ListGiftCtrl._instance.Refresh(data.data.data);


            }
        });

    }


    receiveDayGift() {
        let self = this;

        // console.log("receiveDayGift");
        window['wx'].request({
            url: this.domainName + '/yu-di/gift-day-receive',
            data: {
                token: self.token,
                app: self.app
            },
            method: 'POST',
            header: SDKCtrl._instance.getHeader(),
            success: function (data) {
                // console.log("successreceiveDayGift");
                // console.log(data);
                // console.log(data.data.data.result);
                if (data.data.data.result == 1) {

                    DailyGiftCtrl._instance.successReceiveCoin();
                } else if (data.data.data.result == 0) {

                    GameManager._instance.messageCtrl.OpenMessage("礼包已领取");
                }

                //console.log(data);
                // ListGiftCtrl._instance.Refresh(data.data.data);


            }
        });

    }

    getGiftUserList(viewCallback: (_data) => void) {
        let self = this;
        
        //console.log("getGiftUserList "  +self.token );
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
       
            window['wx'].request({
                url: this.domainName + '/yu-di/get-gift',
                data: {
                    app: self.app,
                    token: self.token
                },
                method: 'POST',
                header: SDKCtrl._instance.getHeader(),
                success: function (data) {
                    console.log("successgetGiftUserList");
                    console.log(data);
                    //console.log(data);
                    // ListGiftCtrl._instance.Refresh(data.data.data);
                    viewCallback(data.data.data);
                }
            });
        } else {


        }

    }

    getGiftDayUserList(viewCallback: (data) => void) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let self = this;
            //console.log("getGiftDayUserList"+self.token);
            // console.log(self.token);
            window['wx'].request({
                url: this.domainName + '/yu-di/get-gift-day',
                data: {
                    app: self.app,
                    token: self.token
                },
                method: 'POST',
                header: SDKCtrl._instance.getHeader(),
                success: function (data) {
                    //console.log("getGiftDayUserList");
                    // console.log(data);
                    // DailyGiftCtrl._instance.refreshIcon(data.data.data);

                    viewCallback(data.data.data);
                    // return data.data.data;
                }
            });
        }

    }

    start() {

    }

    // update (dt) {}
}
