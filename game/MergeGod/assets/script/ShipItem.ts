import GameManager from "./GameManager";
import PoolItem from "./PoolItem";
import AudioCtrl from "./AudioCtrl";
import DataConfig, { OUTPUT_TIME_INTERVAL, MAX_GOD_LV } from "./DataConfig";
import GameUI from "./GameUI";
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShipItem extends cc.Component {


    @property(cc.Sprite)
    icon: cc.Sprite = null;


    @property(cc.Label)
    coinFlyLabel: cc.Label = null;

    pool: cc.Node = null;
    zeroPoint: cc.Vec2 = null;
    isClick: boolean = false;
    isMerge: boolean = false;
    public shiplevelpanel: cc.Node = null;

    shipLevel: number = 1;
    public outputCoinPSNum: number = 0;
    public gold_interval_m: number = 0;

    // onLoad () {}

    start() {
        this.registrationEvent();
    }


    registrationEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) { this.onTouchStart(event); }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) { this.onTouchMove(event); }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) { this.onTouchEnd(event); }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) { this.onTouchEnd(event); }, this);
    }


    public PlayAnimaAndAddCoin() {
        if (this.shipLevel != 0) {
            let self = this;
            let dTime = (this.gold_interval_m / GameManager.addSpeedNum) * 0.001;
            this.node.stopAllActions();
            this.node.runAction(
                cc.sequence(cc.delayTime(dTime), cc.scaleTo(0.05, 1.05), cc.delayTime(0.1), cc.scaleTo(0.05, 1),
                    cc.callFunc(function () {
                        GameManager._instance.AddCoin(self.outputCoinPSNum);
                        GameUI.Inst.CreateCoinFlyLabel(self);
                    })).repeatForever()
            );
        }
    }

    public OffEventType() {
        this.node.targetOff(this);
    }

    Init(_pool: cc.Node, _level: number) {//购买创建初始化 
        let self = this;
        self.icon.spriteFrame = GameUI.Inst.godSFA[_level];
        self.node.name = "ship_" + _level;
 
        this.pool = _pool;//设置所在水池
        this.SetZeroPoint();//设置绑定水池参数
        this.shipLevel = _level;
        this.outputCoinPSNum = DataConfig.GodConfigData[this.shipLevel - 1][DataConfig.GOD_output_gold];
        this.gold_interval_m = DataConfig.GodConfigData[this.shipLevel - 1][DataConfig.GOD_gold_interval_m];
        _pool.getComponent(PoolItem).SetShip(this);//设置水池以有船
        this.SetLevelLabel();
        this.PlayAnimaAndAddCoin();
        GameSave.Inst.setMassifDataOf(_pool.getSiblingIndex(), _level);
    }

    SetLevelLabel() {
        let self = this;
        if (self.shiplevelpanel == null) {
            let newNode: cc.Node = cc.instantiate(GameUI.Inst.getShiplevelpanel());
            self.shiplevelpanel = newNode;
            GameManager._instance.shipNumGroup.addChild(newNode);
            newNode.setPosition(self.zeroPoint.x - 50, self.zeroPoint.y);//设置船归位
            newNode.getComponentInChildren(cc.Label).string = self.shipLevel.toString();
        } else {
            self.shiplevelpanel.setPosition(self.zeroPoint.x - 50, self.zeroPoint.y);//设置船归位
            self.shiplevelpanel.getComponentInChildren(cc.Label).string = self.shipLevel.toString();
        }
        this.node.setPosition(this.zeroPoint);//设置船归
        this.node.zIndex = this.pool.getSiblingIndex();
    }

    SetZeroPoint() {
        if (this.shipLevel = 0) {
            this.zeroPoint = cc.v2(this.pool.position.x, this.pool.position.y - 10);
        } else {
            this.zeroPoint = cc.v2(this.pool.position.x, this.pool.position.y + 25);//设置零点位置
        }
    }

    onTouchStart(_event) {
        this.node.parent = GameManager._instance.node;
        let poolArray: PoolItem[] = GameManager._instance.poolLayout.node.getComponentsInChildren(PoolItem);
        for (let i = 0; i < poolArray.length; i++) {
            if (poolArray[i].isHaveShip) {
                if (this.shipLevel == poolArray[i].shipItem.shipLevel && poolArray[i].name != this.pool.name) {
                    poolArray[i].node.children[0].active = true;
                } else {
                    poolArray[i].node.children[0].active = false;
                }
            }
        }
    }

    touchP: cc.Vec2 = null;
    onTouchMove(_event) {

        this.touchP = this.node.parent.convertToNodeSpaceAR(_event.getLocation());
        if (GameSave.Inst.getGuideStep() != 1) {
            this.node.position = cc.v2(this.touchP.x, this.touchP.y - 30);
        } else {//避免出边
            if (this.touchP.x > -323 && this.touchP.x < 5 && this.touchP.y < 292 && this.touchP.y > 108) {
                this.node.position = cc.v2(this.touchP.x, this.touchP.y - 30);
            }
        }
    }

    onTouchEnd(_event) {
        this.node.parent = GameManager._instance.shipGroup;
        this.touchP = this.node.parent.convertToNodeSpaceAR(_event.getLocation());
        if (this.shipLevel == 0) {//开箱子
            let n: number = null;
            if (GameManager._instance.maxGodLevel < 11) {
                n = Math.round(Math.random() * 2 + 1);
            } else {
                n = 3;
            }
            this.Init(this.pool, n);
            AudioCtrl._instance.playClickBoxAudio();
        }
        this.TestingMergeShip(this.touchP);//检测合成
        this.node.zIndex = this.pool.getSiblingIndex();
        if (!this.isMerge) {
            this.node.position = this.zeroPoint;
        }
        let poolArray: cc.Node[] = GameManager._instance.poolLayout.node.children;
        for (let index = 0; index < poolArray.length; index++) {
            let tpool = poolArray[index];
            tpool.children[0].active = false;//关掉高亮
        }
    }

    TestingRecycle() {
        let pos1 = this.node.parent.convertToWorldSpaceAR(this.node.position);
        let pos2 = GameManager._instance.uINode.convertToWorldSpaceAR(GameManager._instance.uINode.getChildByName("TrashBtn").position);
        let v: number = null;
        v = pos1.sub(pos2).mag();
        if (v < 120) {
            GameManager._instance.ScsessShipClean(this.shipLevel, this);
            return true;
        }
        return false;
    }


    RecycleShip() {
        this.CleanPool();
        this.shiplevelpanel.destroy();
        this.node.destroy();
    }

    DestroyShip() {
        this.CleanPool();//清理水池
        this.shiplevelpanel.destroy();
        this.node.destroy();
    }

    TestingMergeShip(touchP) {
        //求拖动船和其他船的距离
        let v: number = null;
        let poolArray: cc.Node[] = GameManager._instance.poolLayout.node.children;
        for (let index = 0; index < poolArray.length; index++) {
            let tpool = poolArray[index];
            tpool.children[0].active = false;//关掉高亮
            let poolP = tpool.position.add(cc.v2(0, 50));
            v = poolP.sub(touchP).mag();
            if (tpool.name != this.pool.name) {
                if (v > 0 && v < 100 && tpool.getComponent(PoolItem).isHaveShip == true) {
                    if (this.shipLevel == tpool.getComponent(PoolItem).shipItem.shipLevel) {
                        this.isMerge = true;
                        let n = this.shipLevel + 1;
                        //cc.log("  合成船  ---  -  " + n);
                        if (this.shipLevel < MAX_GOD_LV) {
                            GameManager._instance.ShowMergeAnima(this.node, tpool.getComponent(PoolItem).shipItem.node, n, tpool);
                        } else {
                            GameManager._instance.messageCtrl.OpenMessage("已经合成最高级");
                            GameManager._instance.ExchangeShip(this, tpool.getComponent(PoolItem).shipItem);
                            return true;
                        }
                        this.ClosePoolH();
                        return true;
                    }
                    else if (tpool.getComponent(PoolItem).shipItem.shipLevel != 0) {
                        // cc.log("    ----两船交换-----    ");
                        GameManager._instance.ExchangeShip(this, tpool.getComponent(PoolItem).shipItem);
                        return true;
                    }
                }
                else if (v > 0 && v < 100 && tpool.getComponent(PoolItem).isHaveShip == false) {//空水池
                    //cc.log("    ----放置空位-----    ");
                    GameManager._instance.PlaceVacancy(this, tpool);
                    return true;
                }
            }
        }
        this.TestingRecycle();//检测回收站
        this.node.position = this.zeroPoint;
        return false;
    }




    ClosePoolH() {
        let poolArray: cc.Node[] = GameManager._instance.poolLayout.node.children;
        for (let index = 0; index < poolArray.length; index++) {
            let pool = poolArray[index];
            pool.children[0].active = false;//关掉高亮
        }

    }

    CleanPool() {
        this.pool.getComponent(PoolItem).CleanPool();
    }

    InitShip(_shipLevel: number) {
        this.shipLevel = _shipLevel;
    }
}
