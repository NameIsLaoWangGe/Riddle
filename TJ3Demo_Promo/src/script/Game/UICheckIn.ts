import { lwg, Animation } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";

export default class UICheckIn extends lwg.Admin.Scene {
    /**list列表*/
    checkList: Laya.List;

    /**初始剩余点击次数为三次*/
    getNum: number = 3;

    /**记录列表中每个box的坐标*/
    posArr: Array<Array<number>>

    constructor() { super(); }

    selfVars(): void {
        this.checkList = this.self['CheckList'];
        this.createCheckList();
    }

    aniSwitch: boolean = true;
    lwgInit(): void {
        ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_sign');

        let ChinkTip = this.self['BtnSeven'].getChildByName('ChinkTip');
        ChinkTip.visible = false;

        this.posArr = [
            [126, 262], [292, 262], [457, 262],
            [126, 422.5], [292, 422.5], [457, 422.5],
            [295, 588]
        ];

        if (lwg.Global._CheckInNum === 6) {
            Animation.shookHead_Simple(this.self['BtnSeven'], 10, 200, 0, f => {
            });
            Laya.timer.loop(1500, this, f => {
                if (!this.aniSwitch) {
                    return;
                }
                Animation.shookHead_Simple(this.self['BtnSeven'], 10, 100, 0, f => {
                });
            });
        } else {
            let todayCell = this.checkList.getCell(lwg.Global._CheckInNum);
            Animation.shookHead_Simple(todayCell, 10, 200, 0, f => {
            });
            Laya.timer.loop(1500, this, f => {
                if (!this.aniSwitch) {
                    return;
                }
                Animation.shookHead_Simple(todayCell, 10, 100, 0, f => {
                });
            });
        }
    }


    /**一些节点的适配*/
    adaptive(): void {
        this.self['SceneContent'].y = Laya.stage.height / 2;
    }

    /**创建皮肤list*/
    createCheckList(): void {
        // this.checkList.selectEnable = true;
        // this.checkList.vScrollBarSkin = "";
        // this.checkList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
        // this.checkList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
        this.checkList.spaceX = 5;
        this.checkList.spaceY = 0;
        this.checkList.selectHandler = new Laya.Handler(this, this.onSelect_List);
        this.checkList.renderHandler = new Laya.Handler(this, this.updateItem);
        this.refreshListData();
        this.listOpenAni();
    }

    /**
     * list列表出场动画
     * 规则如下
     * 1.判断当前选中位置是在什么位置
     * 2.如果在1234位置，那么动画从后往前播放，如果在56789位置，那么动画从前往后播放
     * 3.设置初始位置要在较远的地方也就是1或者9的位置,然后通过动画移动到选中位置
     * */
    listOpenAni(): void {

    }

    /**
     * 刷新list列表数据,如果需要更新list列表数据，更新此方法即可
     * */
    refreshListData(): void {
        var data: Array<Object> = [];
        for (var m: number = 0; m < 6; m++) {
            let index: string = m.toString();
            let url = 'UI_new/CheckIn/word_' + (m + 1) + 'tian.png';

            let check = lwg.Global._CheckInNum > m ? true : false;
            // push全部信息
            data.push({
                index,
                url,
                check
            });
        }
        // 重制array信息列表
        this.checkList.array = data;
    }

    /**当前触摸的box监听*/
    onSelect_List(index: number): void {
        // console.log("当前选择的索引：" + index);
    }

    /**信息刷新，只用listData里面的信息进行赋值，不用其他信息进行赋值*/
    updateItem(cell: Laya.Box, index: number): void {
        let dataSource = cell.dataSource;

        let DayNum = cell.getChildByName('DayNum') as Laya.Image;
        DayNum.skin = dataSource.url;

        let ChinkTip = cell.getChildByName('ChinkTip') as Laya.Image;
        ChinkTip.visible = dataSource.check;

    }

    btnOnClick(): void {

        lwg.Click.on('largen', null, this.self['BtnGet'], this, null, null, this.btnGetUp, null);
        lwg.Click.on('largen', null, this.self['BtnSelect'], this, null, null, this.btnSelectUp, null);
        lwg.Click.on('largen', null, this.self['BtnBack'], this, null, null, this.btnBackUp, null);
    }

    btnBackUp(event):void{
        event.currentTarget.scale(1, 1);
        this.self.close();
    }

    btnGetUp(event): void {

        let dot = (this.self['BtnSelect'] as Laya.Sprite).getChildAt(0) as Laya.Sprite;
        if (dot.visible) {
            ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_sign');

            ADManager.ShowReward(() => {
                this.aniSwitch = false;
                this.btnGetUpFunc(3)
            })
        } else {
            this.btnGetUpFunc(1);
            this.aniSwitch = false;
        }

    }

    btnGetUpFunc(number): void {

        if (lwg.Global._CheckInNum === 6) {
            let ChinkTip = this.self['BtnSeven'].getChildByName('ChinkTip');
            ChinkTip.visible = true;
            this.goldAni(50 * number);
        } else {
            this.checkList.array[lwg.Global._CheckInNum].check = true;
            this.checkList.refresh();
            this.goldAni(25 * number);
        }
        lwg.Global._CheckInNum++;
        if (lwg.Global._CheckInNum > 6) {
            lwg.Global._CheckInNum = 0;
        }
        lwg.Global._lastCheckIn = (new Date).getDate();
        lwg.LocalStorage.addData();
    }

    goldAni(number) {
        Laya.timer.frameOnce(30, this, f => {
            lwg.Effects.getGoldAni(Laya.stage, 10, Laya.stage.width / 2, Laya.stage.height / 2, lwg.Global.GoldNumNode.x - 53, lwg.Global.GoldNumNode.y - 12, f => {

                lwg.Global._addGoldDisPlay(1);
            }, f => {
                lwg.Global._addGold(number);
                this.checkList.refresh();
                this.self.close();
            });
        })
    }

    btnSelectUp(event): void {
        event.currentTarget.scale(1, 1);
        let dot = (this.self['BtnSelect'] as Laya.Sprite).getChildAt(0) as Laya.Sprite;
        if (dot.visible) {
            dot.visible = false;
        } else {
            dot.visible = true;
        }
    }

    lwgOnUpdta(): void {
        lwg.Global._stageClick = false;
    }


    lwgDisable(): void {

        lwg.Global._stageClick = true;
    }
}