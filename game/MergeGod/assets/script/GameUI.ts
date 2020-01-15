import ShipItem from "./ShipItem";
import GameManager from "./GameManager";
import AudioCtrl from "./AudioCtrl";
import SDKCtrl from "./SDKCtrl";

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
export default class GameUI extends cc.Component {
    public static Inst: GameUI = null


    @property(cc.Prefab)
    coinFlyLabelPrf: cc.Prefab = null;

    @property(cc.Prefab)
    mergeEffectPrf: cc.Prefab = null;

    @property(cc.Prefab)
    coinSPrf: cc.Prefab = null;

    @property(cc.Prefab)
    shiplevelpanel: cc.Prefab = null;

    @property(cc.Node)
    turntableUI: cc.Node = null;

    @property(cc.Node)
    turntableGroup: cc.Node = null;

    @property(cc.Prefab)
    tickerTapeParticle: cc.Prefab = null;

    @property(cc.Node)
    coinFlyLabelGroup: cc.Node = null;

    @property([cc.SpriteFrame])
    godSFA: cc.SpriteFrame[] = [];

    coinSA: cc.Node[] = [];

   // coinIcon: cc.Node = null;

    tickerTapeParticleA: cc.Node[] = [];
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        GameUI.Inst = this;
     
    }

   // start() {
        //this.coinIcon = cc.find("Canvas/UI/CoinBar/CoinIcon");
    //}
    getShiplevelpanel(){

        return this.shiplevelpanel;
    }
    CreateTickerTapeParticle() {
        this.tickerTapeParticleA = [];
        this.tickerTapeParticleA.push(cc.instantiate(this.tickerTapeParticle));
        this.tickerTapeParticleA.push(cc.instantiate(this.tickerTapeParticle));
        //n.position =n.position.add( cc.v2( 0,200));
        this.tickerTapeParticleA[0].position = cc.v2(-450, -100);
        this.tickerTapeParticleA[0].getComponent(cc.ParticleSystem).angle = 70;

        this.tickerTapeParticleA[1].position = cc.v2(450, -100);
        this.tickerTapeParticleA[1].getComponent(cc.ParticleSystem).angle = 110;

        GameManager._instance.node.addChild(this.tickerTapeParticleA[0]);
        GameManager._instance.node.addChild(this.tickerTapeParticleA[1]);
        this.destroy
    }

    DestroytTckerTapeParticleA() {
        this.tickerTapeParticleA.forEach(element => {
            element.destroy();
        });
    }

    CreateMergeEffectPrf(shipnode: cc.Node) {
        let n = cc.instantiate(this.mergeEffectPrf);
        AudioCtrl._instance.playCoinAudio()
        GameManager._instance.uINode.addChild(n);
        n.position = shipnode.position.add(cc.v2(0, 20));
        n.zIndex = 100;
        n.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
            n.destroy();
        })));
    }

    OpenNormalTurntable() {
        this.turntableUI.active = true;
        
        SDKCtrl._instance.openBannerAd();
    }


    CloseTurntable() {
        this.turntableUI.active = false;
    }

    CreateCoinFlyLabel(shipItem: ShipItem) {
     
        AudioCtrl._instance.playCoinAudio()
        let newNode =  shipItem.coinFlyLabel.node;
     
        newNode.parent =  this.coinFlyLabelGroup;
        newNode.position = shipItem.node.position.add(cc.v2(50, 70));
        shipItem.coinFlyLabel.string = "+" + GameManager._instance.GetNumString(shipItem.outputCoinPSNum);
        newNode.runAction(cc.sequence(cc.fadeIn(0),cc.moveBy(0.2, cc.v2(0, 60)), cc.delayTime(0.4), cc.fadeOut(0.4), cc.callFunc(function () {
            newNode.parent =  shipItem.node;
        })));
    }
    // update (dt) {}
}
