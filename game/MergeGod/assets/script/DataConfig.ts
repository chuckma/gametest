import GameManager from "./GameManager";
import GameSave from "./GameSave";

export const VERSION = 11.2
export const FIND_DIS = 80
export const SHOOT_DIS = 500
export const Z_TOWER = 1
export const Z_TOWER_MOVE = 200
export const Z_FLY_COIN = 300
export const Z_FLY_ARROW = 300
export const Z_SHOOT = 3
export const MONSTER_GEN_DT = 2
export const MONSTER_JY_GEN_DT = 1
export const BOX_GEN_DT = 8


export const INIT_COINNUM = 5000;

export const MAX_GOD_LV = 37

export const LOTTERY_NUM = 5

export const BUFF_TIME = 45

export const BIG_BUFF_TIME = 300

export const TREASURE_BOX_CD = 30

export const UNLOCK_LAND_LEVEL = 1

export const OUTPUT_TIME_INTERVAL = 5.5

export const MAX_COIN_NUM = 40;//下方金币最大个数

export const BANNERAd_ID = 'adunit-7386b55d2c6a2917';

export const VIDEO_ID = [
    'adunit-ec16763e94ca6a7e', //1
    'adunit-090506766655dc76',//2
    'adunit-7b39630940cb860c',//3
    'adunit-88be50929430eeb7',//4
    'adunit-ff8380c341882b7f',//5
    'adunit-f06fde3483342017',//6
    'adunit-66a8dfb5f29de7e3'];//7

export const VIDEO_FULL_NUM = 50;

/*
export const VIDEO_Default_ID = -1;
export const VIDEO_AddLottery = 0;
export const VIDEO_Accelerate = 1;
export const VIDEO_FreeBox = 2;
export const VIDEO_NoMoney = 3;
export const VIDEO_SignIn = 4;
export const VIDEO_OutLine = 5;
export const VIDEO_TurntableBox = 6;
*/



export const ENCOURAGE_RECEIVE = 0;
export const ENCOURAGE_SHARE = 1;
export const ENCOURAGE_VIDEO = 2;


export const SHARE_FULL_NUM_REDENVELOP = 6;//红包分享限制次数
export const SHARE_FULL_NUM = 50;//分享限制次数

export const SHARE_ID_NUM = 17;//分享ID总个数 最大 加1

//export const SHARE_STATE = 0;


export const ENCOURAGE_Default = 0;//默认
export const ENCOURAGE_AddLottery = 1;
export const ENCOURAGE_Accelerate = 2;
export const ENCOURAGE_FlyBox = 3;
export const ENCOURAGE_RewrdNoMoney = 4;
export const ENCOURAGE_SignInDouble = 5;
export const ENCOURAGE_Outlien = 6;
export const ENCOURAGE_AddDiamondBtn = 7;
export const ENCOURAGE_TurntableBox = 8;
export const ENCOURAGE_DailyIF = 9;
export const ENCOURAGE_ListGiftIF = 10;
export const ENCOURAGE_PreiseGiftIF = 11;
export const ENCOURAGE_XuanyaoTop = 12;
export const ENCOURAGE_RewrdCoinGame = 13;
export const ENCOURAGE_RewrdNoDiamond = 14;
export const ENCOURAGE_TopIF = 15;
export const ENCOURAGE_Fukubukuro = 16;
export const ENCOURAGE_SignInOneMore = 17;

export const SHARE_MIX_LEAVETIME = 2.5;
export const SHARE_MIX_SUCC_RATE_ = 0.5;


export const NODIAMOND_LEVEL = 15;
export const NODIAMOND_SHARE_REWARDNUM = 50;
export const NODIAMOND_VIDEO_REWARDNUM = 200;

export const DAILY_GIFT_PEOPLE = 2;
export const DAILY_GIFT_HOUR = 10;
export const DAILY_GIFT_RESET_HOURS = 8;


export const REDENVELOP_OPENLEVEL = 5;

export const REDENVELOP_SHARE_INTERVAL_MIN = 15;//红包分享间隔次数 上下限
export const REDENVELOP_SHARE_INTERVAL_MAX = 20;



export const PRIZE_MassiveCoin = 0;

//export const PRIZE_BoxTen = 1;
export const PRIZE_AccLarge = 1;

//export const PRIZE_MediumCoin = 2;
export const PRIZE_SeniorGod = 2;

export const PRIZE_DiamondOneHundred = 3;

//export const PRIZE_BoxFive = 4;
export const PRIZE_AccALittle = 4;

export const PRIZE_LargeCoin = 5;
export const PRIZE_ALittleCoin = 6;
export const PRIZE_DiamondTwoHundred = 7;

export const VIDEO_PLAY_INTERVAL_TIME = 10;

export const OUTLINE_REWARD_MIX_SCE = 0;
export const OUTLINE_REWARD_MAX_SCE = 2 * 60 * 60;
export const OUTLINE_REWARD_RATE = 1;




export const LISTGIFT_PEOPLENUM = 10;

