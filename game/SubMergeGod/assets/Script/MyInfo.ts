import GameRankingList from "./GameRankingList";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MyInfo extends cc.Component {

    @property(cc.Label)
    nameAndRank: cc.Label = null;

    @property(cc.Label)
    score: cc.Label = null;

    @property(cc.Sprite)
    headImg: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    setInfo(rank : number, name : string ,score : number, imgUrl:string ) {
        this.nameAndRank.string = name + "\n我的排名：" + rank
        this.score.string =  GameRankingList.NumToString(parseInt( score)) ;
        this.createImage(imgUrl)
    }

    createImage(avatarUrl) {
        if (CC_WECHATGAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.headImg.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        cc.log(e);
                        this.headImg.node.active = false;
                    }
                };
                image.src = avatarUrl;
            } catch (e) {
                cc.log(e);
                this.headImg.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                this.headImg.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }
    // update (dt) {}
}
