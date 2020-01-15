import DataConfig, { OPERATE_ID, ENCOURAGE_FlyBox } from "./DataConfig";
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
export default class FlyBoxCtrl extends cc.Component {
    public static _instance: FlyBoxCtrl = null;



    @property(cc.Node)
    flyBoxBtn: cc.Node = null;



    wingL: cc.Node;
    wingR: cc.Node;
    box: cc.Node;
    flyLoopNum: number = 0;
    //flyBoxOpenNum: number = 0;
    // LIFE-CYCLE CALLBACKS:
    actionFlyBox: cc.Action = null;
    onLoad() {
        FlyBoxCtrl._instance = this;

    }

    init() {
        this.wingL = this.flyBoxBtn.getChildByName("wingL");
        this.wingR = this.flyBoxBtn.getChildByName("wingR");
    }

    openflyBoxBtn() {
        if (GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_FlyBox) < DataConfig.getOperateDataValue(OPERATE_ID.flybox_dayOpen_maxNum)) {
            if (this.actionFlyBox == null) {
                this.TesttingPlayAction();
            }
        }
    }

    closeflyBoxBtn() {
        this.flyBoxBtn.active = false;
    }
    
    TesttingPlayAction() {
        let fg = DataConfig.getFlyBoxCoin();
        if (fg == 0
            || GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_FlyBox) > DataConfig.getOperateDataValue(OPERATE_ID.flybox_dayOpen_maxNum)) {
            this.flyBoxBtn.active = false;
        } else {
            this.flyBoxBtn.active = true;
            //this.wingL.rotation = 0;
           // this.wingR.rotation = 0;
            this.flyBoxBtn.position = cc.v2(-473, 400);
           // this.wingL.stopAllActions();
           // this.wingR.stopAllActions();
            this.flyBoxBtn.stopAllActions();
            //this.wingL.runAction(cc.sequence(cc.rotateBy(0.3, 30), cc.rotateBy(0.3, -30)).repeatForever());
           // this.wingR.runAction(cc.sequence(cc.rotateBy(0.3, -30), cc.rotateBy(0.3, 30)).repeatForever());
            this.actionFlyBox = this.flyBoxBtn.runAction(cc.sequence(
                cc.moveBy(2, cc.v2(0.8, 30)),
                cc.callFunc(()=>{
                    this.wingL.rotation = 30;
                    this.wingR.rotation = -30;
                }), 
                cc.moveBy(2, cc.v2(0.8, -30)),
                cc.callFunc(()=>{
                    this.wingL.rotation = -30;
                    this.wingR.rotation = 30;
                }), 
                ).repeatForever());
            this.flyBoxBtn.runAction(cc.sequence(cc.place(cc.v2(-473, 400)), cc.moveBy(28, cc.v2(930, 0))
                , cc.callFunc(() => {
                    this.flyLoopNum += 1;
                    if (this.flyLoopNum >= DataConfig.getOperateDataValue(OPERATE_ID.flybox_run_after_hide_num)) {
                        this.waitTimeShowFlyBox();
                    }
                })).repeatForever());
        }
    }

    SuccessFlyBoxRewardView() {
        let num = DataConfig.getFlyBoxCoin();
        GameManager._instance.AddCoin(num);
        RewardCtrl._instance.CloseRewardView();
        RewardCtrl._instance.OpenRewardCoinView(num);
        this.waitTimeShowFlyBox();
    }

    waitTimeShowFlyBox() {
       this.flyBoxBtn.active = false;
        this.flyBoxBtn.stopAllActions();
        let t = DataConfig.getOperateDataValue(OPERATE_ID.flybox_hide_time_min)
            + Math.random() *
            (DataConfig.getOperateDataValue(OPERATE_ID.flybox_hide_time_max)
                - DataConfig.getOperateDataValue(OPERATE_ID.flybox_hide_time_min));
        this.unscheduleAllCallbacks();

        this.scheduleOnce(function () {
            if (GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_FlyBox) < DataConfig.getOperateDataValue(OPERATE_ID.flybox_dayOpen_maxNum)) {
                this.flyBoxBtn.active = true;
                this.TesttingPlayAction();
                this.flyLoopNum = 0;
            }
        }, t);
    }
 
}
