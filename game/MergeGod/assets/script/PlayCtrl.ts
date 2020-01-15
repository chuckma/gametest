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
export default class PlayCtrl extends cc.Component {


    renA: cc.Node[];

    runPostion: cc.Vec2[]
        = [
            new cc.Vec2(0, 0),
            new cc.Vec2(-40, 0),
            new cc.Vec2(-80, 0),
            new cc.Vec2(-120, 0)
        ];
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.renA = this.node.children;
        //this.showRun();
        // this.showDown();
        // this.showForward();
    }
    runI = 0;
    showRun() {
        //this.runI=0;
        this.renA = this.node.children;
        this.renA[this.runI].active = true;
        this.schedule(this.runCallback, 0.2);
    }


    runCallback = function () {
        this.renA[this.runI].active = false;
        this.runI++;

        if (this.runI == 5) {
            this.runI = 0;
        }
        this.renA[this.runI].active = true;

    }

    showIdeo() {
        this.renA = this.node.children;
        this.renA[1].active = true;
        this.renA[0].active = false;
        this.renA[2].active = false;
        this.renA[3].active = false;
        this.renA[4].active = false;



    }

    showUp() {
        //cc.log(this.node.name, this.node.position);
        //let self = this;
        let t = 1;
        this.showRun();
        this.node.runAction(
            cc.spawn(
                cc.moveBy(t, new cc.Vec2(100, 25)),

                cc.scaleTo(t, 0.9, 0.9)
            ));




        this.scheduleOnce(function () {
            this.node.runAction(cc.fadeOut(0.1));
            this.node.destroy();
        }, t);

    }

    showDown() {
        let t = 5;
        this.showRun();
        this.node.runAction(
            cc.spawn(
                cc.moveBy(t, new cc.Vec2(400, 0)),
                cc.fadeOut(t),
                // cc.scaleTo(t,0.5,0.5)
            )

        );
        this.scheduleOnce(function () {


            this.unschedule(this.runCallback);
        }, t);
        // this.showIdeo();

    }

    showForward() {
        let t = 1;
        //cc.log("showForward" + this.node.name, this.node.position);
        this.showRun();
        this.node.runAction(cc.moveTo(t, new cc.Vec2(this.node.x + 40, 0)));
        this.scheduleOnce(function () {


            this.unschedule(this.runCallback);
            this.showIdeo();
            if (this.node.x < 20 && this.node.x > -20) {
                this.node.x = 0;
            }
            else if (this.node.x < -20 && this.node.x > -60) {
                this.node.x = -40;
            }
            else if (this.node.x < -60 && this.node.x > -100) {
                this.node.x = -80;
            }
            else if (this.node.x < -100 && this.node.x > -120) {
                this.node.x = -120;
            }
        }, t + 0.5);


    }
    // update (dt) {}
}
