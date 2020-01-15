import SDKCtrl from "./SDKCtrl";
import GameManager from "./GameManager";

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
export default class CollectionGuidanceCtrl extends cc.Component {
    public static _instance: CollectionGuidanceCtrl = null;
    @property(cc.Node)
    collectionGuidanceView: cc.Node = null;

    @property(cc.Node)
    box: cc.Node = null;

    @property(cc.Node)
    rope: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        CollectionGuidanceCtrl._instance = this;
    }

    start() {
        this.rope.runAction(cc.sequence(cc.rotateTo(3, -3).easing(cc.easeSineInOut()), cc.rotateTo(3, 3)).repeatForever());

        if (GameManager._instance.GetIntData("COLLECTIONGUIDANCE", 0) == 1) {

            this.CloseRopeBox();

        }
    }

    CloseRopeBox() {
        this.rope.active = false;
    }

    OpenView() {
        this.collectionGuidanceView.active = true;
    }

    CloseView() {
        this.collectionGuidanceView.active = false;
    }
    // update (dt) {}
}
