
import DataConfig, { LOTTERY_NUM } from "./dataConfig";
import Bitbear from "./Bitbear";

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

interface UserData {
    money: number,
    profitNum: number,
    diamondNum: number,
    lotteryNum: number,
    buytimes: { [key: number]: number },
    buyDiaTimes: { [key: number]: number },
    guide: number,
    massifData: number[],
    maxLv: number,
    week: number,
    dailyReward: number[],
    startGameDate: number,
    dayNum: number,
    shareSumNum: number,
    shareSuccessNum: number[],
    lastDaygiftlistLength: number,
    lastGiftlistLength: number,
    doubleOutputID: number,
    doubleOutputTime: number,
    openTreasureBoxTime: number,
    isFirstPlay: number,
    exp: number,
    videoPlaySuccessNum: number[],
    encourageSuccessNum: number[],
    rewardSignInDayNum: number
}


@ccclass
export default class GameSave extends cc.Component {


    public static Inst: GameSave = null
    //isFirstPlay : boolean = false;



    private data: UserData = {
        money: 5000,
        profitNum: 0,
        diamondNum: 0,
        lotteryNum: LOTTERY_NUM,
        buytimes: {},
        buyDiaTimes: {},
        guide: 0,
        massifData: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //地块数据
        maxLv: 1,
        week: 0,
        dailyReward: [0, 0, 0, 0, 0, 0, 0],
        startGameDate: new Date().getTime(),
        dayNum: 0,
        shareSumNum: 0,
        shareSuccessNum: [0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0,],
        lastDaygiftlistLength: 0,
        lastGiftlistLength: 0,
        doubleOutputID: 0,
        doubleOutputTime: 0,
        openTreasureBoxTime: 0,
        isFirstPlay: 0,
        exp: 0,
        videoPlaySuccessNum: [0, 0, 0, 0, 0, 0],
        encourageSuccessNum: [0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0,],
        rewardSignInDayNum: 0

    }


    onLoad() {
        GameSave.Inst = this;
    }


    init(viewCallback: (data: UserData) => void) {
        let self = this;

        //this.initData() ;
        try {
            Bitbear.getInstance().downloadData(function (data) {
                //   let dataStr = cc.sys.localStorage.getItem("data")
                //console.log(data.data.data);
                //console.log(data.data.data.data);
                let dataStr = data.data.data.data;
                // console.log("------downloadData", dataStr);

                try {
                    if (dataStr == null || dataStr == undefined) {
                        //this.data.isFirstPlay = true;
                        console.log("net no data");
                        self.loadLocalData(viewCallback);
                    }
                    else {
                        console.log("写入网络存档");
                        self.data = JSON.parse(dataStr)
                        // old data 
                        self.testingUndefinedData();
                        viewCallback(self.data);
                    }

                } catch (e) {
                    //网络存档载入错误 或无存档 初始存档
                    console.log("-----网络存档载入错误 或无存档 初始存档");
                    self.loadLocalData(viewCallback);
                    //  viewCallback(self.data);
                }
            });

        }
        catch (e) {
            self.loadLocalData(viewCallback);
        }
    }

    testingUndefinedData() {

        //存档版本兼容
        if (this.data.maxLv == undefined || this.data.maxLv == null) {

            this.data.exp = 0;
            this.data.maxLv = 1;
            this.data.massifData = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        }

        if (this.data.encourageSuccessNum == undefined || this.data.isFirstPlay == null) {

            this.data.encourageSuccessNum = [0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0,];
        }

        console.log("------isFirstPlay", this.data.isFirstPlay);
        if (this.data.isFirstPlay == undefined || this.data.isFirstPlay == null) {

            this.data.isFirstPlay = 0;
        }
        if (this.data.rewardSignInDayNum == undefined || this.data.rewardSignInDayNum == null) {

            this.data.rewardSignInDayNum = 0;
        }
        if (this.data.doubleOutputID == undefined || this.data.doubleOutputID == null) {

            this.data.doubleOutputID = 0;
        }


    }


    /*loadLocalData(viewCallback: (data: UserData) => void) {
        let self = this;
        console.log("网络存档不存在  重置");

        let dataStr = cc.sys.localStorage.getItem("data")
        if (dataStr == null || dataStr == undefined) {
            console.log("new data")

        }
        else {
            self.data = JSON.parse(cc.sys.localStorage.getItem("data"))
            // old data 
            self.testingUndefinedData();
        }
        viewCallback(self.data);
        this.uploadData();
    }*/