export const FLYBOX_REWARDCOIN = 10000;
export const COLLECTIONGUIDANCE_DAINUM = 666;
export const XUAN_YAO_TITLE = "玩游戏能减肥，两个小时减10斤，快来试！！";


export const PRIZE_TITLE = ["1k金币",
    "高级塔",
    "80k金币",
    "攻击道具",
    "50k金币",
    "300k金币",
    "10k金币",
    "初级塔"];

export const DOUBLE_COIN_TIME = 120

export interface DailyRewardData {
    rewardType: number, // 1 金币, 2 解锁塔
    value: number  // 金币 单位k  或者   解锁个数
}

export const VIDEO_FAIL_TEXT = "视频未播放完毕不能获得奖励";
export const VIDEO_LOADFAIL1_TEXT = "观看视频次数已经达到上限，请明天再试";
export const VIDEO_LOADFAIL2_TEXT = "视频获取失败，请检查网络稍后再试。";


export const SHARE_FAIL_TEXT = "分享失败，请分享到不同的群";
export const SHARE_WAIT_TEXT = "等待微信服务器返回信息";
export const SHARE_NUMFULL_TEXT = "今日已达上限，请明日再试";
export const SHARE_CMONPLET_INVITATION_TEXT = "您的好友已为你助力，请去领取赠礼.";

export const SHARE_TITLE = [
    "当凡人还是当玉帝，在这个游戏里，你说了算！？",
    "从凡人修仙到三界之主，你敢来吗？",
    "穿越神仙世界，我当上了玉帝，你来试试?!"
];

export const enum ENCOURAGE_ID {
    noMoney_prize_ID1 = 0,
    noMoney_prize_ID2 = 1,
    noMoney_prize_ID3 = 2,
    noDiamond_prize_ID4 = 3,
    noDiamond_prize_ID5 = 4,
    turntable_5 = 5,
    turntable_10 = 6,
    turntable_25 = 7,
    turntable_50 = 8,
    turntable_100 = 9,
    accBtn_2 = 10,
    top_god = 11,
    gift = 12,
    giftDay = 13,
    top = 14,
    flybox = 15,
    noMoney = 16,
    noDiamond = 17,
    top_god_flaunt = 18,
    redEnvelop = 19,
    signIn_double = 20,
    signIn_onemore = 21,
    outline_double = 22,
    lottery = 23
};



export const enum OPERATE_ID {
    lottery_share_max = 1,
    lottery_dayUpdate_Num = 2,
    noMoney_prize_ID1 = 3,
    noMoney_prize_ID2 = 4,
    noMoney_prize_ID3 = 5,
    noDiamond_prize_ID4 = 6,
    noDiamond_prize_ID5 = 7,
    noDiamond_Spare1 = 8,
    noDiamond_Spare2 = 9,
    noDiamond_Spare3 = 10,
    spare_ID11 = 11,
    spare_ID12 = 12,
    spare_ID13 = 13,
    spare_ID14 = 14,
    spare_ID15 = 15,
    spare_ID16 = 16,
    spare_ID17 = 17,
    spare_ID18 = 18,
    flybox_run_after_hide_num = 19,
    flybox_hide_time_min = 20,
    flybox_hide_time_max = 21,
    flybox_Spare1 = 22,
    flybox_Spare2 = 23,
    flybox_Spare3 = 24,
    flybox_Spare4 = 25,
    flybox_Spare5 = 26,
    flybox_dayOpen_maxNum = 27,
    noMoney_dayOpen_maxNum = 28,
    noDiamond_dayOpen_maxNum = 29,
    accBtn2_dayOpen_maxNum = 30,
    fuku_dayOpen_maxNum = 31,
    addDiamondBtn_dayOpen_maxNum = 32,
    spare3_maxNum = 33,
    spare4_maxNum = 34,
    spare5_maxNum = 35,
    spare6_maxNum = 36,
    spare7_maxNum = 37,
    spare8_maxNum = 38,
    spare9_maxNum = 39,
    spare10_maxNum = 40,
    spare11_maxNum = 41,
    spare12_maxNum = 42,
    spare13_maxNum = 43,
    spare14_maxNum = 44,
    spare15_maxNum = 45,
    topBtn_open_level = 46,
    gift_open_level = 47,
    signIn_open_level = 48,
    turntable_open_level = 49,
    onlineGift_open_level = 50,
    hangBox_open_level = 51,
    flyBox_open_level = 52,
    outlineProfit_open_level = 53,
    banner_open_level = 54,
    open_level_spare2 = 55,
    open_level_spare3 = 56,
    open_level_spare4 = 57,
    open_level_spare5 = 58,
    acceleration_btn1_DIA_PRICE = 59,
    acceleration_btn1_time = 60,
    acceleration_btn1_rate = 61,
    acceleration_btn2_time = 62,
    acceleration_btn2_rate = 63,
    acceleration_Spare1 = 64,
    acceleration_Spare2 = 65,
    acceleration_Spare3 = 66,
    acceleration_Spare4 = 67,
    acceleration_Spare5 = 68
};


