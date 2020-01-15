import GameManager from "./GameManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class RecycleCtrl extends cc.Component {



    start () {
        this.node.on(cc.Node.EventType.MOUSE_ENTER,function(event){this.onMouseEnter(event);},this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,function(event){this.onMouseLeave(event);},this);
    }

    onMouseEnter(event){
        GameManager._instance.inRecycle = true;


    }
    
    onMouseLeave(event){
        GameManager._instance.inRecycle = false;


    }
    // update (dt) {}
}
