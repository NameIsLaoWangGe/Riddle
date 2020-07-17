import { lwg } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";

export default class UIVictoryBox extends lwg.Admin.Scene {
    /**list列表*/
    BoxList: Laya.List;

    /**初始剩余点击次数为三次*/
    getNum: number = 3;

    /**随机三个作为看广告宝箱*/
    ranArray: Array<number> = [];
    constructor() { super(); }

    selfVars(): void {
        this.BoxList = this.self['BoxList'];
    }

    lwgInit(): void {
        lwg.Global._victoryBoxNum++;
        ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_box');
        this.randomAdvBox();
        this.createBoxList();

        this.self['BtnAgain'].visible = false;
        this.self['BtnNo'].visible = false;

    }

    /**一些节点的适配*/
    adaptive(): void {
        this.self['SceneContent'].y = Laya.stage.height / 2;
    }

    // 随机选择三个宝箱是看广告的宝箱
    randomAdvBox(): void {
        let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        let ran1 = Math.floor(Math.random() * (arr.length - 1));
        let a1 = arr[ran1];
        arr.splice(ran1, 1);

        console.log('1', arr)
        let ran2 = Math.floor(Math.random() * (arr.length - 1));
        let a2 = arr[ran2];
        arr.splice(ran2, 1);

        console.log('2', arr)
        let ran3 = Math.floor(Math.random() * (arr.length - 1));
        let a3 = arr[ran3];

        this.ranArray = [a1, a2, a3];
        // console.log(this.ranArray);

    }

    /**创建皮肤list*/
    createBoxList(): void {
        // this.BoxList.selectEnable = true;
        // this.BoxList.vScrollBarSkin = "";
        // this.BoxList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
        // this.BoxList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
        this.BoxList.spaceX = 36;
        this.BoxList.spaceY = 20;
        this.BoxList.selectHandler = new Laya.Handler(this, this.onSelect_List);
        this.BoxList.renderHandler = new Laya.Handler(this, this.updateItem);
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
        for (var m: number = 0; m < 9; m++) {
            let pic_Gold: boolean = false;
            let num: number = Math.floor(Math.random() * 10) + 5;
            let pic_Box: boolean = true;
            let index: string = m.toString();

            let adv = false;
            if (lwg.Global._victoryBoxNum !== 1) {
                for (let index = 0; index < this.ranArray.length; index++) {
                    if (m === this.ranArray[index]) {
                        adv = true;
                        break;
                    }
                }
            }

            // push全部信息
            data.push({
                pic_Gold,
                num,
                pic_Box,
                index,
                adv
            });
        }
        // 重制array信息列表
        this.BoxList.array = data;
    }

    /**当前触摸的box监听*/
    onSelect_List(index: number): void {
        // console.log("当前选择的索引：" + index);
    }

    /**信息刷新，只用listData里面的信息进行赋值，不用其他信息进行赋值*/
    updateItem(cell: Laya.Box, index: number): void {
        let dataSource = cell.dataSource;

        let Pic_Gold = cell.getChildByName('Pic_Gold') as Laya.Image;
        Pic_Gold.visible = dataSource.pic_Gold;

        let Num = cell.getChildByName('Num') as Laya.Label;
        Num.text = dataSource.num;
        Num.visible = Pic_Gold.visible;

        let Pic_Box = cell.getChildByName('Pic_Box') as Laya.Image;
        Pic_Box.visible = dataSource.pic_Box;

        if (dataSource.adv) {
            Pic_Box.skin = 'UI_new/VictoryBox/icon_advbox.png';
        } else {
            Pic_Box.skin = 'UI_new/VictoryBox/icon_chai.png';
        }

        cell.name = dataSource.index;
    }

    btnOnClick(): void {
        lwg.Click.on('largen', null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
        lwg.Click.on('largen', null, this.self['BtnAgain'], this, null, null, this.btnAgainUp, null);
    }
    btnOffClick(): void {
        lwg.Click.off('largen', this.self['BtnNo'], this, null, null, this.btnNoUp, null);
        lwg.Click.off('largen', this.self['BtnAgain'], this, null, null, this.btnAgainUp, null);
    }

    btnNoUp(event): void {
        event.currentTarget.scale(1, 1);
     
        lwg.Admin._openScene(lwg.Admin.SceneName.UIVictory, null, null, null);
        this.self.close();
    }

    /**看广告获取的最大次数为6次*/
    maxAdvGet: number = 6;
    btnAgainUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_box');
        event.currentTarget.scale(1, 1);
        if (this.maxAdvGet <= 0) {
            lwg.Global._createHint_01(lwg.Enum.HintType.noGetNum);
        } else {
            ADManager.ShowReward(() => {
                lwg.Global._createHint_01(lwg.Enum.HintType.getBoxOne);
                this.getNum += 3;
                this.maxAdvGet -= 3;

                this.self['BtnAgain'].visible = false;
                this.self['BtnNo'].visible = false;
            })
        }
    }

    lwgOnUpdta(): void {
        if (this.getNum > 0) {
            this.self['BtnAgain'].visible = false;
            this.self['BtnNo'].visible = false;
        } else {
            this.self['BtnAgain'].visible = true;
            this.self['BtnNo'].visible = true;
        }
    }

    lwgDisable(): void {
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
    }
}