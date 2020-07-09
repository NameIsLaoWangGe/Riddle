import ZhiZhen from "./RotateSelfPro";
import RotateSelfPro from "./RotateSelfPro";
import { lwg } from "../script/Lwg_Template/lwg";
import ADManager from "../TJ/Admanager";


export default class ZhuanPan extends Laya.Script {

    //#region   /******************转盘界面*********************/

    Zhuanpan: Laya.Image;
    ZhuanpanBG: Laya.Box;
    ZhuanpanZhizhen: Laya.Box;
    zhuanpanParent: Laya.Box;
    _rotateSelfPro: RotateSelfPro;
    RewardPanel: Laya.Box;
    StartBtn: Laya.Image;
    BG: Laya.Image;
    lotteryProps: Laya.Box[] = [];

    //转盘按钮
    firstUseed = "1";
    First: Laya.Box;
    Second: Laya.Box;

    onAwake() {
        lwg.Global._stageClick = false;

        this.Zhuanpan = this.owner as Laya.Image;
        this.zhuanpanParent = this.Zhuanpan.getChildByName("zhuanpanParent") as Laya.Box;
        this.RewardPanel = this.Zhuanpan.getChildByName("RewardPanel") as Laya.Box;
        this.StartBtn = this.Zhuanpan.getChildByName("StartBtn") as Laya.Image;

        this.ZhuanpanBG = this.zhuanpanParent.getChildByName("ZhunpanBG") as Laya.Box;
        this.ZhuanpanZhizhen = this.zhuanpanParent.getChildByName("ZhiZhen") as Laya.Box;
        this.BG = this.ZhuanpanBG.getChildByName("BG") as Laya.Image;
        for (let index = 0; index < this.BG.numChildren; index++) {
            this.lotteryProps.push(this.BG.getChildByName('prop' + (index + 1)) as Laya.Box);
        }
        this.RewardPanelInit();
        this._rotateSelfPro = this.zhuanpanParent.getComponent(RotateSelfPro) as RotateSelfPro;
        this._rotateSelfPro.OpenZhiZhen();
        this.StartBtn.on(Laya.Event.CLICK, this, this.ZhunapanStart)
        this.CaiDanMoveInit();

        this.First = this.StartBtn.getChildByName("First") as Laya.Box;
        this.Second = this.StartBtn.getChildByName("Second") as Laya.Box;
        this.RefreshBtn();//按钮刷新

        lwg.Click.on(lwg.Click.ClickType.largen, null, this.owner.scene['BtnBack'], this, null, null, this.btnCloseUp, null);

    }

    btnCloseUp(e: Laya.Event): void {
        e.currentTarget.scale(1, 1);
        this.owner.scene.close();
    }

    RefreshBtn()//第一次免费 后面看广告
    {
        this.firstUseed = Laya.LocalStorage.getItem("firstUseed")

        if (this.firstUseed) {
            if (this.firstUseed == "0") {
                this.First.visible = true;
                this.Second.visible = false;
            }
            else {
                this.First.visible = false;
                this.Second.visible = true;
            }
        }
        else {
            this.First.visible = true;
            this.Second.visible = false;
            Laya.LocalStorage.setItem("firstUseed", "0")
        }
    }

    //开始转
    ZhunapanStart() {
        console.log("点击转盘");
        if (this.First.visible) {
            Laya.LocalStorage.setItem("firstUseed", "1")
            this.StartLottery();
            this.StartBtn.visible = false;
        }
        else {
            //看广告
            console.log("看广告");
            // ADManager.ShowReward(() => {
            this.StartLottery();
            this.StartBtn.visible = false;
            // })
        }

    }

    StartLottery() {
        this._rotateSelfPro.AddSpeed();
        this._rotateSelfPro.OpenZhiZhen();

        //let temptime = this.randomInRange_i(1500, 1500);
        Laya.timer.once(1500, this, this.StopLottery)
    }

