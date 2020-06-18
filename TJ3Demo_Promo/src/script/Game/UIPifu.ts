import { lwg } from "../Lwg_Template/lwg";

export default class UIPifu extends lwg.Admin.Scene {
    /**返回按钮*/
    private BtnBack: Laya.Sprite;
    /**购买按钮*/
    private BtnBuy: Laya.Sprite;
    /**选择按钮*/
    private BtnSelect: Laya.Image;
    /**皮肤的父节点*/
    private PifuParent: Laya.Sprite;
    /**list列表*/
    private PifuList: Laya.List;
    /**背景图*/
    private background: Laya.Image;

    constructor() { super(); }

    lwgInit(): void {
        this.BtnBack = this.self['BtnBack'];
        this.BtnBuy = this.self['BtnBuy'];
        this.BtnSelect = this.self['BtnSelect'];
        this.PifuParent = this.self['PifuParent'];
        this.PifuList = this.self['PifuList'];
        this.background = this.self['background'];

        lwg.Global.ExecutionNumNode.alpha = 0;
        lwg.Global._stageClick = false;

        // this.noHaveSubChaoren();
        this.createPifuList();
        // this.priceDisplay();
        // this.adaptive();
        // this.openAni();
    }

    /**一些节点的适配*/
    adaptive(): void {
        this.self['TowBtn'].y = Laya.stage.height * 0.720;
        this.self['PifuName'].y = Laya.stage.height * 0.185;
        this.self['MatchDot'].y = Laya.stage.height * 0.634;
        this.self['background_01'].height = Laya.stage.height;
        this.PifuList.y = Laya.stage.height * 0.442;
        this.self['BtnBack'].y = Laya.stage.height * 0.83;
    }

    /**金币按钮上的所需购买金币显示*/
    priceDisplay(): void {
        let price = 250 * lwg.Global._buyNum - 150;
        let num = this.BtnBuy.getChildByName('Num') as Laya.Label;
        num.text = price.toString();
    }

    /**找出还没有获得的皮肤,不包括超人*/
    noHaveSubChaoren(): void {
        // 所有皮肤赋值给新数组
        let allArray = [];
        for (let i = 0; i < lwg.Global._allPifu.length; i++) {
            const element = lwg.Global._allPifu[i];
            allArray.push(element);
        }
        // 删除已经有的皮肤，得出还没有的皮肤
        for (let j = 0; j < allArray.length; j++) {
            let element1 = allArray[j];
            for (let k = 0; k < lwg.Global._havePifu.length; k++) {
                let element2 = lwg.Global._havePifu[k];
                if (element1 === element2) {
                    allArray.splice(j, 1);
                    j--;
                }
            }
        }
        lwg.Global._notHavePifu = allArray;
        // 去除超人皮肤
        for (let k = 0; k < allArray.length; k++) {
            const element = allArray[k];
            if (element === '09_chaoren') {
                allArray.splice(k, 1);
            }
            lwg.Global._notHavePifuSubChaoren = allArray;
            console.log(lwg.Global._notHavePifuSubChaoren);
        }
    }

    openAni(): void {
        return;

        let delayed = 100;
        let time = 200;

        let y2 = this.background.y;
        lwg.Animation.move_Deform_Y(this.background, -300, -15, y2, -0.1, 0.2, time, delayed * 1, f => {
        });

        let x1 = this.BtnBack.x;
        lwg.Animation.move_Deform_X(this.BtnBack, -200, 30, x1, -0.1, 0.2, time, delayed * 4, f => { });

        let x4 = this.BtnBuy.x;
        lwg.Animation.move_Deform_X(this.BtnBuy, x4, 0, x4, 0.2, -0.15, time, delayed * 4, f => { });

        let x5 = this.BtnSelect.x;
        lwg.Animation.move_Deform_X(this.BtnSelect, x5, 0, x5, 0.2, -0.15, time, delayed * 4, f => { });

        lwg.Animation.fadeOut(this.PifuList, 0, 1, time, delayed, f => {
            this.listOpenAni()
        });
    }

