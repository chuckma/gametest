import GameManager from "./GameManager";
import RankingView from "./RankingView";
import SDKCtrl from "./SDKCtrl";
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
export default class TopCtrl extends cc.Component {



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
   // display: cc.Sprite = null;
   // tex : cc.Texture2D = null;
   rankingView :RankingView;
    start () {
     
      // this.tex = new cc.Texture2D();
      this.rankingView = this.getComponentInChildren(RankingView);
    }

 
    OpenTopView(){
       // AudioCtrl._instance.playClickBoxAudio();

       if(GameManager._instance.inMainView){
            GameManager._instance.inMainView = false;
            this.node.children[0].active = true;
            this.rankingView.submitScoreButtonFunc();
           // this.rankingView.friendButtonFunc("");
       }
       // this._updateSubDomainCanvas () ;
        //this.GetUserCloudStorage();
       //SDKCtrl._instance.createTopAuthorizationBtn();

    }

    CloseTopView(){
        this.node.children[0].active = false;
        GameManager._instance.inMainView = true;
        //udioCtrl._instance.playClickBoxAudio();
        //SDKCtrl._instance.closeTopAuthorizationBtn();

    }


   


    // update (dt) {}
}
