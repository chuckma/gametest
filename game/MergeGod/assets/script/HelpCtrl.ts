import GameManager from "./GameManager";
import RewardCtrl from "./RewardCtrl";
import GameSave from "./GameSave";

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
export default class HelpCtrl extends cc.Component {
    public static _instance: HelpCtrl = null;
    view: cc.Node;
    endView: cc.Node;

    public helptext: string[] = [
        "点击购买你的第一个神仙",
        "移动合成更高级的神仙",
        "点击这里可以继续购买神仙",
        "角色越多赚钱越多",
        "点这里可以继续购买神仙",
        "打开商店",
        "点击按钮购买神仙",
        "现在可以使用钻石购买神仙了",
        "再次点击可以继续购买"
    ];

    @property(cc.Node)
    hand: cc.Node = null;

    @property(cc.Node)
    maskAsh: cc.Node = null;

    @property(cc.Label)
    textLabel: cc.Label = null;

    @property(cc.Label)
    text1Label: cc.Label = null;
    rewardView: any;
    onLoad() {
        HelpCtrl._instance = this;
    }
    start() {
    

        this.view = this.node.getChildByName("HelpView");
        this.endView = this.node.getChildByName("HelpEndView");
    }

    shopHelp(customEventDatas) {
        if (GameSave.Inst.getGuideStep() == 7
            && GameManager._instance.maxGodLevel == 6
            && (
                RewardCtrl._instance.rewardView.getChildByName("DiaView").active == true
                || customEventDatas == 'topClose'
            )
        ) {//打开商店
            //console.log("11111111111111111111111111111");
           // GameManager._instance.SetIntData("help", 8);
            GameSave.Inst.setGuideStep(8);
            HelpCtrl._instance.maskAsh.active = true;
            HelpCtrl._instance.maskAsh.position = GameManager._instance.shopBtn.position;
            HelpCtrl._instance.maskAsh.getComponentInChildren(cc.Mask).node.height = 200;
            HelpCtrl._instance.maskAsh.getComponentInChildren(cc.Mask).node.width = 200;
            HelpCtrl._instance.hand.active = true;
            HelpCtrl._instance.hand.position = GameManager._instance.shopBtn.position.add(cc.v2(0, -50));
            HelpCtrl._instance.textLabel.string = HelpCtrl._instance.helptext[5];
            HelpCtrl._instance.textLabel.node.active = true;
            HelpCtrl._instance.textLabel.node.position = GameManager._instance.shopBtn.position.add(cc.v2(-200, -65));
        }
    }
    openEndVeiw() {

        //this.endView.active = true;
    }

    closeEndView() {
        //this.endView.active = false;


    }
    openVeiw() {

        this.view.active = true;
    }

    closeView() {
        this.view.active = false;


    }

    // update (dt) {}
}
