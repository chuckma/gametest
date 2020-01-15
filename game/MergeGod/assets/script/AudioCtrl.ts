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
export default class AudioCtrl extends cc.Component {
    public static _instance : any = null;
    @property(cc.Node)
    buyAudio: cc.Node = null;

    @property(cc.Node)
    clickBoxAudio: cc.Node = null;

    @property(cc.Node)
    coinAudio: cc.Node = null;

    @property(cc.Node)
    collectanAudio: cc.Node = null;

    @property(cc.Node)
    mergerAudio: cc.Node = null;

    @property(cc.Node)
    newTopAudio: cc.Node = null;

    @property(cc.Node)
    runShipAudio: cc.Node = null;
    
    @property(cc.Node)
    clickAudio: cc.Node = null;

    public playBuyAudio():void{
            this.buyAudio.getComponent(cc.AudioSource).play();
       
    }
    public playClickBoxAudio():void{
            this.clickBoxAudio.getComponent(cc.AudioSource).play();
        
    }

    public playClick():void{
        this.clickAudio.getComponent(cc.AudioSource).play();
    
    }
    public playCoinAudio():void{
            this.coinAudio.getComponent(cc.AudioSource).play();
        
    }
    public playCollectanAudio():void{
            this.collectanAudio.getComponent(cc.AudioSource).play();
        
    }
    public playMergerAudio():void{
            this.mergerAudio.getComponent(cc.AudioSource).play();
        
    }
    public playNewTopAudio():void{
            this.newTopAudio.getComponent(cc.AudioSource).play();
        
        
    }

    
    public playRunShipAudioAudio():void{
            this.runShipAudio.getComponent(cc.AudioSource).play();
        
        
    }

    start () {
        AudioCtrl._instance = this;
    }

}
