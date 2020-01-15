import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankingView extends cc.Component {

    @property(cc.Node)
    groupFriendButton: cc.Node = null;
    @property(cc.Node)
    friendButton: cc.Node = null;
    @property(cc.Node)
    gameOverButton: cc.Node = null;
    @property(cc.Sprite)
    rankingScrollView: cc.Sprite = null;//显示排行榜
    tex: cc.Texture2D = null

    start() {
        //cc.log("dddddddddddddd");
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
           // this.submitScoreButtonFunc();
            window['wx'].showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();

            let windowSize = cc.view.getVisibleSize();
            window.sharedCanvas.width = windowSize.width;
            window.sharedCanvas.height = windowSize.height;

            this.rankingScrollView.node.height = windowSize.height;
            this.rankingScrollView.node.width =  windowSize.width;
            window['wx'].postMessage({
                messageType: 1,
                MAIN_SC_KAY: "score",
                MAIN_APPE_KAY: "appe"
            });
        }
    }

    friendButtonFunc(event) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            // 发消息给子域
            window['wx'].postMessage({
                messageType: 1,
                MAIN_SC_KAY: "score",
                MAIN_APPE_KAY: "appe"
            });
        } else {
            console.log("获取好友排行榜数据。score");
        }
    }

    groupFriendButtonFunc(event) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            window['wx'].shareAppMessage({
                success: (res) => {
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window['wx'].postMessage({
                            messageType: 5,
                            MAIN_SC_KAY: "score",
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        } else {
            console.log("获取群排行榜数据。score");
        }
    }

    gameOverButtonFunc (event) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            window['wx'].postMessage({// 发消息给子域
                messageType: 4,
                MAIN_SC_KAY: "score"
            });
        } else {
            console.log("获取横向展示排行榜数据。score");
        }
    }

    submitScoreButtonFunc(){
        let score =  GameManager._instance.coinNum;
        let appellationNum =  GameManager._instance.maxGodLevel -1;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            window['wx'].postMessage({
                messageType: 3,
                MAIN_SC_KAY: "score",
                score: score,
                MAIN_APPE_KAY: "appe",
                appellationNum: appellationNum,
            });
        } else {
           console.log("提交得分: score : " + score)
        }
    }

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    }

    update() {
 
        this._updateSubDomainCanvas();
    }
}
