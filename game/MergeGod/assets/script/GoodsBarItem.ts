
import GameManager from "./GameManager";
import DataConfig from "./DataConfig";
import GameSave from "./GameSave";
import GameUI from "./GameUI";

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
export default class GoodsBarItem extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    @property(cc.Button)
    buyBtn: cc.Button = null;

    @property(cc.Button)
    buyDiamondBtn: cc.Button = null;

    @property(cc.Node)
    lockBuyBtn: cc.Node = null;


    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    priceLabel: cc.Label = null;

    @property(cc.Label)
    dPriceLabel: cc.Label = null;

    @property(cc.Label)
    unlockLevelLabel: cc.Label = null;

    @property(cc.Label)
    godNameLabel: cc.Label = null;


    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property(cc.Prefab)
    shiplevelpanel: cc.Prefab = null;

    @property(cc.Prefab)
    goodsShip: cc.Prefab = null;


    price: number = 0;
    dPrice: number = 0;
    level: number = 0;
    lockBuy: cc.Node = null;

    start() {

    }
    public init() {
        this.level = this.node.getSiblingIndex() + 1;
        this.levelLabel.string = this.level.toString();

        //创建商品图标
        let self = this;

        this.icon.spriteFrame = GameUI.Inst.godSFA[self.level];
        //console.log(" this.level  " +  this.level);
        this.godNameLabel.string
            = DataConfig.GodConfigData[self.level - 1][DataConfig.GOD_Name];

        //颜色
        if (self.level >= GameManager._instance.maxGodLevel && self.level != 1) {
            //置灰
            this.godNameLabel.node.active = false;
            this.icon.node.color = cc.Color.BLACK;
        } else {
            //金钱购买解锁

            //刷新价格
            this.price = GameManager._instance.getCoinPrice(this.level);
            this.priceLabel.string = GameManager._instance.GetNumString(this.price);

            this.godNameLabel.node.active = true;
            this.icon.node.color = cc.Color.WHITE;
        }

        //钻石购买解锁
        if (DataConfig.GodConfigData[self.level - 1][DataConfig.GOD_unlock_buy_diamond_level] <= GameManager._instance.maxGodLevel) {
            //解锁钻石

            this.dPrice = GameManager._instance.getBuyDiaPrice(this.level);
            this.dPriceLabel.string = this.dPrice.toString();

            if (this.dPrice > 0) {
                self.buyDiamondBtn.node.active = true;
                self.dPriceLabel.string = this.dPrice.toString();
            } else {
                self.buyDiamondBtn.node.active = false;
            }
        }

        //金币购买解锁
        if (DataConfig.GodConfigData[self.level - 1][DataConfig.GOD_unlock_buy_gold_level] <= GameManager._instance.maxGodLevel) {
            self.godNameLabel.node.active = true;
            this.icon.node.color = cc.Color.WHITE;
            self.buyBtn.node.active = true;
            self.lockBuyBtn.active = false;
            self.buyDiamondBtn.node.active = false;
        } else {
            self.buyBtn.node.active = false;
            self.lockBuyBtn.active = true;
            self.unlockLevelLabel.string = DataConfig.GodConfigData[self.level - 1][DataConfig.GOD_unlock_buy_gold_level];
        }


        //添加购买事件
        let eh = new cc.Component.EventHandler;
        eh.target = this.node.parent.parent.parent.parent;
        eh.component = "ShopCtrl";
        eh.handler = "BuyShip";
        eh.customEventData = this.level.toString();
        self.buyBtn.clickEvents[0] = eh;


        let eh1 = new cc.Component.EventHandler;
        eh1.target = GameManager._instance.shopCtrl.node;
        eh1.component = "ShopCtrl";
        eh1.handler = "BuyDiamondShip";
        eh1.customEventData = self.level.toString();
        self.buyDiamondBtn.clickEvents[0] = eh1;
    }

    RefreshStatus() {
        let self = this;


        //解锁展示 该商品

        if (self.level - 1 < GameManager._instance.maxGodLevel) {
            self.godNameLabel.node.active = true;
            this.icon.node.color = cc.Color.WHITE;
        }
        //钻石购买解锁
        if (DataConfig.GodConfigData[self.level - 1][DataConfig.GOD_unlock_buy_diamond_level] <= GameManager._instance.maxGodLevel) {

            this.dPrice = GameManager._instance.getBuyDiaPrice(this.level);
            this.dPriceLabel.string = this.dPrice.toString();
            //解锁钻石
            if (this.dPrice > 0) {
                self.buyDiamondBtn.node.active = true;
            }
        }

        //金币购买解锁
        if (DataConfig.GodConfigData[self.level - 1][DataConfig.GOD_unlock_buy_gold_level] <= GameManager._instance.maxGodLevel) {

            //刷新价格
            this.price = GameManager._instance.getCoinPrice(this.level);
            this.priceLabel.string = GameManager._instance.GetNumString(this.price);
            self.buyBtn.node.active = true;
            self.lockBuyBtn.active = false;
            self.buyDiamondBtn.node.active = false;
        }
    }


    RefreshPrice() {
        this.price = GameManager._instance.getCoinPrice(this.level);
        this.priceLabel.string = GameManager._instance.GetNumString(this.price);
        this.dPrice = GameManager._instance.getBuyDiaPrice(this.level);
        this.dPriceLabel.string = GameManager._instance.GetNumString(Math.floor(this.dPrice));
    }
    // update (dt) {}
}
