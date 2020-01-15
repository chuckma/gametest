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
export default class Transition extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    cloudA: cc.Node = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let t = 1.2;
        this.bg.runAction( cc.sequence( cc.fadeOut(t),cc.callFunc(()=>this.node.destroy())));

        for (let index = 0; index < this.cloudA.childrenCount; index++) {
            const element =  this.cloudA.children[index];
            if(index == 2 || index ==3){
                element.runAction(cc.moveBy(t,cc.v2(800,0)).easing(cc.easeSineIn()));

            }else{
                element.runAction(cc.moveBy(t,cc.v2(-800,0)).easing(cc.easeSineIn()));


            }
        }
    }

    // update (dt) {}
}
