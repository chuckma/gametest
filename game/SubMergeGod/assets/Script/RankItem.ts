import GameRankingList from "./GameRankingList";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankItem extends cc.Component {

    @property(cc.Node)
    backSprite: cc.Node = null;
    @property(cc.Label)
    rankLabel: cc.Label = null;
    @property(cc.Sprite)
    avatarImgSprite: cc.Sprite = null;
    @property(cc.Label)
    nickLabel: cc.Label = null;
    @property(cc.Label)
    appellationLabel: cc.Label = null;

    @property(cc.Label)
    topScoreLabel: cc.Label = null;


    @property(cc.Label)
    myInfo: cc.Label = null;

    @property(cc.Sprite)
    rank1st: cc.Sprite = null;
    @property(cc.Sprite)
    rank2th: cc.Sprite = null;
    @property(cc.Sprite)
    rank3rd: cc.Sprite = null;




    
    start() {

    }

    init(rank, data) {
        let avatarUrl = data.avatarUrl;
        // let nick = data.nickname.length <= 10 ? data.nickname : data.nickname.substr(0, 10) + "...";
        let nick = data.nickname;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        let appellationNum =  data.KVDataList.length > 1 ? data.KVDataList[1].value : 0;
        if (rank % 2 == 0) {
            this.backSprite.color = new cc.Color(0, 0, 0, 0);
        }

        if (rank == 0) {
            //this.rankLabel.node.color = new cc.Color(255, 0, 0, 255);
            // this.rankLabel.node.setScale(2);
            this.rankLabel.node.active = false;
            this.rank1st.node.active = true
        } else if (rank == 1) {
            //this.rankLabel.node.color = new cc.Color(255, 255, 0, 255);
            //this.rankLabel.node.setScale(1.6);
            this.rankLabel.node.active = false;
            this.rank2th.node.active = true
        } else if (rank == 2) {
            // this.rankLabel.node.color = new cc.Color(100, 255, 0, 255);
            // this.rankLabel.node.setScale(1.3);
            this.rankLabel.node.active = false;
            this.rank3rd.node.active = true
        }
        this.rankLabel.string = (rank + 1).toString();
        this.createImage(avatarUrl);
        this.nickLabel.string = nick;
        this.topScoreLabel.string = GameRankingList.NumToString(parseInt( grade));
        this.appellationLabel.string = GameRankingList.AppellationData[appellationNum][1];
    }

    setMyInfo( rank, data ) {
        this.nickLabel.node.active = false
        this.myInfo.string = data.nickname + '\n' + "当前排名：" + rank
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
                        this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        //cc.log(e);
                        this.avatarImgSprite.node.active = false;
                    }
                };
                image.src = avatarUrl;
            } catch (e) {
                //cc.log(e);
                this.avatarImgSprite.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }
}
