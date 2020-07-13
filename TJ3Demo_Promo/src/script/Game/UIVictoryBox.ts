import { lwg } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";

export default class UIVictoryBox extends lwg.Admin.Scene {
    /**list列表*/
    BoxList: Laya.List;

    /**点击次数为三次*/ 
    getNum: number = 3;
    constructor() { super(); }

    selfVars(): void {
        this.BoxList = this.self['BoxList'];
    }

    lwgInit(): void {
        this.createBoxList();
    }

    /**一些节点的适配*/
    adaptive(): void {
        this.self['sceneContent'].y = Laya.stage.height / 2;
    }


    /**创建皮肤list*/
    createBoxList(): void {
        this.BoxList.selectEnable = true;
        this.BoxList.vScrollBarSkin = "";
        // this.BoxList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
        // this.BoxList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
        this.BoxList.spaceX = 70;
        this.BoxList.spaceY = 45;
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
            // push全部信息
            data.push({
                pic_Gold,
                num,
                pic_Box,
                index
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

        let Pic_Box = cell.getChildByName('Pic_Box') as Laya.Label;
        Pic_Box.visible = dataSource.pic_Box;

        cell.name = dataSource.index;
    }

    btnOnClick(): void {
        lwg.Click.on('largen', null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
        lwg.Click.on('largen', null, this.self['BtnAgain'], this, null, null, this.btnAgainUp, null);
    }

    btnNoUp(event): void {
        event.currentTarget.scale(1, 1);
        lwg.Admin._openScene(lwg.Admin.SceneName.UIVictory, null, null, null);
        this.self.close();
    }

    btnAgainUp(event): void {
        event.currentTarget.scale(1, 1);
    }


    lwgDisable(): void {
    }
}