export interface GodData {
    id: number,
    name: number,
    level: number,
    iconNum: number,
    output_gold: number,
    unlock_diamond: number,
    diamond: number,
    unlock_buy_gold: number,
    buy_gold: number,
    add_gold_rate: number,
    unlock_buy_diamond: number,
    buy_diamond: number,
    add_diamond_rate: number,
    free_gold: number
}


export default class DataConfig {


    static GOD_ID = 0
    static GOD_Name = 1
    static GOD_level = 2
    static GOD_iconNum = 3
    static GOD_output_gold = 4
    static GOD_unlock_diamond = 5
    static GOD_diamond = 6
    static GOD_unlock_buy_gold_level = 7
    static GOD_buy_gold = 8
    static GOD_add_gold_rate = 9
    static GOD_unlock_buy_diamond_level = 10
    static GOD_buy_diamond = 11
    static GOD_add_diamond_rate = 12
    static GOD_fly_gold = 13
    static GOD_trash_gold = 14
    static GOD_gold_interval_m = 15
    static GOD_info = 16
    static GOD_turntable_diamond_base = 17
    public static GodConfigData = [[]];
    static ListGif_ID = 0
    static ListGif_friend_num = 1
    static ListGif_diamond = 2
    public static ListGifData = [[]];

    static SignIn_ID = 0
    static SignIn_Day = 1
    static SignIn_DiaNum = 2
    static SignIn_DiaNumOneMore = 3
    public static SignInData = [[]];

    static Fukubukuro_ID = 0
    static Fukubukuro_LimitNum = 1
    static Fukubukuro_Min_redpacket = 2
    static Fukubukuro_Max_redpacket = 3
    public static FukubukuroData = [[]];

    static ShareReward_ID = 0
    static ShareReward_Short_Diamond = 1
    static ShareReward_Fly_Gold = 2
    static ShareReward_Short_Gold = 3
    public static ShareRewardData = [[]];

    public static OperateData = [[]];

    static Weight_ID = 0
    static TurntableWeight_RewardType = 1
    static TurntableWeight_PrizeNum = 2
    static TurntableWeight_WeightNormal = 3
    static TurntableWeight_Weight5 = 4
    static TurntableWeight_Weight10 = 5
    static TurntableWeight_Weight25 = 6
    static TurntableWeight_Weight50 = 7
    static TurntableWeight_Weight100 = 8

    public static TurntableWeightData = [[]];
    
    public static LotteryData = [[]];

    public static getOperateDataValue(_id : number) : number {
        return this.OperateData[_id-1][1];

    }

    public static getShortName(_name: string): string {
        if (_name.length > 5) {
            return _name.substring(0, 5) + "...";
        } else {
            return _name;
        }
    }
    
    public static getFlyBoxCoin(): number {
        //宝箱获得金币    
        let n1 = GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_RewrdNoMoney);
        let n2 = GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_FlyBox);
        let n = n1 + n2;
        if(n >= DataConfig.ShareRewardData.length){
            return null;
        }
        let data = DataConfig.ShareRewardData[n];
        let r = data[DataConfig.ShareReward_Fly_Gold];
        return r * this.getMaxCoinBuyPriceMulGOD_fly_gold();

    }


    public static getNoMoneyCoin(): number {
        //金币不足就获得数 
        let n1 = GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_RewrdNoMoney);
        let n2 = GameSave.Inst.getEncourageSuccessNumOf(ENCOURAGE_FlyBox);
        let n = n1 + n2;
        if(n >= DataConfig.ShareRewardData.length){
            return null;
        }
        
        let data = DataConfig.ShareRewardData[n];
        let r = data[DataConfig.ShareReward_Short_Gold];
        //console.log("次数"  + n + "系数 " + r);

        return r * this.getMaxCoinBuyPriceMulGOD_fly_gold();

    }


    public static getMaxCoinBuyPriceMulGOD_fly_gold(): number {
        //最大可金币购买等级人物 价格 * 飞行宝箱系数（人物表）
        //版本10 取消 乘宝箱系数
        let _maxCoinNum = 0;
        for (let index = 0; index < GameManager._instance.maxGodLevel; index++) {
            // const element = array[index];
            if (DataConfig.GodConfigData[index][DataConfig.GOD_unlock_buy_gold_level] <= GameManager._instance.maxGodLevel) {
                _maxCoinNum = GameManager._instance.getCoinPrice(index + 1);
            }
        }
        return _maxCoinNum;

    }

    public static DailyReward: DailyRewardData[] = [

        {
            rewardType: 1,
            value: 10
        }, // 1

        {
            rewardType: 1,
            value: 30
        },//2

        {
            rewardType: 2,
            value: 1
        },//3

        {
            rewardType: 1,
            value: 100
        },//4
        {
            rewardType: 1,
            value: 300
        },//5
        {
            rewardType: 1,
            value: 800
        },//6
        {
            rewardType: 2,
            value: 2
        }//7
    ]
  

}

