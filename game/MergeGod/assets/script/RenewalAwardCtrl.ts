import RewardCtrl from "./RewardCtrl";
import GameManager from "./GameManager";
import Bitbear from "./Bitbear";
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

const {ccclass, property} = cc._decorator;

@ccclass
export default class RenewalAwardCtrl extends cc.Component {


    public static _instance: RenewalAwardCtrl = null;

    @property(cc.Node)
    view: cc.Node = null;

    /*@property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';*/

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        RenewalAwardCtrl._instance = this;
    }

   /*start () {

    }*/

    openView(){
        this.view.active = true;


    }

    
    closeView(){
        this.view.active = false;


    }

    onClickRewardBtn(){

        let self =this;
        let diaNum:number = 666;

        Bitbear.getInstance().saveRenewalAwardDiamond((data)=>{
            if(data.data.data.result){
                self.closeView();
                GameManager._instance.AddDiamond(diaNum)
                RewardCtrl._instance.OpenRewardDiamondView(diaNum);
                GameSave.Inst.waitUploadData();
            }else{
                GameManager._instance.messageCtrl.OpenMessage("领取失败");
            }


        });
       

    }
    // update (dt) {}
}
