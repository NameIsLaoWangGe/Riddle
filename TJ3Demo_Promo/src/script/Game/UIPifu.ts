import { lwg } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";

export default class UIPifu extends lwg.Admin.Scene {
    /**返回按钮*/
    private BtnBack: Laya.Sprite;
    /**购买按钮*/
    private BtnBuy: Laya.Sprite;
    /**选择按钮*/
    private BtnSelect: Laya.Image;
    /**list列表*/
    private PifuList: Laya.List;
    /**背景图*/
    private background: Laya.Image;

    constructor() { super(); }

    selfVars(): void {
        ADManager.CloseBanner();
        this.PifuList = this.self['PifuList'];

        this.BtnBack = this.self['BtnBack'];
        this.BtnBuy = this.self['BtnBuy'];
        this.BtnSelect = this.self['BtnSelect'];
        ADManager.TAPoint(TaT.BtnShow, 'gold_skin');
        ADManager.TAPoint(TaT.BtnShow, 'choose_skin');

        if (!lwg.Global._elect) {
            this.self['P201'].visible = false;
        }

        this.background = this.self['background'];
    }

    lwgInit(): void {
        lwg.Global._havePifu.push(lwg.Enum.PifuAllName[9]);

        lwg.Global.ExecutionNumNode.alpha = 0;
        lwg.Global._stageClick = false;
        if (lwg.Enum.PifuAllName[lwg.Global._currentPifu]) {
            this.listFirstIndex = lwg.Enum.PifuAllName[lwg.Global._currentPifu];
        } else {
            this.listFirstIndex = lwg.Enum.PifuAllName['01_gongzhu'];
        }
        lwg.Global.notHavePifuSubXD();
        this.createPifuList();
        this.priceDisplay();
    }

    /**一些节点的适配*/
    adaptive(): void {
        this.self['TowBtn'].y = Laya.stage.height * 0.766;
        this.self['PifuLogo'].y = Laya.stage.height * 0.160;
        this.self['PifuName'].y = Laya.stage.height * 0.261;
        this.self['MatchDot'].y = Laya.stage.height * 0.684;
        this.self['background_01'].height = Laya.stage.height;
        this.self['BtnBack'].y = Laya.stage.height * 0.883;
        this.self['P201'].y = Laya.stage.height * 0.208;
        this.PifuList.y = Laya.stage.height * 0.471;
    }

    /**金币按钮上的所需购买金币显示*/
    priceDisplay(): void {
        let price = 250 * lwg.Global._buyNum - 150;
        let num = this.BtnBuy.getChildByName('Num') as Laya.Label;
        num.text = 'x' + price.toString();
    }


    /**创建皮肤list*/
    createPifuList(): void {
        // this.PifuList.selectEnable = true;
        this.PifuList.hScrollBarSkin = "";
        // this.PifuList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
        // this.PifuList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
        this.PifuList.selectHandler = new Laya.Handler(this, this.onSelect_List);
        this.PifuList.renderHandler = new Laya.Handler(this, this.updateItem);
        this.refreshListData(null);
        this.matchDotStaly();
        this.selectPifuStyle();
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
        if (0 <= this.listFirstIndex && this.listFirstIndex <= 4) {
            this.PifuList.scrollTo(this.PifuList.length - 1);
        } else {
            this.PifuList.scrollTo(0);
        }
        this.PifuList.tweenTo(this.listFirstIndex, 600);
    }

    /**
     * 刷新list列表数据,如果需要更新list列表数据，更新此方法即可
     * 有9个皮肤，但是给予10个位置，第一个和最后一个是空位，为了使第二个和倒数第二个能排到中间
     * */
    refreshListData(func): void {
        var data: Array<Object> = [];
        for (var m: number = -1; m < 11; m++) {
            if (m === -1 || m === 10) {
                data.push({
                    stance: true
                })
                continue;
            }
            // 名字
            let name = lwg.Global._allPifu[m];
            // 判断有没有这个皮肤
            let have = false;
            for (let index = 0; index < lwg.Global._havePifu.length; index++) {
                const element = lwg.Global._havePifu[index];
                if (lwg.Global._allPifu[m] === lwg.Global._havePifu[index]) {
                    have = true;
                }
            }
            // 有了这个皮肤，那么是皮肤图片是亮的，如果没有，那么是暗的,并且上面有个锁的图片
            let pifuUrl;
            if (have) {
                pifuUrl = lwg.Enum.PifuSkin[m];
            } else {
                pifuUrl = lwg.Enum.PifuSkin_No[m];
            }

            // 在已经拥有的皮肤当中，判断当前选中的是哪一个
            let selectWord;
            if (lwg.Global._currentPifu === lwg.Enum.PifuAllName[m]) {
                selectWord = true;
            } else {
                selectWord = false;
            }
            // 缩放大小，不在中心位置的则缩小
            let scale;
            if (m === this.listFirstIndex) {
                scale = 1;
            } else {
                scale = 0.7;
            }
            // push全部信息
            data.push({
                have,
                pifuUrl,
                selectWord,
                scale
            });
        }
        // 重制array信息列表
        this.PifuList.array = data;
        // console.log(data);
        if (func !== null) {
            func();
        }
    }

