import { lwg } from "../Lwg_Template/lwg";

export default class UIPifu extends Laya.Script {
    /** @prop {name:Pifu, tips:"皮肤prefab", type:Prefab}*/
    public Pifu: Laya.Prefab;
    /**挂载当前脚本的节点*/
    private self: Laya.Scene;
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

    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.Scene;
        this.BtnBack = this.self['BtnBack'];
        this.BtnBuy = this.self['BtnBuy'];
        this.BtnSelect = this.self['BtnSelect'];
        this.PifuParent = this.self['PifuParent'];
        this.PifuList = this.self['PifuList'];
        this.btnClickOn();
        this.createPifuList();
        this.noHave();
    }

    /**找出还没有获得的皮肤*/
    noHave(): void {
        // 所有皮肤赋值给新数组
        let allArray = [];
        for (let i = 0; i < lwg.Global._orderPifu.length; i++) {
            const element = lwg.Global._orderPifu[i];
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
    }

    /**创建皮肤list*/
    createPifuList(): void {
        this.PifuList.selectEnable = true;
        // this.PifuList.hScrollBarSkin = "";s
        this.PifuList.renderHandler = new Laya.Handler(this, this.updateItem);
        this.PifuList.selectHandler = new Laya.Handler(this, this.onSelect_List);
        var data: Array<Object> = [];
        for (var m: number = 0; m < 9; m++) {
            data.push({
                url: lwg.Enum.PifuSkin[m],
                url_h: lwg.Enum.PifuSkin_h[m],
                order: m,
                scelet: true,
                scale: 0.8
            });
        }
        this.PifuList.array = data;
    }

    /**当前触摸的box监听*/
    onSelect_List(index: number): void {
        console.log("当前选择的索引：" + index);
        // this.PifuList.scrollTo(index - 1);
    }

    /**滑动设置，滑动一段，走一格*/
    private moveSwitch: boolean = false;
    private firstX: number;
    private currentIndex: number = 0;
    onStageMouseDown() {
        this.firstX = Laya.MouseManager.instance.mouseX;
        this.moveSwitch = true;
    }

    onStageMouseUp(): void {
        let x = Laya.MouseManager.instance.mouseX;
        if (!this.moveSwitch) {
            return;
        }
        let diffX = x - this.firstX;

        if (diffX > 100) {
            console.log('向左滑动');
            this.currentIndex -= 1;

        } else if (diffX < -100) {
            console.log('向右滑动');
            this.currentIndex += 1;
        }
        this.currentIndex = this.currentIndex < 0 ? 0 : this.currentIndex;
        this.PifuList.tweenTo(this.currentIndex, 300);
        this.moveSwitch = false;
    }

    /**刷新整个list*/
    resetPifuList(): void {
        let data;
        for (var m: number = 0; m < 9; m++) {
            data.push({
                url: lwg.Enum.PifuSkin[m],
                url_h: lwg.Enum.PifuSkin_h[m],
                order: m,
                scelet: true,
                scale: 0.8,
            });
        }
    }

    updateItem(cell, index): void {
        cell.name = ('item' + index).toString();
        let pifuImg = cell.getChildByName('PifuImg') as Laya.Image;
        let select = cell.getChildByName('Select') as Laya.Sprite;
        let lock = cell.getChildByName('Lock') as Laya.Sprite;

        // 如果这个皮肤存在于已获得的，那么就变亮
        let have = false;
        for (let i = 0; i < lwg.Global._havePifu.length; i++) {
            if (lwg.Enum.PifuOrder[index] === lwg.Global._havePifu[i]) {
                have = true;
            }
        }

        // 不存在则变暗，没有解锁
        if (have) {
            pifuImg.skin = this.PifuList.array[index].url;
            lock.visible = false;
        } else {
            pifuImg.skin = this.PifuList.array[index].url_h;
            lock.visible = true;
        }

        //在判断当前选中的是哪一个
        if (lwg.Global._currentPifu === lwg.Enum.PifuOrder[index]) {
            select.visible = true;
        } else {
            select.visible = false;
        }

        // 在中间的那个放大，其他缩小
        if (index === this.currentIndex + 1) {
            cell.scale(1, 1);
        } else {
            cell.scale(0.85, 0.85);
        }
        //如果这个角色未获得，那么选择变灰色
        if (index === this.currentIndex + 1) {
            if (!lock.visible) {
                this.BtnSelect.skin = 'pifu/select_btn1.png';
            } else {
                this.BtnSelect.skin = 'pifu/select_btn2.png';
            }
        }
    }

    /**游戏开始按钮*/
    btnClickOn(): void {
        lwg.Click.on('largen', null, this.BtnBack, this, null, null, this.btnBackClickUP, null);
        lwg.Click.on('largen', null, this.BtnBuy, this, null, null, this.btnBuyClickUP, null);
        lwg.Click.on('largen', null, this.BtnSelect, this, null, null, this.btnSelectClickUP, null);
    }

    /**返回按钮抬起*/
    btnBackClickUP(event): void {
        event.currentTarget.scale(1, 1);
        this.self.close();
    }

    /**
     * 购买按钮按钮抬起
     * 点击后从还没有获得的皮肤中随机给予一个皮肤
    */
    btnBuyClickUP(event): void {
        event.currentTarget.scale(1, 1);
        let random = Math.floor(Math.random() * lwg.Global._notHavePifu.length);
        // 求出索引值
        let pifuIndex = lwg.Enum.PifuOrder[lwg.Global._notHavePifu[random]];
        this.PifuList.tweenTo(pifuIndex, 300, Laya.Handler.create(this, function () {
        }));
    }


    /**开始游戏按钮抬起*/
    btnSelectClickUP(event): void {
        event.currentTarget.scale(1, 1);
        let cell = this.PifuList.getCell(this.currentIndex + 1);
        let select = cell.getChildByName('Select') as Laya.Sprite;
        let lock = cell.getChildByName('Lock') as Laya.Sprite;
        // 如果没有被锁住，那么可以选择他
        if (!lock.visible) {
            console.log('可以选择！');
            select.visible = true;
            // 关掉原来的选中
            let number = lwg.Enum.PifuOrder[lwg.Global._currentPifu];
            let cell1 = this.PifuList.getCell(number);
            let select1 = cell.getChildByName('Select') as Laya.Sprite;
            select1.visible = false;
            // 更换选择
            lwg.Global._currentPifu = lwg.Enum.PifuOrder[this.currentIndex + 1];
        }
    }

    onDisable(): void {

    }
}