     loadLocalData(viewCallback: (data: UserData) => void) {
          let self = this;
          console.log("网络存档不存在  重置");
          try {
              let dataStr = cc.sys.localStorage.getItem("data")
              // console.log("------dataStr", dataStr);
              if (dataStr == null || dataStr == undefined) {
                  //this.data.isFirstPlay = true;
                  console.log("new data")
  
              }
              else {
                  self.data = JSON.parse(cc.sys.localStorage.getItem("data"))
                  // old data 
                  self.testingUndefinedData();
              }
             // console.log("-----------------------");
              viewCallback(self.data);
             // console.log("---------333333--------------");
          } catch (e) {
              console.log("读取本地存档错误 e " + e);
              this.data = {
                  money: 5000,
                  profitNum: 0,
                  diamondNum: 0,
                  lotteryNum: LOTTERY_NUM,
                  buytimes: {},
                  buyDiaTimes: {},
                  guide: 0,
                  massifData: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  maxLv: 1,
                  week: 0,
                  dailyReward: [0, 0, 0, 0, 0, 0, 0],
                  startGameDate: new Date().getTime(),
                  dayNum: 0,
                  shareSumNum: 0,
                  shareSuccessNum: [0, 0, 0, 0, 0,
                                    0, 0, 0, 0, 0,
                                    0, 0, 0, 0, 0,
                                    0, 0,],
                  lastDaygiftlistLength: 0,
                  lastGiftlistLength: 0,
                  doubleOutputID: 0,
                  doubleOutputTime: 0,
                  openTreasureBoxTime: 0,
                  isFirstPlay: 0,
                  exp: 0,
                  videoPlaySuccessNum: [0, 0, 0, 0, 0, 0],
                  encourageSuccessNum: [0, 0, 0, 0, 0,
                                      0, 0, 0, 0, 0,
                                      0, 0, 0, 0, 0,
                                      0, 0,],
                  rewardSignInDayNum: 0
              }
              //this.uploadData();
             // console.log("---------------222--------");
              
              viewCallback(self.data);
          }
      }

    save() {
        // console.log("-----save-dataStr", JSON.stringify(this.data));
        //cc.sys.localStorage.setItem("data", JSON.stringify(this.data));
        this.unschedule(this.setdata);
        this.scheduleOnce(this.setdata, 0.2);

    }

    setdata() {
        cc.sys.localStorage.setItem("data", JSON.stringify(this.data));
    }



    waitUploadData() {
        this.unschedule(this.uploadData);
        this.scheduleOnce(this.uploadData, 0.25);
    }