    /**当前触摸的box监听*/
    onSelect_List(index: number): void {
        // console.log("当前选择的索引：" + index);
    }

    /**信息刷新，只用listData里面的信息进行赋值，不用其他信息进行赋值*/
    updateItem(cell, index: number): void {
        let dataSource = cell.dataSource;

        let pifuImg = cell.getChildByName('PifuImg') as Laya.Image;
        let select = cell.getChildByName('Select') as Laya.Sprite;

        // 信息赋值
        pifuImg.skin = dataSource.pifuUrl;
        cell.scale(dataSource.scale, dataSource.scale);
    }

    /**滑动设置，滑动一段，走一格*/
    private moveSwitch: boolean = false;
    private firstX: number;
    /**list列表第一个第几个单元*/
    private listFirstIndex: number;
    onStageMouseDown() {
        // console.log('点击了舞台！');
        this.firstX = Laya.MouseManager.instance.mouseX;
        this.moveSwitch = true;
    }
    onStageMouseUp(): void {
        let x = Laya.MouseManager.instance.mouseX;
        if (!this.moveSwitch) {
            return;
        }
        let diffX = x - this.firstX;

        if (diffX > 80) {
            // console.log('向左滑动');
            this.listFirstIndex -= 1;
            if (this.listFirstIndex < 0) {
                this.listFirstIndex = 0;
            }
        } else if (diffX < -80) {
            // console.log('向右滑动');
            this.listFirstIndex += 1;
            if (this.listFirstIndex > 9) {
                this.listFirstIndex = 9;
            }
        }
        this.moveSwitch = false;
        this.PifuList.tweenTo(this.listFirstIndex, 50, Laya.Handler.create(this, this.moveCompelet));
    }

    /**移动结束回调*/
    moveCompelet(): void {
        this.refreshListData(null);
        this.matchDotStaly();
        this.whetherHaveThisPifu();
        this.selectPifuStyle();
    }

    /**当前位置是否是被选中的那个皮肤,是的话改变样式*/
    selectPifuStyle(): void {
        let wordpic = this.BtnSelect.getChildByName('wordpic') as Laya.Image;
        if (this.PifuList.array[this.listFirstIndex + 1].selectWord) {
            wordpic.skin = 'UI_new/Pifu/word_scelet_02.png';
            wordpic.x = 67;
        } else {
            wordpic.skin = 'UI_new/Pifu/word_scelet_01.png';
            wordpic.x = 87;
        }
    }

    /**灰点位置，和名称的样式*/
    matchDotStaly(): void {
        let MatchDot = this.self['MatchDot'] as Laya.Sprite;
        console.log(this.listFirstIndex);
        for (let index = 0; index < MatchDot.numChildren; index++) {
            const element = MatchDot.getChildAt(index) as Laya.Sprite;
            if (element.name === this.listFirstIndex.toString()) {
                element.getChildAt(0)['visible'] = false;
                element.getChildAt(1)['visible'] = true;
            } else {
                element.getChildAt(1)['visible'] = false;
                element.getChildAt(0)['visible'] = true;
            }
        }

        let namePic = this.self['PifuName'].getChildByName('namePic') as Laya.Image;
        namePic.skin = lwg.Enum.PifuNameSkin[this.listFirstIndex];
        namePic.pivotX = namePic.width / 2;
        namePic.x = this.self['PifuName'].width / 2;
    }

    /**当前展示的皮肤可否选择*/
    private showSelect: boolean;
    /**判断当前在中间的皮肤是否拥有，如果拥有那么可以点击选择，如果不拥有，那么选择变灰*/
    whetherHaveThisPifu(): void {
        let cell = this.PifuList.getCell(this.listFirstIndex + 1);//注意+1
        if (cell.dataSource.have) {
            this.showSelect = true;
            this.BtnSelect.skin = 'UI_new/Victory/green_btn.png';
        } else {
            this.showSelect = false;
            this.BtnSelect.skin = 'UI_new/Victory/rede_btn_01.png';
        }

        // console.log(this.PifuList.array);
        // console.log(cell['_dataSource']);
    }

    btnOnClick(): void {
        lwg.Click.on('largen', null, this.BtnBack, this, null, null, this.btnBackUp, null);
        lwg.Click.on('largen', null, this.BtnBuy, this, null, null, this.btnBuyUp, null);
        lwg.Click.on('largen', null, this.BtnSelect, this, null, null, this.btnSelectUp, null);
    }

