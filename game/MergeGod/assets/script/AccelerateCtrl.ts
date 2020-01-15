import GameManager from "./GameManager";
import SDKCtrl from "./SDKCtrl";
import DataConfig, { OPERATE_ID, ENCOURAGE_Accelerate } from "./dataConfig";
import GameSave from "./GameSave";
import MessageCtrl from "./MessageCtrl";
import RewardCtrl from "./RewardCtrl";

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
export default class AccelerateCtrl extends cc.Component {
    public static _instance: AccelerateCtrl = null;
    view: cc.Node;
    accelerateBtn: cc.Node;
    subAccBtn1: cc.Node;
    subAccBtn2: cc.Node;
    CONSUME_DIAMONDS: number = 10;

    ACCELERATE_STATE = 0;
    ACCELERATE_DIAMONDS = 0;
    ACCELERATE_ENCOURAGE = 1;

    public btn_time: number[] = [];
    //encourage_time: number = 200;

    public btn_rate: number[] = [];
    // btn2_rate = 2;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        AccelerateCtrl._instance = this;
        this.view = this.node.getChildByName("AccelerateView");
        this.accelerateBtn = cc.find("Canvas/UI/AccelerateBtn");
        this.subAccBtn1 = this.view.getChildByName('DiamondAccBtn');
        this.subAccBtn2 = this.view.getChildByName('EncourageAccBtn');
    }


    init() {


        this.CONSUME_DIAMONDS = DataConfig.getOperateDataValue(OPERATE_ID.acceleration_btn1_DIA_PRICE);
        this.btn_rate[this.ACCELERATE_DIAMONDS] = DataConfig.getOperateDataValue(OPERATE_ID.acceleration_btn1_rate);
        this.btn_time[this.ACCELERATE_DIAMONDS] = DataConfig.getOperateDataValue(OPERATE_ID.acceleration_btn1_time);
        this.btn_rate[this.ACCELERATE_ENCOURAGE] = DataConfig.getOperateDataValue(OPERATE_ID.acceleration_btn2_rate);
        this.btn_time[this.ACCELERATE_ENCOURAGE] = DataConfig.getOperateDataValue(OPERATE_ID.acceleration_btn2_time);
    }


    onClickEncourageAccBth() {
        //if (GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_Accelerate) < DataConfig.getOperateDataValue(OPERATE_ID.accBtn2_dayOpen_maxNum)) {
            SDKCtrl._instance.OpenDoubleOutputEncourage();
       /* } else {

            GameManager._instance.messageCtrl.OpenMessage("已到达使用上限");
        }*/
    }


    closeView() {
        this.view.active = false;
    }



   /* openView() {

        this.view.active = true;
    

        this.subAccBtn1.getChildByName('timeLabel').getComponent(cc.Label).string
            = this.btn_rate[this.ACCELERATE_DIAMONDS] + '倍速' + this.btn_time[this.ACCELERATE_DIAMONDS] + '秒';
        this.subAccBtn1.getChildByName('priceLabel').getComponent(cc.Label).string
            = 'X' + this.CONSUME_DIAMONDS;


        this.subAccBtn2.getChildByName('timeLabel').getComponent(cc.Label).string
            = this.btn_rate[this.ACCELERATE_ENCOURAGE] + '倍速' + this.btn_time[this.ACCELERATE_ENCOURAGE] + '秒';


        //console.log('AccelerateCtrlopenView');

    }*/

 /*   onClickDiamondAccBtn() {
        //console.log('onClickDiamondAccBtn', GameManager._instance.diamondNum, this.CONSUME_DIAMONDS);
        //console.log(GameManager._instance.diamondNum > this.CONSUME_DIAMONDS);
        if (GameManager._instance.diamondNum > this.CONSUME_DIAMONDS) {
            GameManager._instance.AddDiamond(-this.CONSUME_DIAMONDS);
            SDKCtrl._instance.startDoubleOutputTimer( this.btn_time[this.ACCELERATE_DIAMONDS]);
           // SDKCtrl._instance.startDoubleOutputTimer(this.ACCELERATE_DIAMONDS, this.btn_time[this.ACCELERATE_DIAMONDS]);
        }else{

            RewardCtrl._instance.OpenNoDiamond();
        }


    }*/




    // update (dt) {}
}