    uploadData() {
        console.log('StartUploadData');
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            Bitbear.getInstance().uploadData(JSON.stringify(this.data),
                function (res) {
                    console.log('uploadData');
                    console.log(res);
                });
        }
    }

    setDoubleOutputTime(_dopt: number) {
        this.data.doubleOutputTime = _dopt;
        this.save();

    }

    getDoubleOutputTime() {

        return this.data.doubleOutputTime;

    }


    getRewardSignInDayNum() {
        return this.data.rewardSignInDayNum;
    }

    setRewardSignInDayNum(_rewardSignInDayNum: number) {
        this.data.rewardSignInDayNum = _rewardSignInDayNum;
        this.save();
    }

    getShareSumNum() {

        return this.data.shareSumNum;

    }

    setShareSumNum(_shareSumNum: number) {

        this.data.shareSumNum = _shareSumNum;
        this.save();

    }

    cleanEncourageSuccessNum() {
        // let sn = GameManager._instance.GetIntData("VideoNum" + _videoID, 0);
        //console.log( this.data.encourageSuccessNum);

        for (let index = 0; index < this.data.encourageSuccessNum.length; index++) {
            this.data.encourageSuccessNum[index] = 0;

        }
        this.save();
        //console.log( this.data.encourageSuccessNum);
    }

    getEncourageSuccessNumOf(_id: number) {
        return this.data.encourageSuccessNum[_id];
    }

    setEncourageSuccessNumOf(_id: number, _Num: number) {
        console.log(_id, _Num);
        this.data.encourageSuccessNum[_id] = _Num;
        this.save();

    }

    addEncourageSuccessNum(_encourageID: number) {

        /*  if(_encourageID == ENCOURAGE_RewrdNoMoney){
  
              _encourageID= ENCOURAGE_FlyBox;
              
          }*/
        this.data.encourageSuccessNum[_encourageID] += 1;
        this.save();
        // let sn = GameManager._instance.GetIntData("VideoNum" + _videoID, 0);
        // GameManager._instance.SetIntData("VideoNum" + _videoID, sn + 1);
    }

    setExp(exp: number) {
        this.data.exp = exp
        this.save()
    }

    addExp(exp: number) {
        this.data.exp += exp

        this.save();
    }



    getExp(): number {
        return this.data.exp
    }


    maxLv() {

        return this.data.maxLv ? this.data.maxLv : 1
    }

    clear() {
        cc.sys.localStorage.clear()
    }

    setIsFirstPlay(num: number) {

        this.data.isFirstPlay = num;
        this.save();
    }

    getIsFirstPlay(): number {

        return this.data.isFirstPlay
    }

    setDiamond(_dianum: number) {

        this.data.diamondNum = _dianum;
        this.save();
    }

    getDiamond(): number {

        return this.data.diamondNum
    }

    getMoney(): number {

        return this.data.money
    }

    setMaxLv(_maxLv: number) {
        this.data.maxLv = _maxLv;
        this.save();
    }

    getMaxLv(): number {
        return this.data.maxLv;
    }

    getLotteryNum(): number {
        ///return 1;
        return this.data.lotteryNum;
    }

    setLotteryNum(lotteryNum: number) {
        this.data.lotteryNum = lotteryNum;
        this.save()

    }




    getOpenTreasureBoxTime() {

        return this.data.openTreasureBoxTime
    }

    setOpenTreasureBoxTime(openTreasureBoxTime: number) {
        this.data.openTreasureBoxTime = openTreasureBoxTime
        this.save()

    }

    setMoney(money: number) {
        this.data.money = money
        this.save()
    }

    addMoney(money: number) {
        this.data.money += money
        this.save()
    }

    getBuyTimes(lv: number): number {
        let t = this.data.buytimes[lv - 1]
        return t ? t : 0
    }

    setBuyTimes(lv: number, times: number) {
        this.data.buytimes[lv - 1] = times
        this.save()
    }

    getBuyDiaTimes(lv: number): number {
        let t = this.data.buyDiaTimes[lv - 1]
        return t ? t : 0
    }

    setBuyDiaTimes(lv: number, times: number) {
        this.data.buyDiaTimes[lv - 1] = times
        this.save()
    }

    getGuideStep(): number {
        return this.data.guide
    }

    setGuideStep(step: number) {
        this.data.guide = step
        this.save()
    }

    getMassifDataOf(index: number): number {
        return this.data.massifData[index];
    }

    getMassifData(): number[] {
        return this.data.massifData
    }

    setMassifData(data: number[]) {
        this.data.massifData = data
        this.save()
    }

    setMassifDataOf(index: number, lv: number) {
        this.data.massifData[index] = lv
        this.save();
    }

    setStartGameDate(_time: number) {
        this.data.startGameDate = _time;
        this.save();
    }


    getStartGameDate() {
        if (this.data.startGameDate == undefined || this.data.startGameDate == null)
            this.data.startGameDate = new Date().getTime();
        return this.data.startGameDate;
    }

    getWeek() {
        if (this.data.week == undefined || this.data.week == null)
            this.data.week = 0;
        return this.data.week;
    }

    cleanRwardInfo() {
        for (let index = 0; index < this.data.dailyReward.length; index++) {
            this.data.dailyReward[index] = 0;
        }
        this.save();
    }
    getRwardInfo() {


        if (this.data.dailyReward == undefined || this.data.dailyReward == null)
            this.data.dailyReward = [0, 0, 0, 0, 0, 0, 0]

        return this.data.dailyReward;
    }


    getDayNum() {

        return this.data.dayNum;

    }

    setDayNum(_day: number) {

        this.data.dayNum = _day;
        this.save();
       // this.waitUploadData();
    }




    getLastGiftlistLength() {

        return this.data.lastGiftlistLength;

    }

    setLastGiftlistLength(_lastGiftlistLength: number) {

        this.data.lastGiftlistLength = _lastGiftlistLength;
        this.save();

    }


    getLastDaygiftlistLength() {

        return this.data.lastDaygiftlistLength;

    }

    setLastDaygiftlistLength(lastDaygiftlistLength: number) {

        this.data.lastDaygiftlistLength = lastDaygiftlistLength;
        this.save();

    }


    getRwardInfoOf(_dayNum: number): number {


        if (this.data.dailyReward == undefined || this.data.dailyReward == null)
            this.data.dailyReward = [0, 0, 0, 0, 0, 0, 0]

        return this.data.dailyReward[_dayNum];
    }

    setRwardInfoOf(_dayNum: number, rwardNum: number, week?: number) {

        this.data.week = week;
        this.data.dailyReward[_dayNum] = rwardNum;

        this.save()
        //this.waitUploadData();
        this.uploadData();
    }
    // update (dt) {}
}
/*setRwardInfo(info: number[], week: number) {

    this.data.week = week
    this.data.dailyReward = info

    this.save()
}*/