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
export default class GameBarItem extends cc.Component {


     //score= null;
     //title= null;
     //app_id= null;
     //icon_old= null;
     //description= null;
     //channel_parameters1 = null;
   

    // LIFE-CYCLE CALLBACKS:
    /*openGame(i){
        SDKCtrl._instance.showMoreGame(
            this.app_id,this.icon_old,this.channel_parameters1
        );


    }*/
    public ad_id  =null;
    public ad_old_url  = null;
    public channel_parameters  = null;

    // onLoad () {}
    /*onEnable(){
        cc.log("   --222222222222222222222-------- ");
   
     
        
    }*/

    OpenTheGame():void{

        //console.log(this.ad_id);
        //console.log(this.ad_old_url);
        //console.log(this.channel_parameters);
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            if(window['wx'].navigateToMiniProgram!=undefined){
                window['wx'].navigateToMiniProgram({
                    appId: this.ad_id,
                    path:this.channel_parameters
                });
            }else{
                if(this.ad_old_url && this.ad_old_url!="")window['wx'].previewImage({urls:[this.ad_old_url]});
            }
        }
    }
    // update (dt) {}
}
