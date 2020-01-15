import RankItem from "./RankItem";
import MyInfo from "./MyInfo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameRankingList extends cc.Component {

    @property(cc.ScrollView)
    rankingScrollView: cc.ScrollView = null;
    @property(cc.Node)
    scrollViewContent: cc.Node = null;
    @property(cc.Prefab)
    prefabRankItem: cc.Prefab = null;
    @property(cc.Prefab)
    prefabGameOverRank: cc.Prefab = null;
    @property(cc.Node)
    gameOverRankLayout: cc.Node = null;
    @property(cc.Node)
    loadingLabel: cc.Node = null;//加载文字


    @property(cc.Node)
    myInfo: cc.Node = null
    
    public static AppellationData = [[]];

    close() {

        window.wx.postMessage({
            close: 1,
        });

    }

    start() {

        let self = this;
        cc.loader.loadRes('data/GodData', function (err, data) {

            let tcd = data.text.split("\n");
            // console.log(tcd.length);
            for (let i = 1; i < tcd.length; i++) {
                let ttcd = tcd[i].split(",");
                GameRankingList.AppellationData.push([]);
                //console.log(ttcd);
                GameRankingList.AppellationData[i - 1][0]=parseFloat(ttcd[0]);
                GameRankingList.AppellationData[i - 1][1]=ttcd[1];
            }
            self.removeChild();
            if (CC_WECHATGAME) {
                wx.onMessage(data => {
                    cc.log("接收主域发来消息：", data)
                    if (data.messageType == 0) {//移除排行榜
                        self.removeChild();
                    } else if (data.messageType == 1) {//获取好友排行榜
                        self.fetchFriendData(data.MAIN_SC_KAY,data.MAIN_APPE_KAY);
                    } else if (data.messageType == 3) {//提交得分
                        self.submitScore(data.MAIN_SC_KAY, data.score,data.MAIN_APPE_KAY,data.appellationNum);
                    } else if (data.messageType == 4) {//获取好友排行榜横向排列展示模式
                        self.gameOverRank(data.MAIN_SC_KAY);
                    } else if (data.messageType == 5) {//获取群排行榜
                        self.fetchGroupFriendData(data.MAIN_SC_KAY, data.shareTicket);
                    }
                });
            } else {
                self.fetchFriendData();
                // this.gameOverRank(1000);
            }
        });
    }

    submitScore(MAIN_SC_KAY, score,MAIN_APPE_KAY,appellationNum) { //提交得分
        //if (CC_WECHATGAME) {

        //console.log("submitScore ---------  " , MAIN_SC_KAY,score,MAIN_APPE_KAY ,appellationNum);
        wx.getUserCloudStorage({
            // 以key/value形式存储
            keyList: [MAIN_SC_KAY],
            success: function (getres) {
                //console.log('getUserCloudStorage', 'success', getres,)
                if (getres.KVDataList.length != 0) {
                    if (score && getres.KVDataList[0].value > score) {
                        return;
                    }
                }
                // 对用户托管数据进行写数据操作
                wx.setUserCloudStorage({
                    KVDataList: [
                        { key: MAIN_SC_KAY, value: "" + score }
                        ,{ key: MAIN_APPE_KAY, value: "" + appellationNum }
                    ],
                    success: function (res) {
                        //console.log('setUserCloudStorage', 'success', res)
                    },
                    fail: function (res) {
                      //  console.log('setUserCloudStorage', 'fail')
                    },
                    complete: function (res) {
                       // console.log('setUserCloudStorage', 'ok')
                    }
                });
             
            },
            fail: function (res) {
              //  console.log('getUserCloudStorage', 'fail')
            },
            complete: function (res) {
              //  console.log('getUserCloudStorage', 'ok')
            }
        });

    }

    removeChild() {
        //this.node.removeAllChildren()

        this.rankingScrollView.node.active = false;
        this.scrollViewContent.removeAllChildren();
        this.gameOverRankLayout.active = false;
        this.gameOverRankLayout.removeAllChildren();
        this.loadingLabel.getComponent(cc.Label).string = "玩命加载中...";
        this.loadingLabel.active = true;
    }

    fetchFriendData(MAIN_SC_KAY ?,MAIN_APPE_KAY?) {
       // console.log('fetchFriendData', MAIN_SC_KAY,MAIN_APPE_KAY);
        this.removeChild();
        this.rankingScrollView.node.active = true;

        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: (userRes) => {
                this.loadingLabel.active = false;
        
                //取出所有好友数据
                wx.getFriendCloudStorage({
                    keyList: [MAIN_SC_KAY,MAIN_APPE_KAY],
                    success: res => {
                       // console.log(res);
                        let data = res.data;
                        data.sort((a, b) => {
                          //  console.log("data.sort((a, b) => {----------------");
                          //  console.log(a);
                          //  console.log(b);
                            if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                return 0;
                            }
                            if (a.KVDataList.length == 0) {
                                return 1;
                            }
                            if (b.KVDataList.length == 0) {
                                return -1;
                            }
                            return b.KVDataList[0].value - a.KVDataList[0].value;
                        });
                        for (let i = 0; i < data.length; i++) {
                            var playerInfo = data[i];
                            var item = cc.instantiate(this.prefabRankItem);
                           // console.log("prefabRankItem ----  i " + i );
                            item.getComponent('RankItem').init(i, playerInfo);
                            this.scrollViewContent.addChild(item);
                          
                        }
         
                    },
                    fail: res => {
                        cc.log("wx.getFriendCloudStorage fail " + res);
                        this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                    },
                });
            },
            fail: (res) => {
                this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
            }
        });

    }

    fetchGroupFriendData(MAIN_SC_KAY, shareTicket) {
        this.removeChild();
        this.rankingScrollView.node.active = true;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                  //  console.log('success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getGroupCloudStorage({
                        shareTicket: shareTicket,
                        keyList: [MAIN_SC_KAY],
                        success: res => {
                          //  console.log("wx.getGroupCloudStorage success", res);
                            this.loadingLabel.active = false;
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            for (let i = 0; i < data.length; i++) {
                                var playerInfo = data[i];
                                var item = cc.instantiate(this.prefabRankItem);
                                item.getComponent('RankItem').init(i, playerInfo);
                                this.scrollViewContent.addChild(item);
                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    let userItem = cc.instantiate(this.prefabRankItem);
                                    userItem.getComponent('RankItem').init(i, playerInfo);
                                    userItem.y = -354;
                                    userItem.name = "usrItm"
                                    this.node.addChild(userItem, 1);
                                }
                            }
                            if (data.length <= 6) {
                                let layout = this.scrollViewContent.getComponent(cc.Layout);
                                layout.resizeMode = cc.Layout.ResizeMode.NONE;
                            }
                        },
                        fail: res => {
                         //   console.log("wx.getFriendCloudStorage fail", res);
                            this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        },
                    });
                },
                fail: (res) => {
                    this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    }

    gameOverRank(MAIN_SC_KAY) {
        this.removeChild();
        this.gameOverRankLayout.active = true;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    cc.log('success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [MAIN_SC_KAY],
                        success: res => {
                            cc.log("wx.getFriendCloudStorage success", res);
                            this.loadingLabel.active = false;
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    if ((i - 1) >= 0) {
                                        if ((i + 1) >= data.length && (i - 2) >= 0) {
                                            let userItem = cc.instantiate(this.prefabGameOverRank);
                                            userItem.getComponent('GameOverRank').init(i - 2, data[i - 2]);
                                            this.gameOverRankLayout.addChild(userItem);
                                        }
                                        let userItem = cc.instantiate(this.prefabGameOverRank);
                                        userItem.getComponent('GameOverRank').init(i - 1, data[i - 1]);
                                        this.gameOverRankLayout.addChild(userItem);
                                    } else {
                                        if ((i + 2) >= data.length) {
                                            let node = new cc.Node();
                                            node.width = 200;
                                            this.gameOverRankLayout.addChild(node);
                                        }
                                    }
                                    let userItem = cc.instantiate(this.prefabGameOverRank);
                                    userItem.getComponent('GameOverRank').init(i, data[i], true);
                                    this.gameOverRankLayout.addChild(userItem);
                                    if ((i + 1) < data.length) {
                                        let userItem = cc.instantiate(this.prefabGameOverRank);
                                        userItem.getComponent('GameOverRank').init(i + 1, data[i + 1]);
                                        this.gameOverRankLayout.addChild(userItem);
                                        if ((i - 1) < 0 && (i + 2) < data.length) {
                                            let userItem = cc.instantiate(this.prefabGameOverRank);
                                            userItem.getComponent('GameOverRank').init(i + 2, data[i + 2]);
                                            this.gameOverRankLayout.addChild(userItem);
                                        }
                                    }
                                }
                            }
                        },
                        fail: res => {
                           // console.log("wx.getFriendCloudStorage fail", res);
                            this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        },
                    });
                },
                fail: (res) => {
                    this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    }

    public static NumToString(_num: number): string {
        if (_num / 1000000000000 >= 1) {
            return (_num / 1000000000000).toFixed(2) + "t";
        } else if (_num / 1000000000 >= 1) {
            return (_num / 1000000000).toFixed(2) + "b";
        }
        else if (_num / 1000000 >= 1) {
            return (_num / 1000000).toFixed(2) + "m";
        }
        else if (_num / 1000 >= 1) {
            return (_num / 1000).toFixed(2) + "k";
        } else {
            return _num.toFixed(0);
        }
    }

}