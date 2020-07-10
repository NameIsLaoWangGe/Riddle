import ZhiZhen from "./RotateSelfPro";
import RotateSelfPro from "./RotateSelfPro";
import { lwg } from "../script/Lwg_Template/lwg";
import ADManager, { TaT } from "../TJ/Admanager";


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
        ADManager.CloseBanner();
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
            ADManager.ShowReward(() => {
                this.StartLottery();
                this.StartBtn.visible = false;
            })
        }

    }

    StartLottery() {
        this._rotateSelfPro.AddSpeed();
        this._rotateSelfPro.OpenZhiZhen();

        //let temptime = this.randomInRange_i(1500, 1500);
        Laya.timer.once(1500, this, this.StopLottery)
    }

    lotteryGift: LotteryGift = LotteryGift.prop1;
    /**旋转次数*/
    lotteryNum: number = 0;
    //停止转
    StopLottery() {
        this.lotteryNum++;
        console.log("转盘停止");
        let ran = this.randomInRange_i(0, 100);
        if (ran >= 0 && ran < 20) {
            this.lotteryGift = 0;
        }
        else if (ran >= 20 && ran < 40) {
            if (lwg.Global._zibiyazi || this.lotteryNum === 1) {
                this.lotteryGift = 2;
            } else {
                this.lotteryGift = 1;
                lwg.Global._zibiyazi = true;
            }
        }
        else if (ran >= 40 && ran < 60) {
            this.lotteryGift = 2;
        }
        else if (ran >= 60 && ran < 80) {
            this.lotteryGift = 3;
        }
        // else if (ran >= 80 && ran < 100) {
        // 彩蛋皮肤转不到
        //     this.lotteryGift = 4;
        // }
        else if (ran >= 80 && ran < 100) {
            this.lotteryGift = 5;
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
                    lwg.Global._createHint_01(lwg.Enum.HintType.zibiyazi);
                    break;
                case 2:
                    lwg.Global._addGold(30);
                    break;
                case 3:
                    lwg.Global._addExecution(2);
                    break;
                case 4:
                    // 彩蛋皮肤赚不到
                    break;
                case 5:
                    lwg.Global._addGold(60);
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

        ADManager.ShowReward(() => {
            this.ClosePanel();
            this.StartLottery();
            this.StartBtn.visible = false;
        })
    }
    btnNoUp(e: Laya.Event): void {
        this.ClosePanel();
    }

    //index 奖励索引
    //BtnState 按钮状态 1 广告  0 普通
    //_action 事件 按钮点击后的事件
    ShowReward() {
        ADManager.TAPoint(TaT.PageEnter, 'turngiftpage');
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
            pic.scale(0.5, 0.5);
            pic.x = -35;
            pic.y = -53;
        } else {
            if (this.lotteryindex + 1 === 1 || this.lotteryindex + 1 === 4) {
                pic.x = 12.5;
                pic.y = 26;
            } else if (this.lotteryindex + 1 === 3 || this.lotteryindex + 1 === 6) {
                pic.x = 12.5;
                pic.y = 26;
            }
            pic.scale(1, 1);
        }
    }

    ClosePanel() {
        ADManager.TAPoint(TaT.PageLeave, 'turngiftpage');
        this.RewardPanel.x = 1500;
        this.RewardPanel.y = 0;
    }
    //#endregion

    //#region  /******************彩蛋1*********************/
    CaiDanMoveInit() {
        lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.owner.scene['Caidan'], this, this.caidanDwon, null, null, null);
        //免费领取彩蛋界面 
        let BtnNo = this.owner.scene['Painted_Pikaqiu'].getChildByName('BtnNo');
        let BtnFreeGet = this.owner.scene['Painted_Pikaqiu'].getChildByName('BtnFreeGet');
        lwg.Click.on(lwg.Click.ClickType.largen, null, BtnNo, this, null, null, this.btnNoUp_P, null);
        lwg.Click.on(lwg.Click.ClickType.largen, null, BtnFreeGet, this, null, null, this.btnFreeGetUp_P, null);
    }

    btnNoUp_P(e: Laya.Event): void {
        ADManager.TAPoint(TaT.PageLeave, 'PKskinQpage');

        e.currentTarget.scale(1, 1);
        this.owner.scene['Painted_Pikaqiu'].x = 1500;
        this.owner.scene['Painted_Pikaqiu'].y = 0;
    }

    btnFreeGetUp_P(e: Laya.Event): void {
        e.currentTarget.scale(1, 1);
        ADManager.ShowReward(() => {

            lwg.Global._huangpihaozi = true;
            lwg.LocalStorage.addData();
            this.owner.scene['Painted_Pikaqiu'].x = 1500;
            this.owner.scene['Painted_Pikaqiu'].y = 0;
            lwg.Global._paintedPifu.push[RewardDec.prop5];
            lwg.Global._createHint_01(lwg.Enum.HintType.saiyaren);
        })
    }

    mouseDwon: boolean = false;
    caidanDwon(): void {
        if (!lwg.Global._huangpihaozi) {
            this.mouseDwon = true;
        } else {
            console.log('已经获得了黄皮耗子皮肤！')
        }
    }
    mouseMove: boolean = false;
    onStageMouseMove(e: Laya.Event): void {
        if (this.mouseDwon) {
            this.mouseMove = true;
            this.owner.scene.addChild(this.owner.scene['Caidan']);
            this.owner.scene['Caidan'].x = e.stageX;
            this.owner.scene['Caidan'].y = e.stageY;
        }
    }
    onStageMouseUp(e: Laya.Event): void {
        if (this.mouseMove) {
            this.owner.scene['CaidanParent'].addChild(this.owner.scene['Caidan']);
            this.owner.scene['Caidan'].x = 472;
            this.owner.scene['Caidan'].y = 301;
            this.mouseDwon = false;
            this.mouseMove = false;

            /**判断当前位置和转盘中心点距离，如果大于则弹出领取皮肤界面*/
            let point = new Laya.Point(e.stageX, e.stageY);
            let dis = point.distance(this.owner.scene['ZhunpanBG'].x, this.owner.scene['ZhunpanBG'].y);
            if (dis - this.owner.scene['ZhunpanBG'].width / 2 > 0) {
                ADManager.TAPoint(TaT.PageEnter, 'PKskinQpage');

                this.owner.scene['Painted_Pikaqiu'].x = 0;
                this.owner.scene['Painted_Pikaqiu'].y = 0;
            }
        }
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
        ADManager.ShowBanner();

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
    prop2 = '自闭鸭子',
    prop3 = '金币x30',
    prop4 = '体力x2',
    prop5 = '黄皮耗子',
    prop6 = '金币x60'
}
export enum RewardSkin {
    prop1 = 'UI_new/conmmon/icon_execution_big.png',
    prop2 = 'CaiDanQIang/Skin/1.png',
    prop3 = 'UI_new/conmmon/icon_gold_big.png',
    prop4 = 'UI_new/conmmon/icon_execution_big.png',
    prop5 = 'CaiDanQIang/Skin/0.png',
    prop6 = 'UI_new/conmmon/icon_gold_big.png'
}













































