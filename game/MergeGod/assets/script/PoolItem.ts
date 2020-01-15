// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import ShipItem from "./ShipItem";
import GameSave from "./GameSave";
const {ccclass, property} = cc._decorator;

@ccclass
export default class PoolItem extends cc.Component {

    shipItem :ShipItem = null;
    isHaveShip:boolean = false;
 

    start () {
        this.node.on(cc.Node.EventType.TOUCH_END,function(event){this.onTouchEnd(event);},this);
     
    }
    CleanPool(){

        this.shipItem  = null;
        this.isHaveShip = false;
       // cc.sys.localStorage.setItem(this.node.name,0);//存储该水池上面船的型号 0是没船
        GameSave.Inst.setMassifDataOf(this.node.getSiblingIndex(),0);
    }
    SetShip(_shipItem : ShipItem){
        this.shipItem = _shipItem;
        this.isHaveShip = true;
       // GameSave.Inst.setMassifDataOf(this.node.getSiblingIndex(),_shipItem.shipLevel);

    }

    onTouchEnd(){
        //cc.log("===========poolonTouchEnd===========");


    }
    // update (dt) {}
}
