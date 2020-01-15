// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import GameManager from "./GameManager";
import AudioCtrl from "./AudioCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartCtrl extends cc.Component {
    public static _instance: StartCtrl = null;

    startBtn: cc.Node;
    startView: cc.Node;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

 
    start () {
       /* cc.director.preloadScene("main", function () {
            cc.director.loadScene("main");
            });*/
    }
 
   /* closeStartView(){
       AudioCtrl._instance.playClick();
       this.startView.active = false;

        GameManager._instance.inMainView = true;
    }*/

    // update (dt) {}
}
