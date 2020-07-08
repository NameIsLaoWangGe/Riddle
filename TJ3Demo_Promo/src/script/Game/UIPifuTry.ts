import { lwg } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";

export default class UIPifuTry extends lwg.Admin.Scene {
    /**看广告获取*/
    private BtnAdv: Laya.Sprite;
    /**随机到的皮肤是第几个皮肤*/
    private pifuNum: number;

    constructor() { super(); }

    lwgInit(): void {
        this.self = this.owner as Laya.Scene;
        ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_skintry');
        ADManager.TAPoint(TaT.BtnShow, 'close_skintry');

        if (!lwg.Global._elect) {
            this.self['P201'].visible = false;
        }

        lwg.Global.notHavePifuSubXD();
        this.randomNoHave();
    }
    adaptive(): void {
        this.self['SceneContent'].y = Laya.stage.height / 2;
        this.self['P201'].y = Laya.stage.height * 0.237;

        this.self['background_01'].height = Laya.stage.height;
    }

    openAni(): void {
        // this.self['BtnNo'].visible = false;
        // setTimeout(() => {
        //     this.self['BtnNo'].visible = true;
        // }, lwg.Global._btnDelayed);
    }

    /**随机出一个还没有获得的皮肤放在皮肤加载位置*/
    randomNoHave(): void {
        let len = lwg.Global._notHavePifuSubXD.length;
        if (len === 0) {
            this.self.close();
            lwg.Global._gameStart = true;
            return;
        }
        let random = Math.floor(Math.random() * len);
        // 显示名称
        let pifuName = lwg.Global._notHavePifu[random];
        let oder1 = lwg.Enum.PifuAllName[pifuName];
        this.pifuNum = oder1;
        // let name = this.PifuName.getChildByName('Name') as Laya.Label;
        // 找到皮肤地址
        let pifuImg = this.self['Pifu'].getChildByName('img') as Laya.Image;
        let oder2 = lwg.Enum.PifuAllName[pifuName];
        pifuImg.skin = lwg.Enum.PifuSkin[oder2];
    }

    btnOnClick(): void {
        lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.self['BtnCheck'], this, null, null, this.btnCheckUp, null);
        // lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnZanshi'], this, null, null, this.btnAdvUp, null);

        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnGet'], this, null, null, this.btnAdvUp, null);
        // lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
        // lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['Btn'], this, null, null, null, null);
    }

    btnAdvUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_skintry');
        event.currentTarget.scale(1, 1);

        let check = this.self['BtnCheck'].getChildByName('Check') as Laya.Sprite;
        if (check.visible) {
            ADManager.ShowReward(() => {
                this.btnAdvFunc();
            })
        }else{
            event.currentTarget.scale(1, 1);
            this.self.close();
            lwg.Admin._sceneControl[lwg.Admin.SceneName.UIStart]['UIStart'].openPlayScene();
        }
    }
    btnCheckUp(e: Laya.Event): void {
        let check = this.self['BtnCheck'].getChildByName('Check') as Laya.Sprite;
        let word = this.self['BtnGet'].getChildByName('word') as Laya.Image;
        if (check.visible) {
            check.visible = false;
            word.skin = 'UI_new/PifuTry/free_btn1.png';
        } else {
            check.visible = true;
            word.skin = 'UI_new/PifuTry/word_freetry.png';
        }


    }

    btnNoUp(event): void {
        event.currentTarget.scale(1, 1);
        this.self.close();
        lwg.Admin._sceneControl[lwg.Admin.SceneName.UIStart]['UIStart'].openPlayScene();
    }

    btnAdvFunc(): void {
        this.self.close();
        lwg.Global._yuanpifu = lwg.Global._currentPifu;
        lwg.Global._currentPifu = lwg.Enum.PifuAllName[this.pifuNum];
        lwg.Admin._sceneControl[lwg.Admin.SceneName.UIStart]['UIStart'].openPlayScene();
        this.self.close();

        lwg.LocalStorage.addData();
    }

    onDisable(): void {
    }
}