    lotteryGift: LotteryGift = LotteryGift.prop1;
    //停止转
    StopLottery() {
        console.log("转盘停止");
        let ran = this.randomInRange_i(0, 100);
        if (ran >= 0 && ran < 20) {
            this.lotteryGift = LotteryGift.prop1;
        }
        else if (ran >= 20 && ran < 40) {
            this.lotteryGift = LotteryGift.prop2;
            lwg.Global._pikaqiu = true;
            if (lwg.Global._pikaqiu) {
                this.lotteryGift = LotteryGift.prop3;
            }
        }
        else if (ran >= 40 && ran < 60) {
            this.lotteryGift = LotteryGift.prop3;
        }
        else if (ran >= 60 && ran < 80) {
            this.lotteryGift = LotteryGift.prop4;
        }
        else if (ran >= 80 && ran < 100) {
            this.lotteryGift = LotteryGift.prop6;
        }
        // this.lotteryGift = LotteryGift.prop6;  特殊皮肤奖励
        let degree = 60 * this.lotteryGift + this.randomInRange_i(25, 35);
        this._rotateSelfPro.StopSpeed(degree, () => {
            this.lotteryindex = this.lotteryGift;
            switch (this.lotteryGift) {
                case 0:
                    lwg.Global._addExecution(3);
                    break;
                case 1:
                    lwg.Global._paintedPifu.push[RewardDec.prop2];
                    break;
                case 2:
                    lwg.Global._addGold(30);
                    break;
                case 3:
                    lwg.Global._addExecution(2);
                    break;
                case 4:
                    lwg.Global._addGold(60);
                    break;
                case 5:
                    break;
            }
            console.log("获取礼物", this.lotteryGift + 1);
            Laya.timer.once(500, this, this.ShowReward);
        })
    }
    //#endregion


    //#region   /******************转盘奖励获取******************** */
    lotteryindex: number = 0;
    ADaction: Function;
    Normalaction: Function
    RewardPanelInit() {
        let BtnADAgain = this.RewardPanel.getChildByName("BtnADAgain") as Laya.Image;
        let BtnNo = this.RewardPanel.getChildByName("BtnNo") as Laya.Image;
        console.log(BtnNo);
        lwg.Click.on(lwg.Click.ClickType.largen, null, BtnADAgain, this, null, null, this.btnADAgainUp, null);
        lwg.Click.on(lwg.Click.ClickType.largen, null, BtnNo, this, null, null, this.btnNoUp, null);
    }
    btnADAgainUp(): void {
        // console.log("看广告");
        // ADManager.ShowReward(() => {
        this.ClosePanel();
        this.StartLottery();
        this.StartBtn.visible = false;
        // })
    }
    btnNoUp(e: Laya.Event): void {
        this.ClosePanel();
    }

    //index 奖励索引
    //BtnState 按钮状态 1 广告  0 普通
    //_action 事件 按钮点击后的事件
    ShowReward() {
        this.RewardPanel.x = 0;
        this.RewardPanel.y = 0;
        this.RefreshBtn();
        this.StartBtn.visible = true;

        // 奖励图片展示规则
        let prop = this.RewardPanel.getChildByName('Prop') as Laya.Image;
        let pic = prop.getChildByName('Pic') as Laya.Image;
        pic.skin = RewardSkin['prop' + (this.lotteryindex + 1)];
        let dec = prop.getChildByName('Dec') as Laya.Label;
        dec.text = RewardDec['prop' + (this.lotteryindex + 1)];
        if (this.lotteryindex + 1 === 2 || this.lotteryindex + 1 === 5) {
            pic.scale(0.7, 0.7);
            pic.x = 33;
            pic.y = 6;
        } else {
            pic.scale(3, 3);
            if (this.lotteryindex + 1 === 1 || this.lotteryindex + 1 === 4) {
                pic.x = 15;
                pic.y = 26;
            } else if (this.lotteryindex + 1 === 3 || this.lotteryindex + 1 === 6) {
                pic.x = 6;
                pic.y = 14;
            }
        }

    }

    GetRewardClick() {
        if (this.Normalaction != null) {
            this.Normalaction();
        }
        this.ClosePanel();
    }

    ADGetRewardClick() {
        //看视频获取----------------------------------------->
        console.log("看广告");
        ADManager.ShowReward(() => {
            this.ADaction();
            this.ClosePanel();
            this.StartLottery();
            this.StartBtn.visible = false;
        })
    }
    ClosePanel() {
        this.RewardPanel.x = 1500;
        this.RewardPanel.y = 0;
    }
    //#endregion


    //#region  /******************彩蛋1*********************/
    CaiDanParnet: Laya.Box;
    CaidanImage: Laya.Image;
    ImageX: number = 0;
    ImageY: number = 0;
    ImageCanMove: boolean = false;//菜单是否可用

    CaiDanMoveInit() {
        this.CaiDanParnet = this.lotteryProps[4];
        this.CaidanImage = this.CaiDanParnet.getChildAt(1) as Laya.Image;
        console.log("CaiDanParnet", this.CaiDanParnet, "CaidanImage", this.CaidanImage);
        this.RefreshCaiDan();
    }