    /**创建皮肤list*/
    createPifuList(): void {
        // this.PifuList.selectEnable = true;
        this.PifuList.hScrollBarSkin = "";
        // this.PifuList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
        // this.PifuList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
        this.PifuList.selectHandler = new Laya.Handler(this, this.onSelect_List);
        this.PifuList.renderHandler = new Laya.Handler(this, this.updateItem);
        this.refreshListData();
        this.matchDotStaly();
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
    refreshListData(): void {
        var data: Array<Object> = [];
        for (var m: number = -1; m < 10; m++) {
            if (m === -1 || m === 9) {
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
                scale = 0.8;
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
    /**list列表第一个第几个单元，因为0位置是空位，所以标记从1开始，而不是0置*/
    private listFirstIndex: number = lwg.Enum.PifuAllName[lwg.Global._currentPifu];
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
            if (this.listFirstIndex > 8) {
                this.listFirstIndex = 8;
            }
        }
        this.moveSwitch = false;
        this.PifuList.tweenTo(this.listFirstIndex, 50, Laya.Handler.create(this, this.moveCompelet));
    }

    /**移动结束回调*/
    moveCompelet(): void {
        this.refreshListData();
        this.matchDotStaly();
        this.whetherHaveThisPifu();
    }

    /**灰点的样式*/
    matchDotStaly(): void {
        let MatchDot = this.self['MatchDot'] as Laya.Sprite;
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
    }

    /**当前展示的皮肤可否选择*/
    private showSelect: boolean;
    /**判断当前在中间的皮肤是否拥有，如果拥有那么可以点击选择，如果不拥有，那么选择变灰*/
    whetherHaveThisPifu(): void {
        let cell = this.PifuList.getCell(this.listFirstIndex + 1);//注意+1
        let boo = false;
        for (let index = 0; index < lwg.Global._havePifu.length; index++) {
            const pifuName = lwg.Global._havePifu[index];
            if (cell.name === pifuName) {
                boo = true;
            }
        }
        if (boo) {
            this.showSelect = true;
            this.BtnSelect.skin = 'UI_new/Victory/green_btn.png';
        } else {
            this.showSelect = false;
            this.BtnSelect.skin = 'UI_new/Victory/rede_btn_01.png';
        }
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
        // lwg.Global.UIMain['UIMain'].currentPifuSet();//更换皮肤
        // lwg.Global.UIStart['UIStart'].goldRes();//金币重制

        lwg.LocalStorage.addData();
    }

    /**当前购买的那个皮肤记录*/
    private buyIndex: number;
    /**
     * 购买按钮按钮抬起
     * 点击后从还没有获得的皮肤中随机给予一个皮肤
    */
    btnBuyUp(event): void {
        event.currentTarget.scale(1, 1);
        event.stopPropagation();//防止事件穿透到舞台
        // 查看金币数量是否足够,查看皮肤是否全部拥有
        let price = 250 * lwg.Global._buyNum - 150;
        if (lwg.Global._goldNum < price || lwg.Global._notHavePifuSubChaoren.length <= 0) {
            if (lwg.Global._goldNum < price) {
                // 金币不够了
                lwg.Global._createHint_01(lwg.Enum.HintType.noGold);
            } else if (lwg.Global._notHavePifuSubChaoren.length <= 0) {
                // 除了超人皮肤已经卖完了
                lwg.Global._createHint_01(lwg.Enum.HintType.noPifu);
            }
            return;
        } else {
            lwg.Global._goldNum -= price;
            lwg.Global._buyNum++;
            // 从没有获得的皮肤中随机一个还没有获得的皮肤
            let random = Math.floor(Math.random() * lwg.Global._notHavePifuSubChaoren.length);
            // 求这个皮肤在所有皮肤中的索引值
            this.buyIndex = lwg.Enum.PifuAllName[lwg.Global._notHavePifuSubChaoren[random]];
            console.log('购买了第' + this.buyIndex + '位置的皮肤');
            this.nohavePifuAni();
        }
    }

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
    /**还没有购买的皮肤记录*/
    private noHaveIndex: number = 0;
    /**在还没有够买的这些皮肤中，一个一个播放,停顿后放大，并且排除已购买皮肤,从第一个开始，或者从最后一个开始*/
    nohavePifuAni(): void {
        let noHavePifu_00 = lwg.Global._notHavePifuSubChaoren[this.noHaveIndex];
        console.log(noHavePifu_00);
        let index;
        if (noHavePifu_00) {
            index = lwg.Enum.PifuAllName[noHavePifu_00];
            // 名字和大小变化
            this.listFirstIndex = index;
            this.refreshListData();
            // 递归移动
            this.PifuList.tweenTo(index, 200, Laya.Handler.create(this, function () {
                this.noHaveIndex++;
                this.nohavePifuAni();
                this.pifuNameRefresh();
            }));
        } else {
            console.log('循环完毕，准备循环到被购买的那个皮肤', this.buyIndex);
            let time = this.buyIndex;
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
        this.noHaveSubChaoren();
        this.refreshListData();
        this.whetherHaveThisPifu();
        this.priceDisplay();

        lwg.LocalStorage.addData();
        console.log('购买完成！');
    }

    /**选中按钮抬起*/
    btnSelectUp(event: Laya.Event): void {
        event.currentTarget.scale(1, 1);
        event.stopPropagation();//防止事件穿透到舞台
        let cell = this.PifuList.getCell(this.listFirstIndex + 1);//注意+1
        let lock = cell.getChildByName('Lock') as Laya.Sprite;
        // 如果没有被锁住，那么可以选择他
        if (this.showSelect) {
            if (!lock.visible) {
                // 关掉原来的选中
                let select1 = cell.getChildByName('Select') as Laya.Sprite;
                select1.visible = false;
                // 更换选择
                lwg.Global._currentPifu = lwg.Global._allPifu[this.listFirstIndex];
                // console.log(lwg.Global._currentPifu);
                this.refreshListData();
            }
        }
    }

    lwgDisable(): void {
        lwg.Global._stageClick = true;
        lwg.Global.ExecutionNumNode.alpha = 1;
    }
}