    /**返回按钮抬起*/
    btnBackUp(event): void {
        event.stopPropagation();//防止事件穿透到舞台
        event.currentTarget.scale(1, 1);
        this.self.close();
        lwg.LocalStorage.addData();
    }

    /**当前购买的那个皮肤记录*/
    private buyIndex: number;
    /**
     * 购买按钮按钮抬起
     * 点击后从还没有获得的皮肤中随机给予一个皮肤
    */
    btnBuyUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'gold_skin');
        event.currentTarget.scale(1, 1);

        event.stopPropagation();//防止事件穿透到舞台
        // 查看金币数量是否足够,查看皮肤是否全部拥有
        let price = 250 * lwg.Global._buyNum - 150;
        if (lwg.Global._goldNum < price || lwg.Global._notHavePifuSubXD.length <= 0) {
            if (lwg.Global._goldNum < price) {
                // 金币不够了
                lwg.Global._createHint_01(lwg.Enum.HintType.noGold);
            } else if (lwg.Global._notHavePifuSubXD.length <= 0) {
                // 除了限定皮肤已经卖完了
                lwg.Global._createHint_01(lwg.Enum.HintType.noGetPifu);
            }
            return;
        } else {
            lwg.Global._goldNum -= price;
            // 表现上加上
            let Num = lwg.Global.GoldNumNode.getChildByName('Num') as Laya.FontClip;
            Num.value = lwg.Global._goldNum.toString();

            lwg.Global._buyNum++;
            // 从没有获得的皮肤中随机一个还没有获得的皮肤
            let random = Math.floor(Math.random() * lwg.Global._notHavePifuSubXD.length);
            // 求这个皮肤在所有皮肤中的索引值
            this.buyIndex = lwg.Enum.PifuAllName[lwg.Global._notHavePifuSubXD[random]];
            console.log('购买了第' + this.buyIndex + '位置的皮肤');
            this.nohavePifuAni();
        }
    }

    /**还没有购买的皮肤记录*/
    private noHaveIndex: number = 0;
    /**
     * 购买动画
     * 规则如下：
     * 1.判断购买后的那个索引值是第几个位置
     * 2.移动到第一个没有购买的位置
     * 3.从第一个没有购买的开始，走一遍没有被购买的皮肤的过场动画。
     * 4.再从最后一个回到到购买的那一个，如果恰好是最后一个，那么就直接没有动画
     * 5.如果购买的恰好是第一个，那么第一步也没有动画。
     * 6.一旦点击购买了，那么会完成购买，无论动画有没有播放完毕
     * */
    /**在还没有够买的这些皮肤中，一个一个播放,停顿后放大，并且排除已购买皮肤,从第一个开始，或者从最后一个开始*/
    nohavePifuAni(): void {
        let noHavePifu_00 = lwg.Global._notHavePifuSubXD[this.noHaveIndex];
        console.log(noHavePifu_00);
        let index;
        if (noHavePifu_00) {
            index = lwg.Enum.PifuAllName[noHavePifu_00];
            // 名字和大小变化
            this.listFirstIndex = index;
            this.refreshListData(null);
            // 递归移动
            this.PifuList.tweenTo(index, 200, Laya.Handler.create(this, function () {
                this.noHaveIndex++;
                this.nohavePifuAni();
            }));
        } else {
            console.log('循环完毕，准备循环到被购买的那个皮肤', this.buyIndex);
            this.PifuList.tweenTo(this.buyIndex, (11 - this.buyIndex) * 100, Laya.Handler.create(this, function () {
                this.noHaveIndex = 0;
                // 名字和大小变化
                this.listFirstIndex = this.buyIndex;
                this.buyCompelet();
            }));
        }
    }

    /**购买成功回调*/
    buyCompelet(): void {
        // 将购买的皮肤添加到数据中
        lwg.Global._havePifu.push(lwg.Enum.PifuAllName[this.buyIndex]);
        lwg.Global.notHavePifuSubXD();
        this.refreshListData(f => {
            this.priceDisplay();
            this.selectPifuStyle();
            this.matchDotStaly();
            lwg.LocalStorage.addData();
        });
        console.log('购买完成！');
    }

    /**选中按钮抬起*/
    btnSelectUp(event: Laya.Event): void {
        ADManager.TAPoint(TaT.BtnClick, 'choose_skin');
        event.stopPropagation();//防止事件穿透到舞台
        event.currentTarget.scale(1, 1);
        this.whetherHaveThisPifu();
        // 如果没有被锁住，那么可以选中
        if (this.showSelect) {
            // 更换选择
            lwg.Global._currentPifu = lwg.Global._allPifu[this.listFirstIndex];
            this.refreshListData(null);
            this.selectPifuStyle();
        }
    }

    lwgDisable(): void {
        lwg.LocalStorage.addData();
        lwg.Global._stageClick = true;
        lwg.Global.ExecutionNumNode.alpha = 1;
        ADManager.ShowBanner();
    }
}