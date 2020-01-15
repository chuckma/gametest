import GameManager from "./GameManager";
import ShipItem from "./ShipItem";
import DataConfig from "./DataConfig";

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
export default class TrashCtrl extends cc.Component {

    @property(cc.Node)
    trashView: cc.Node = null;

    level :number = 0;
    shipI :ShipItem = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    openView(_level :number,_shipI:ShipItem){
        this.level = _level;
        this.shipI = _shipI;
        this.trashView.getChildByName("infoRichText").getComponent(cc.RichText).string
        = "是否回收神仙？<br/>" 
        +_level +" "+ DataConfig.GodConfigData[_level-1][DataConfig.GOD_Name] + "<br/>" 
        +"金币" +GameManager._instance.GetNumString( DataConfig.GodConfigData[_level-1][DataConfig.GOD_trash_gold]);


        this.trashView.active = true;
    }

    closeView(){
        this.trashView.active = false;

    }

    ClickConfirm(){
        GameManager._instance.ScsessShipClean(this.level,this.shipI);
        
        this.closeView();
    }
    ClickCancel(){

        this.closeView();
    }
    // update (dt) {}
}
