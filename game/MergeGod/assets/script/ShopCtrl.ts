import GoodsBarItem from "./GoodsBarItem";
import GameManager from "./GameManager";
import AudioCtrl from "./AudioCtrl";
import DataConfig, { MAX_GOD_LV } from "./DataConfig";
import HelpCtrl from "./HelpCtrl";
import GameSave from "./GameSave";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopCtrl extends cc.Component {
    public static _instance: ShopCtrl = null;
    @property(cc.Node)
    shopView: cc.Node = null;
    @property(cc.Prefab)
    goodsbar: cc.Prefab = null;

    scrollView: cc.ScrollView = null;
    goodsbarA :GoodsBarItem[] = [];
    goodsbarLayout : cc.Layout= null;

    coinLabel: cc.Label = null;
    diaLabel: cc.Label = null;
    public isShareEnd: boolean = false;

    isFastOpenShop : boolean = true;
    onLoad() {

        ShopCtrl._instance = this;
        //this.goodsbarA = this.node.getComponentsInChildren(GoodsBarItem);
        this.goodsbarLayout =   this.node.getComponentInChildren(cc.Layout);
    }
    
    init() {

        this.scrollView = this.node.getComponentInChildren(cc.ScrollView);
        this.scrollView.content.height = MAX_GOD_LV * 168;

        this.coinLabel = this.shopView.getChildByName("coinIcon").getComponentInChildren(cc.Label);
        this.diaLabel = this.shopView.getChildByName("diaIcon").getComponentInChildren(cc.Label);
      
       // let self = this;

       
        for (let i = 0; i < MAX_GOD_LV; i++) {
            //const element = this.goodsbarA[i]; 
        
                let newNode = cc.instantiate(this.goodsbar);            //新建一个节点，添加资源prefab
                newNode.name = "goodsbar_" + i;
                this.goodsbarLayout.node.addChild(newNode);
                let gbi =  newNode.getComponent(GoodsBarItem);
                this.goodsbarA.push(gbi);
         
                gbi.init();
                newNode.active = false;
        }
  
    }

    OpenShop() {
     
        if (GameManager._instance.inMainView) {
         
            GameManager._instance.inMainView = false;
 
            this.shopView.active = true;
       
           
            this.RefreshLabel();

            if(this.isFastOpenShop){
                this.isFastOpenShop =false;
                let i =0;
                this.schedule(()=>{
                    //console.log(" i " + i);
                    this.goodsbarA[i].node.active = true;
                    this.goodsbarA[i].RefreshStatus();
                    i++;
                }, 0,this.goodsbarA.length-1);

            }else{

                this.goodsbarA
                .forEach(element => {
                    element.RefreshStatus();
                });
            }
         

            //console.log(  " y   " +this.shopView.getComponentInChildren(cc.Layout).node.y);
     
            if (GameSave.Inst.getGuideStep() == 8 ) {
               // GameManager._instance.SetIntData("help", 9);
                GameSave.Inst.setGuideStep(9) ;
                this.shopView.getComponentInChildren(cc.Layout).node.y = 378;
                let diaBuyBtn = this.scrollView.node.children[0].children[3].getChildByName("BuyDiamondBtn");
                //diaBuyBtn.active = true;

                HelpCtrl._instance.maskAsh.active =true;
                HelpCtrl._instance.maskAsh.parent =diaBuyBtn ;
                HelpCtrl._instance.maskAsh.setPosition(-30,-244);
                HelpCtrl._instance.maskAsh.parent = HelpCtrl._instance.node ;

               // HelpCtrl._instance.maskAsh.position = this.scrollView.node.children[0].children[4].getChildByName("BuyDiamondBtn").position;
                HelpCtrl._instance.maskAsh.getComponentInChildren(cc.Mask).node.height = 150;
                HelpCtrl._instance.maskAsh.getComponentInChildren(cc.Mask).node.width = 200;


                HelpCtrl._instance.hand.active = true;

                HelpCtrl._instance.hand.parent = diaBuyBtn ;
                HelpCtrl._instance.hand.setPosition(-30,-294);
                HelpCtrl._instance.hand.parent = HelpCtrl._instance.node ;

                HelpCtrl._instance.textLabel.string = HelpCtrl._instance.helptext[6];
                HelpCtrl._instance.textLabel.node.active = true;
                HelpCtrl._instance.textLabel.node.parent =diaBuyBtn ;
                HelpCtrl._instance.textLabel.node.setPosition(-30,-394);
                HelpCtrl._instance.textLabel.node.parent = HelpCtrl._instance.node ;
   
                HelpCtrl._instance.text1Label.string = HelpCtrl._instance.helptext[7];
                HelpCtrl._instance.text1Label.node.active = true;
                HelpCtrl._instance.text1Label.node.parent =diaBuyBtn ;
                HelpCtrl._instance.text1Label.node.setPosition(-30,0);
                HelpCtrl._instance.text1Label.node.parent = HelpCtrl._instance.node ;
    
            }
            AudioCtrl._instance.playClick();
        }

    }



    scrollEvents(){

        
    }
    BuyDiamondShip(event, customEventData) {

        GameManager._instance.BuyDiamondShip(customEventData);

        let le: number = Number.parseInt(customEventData);
        if (GameSave.Inst.getGuideStep() == 9
        && le == 4) {
    
           // GameManager._instance.SetIntData("help", 10);
            GameSave.Inst.setGuideStep(10);

            let diaBuyBtn = this.scrollView.node.children[0].children[3].getChildByName("BuyDiamondBtn");
            //diaBuyBtn.active = true;

            HelpCtrl._instance.maskAsh.active = true;
            HelpCtrl._instance.maskAsh.parent = diaBuyBtn ;
           // HelpCtrl._instance.maskAsh.setPosition(-30,-324);
            HelpCtrl._instance.maskAsh.parent = HelpCtrl._instance.node ;

           // HelpCtrl._instance.maskAsh.position = this.scrollView.node.children[0].children[4].getChildByName("BuyDiamondBtn").position;
            HelpCtrl._instance.maskAsh.getComponentInChildren(cc.Mask).node.height = 150;
            HelpCtrl._instance.maskAsh.getComponentInChildren(cc.Mask).node.width = 200;


            HelpCtrl._instance.hand.active = true;

            HelpCtrl._instance.hand.parent = diaBuyBtn ;
           // HelpCtrl._instance.hand.setPosition(-30,-374);
            HelpCtrl._instance.hand.parent = HelpCtrl._instance.node ;

            HelpCtrl._instance.textLabel.string = HelpCtrl._instance.helptext[8];
            HelpCtrl._instance.textLabel.node.active = true;
            HelpCtrl._instance.textLabel.node.parent =diaBuyBtn ;
           // HelpCtrl._instance.textLabel.node.setPosition(-30,-474);
            HelpCtrl._instance.textLabel.node.parent = HelpCtrl._instance.node ;

            HelpCtrl._instance.text1Label.node.active = false;

        }else if (GameSave.Inst.getGuideStep() == 10){
    
           // GameManager._instance.SetIntData("help", 11);
            GameSave.Inst.setGuideStep(11);
            HelpCtrl._instance.maskAsh.active =false;
            HelpCtrl._instance.hand.active = false;
            HelpCtrl._instance.textLabel.node.active = false;
           // this.CloseShop();
            
        }
    }



    BuyShip(event, customEventData) {
        GameManager._instance.BuyShip(customEventData);
    }

    CloseShareBtn(customEventData: string) {
        let _level = Number.parseInt(customEventData)
        this.node.getComponentInChildren(cc.Layout).node.children[_level - 1].getChildByName("share").active = false;
    }


    RefreshPrice(_level?) {
        this.node.getComponentInChildren(cc.Layout).node.children[_level - 1].getComponent(GoodsBarItem).RefreshPrice();
        this.RefreshLabel();
    }

    RefreshLabel() {
        this.coinLabel.string = GameManager._instance.GetNumString(GameManager._instance.coinNum);
        this.diaLabel.string = GameManager._instance.GetNumString(GameManager._instance.diamondNum);//刷新
    }

   

    CloseShop() {
     
        this.shopView.active = false;
        GameManager._instance.inMainView = true;
       // this.scheduleOnce(()=>{
            AudioCtrl._instance.playClick();
           // GameManager._instance.initBuyShipQuickly();
       // },0);
    }
}