    RefreshCaiDan() {
        let use = Laya.LocalStorage.getItem("LotteryCaidan")//是否存在Key1
        if (use) {
            if (use == "0") {
                this.CaidanImage.on(Laya.Event.MOUSE_DOWN, this, this.CaiDanDown);
                this.CaidanImage.on(Laya.Event.MOUSE_UP, this, this.CaiDanUp);
                this.CaidanImage.on(Laya.Event.MOUSE_OUT, this, this.CaidanMoveOut);
            }
            else {
                this.CaidanImage.off(Laya.Event.MOUSE_DOWN, this, this.CaiDanDown);
                this.CaidanImage.off(Laya.Event.MOUSE_UP, this, this.CaiDanUp);
                this.CaidanImage.off(Laya.Event.MOUSE_OUT, this, this.CaidanMoveOut);
            }
        }
        else {
            Laya.LocalStorage.setItem("LotteryCaidan", "0");
            this.CaidanImage.on(Laya.Event.MOUSE_DOWN, this, this.CaiDanDown);
            this.CaidanImage.on(Laya.Event.MOUSE_UP, this, this.CaiDanUp);
            this.CaidanImage.on(Laya.Event.MOUSE_OUT, this, this.CaidanMoveOut);
        }
        this.ImageX = this.CaidanImage.x;
        this.ImageY = this.CaidanImage.y;
    }

    CaiDanDown() {
        console.log("彩蛋点击事件");
        this.CaidanImage.on(Laya.Event.MOUSE_MOVE, this, this.CaiDanMove);
    }
    CaiDanMove() {
        this.CaidanImage.x = this.CaiDanParnet.mouseX;
        this.CaidanImage.y = this.CaiDanParnet.mouseY;
    }
    CanGet: boolean = false;
    CaidanMoveOut()//快速移动时 鼠标脱离物体
    {
        this.CaiDanUp();
    }
    CaiDanUp() {
        this.CaidanImage.off(Laya.Event.MOUSE_MOVE, this, this.CaiDanMove);

        let x = Math.abs(this.CaidanImage.x - this.ImageX);
        let y = Math.abs(this.CaidanImage.y - this.ImageY);
        if ((x * x + y * y) > 40000) {
            console.log("位置恢复,触发");
            this.lotteryindex = LotteryGift.prop6;
            this.ADaction = () => {
                //获取
                Laya.LocalStorage.setItem("LotteryCaidan", "1");
                this.RefreshCaiDan()

            }
            this.Normalaction = () => {
                this.RefreshCaiDan()
                console.log("点击获取", this.lotteryGift);
            }
            this.ShowReward();
        }
        else {
            console.log("位置恢复,不触发");

        }
        this.CaidanImage.x = this.ImageX;
        this.CaidanImage.y = this.ImageY;

    }

    //#endregion

    /******************彩蛋*********************/
    Caidan1: Laya.Box;
    Caidan2: Laya.Box;
    Caidan1item: Laya.Image;
    Caidan2item: Laya.Image;

    CaidanInit() {
        this.Caidan1 = this.Zhuanpan.getChildByName("CaiDan1") as Laya.Box;
        this.Caidan2 = this.Zhuanpan.getChildByName("Caidan2") as Laya.Box;
        this.Caidan1item = this.Caidan1.getChildByName("Caidan1item") as Laya.Image;
        this.Caidan2item = this.Caidan2.getChildByName("Caidan2item") as Laya.Image;
    }

    randomInRange_i(x: number, y: number, s = null): number {
        let rs;
        if (x == y) {
            rs = x;
        } else if (y > x) {
            let v = (y - x) * (s == null ? Math.random() : s) + x;
            rs = v.toFixed();
        } else {
            throw `x > y`;
        }
        return Number(rs);
    }

    onDisable(): void {
        lwg.Global._stageClick = true;
    }

}

export enum LotteryGift {
    prop1,
    prop2,
    prop3,
    prop4,
    prop5,
    prop6,
}

export enum RewardDec {
    prop1 = '体力x3',
    prop2 = '皮卡丘',
    prop3 = '金币x30',
    prop4 = '体力x2',
    prop5 = '可达鸭',
    prop6 = '金币x60'
}
export enum RewardSkin {
    prop1 = 'UI_new/conmmon/icon_execution.png',
    prop2 = 'UI_new/conmmon/icon_qingdi.png',
    prop3 = 'UI_new/conmmon/icon_gold.png',
    prop4 = 'UI_new/conmmon/icon_execution.png',
    prop5 = 'UI_new/conmmon/icon_qingdi.png',
    prop6 = 'UI_new/conmmon/icon_gold.png'
}













































