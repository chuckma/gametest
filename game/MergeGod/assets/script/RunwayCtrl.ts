import GameManager from "./GameManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class RunwayCtrl extends cc.Component {
    refresh(){
       // cc.log("   " +GameManager._instance.inWayNum,GameManager._instance.MaxInWayNum )
        for (let i = 0; i < this.node.childrenCount; i++) {
            
            if(i< GameManager._instance.MaxInWayNum){
                this.node.children[i].active = true;
                if(i< GameManager._instance.inWayNum){
                    this.node.children[i].children[0].active = true;

                }else{
                    this.node.children[i].children[0].active = false;

                }
            }
        }
    }


}
